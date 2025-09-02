import { noChange } from 'lit-html';
// import '@material/mwc-ripple';
// tslint:disable-next-line
import { Ripple } from '@material/mwc-ripple';
import { fireEvent } from './common/fire-event';
import { deepEqual } from './deep-equal';
import { AttributePart, Directive, DirectiveParameters, directive } from 'lit-html/directive';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

interface ActionHandlerType extends HTMLElement {
  holdTime: number;
  bind(element: Element, options: ActionHandlerOptions): void;
}

export interface ActionHandlerDetail {
  action: 'hold' | 'tap' | 'double_tap';
}

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  disabled?: boolean;
  repeat?: number;
  repeatLimit?: number;
  isIcon?: boolean;
  cardHasHold?: boolean;
}

interface ActionHandlerElement extends HTMLElement {
  actionHandler?: {
    options: ActionHandlerOptions;
    start?: (ev: Event) => void;
    end?: (ev: Event) => void;
    handleKeyDown?: (ev: KeyboardEvent) => void;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'action-handler': ActionHandlerType;
  }
  interface HASSDomEvents {
    action: ActionHandlerDetail;
  }
}

class ActionHandlerType extends HTMLElement implements ActionHandlerType {
  public holdTime = 500;

  public ripple: Ripple;

  protected timer?: number;

  protected held = false;

  private cancelled = false;

  private dblClickTimeout?: number;

  private repeatTimeout: NodeJS.Timeout | undefined;

  private isRepeating = false;

  private repeatCount = 0;

  constructor() {
    super();
    this.ripple = document.createElement('mwc-ripple');
  }

  public connectedCallback(): void {
    Object.assign(this.style, {
      position: 'fixed',
      width: isTouch ? '100px' : '50px',
      height: isTouch ? '100px' : '50px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: '999',
    });

    this.appendChild(this.ripple);
    this.ripple.primary = true;

    ['touchcancel', 'mouseout', 'mouseup', 'touchmove', 'mousewheel', 'wheel', 'scroll'].forEach((ev) => {
      document.addEventListener(
        ev,
        () => {
          this.cancelled = true;
          if (this.timer) {
            this.stopAnimation();
            clearTimeout(this.timer);
            this.timer = undefined;
            if (this.isRepeating && this.repeatTimeout) {
              clearInterval(this.repeatTimeout);
              this.isRepeating = false;
            }
          }
        },
        { passive: true },
      );
    });
  }

  public bind(element: ActionHandlerElement, options: ActionHandlerOptions = {}): void {
    if (element.actionHandler && deepEqual(options, element.actionHandler.options)) {
      return;
    }

    if (element.actionHandler) {
      element.removeEventListener('touchstart', element.actionHandler.start!);
      element.removeEventListener('touchend', element.actionHandler.end!);
      element.removeEventListener('touchcancel', element.actionHandler.end!);

      element.removeEventListener('mousedown', element.actionHandler.start!);
      element.removeEventListener('click', element.actionHandler.end!);

      element.removeEventListener('keydown', element.actionHandler.handleKeyDown!);
    } else {
      element.addEventListener('contextmenu', (ev: Event) => {
        const e = ev || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      });
    }

    element.actionHandler = { options };

    if (options.disabled) {
      return;
    }

    element.actionHandler.start = (ev: Event) => {
      if (options.cardHasHold && !options.hasHold) {
        return;
      }
      if (options.isIcon) {
        ev.stopPropagation();
      }
      this.cancelled = false;
      let x;
      let y;
      if ((ev as TouchEvent).touches) {
        x = (ev as TouchEvent).touches[0].clientX;
        y = (ev as TouchEvent).touches[0].clientY;
      } else {
        x = (ev as MouseEvent).clientX;
        y = (ev as MouseEvent).clientY;
      }

      if (options.hasHold) {
        this.held = false;
        this.timer = window.setTimeout(() => {
          this.startAnimation(x, y);
          this.held = true;
          if (options.repeat && !this.isRepeating) {
            this.repeatCount = 0;
            this.isRepeating = true;
            this.repeatTimeout = setInterval(() => {
              fireEvent(element, 'action', { action: 'hold' });
              this.repeatCount++;
              if (this.repeatTimeout && options.repeatLimit && this.repeatCount >= options.repeatLimit) {
                clearInterval(this.repeatTimeout);
                this.isRepeating = false;
              }
            }, options.repeat);
          }
        }, this.holdTime);
      }
    };

    element.actionHandler.end = (ev: Event) => {
      if (options.isIcon) {
        ev.stopPropagation();
      }
      // Don't respond when moved or scrolled while touch
      if (['touchend', 'touchcancel'].includes(ev.type) && this.cancelled) {
        if (this.isRepeating && this.repeatTimeout) {
          clearInterval(this.repeatTimeout);
          this.isRepeating = false;
        }
        return;
      }

      // Don't do anything else if touch event was cancelled
      if (ev.type == 'touchcancel') {
        return;
      }

      const target = ev.target as HTMLElement;
      // Prevent mouse event if touch event
      if (ev.cancelable) {
        ev.preventDefault();
      }
      if (options.hasHold) {
        clearTimeout(this.timer);
        if (this.isRepeating && this.repeatTimeout) {
          clearInterval(this.repeatTimeout);
        }
        this.isRepeating = false;
        this.stopAnimation();
        this.timer = undefined;
      }
      if (options.hasHold && this.held) {
        if (!options.repeat) {
          fireEvent(target, 'action', { action: 'hold' });
        }
      } else if (options.hasDoubleClick) {
        if ((ev.type === 'click' && (ev as MouseEvent).detail < 2) || !this.dblClickTimeout) {
          this.dblClickTimeout = window.setTimeout(() => {
            this.dblClickTimeout = undefined;
            fireEvent(target, 'action', { action: 'tap' });
          }, 250);
        } else {
          clearTimeout(this.dblClickTimeout);
          this.dblClickTimeout = undefined;
          fireEvent(target, 'action', { action: 'double_tap' });
        }
      } else {
        fireEvent(target, 'action', { action: 'tap' });
      }
    };

    element.actionHandler.handleKeyDown = (ev: KeyboardEvent) => {
      if (!['Enter', ' '].includes(ev.key)) {
        return;
      }
      (ev.currentTarget as ActionHandlerElement).actionHandler!.end!(ev);
    };

    element.addEventListener('touchstart', element.actionHandler.start, {
      passive: true,
    });
    element.addEventListener('touchend', element.actionHandler.end);
    element.addEventListener('touchcancel', element.actionHandler.end);

    element.addEventListener('mousedown', element.actionHandler.start, {
      passive: true,
    });
    element.addEventListener('click', element.actionHandler.end);

    element.addEventListener('keydown', element.actionHandler.handleKeyDown);
  }

  private startAnimation(x: number, y: number): void {
    Object.assign(this.style, {
      left: `${x}px`,
      top: `${y}px`,
      display: null,
    });
    this.ripple.disabled = false;
    this.ripple.startPress();
    this.ripple.unbounded = true;
  }

  private stopAnimation(): void {
    this.ripple.endPress();
    this.ripple.disabled = true;
    this.style.display = 'none';
  }
}

customElements.define('button-card-action-handler', ActionHandlerType);

const getActionHandler = (): ActionHandlerType => {
  const body = document.body;
  if (body.querySelector('button-card-action-handler')) {
    return body.querySelector('button-card-action-handler') as ActionHandlerType;
  }

  const actionhandler = document.createElement('button-card-action-handler');
  body.appendChild(actionhandler);

  return actionhandler as ActionHandlerType;
};

export const actionHandlerBind = (element: ActionHandlerElement, options?: ActionHandlerOptions) => {
  const actionhandler: ActionHandlerType = getActionHandler();
  if (!actionhandler) {
    return;
  }
  actionhandler.bind(element, options);
};
export const actionHandler = directive(
  class extends Directive {
    update(part: AttributePart, [options]: DirectiveParameters<this>) {
      actionHandlerBind(part.element as ActionHandlerElement, options);
      return noChange;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    render(_options?: ActionHandlerOptions) {}
  },
);
