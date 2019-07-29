import { directive, PropertyPart } from 'lit-html';
import * as Bowser from 'bowser';
// See https://github.com/home-assistant/home-assistant-polymer/pull/2457
// on how to undo mwc -> paper migration
// import '@material/mwc-ripple';

const isTouch = 'ontouchstart' in window
  || navigator.maxTouchPoints > 0
  || navigator.msMaxTouchPoints > 0;

interface LongPress extends HTMLElement {
  holdTime: number;
  bind(element: Element): void;
}
interface LongPressElement extends Element {
  longPress?: boolean;
  repeat?: number | undefined;
  isRepeating?: boolean | undefined;
  hasDblClick?: boolean | undefined;
}

class LongPress extends HTMLElement implements LongPress {
  public holdTime: number;

  protected ripple: any;

  protected timer: number | undefined;

  protected held: boolean;

  protected cooldownStart: boolean;

  protected cooldownEnd: boolean;

  private repeatTimeout: NodeJS.Timeout | undefined;

  private dblClickTimeout: number | undefined;

  private nbClicks: number;

  constructor() {
    super();
    this.holdTime = 500;
    this.ripple = document.createElement('paper-ripple');
    this.timer = undefined;
    this.held = false;
    this.cooldownStart = false;
    this.cooldownEnd = false;
    this.nbClicks = 0;
  }

  public connectedCallback() {
    Object.assign(this.style, {
      borderRadius: '50%', // paper-ripple
      position: 'absolute',
      width: isTouch ? '100px' : '50px',
      height: isTouch ? '100px' : '50px',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
    });

    this.appendChild(this.ripple);
    this.ripple.style.color = '#03a9f4'; // paper-ripple
    this.ripple.style.color = 'var(--primary-color)'; // paper-ripple
    // this.ripple.primary = true;

    [
      'touchcancel',
      'mouseout',
      'mouseup',
      'touchmove',
      'mousewheel',
      'wheel',
      'scroll',
    ].forEach((ev) => {
      document.addEventListener(
        ev,
        () => {
          clearTimeout(this.timer);
          this.stopAnimation();
          this.timer = undefined;
        },
        { passive: true },
      );
    });
  }

  public bind(element: LongPressElement) {
    /* eslint no-param-reassign: 0 */
    if (element.longPress) {
      return;
    }
    element.longPress = true;

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

    const clickStart = (ev: Event) => {
      ev.stopPropagation();
      if (this.cooldownStart) {
        return;
      }
      this.held = false;
      let x;
      let y;
      if ((ev as TouchEvent).touches) {
        x = (ev as TouchEvent).touches[0].pageX;
        y = (ev as TouchEvent).touches[0].pageY;
      } else {
        x = (ev as MouseEvent).pageX;
        y = (ev as MouseEvent).pageY;
      }
      this.timer = window.setTimeout(() => {
        this.startAnimation(x, y);
        this.held = true;
        if (element.repeat && !element.isRepeating) {
          element.isRepeating = true;
          this.repeatTimeout = setInterval(() => {
            element.dispatchEvent(new Event('ha-hold'));
          }, element.repeat);
        }
      }, this.holdTime);

      this.cooldownStart = true;
      window.setTimeout(() => (this.cooldownStart = false), 100);
    };

    const clickEnd = (ev: Event) => {
      ev.stopPropagation();
      if (
        this.cooldownEnd
        || (['touchend', 'touchcancel'].includes(ev.type)
          && this.timer === undefined)
      ) {
        if (element.isRepeating && this.repeatTimeout) {
          clearInterval(this.repeatTimeout);
          element.isRepeating = false;
        }
        return;
      }
      clearTimeout(this.timer);
      if (element.isRepeating && this.repeatTimeout) {
        clearInterval(this.repeatTimeout);
      }
      element.isRepeating = false;
      this.stopAnimation();
      this.timer = undefined;
      if (this.held) {
        if (!element.repeat) {
          element.dispatchEvent(new Event('ha-hold'));
        }
      } else if (element.hasDblClick) {
        if (this.nbClicks === 0) {
          this.nbClicks += 1;
          this.dblClickTimeout = window.setTimeout(() => {
            if (this.nbClicks === 1) {
              this.nbClicks = 0;
              element.dispatchEvent(new Event('ha-click'));
            }
          }, 250);
        } else {
          this.nbClicks = 0;
          clearTimeout(this.dblClickTimeout);
          element.dispatchEvent(new Event('ha-dblclick'));
        }
      } else {
        element.dispatchEvent(new Event('ha-click'));
      }
      this.cooldownEnd = true;
      window.setTimeout(() => (this.cooldownEnd = false), 100);
    };

    const br = Bowser.getParser(window.navigator.userAgent);
    const isCrazyBrowser = br.satisfies({
      mobile: {
        safari: '>=13',
      },
    });
    element.addEventListener('touchstart', clickStart, { passive: true });
    element.addEventListener('touchend', clickEnd);
    element.addEventListener('touchcancel', clickEnd);
    if (!isCrazyBrowser) {
      element.addEventListener('mousedown', clickStart, { passive: true });
      element.addEventListener('click', clickEnd);
    }
  }

  private startAnimation(x: number, y: number) {
    Object.assign(this.style, {
      left: `${x}px`,
      top: `${y}px`,
      display: null,
    });
    this.ripple.holdDown = true; // paper-ripple
    this.ripple.simulatedRipple(); // paper-ripple
    // this.ripple.disabled = false;
    // this.ripple.active = true;
    // this.ripple.unbounded = true;
  }

  private stopAnimation() {
    this.ripple.holdDown = false; // paper-ripple
    // this.ripple.active = false;
    // this.ripple.disabled = true;
    this.style.display = 'none';
  }
}

customElements.define('long-press-button-card', LongPress);

const getLongPress = (): LongPress => {
  const body = document.body;
  if (body.querySelector('long-press-button-card')) {
    return body.querySelector('long-press-button-card') as LongPress;
  }

  const longpress = document.createElement('long-press-button-card');
  body.appendChild(longpress);

  return longpress as LongPress;
};

export const longPressBind = (element: LongPressElement) => {
  const longpress: LongPress = getLongPress();
  if (!longpress) {
    return;
  }
  longpress.bind(element);
};

export const longPress = directive(() => (part: PropertyPart) => {
  longPressBind(part.committer.element);
});
