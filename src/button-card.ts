import { LitElement, html, TemplateResult, CSSResult, PropertyValues, nothing } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { until } from 'lit/directives/until.js';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { classMap, ClassInfo } from 'lit-html/directives/class-map.js';
import { HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { LovelaceCard } from './types/lovelace';
import {
  ButtonCardConfig,
  ExternalButtonCardConfig,
  StateConfig,
  ExemptionUserConfig,
  ExemptionUsernameConfig,
  CustomFieldCard,
  ButtonCardEmbeddedCards,
  ButtonCardEmbeddedCardsConfig,
  ColorType,
  CustomFields,
  EntityPicture,
  ActionEventData,
  EvaluatedActionConfig,
  ActionConfig,
  NoActionConfig,
  ToggleActionConfig,
  MoreInfoActionConfig,
  NavigateActionConfig,
  UrlActionConfig,
  PerformActionActionConfig,
  AssistActionConfig,
  CustomActionConfig,
  ActionCustomEvent,
  JavascriptActionConfig,
  CallServiceActionConfig,
  MultiActionsActionConfig,
  CustomActionMultiActionsDelay,
  TooltipConfig,
  ShowToastParams,
  ToastActionConfig,
  EvaluatedVariables,
} from './types/types';
import { actionHandler } from './action-handler';
import {
  computeDomain,
  computeEntity,
  getFontColorBasedOnBackgroundColor,
  buildNameStateConcat,
  applyBrightnessToColor,
  getLightColorBasedOnTemperature,
  mergeDeep,
  mergeStatesById,
  getLovelace,
  getLovelaceCast,
  secondsToDuration,
  durationToSeconds,
  computeStateDomain,
  stateActive,
  computeCssVariable,
  isMediaSourceContentId,
  resolveMediaSource,
  findEntities,
  lovelaceViewIsSection,
} from './helpers';
import { createThing } from './common/create-thing';
import { styles } from './styles';
import { computeStateDisplay } from './common/compute_state_display';
import copy from 'fast-copy';
import * as pjson from '../package.json';
import { deepEqual } from './deep-equal';
import { stateColorCss } from './common/state_color';
import {
  AUTO_COLORS,
  DEFAULT_COLOR,
  DOMAINS_TOGGLE,
  DOMAINS_PRESS,
  OVERRIDE_CARD_BACKGROUND_COLOR_COLORS,
  OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE,
  DEFAULT_LOCK_DURATION,
  DEFAULT_LOCK_ICON,
  DEFAULT_UNLOCK_ICON,
  DEFAULT_STATE_COLOR,
  DEFAULT_FAILED_TOAST_MESSAGE,
  NORMALISED_ACTION,
} from './common/const';
import { handleAction } from './handle-action';
import { fireEvent } from './common/fire-event';
import { HaRipple, HaTooltip, HomeAssistant } from './types/homeassistant';
import { timerTimeRemaining } from './common/timer';
import {
  formatDateTime,
  formatDateTimeNumeric,
  formatDateTimeWithSeconds,
  formatShortDateTime,
  formatShortDateTimeWithYear,
} from './common/format_date_time';
import { formatTime, formatTime24h, formatTimeWeekday, formatTimeWithSeconds } from './common/format_time';
import {
  formatDate,
  formatDateMonth,
  formatDateMonthYear,
  formatDateNumeric,
  formatDateShort,
  formatDateWeekday,
  formatDateWeekdayDay,
  formatDateWeekdayShort,
  formatDateYear,
} from './common/format_date';
import { parseDuration } from './common/parse-duration';
import { forwardHaptic, HapticType } from './forward-haptic';

let helpers = (window as any).cardHelpers;
const helperPromise = new Promise<void>(async (resolve) => {
  if (helpers) resolve();
  if ((window as any).loadCardHelpers) {
    helpers = await (window as any).loadCardHelpers();
    (window as any).cardHelpers = helpers;
    resolve();
  }
});

if (!(window as any).buttonCardCustomActionsHandler) {
  (window as any).buttonCardCustomActionsHandler = function (ev: CustomEvent) {
    if (ev.detail.buttonCardCustomAction) {
      ev.detail.buttonCardCustomAction?.callback(ev);
    }
  };
  document.body.addEventListener('ll-custom', (window as any).buttonCardCustomActionsHandler);
}

/* eslint no-console: 0 */
console.info(
  `%c BUTTON-CARD %c v${pjson.version} `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'button-card',
  name: 'Button-Card',
  preview: false,
  description: 'A massively customizable custom button card',
});

declare global {
  interface HASSDomEvents {
    'card-visibility-changed': null;
  }
}

@customElement('button-card')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ButtonCard extends LitElement {
  @property() private _hass?: HomeAssistant;

  @property() private _config?: ButtonCardConfig;

  @property() private _timeRemaining?: number;

  @property() private _updateTimerMS?: number;

  @property({ type: Boolean, reflect: true }) preview = false;

  @property({ type: Boolean }) private _spinnerActive = false;

  @queryAsync('ha-ripple') private _ripple!: Promise<HaRipple | null>;

  private _pHass?: HomeAssistant;

  private _pStates?: HassEntities;

  private _stateObj: HassEntity | undefined;

  private _evaluatedVariables: EvaluatedVariables = {};

  private _pVariables?: any;

  private _interval?: number;

  private _updateTimeout: number | undefined;

  private _updateTimerDuration: number | undefined;

  private _cards: ButtonCardEmbeddedCards = {};

  private _cardsConfig: ButtonCardEmbeddedCardsConfig = {};

  private _monitoredEntities: string[] = [];

  private _initialSetupComplete = false;

  private _cardClickable = false;

  private _iconClickable = false;

  private _hasIconActions = false;

  private _hidden = false;

  private _cardMomentary = false;

  private _iconMomentary = false;

  private _cardRipple = false;

  private _protectedAction?: ActionEventData = undefined;

  private _hapticCapture = false;

  private get _doIHaveEverything(): boolean {
    return !!this._hass && !!this._config && this.isConnected;
  }

  static getStubConfig(hass: HomeAssistant, entities: string[], entitiesFallback: string[]): ExternalButtonCardConfig {
    const maxEntities = 1;
    const foundEntities = findEntities(hass, maxEntities, entities, entitiesFallback, ['light', 'switch']);
    if (lovelaceViewIsSection()) {
      return {
        entity: foundEntities[0] || '',
        section_mode: true,
        grid_options: {
          rows: 2,
          columns: 6,
        },
      };
    }
    return {
      entity: foundEntities[0] || '',
      section_mode: false,
    };
  }

  private _computeHidden(): void {
    let hidden: boolean;
    if (this.preview || !this._initialSetupComplete || this._config?.hidden === undefined) {
      hidden = false;
    } else {
      hidden = this._getTemplateOrValue(this._stateObj, this._config!.hidden);
    }
    if (hidden !== this._hidden) {
      this._hidden = hidden;
      this.hidden = hidden;
      fireEvent(this, 'card-visibility-changed');
    }
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._pStates) {
      this._pStates = this._createStateProxy();
    }
    this._pHass = {
      ...hass,
      states: this._pStates,
    };
    Object.keys(this._cards).forEach((element) => {
      const el = this._cards[element];
      el.hass = this._hass;
    });
    if (!this._initialSetupComplete) {
      this._finishSetup();
    }
  }

  private _createStateProxy(): HassEntities {
    return new Proxy(
      {},
      {
        get: (__target, prop: string) => {
          if (prop.includes('.') && !this._monitoredEntities.includes(prop)) {
            this._monitoredEntities.push(prop);
            this._expandTriggerGroups();
          }
          return this._hass?.states?.[prop];
        },
        has: (__target, prop: string) => {
          return !!this._hass?.states?.[prop];
        },
        ownKeys: () => {
          if (!this._hass || !this._hass.states) return [];
          return Object.keys(this._hass.states);
        },
        getOwnPropertyDescriptor: (__target, prop: string) => {
          return {
            value: this._hass?.states?.[prop],
            enumerable: true,
            configurable: true,
          };
        },
      },
    );
  }

  private _createVariablesProxy(variables: any): any {
    if (!variables) return {};
    this._evaluatedVariables = {};
    return new Proxy(variables, {
      get: (__target, prop: string) => {
        if (prop in this._evaluatedVariables && 'value' in this._evaluatedVariables[prop]) {
          return this._evaluatedVariables[prop].value;
        } else if (prop in __target) {
          if (this._evaluatedVariables[prop]?.loop) {
            throw new Error(`button-card: Detected a loop while evaluating variable "${prop}"`);
          }
          this._evaluatedVariables[prop] = { loop: true };
          const origin = Reflect.get(__target, prop);
          if (typeof origin === 'object' && origin !== null && 'value' in origin) {
            this._evaluatedVariables[prop].value = this._objectEvalTemplate(this._stateObj, origin.value);
          } else {
            this._evaluatedVariables[prop].value = this._objectEvalTemplate(this._stateObj, origin);
          }
          delete this._evaluatedVariables[prop].loop;
          return this._evaluatedVariables[prop].value;
        } else {
          return undefined;
        }
      },
    });
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearInterval();
    this._updateTimerCancel();
    window.removeEventListener('haptic', this._hapticInterceptHandler.bind(this), { capture: true });
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (!this._initialSetupComplete) {
      this._finishSetup();
    } else {
      this._updateTimerStart();
      this._startTimerCountdown();
    }
    window.addEventListener('haptic', this._hapticInterceptHandler.bind(this), { capture: true });
  }

  private _finishSetup(): void {
    if (!this._initialSetupComplete && this._doIHaveEverything) {
      this._pVariables = this._createVariablesProxy(copy(this._config?.variables));

      if (this._config!.entity) {
        try {
          const entityEvaled = this._getTemplateOrValue(undefined, this._config!.entity);
          this._config!.entity = entityEvaled;
          this._stateObj = this._hass!.states[entityEvaled];
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.error(`button-card: Could not evaluate entity template: ${this._config!.entity}`);
        }
      }

      if (
        !this._isActionDoingSomething(this._stateObj, this._config!.press_action) &&
        !this._isActionDoingSomething(this._stateObj, this._config!.release_action)
      ) {
        if (this._config!.entity && DOMAINS_TOGGLE.has(computeDomain(this._config!.entity))) {
          this._config = {
            tap_action: { action: 'toggle' },
            ...this._config!,
          };
        } else if (this._config!.entity && DOMAINS_PRESS.has(computeDomain(this._config!.entity))) {
          this._config = {
            tap_action: {
              action: 'call-service',
              service: 'input_button.press',
              target: { entity_id: this._config!.entity },
            },
            ...this._config!,
          };
        } else if (this._config!.entity) {
          this._config = {
            tap_action: { action: 'more-info' },
            ...this._config!,
          };
        } else {
          this._config = {
            tap_action: { action: 'none' },
            ...this._config!,
          };
        }
      } else {
        this._config = {
          tap_action: { action: 'none' },
          ...this._config!,
        };
      }

      if (
        this._isActionDoingSomething(this._stateObj, this._config!.press_action) ||
        this._isActionDoingSomething(this._stateObj, this._config!.release_action)
      ) {
        if (
          this._isActionDoingSomething(this._stateObj, this._config!.tap_action) ||
          this._isActionDoingSomething(this._stateObj, this._config!.hold_action) ||
          this._isActionDoingSomething(this._stateObj, this._config!.double_tap_action)
        ) {
          throw new Error(
            'button-card: If you use press_action or release_action, then tap_action, hold_action and double_tap_action must be "none" or not set at all.',
          );
        }
      }
      if (
        this._isActionDoingSomething(this._stateObj, this._config!.icon_press_action) ||
        this._isActionDoingSomething(this._stateObj, this._config!.icon_release_action)
      ) {
        if (
          this._isActionDoingSomething(this._stateObj, this._config!.icon_tap_action) ||
          this._isActionDoingSomething(this._stateObj, this._config!.icon_hold_action) ||
          this._isActionDoingSomething(this._stateObj, this._config!.icon_double_tap_action)
        ) {
          throw new Error(
            'button-card: If you use icon_press_action or icon_release_action, then icon_tap_action, icon_hold_action and icon_double_tap_action must be "none" or not set at all.',
          );
        }
      }

      this._monitoredEntities = [];
      if (this._config!.entity && !this._monitoredEntities.includes(this._config!.entity))
        this._monitoredEntities.push(this._config!.entity);
      this._expandTriggerGroups();

      this._startTimerCountdown();
      this._updateTimerStart();
      this._computeHidden();
      this._initialSetupComplete = true;
    }
  }

  private _startTimerCountdown(): void {
    if (this._config && this._config.entity && computeDomain(this._config.entity) === 'timer') {
      const stateObj = this._hass!.states[this._config.entity];
      this._startInterval(stateObj);
    }
  }

  private _createCard(config: any): any {
    if (helpers) return helpers.createCardElement(config);
    else {
      const element = createThing(config);
      helperPromise.then(() => {
        fireEvent(element, 'll-rebuild', {});
      });
      return element;
    }
  }

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this._hass) return html``;
    this._stateObj = this._config!.entity ? this._hass!.states[this._config!.entity] : undefined;
    try {
      this._evaluatedVariables = {};
      if (this._config?.variables) {
        Object.keys(this._config?.variables)?.forEach((varName) => {
          const v = this._config!.variables![varName];
          if (typeof v === 'object' && v !== null && v.force_eval) {
            // this is to force evaluate specific variables to support "hacks"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const __ = this._pVariables[varName];
          }
        });
      }
      return this._cardHtml();
    } catch (e: any) {
      if (e.stack) console.error(e.stack);
      else console.error(e);
      const errorCard = document.createElement('hui-error-card') as LovelaceCard;
      errorCard.preview = this.preview;
      errorCard.setConfig({
        type: 'error',
        error: e.name,
        message: e.message,
      });
      return html` ${errorCard} `;
    }
  }

  private _hasAnEntityChanged(changedProps: PropertyValues): boolean {
    const oldHass = changedProps.get('_hass') as HomeAssistant | undefined;
    if (oldHass) {
      function hasChanged(this: ButtonCard, elt: string): boolean {
        return oldHass?.states[elt] !== this._hass!.states[elt];
      }
      return this._monitoredEntities.some(hasChanged.bind(this));
    }
    return false;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('_config')) {
      return true;
    }

    // if update_timer is set (and > 100ms), we only update on interval
    if (this._updateTimerDuration) {
      if (changedProps.has('_updateTimerMS')) {
        return true;
      } else {
        return this._updateTimerChanged();
      }
    }

    const forceUpdate =
      changedProps.has('_timeRemaining') || changedProps.has('_updateTimerMS') || changedProps.has('_spinnerActive')
        ? true
        : false;
    if (forceUpdate || this._hasAnEntityChanged(changedProps)) {
      this._expandTriggerGroups();
      return true;
    } else if (changedProps.has('preview')) {
      return true;
    }
    return false;
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (changedProps.has('preview')) {
      Object.keys(this._cards).forEach((element) => {
        const el = this._cards[element];
        el.preview = this.preview;
      });
    }
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (
      this._config &&
      this._config.entity &&
      computeDomain(this._config.entity) === 'timer' &&
      changedProps.has('_hass')
    ) {
      const stateObj = this._hass!.states[this._config.entity];
      const oldHass = changedProps.get('_hass') as HomeAssistant;
      const oldStateObj = oldHass ? oldHass.states[this._config.entity] : undefined;

      if (oldStateObj !== stateObj) {
        this._startInterval(stateObj);
      } else if (!stateObj) {
        this._clearInterval();
      }
    }

    this.updateComplete.then(() => {
      const tooltip = this.shadowRoot?.getElementById('tooltip');
      if (tooltip) {
        // Workaround for wa-tooltip issues with not resetting its AbortController
        // meaning that listener are set are instantly aborted
        // Without this workaround tooltips stop working after edit mode
        // https://github.com/shoelace-style/webawesome/issues/1595
        (tooltip as any).eventController?.abort();
        (tooltip as any).eventController = new AbortController();
        (tooltip as any).anchor = undefined;
        (tooltip as any).handleForChange?.();
      }
    });

    this._updateTimer();
    this._computeHidden();
  }

  private _clearInterval(): void {
    if (this._interval) {
      window.clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  private _startInterval(stateObj: HassEntity): void {
    this._clearInterval();
    this._calculateRemaining(stateObj);

    if (stateObj.state === 'active') {
      this._interval = window.setInterval(() => this._calculateRemaining(stateObj), 1000);
    }
  }

  private _calculateRemaining(stateObj: HassEntity): void {
    if (stateObj.attributes.remaining) {
      this._timeRemaining = timerTimeRemaining(stateObj);
    }
  }

  private _computeTimeDisplay(stateObj: HassEntity): string | undefined | null {
    if (!stateObj) {
      return undefined;
    }

    return secondsToDuration(this._timeRemaining || durationToSeconds(stateObj.attributes.duration));
  }

  private _getMatchingConfigState(state: HassEntity | undefined): StateConfig | undefined {
    if (!this._config!.state) {
      return undefined;
    }
    const hasTemplate = this._config!.state.find((elt) => elt.operator === 'template');
    if (!state && !hasTemplate) {
      return undefined;
    }
    let def: StateConfig | undefined;
    const retval = this._config!.state.find((elt) => {
      if (elt.operator) {
        switch (elt.operator) {
          case '==':
            /* eslint eqeqeq: 0 */
            return state && state.state == this._getTemplateOrValue(state, elt.value);
          case '<=':
            return state && state.state <= this._getTemplateOrValue(state, elt.value);
          case '<':
            return state && state.state < this._getTemplateOrValue(state, elt.value);
          case '>=':
            return state && state.state >= this._getTemplateOrValue(state, elt.value);
          case '>':
            return state && state.state > this._getTemplateOrValue(state, elt.value);
          case '!=':
            return state && state.state != this._getTemplateOrValue(state, elt.value);
          case 'regex': {
            /* eslint no-unneeded-ternary: 0 */
            const matches = state && state.state.match(this._getTemplateOrValue(state, elt.value)) ? true : false;
            return matches;
          }
          case 'template': {
            return this._getTemplateOrValue(state, elt.value);
          }
          case 'default':
            def = elt;
            return false;
          default:
            return false;
        }
      } else {
        return state && this._getTemplateOrValue(state, elt.value) == state.state;
      }
    });
    if (!retval && def) {
      return def;
    }
    return retval;
  }

  private _localize(
    stateObj: HassEntity,
    state?: string,
    numeric_precision?: number | 'card',
    show_units = true,
    units?: string,
  ): string {
    return computeStateDisplay(
      this._hass!.localize,
      stateObj,
      this._hass!.locale,
      this._hass!.config,
      this._hass!.entities,
      {
        numeric_precision: numeric_precision === 'card' ? this._config?.numeric_precision : numeric_precision,
        show_units,
        units,
      },
      state,
    );
  }

  private _relativeTime(date: string | undefined, capitalize: boolean = false) {
    if (date) {
      return html`
        <ha-relative-time
          id="relative-time"
          class="ellipsis"
          .hass="${this._hass}"
          .datetime="${date}"
          .capitalize="${capitalize}"
        ></ha-relative-time>
      `;
    }
    return '';
  }

  private _getTemplateHelpers() {
    return {
      localize: this._localize.bind(this),
      // Datetime functions
      formatDateTime: (datetime) => {
        return formatDateTime(new Date(datetime), this._hass!.locale, this._hass!.config);
      },
      formatShortDateTimeWithYear: (datetime) => {
        return formatShortDateTimeWithYear(new Date(datetime), this._hass!.locale, this._hass!.config);
      },
      formatShortDateTime: (datetime) => {
        return formatShortDateTime(new Date(datetime), this._hass!.locale, this._hass!.config);
      },
      formatDateTimeWithSeconds: (datetime) => {
        return formatDateTimeWithSeconds(new Date(datetime), this._hass!.locale, this._hass!.config);
      },
      formatDateTimeNumeric: (datetime) => {
        return formatDateTimeNumeric(new Date(datetime), this._hass!.locale, this._hass!.config);
      },
      // Time functions
      relativeTime: this._relativeTime.bind(this),
      formatTime: (time) => {
        return formatTime(new Date(time), this._hass!.locale, this._hass!.config);
      },
      formatTimeWithSeconds: (time) => {
        return formatTimeWithSeconds(new Date(time), this._hass!.locale, this._hass!.config);
      },
      formatTimeWeekday: (time) => {
        return formatTimeWeekday(new Date(time), this._hass!.locale, this._hass!.config);
      },
      formatTime24h: (time) => {
        return formatTime24h(new Date(time), this._hass!.locale, this._hass!.config);
      },
      // Date functions
      formatDateWeekdayDay: (date) => {
        return formatDateWeekdayDay(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDate: (date) => {
        return formatDate(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateNumeric: (date) => {
        return formatDateNumeric(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateShort: (date) => {
        return formatDateShort(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateMonthYear: (date) => {
        return formatDateMonthYear(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateMonth: (date) => {
        return formatDateMonth(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateYear: (date) => {
        return formatDateYear(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateWeekday: (date) => {
        return formatDateWeekday(new Date(date), this._hass!.locale, this._hass!.config);
      },
      formatDateWeekdayShort: (date) => {
        return formatDateWeekdayShort(new Date(date), this._hass!.locale, this._hass!.config);
      },
      parseDuration: (duration, format = 'ms', locale = this._hass!.locale?.language) => {
        return parseDuration(duration, format, locale);
      },
      toastMessage: (message?: string) => {
        return this._sendToastMessage.bind(this)({ message });
      },
      toast: (params: ShowToastParams) => {
        return this._sendToastMessage.bind(this)(params);
      },
      runAction: (actionConfig: ActionConfig) => {
        const localAction = this._evalActions(this._config!, actionConfig);
        this._buildActionConfig(localAction);
      },
    };
  }

  private _evalTemplate(state: HassEntity | undefined, func: any): any {
    /* eslint no-new-func: 0 */
    try {
      return new Function(
        'states',
        'entity',
        'user',
        'hass',
        'variables',
        'html',
        `helpers`,
        `'use strict'; ${func}`,
      ).call(
        this,
        this._pStates,
        state,
        this._hass!.user,
        this._pHass,
        this._pVariables,
        html,
        this._getTemplateHelpers(),
      );
    } catch (e: any) {
      const funcTrimmed = func.length <= 100 ? func.trim() : `${func.trim().substring(0, 98)}...`;
      e.message = `${e.name}: ${e.message} in '${funcTrimmed}'`;
      e.name = 'ButtonCardJSTemplateError';
      throw e;
    }
  }

  private _objectEvalTemplate(state: HassEntity | undefined, obj: any | undefined): any {
    const objClone = copy(obj);
    return this._getTemplateOrValue(state, objClone);
  }

  private _getTemplateOrValue(state: HassEntity | undefined, value: any | undefined): any | undefined {
    if (['number', 'boolean', 'function'].includes(typeof value)) return value;
    if (!value) return value;
    if (typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        value[key] = this._getTemplateOrValue(state, value[key]);
      });
      return value;
    }
    const trimmed = value.trim();
    const rx = new RegExp('^(\\[{3,})(.*?)(\\]{3,})$', 's');
    const match = trimmed.match(rx);
    if (match && match.length === 4) {
      if (match[1].length === 3 && match[3].length === 3) {
        return this._evalTemplate(state, match[2]);
      } else if (match[1].length === match[3].length) {
        return trimmed.slice(1, -1);
      } else {
        return value;
      }
    } else {
      return value;
    }
  }

  private _getColorForLightEntity(
    state: HassEntity | undefined,
    useTemperature: boolean,
    cardColorType?: ColorType,
  ): string {
    let color: string = DEFAULT_COLOR;
    if (OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE.includes(color)) {
      color = computeCssVariable(OVERRIDE_CARD_BACKGROUND_COLOR_COLORS)!;
    }
    if (state) {
      // we have en entity
      if (stateActive(state)) {
        // entity is on
        if (state.attributes.rgb_color) {
          // entity has RGB attributes
          color = `rgb(${state.attributes.rgb_color.join(',')})`;
        } else if (
          useTemperature &&
          state.attributes.color_temp &&
          state.attributes.min_mireds &&
          state.attributes.max_mireds
        ) {
          // entity has color temperature and we want it
          color = getLightColorBasedOnTemperature(
            state.attributes.color_temp,
            state.attributes.min_mireds,
            state.attributes.max_mireds,
          );
        } else {
          // all the other lights
          color = stateColorCss(state, state.state, cardColorType) || DEFAULT_COLOR;
        }
        if (state.attributes.brightness) {
          color = applyBrightnessToColor(this, color, (state.attributes.brightness + 245) / 5);
        }
      } else {
        color = stateColorCss(state, state.state, cardColorType) || DEFAULT_COLOR;
      }
    }
    return color;
  }

  private _buildCssColorAttribute(state: HassEntity | undefined, configState: StateConfig | undefined): string {
    let colorValue = '';
    let color: undefined | string;
    if (configState?.color) {
      colorValue = configState.color;
    } else if (this._config!.color) {
      colorValue = this._config!.color;
    }
    if (AUTO_COLORS.includes(colorValue)) {
      if (!state || (state && computeDomain(state.entity_id) !== 'light')) {
        colorValue = '';
      }
    }
    if (AUTO_COLORS.includes(colorValue)) {
      // I'm a light
      color = this._getColorForLightEntity(state, colorValue !== 'auto-no-temperature', this._config?.color_type);
    } else if (colorValue) {
      // Color is forced but not auto
      color = colorValue;
    } else if (state) {
      // based on state
      color = stateColorCss(state, state.state, this._config?.color_type) || DEFAULT_COLOR;
    } else {
      color = DEFAULT_COLOR;
    }
    return color;
  }

  private _buildIcon(state: HassEntity | undefined, configState: StateConfig | undefined): string | undefined {
    if (!this._config!.show_icon) {
      return undefined;
    }
    let icon: undefined | string;
    if (configState?.icon) {
      icon = configState.icon;
    } else if (this._config!.icon) {
      icon = this._config!.icon;
    } else {
      return undefined;
    }
    return this._getTemplateOrValue(state, icon);
  }

  private _buildEntityPicture(state: HassEntity | undefined, configState: StateConfig | undefined): EntityPicture {
    if (!this._config!.show_entity_picture || (!state && !configState && !this._config!.entity_picture)) {
      return undefined;
    }
    let entityPicture: string | undefined;

    if (configState?.entity_picture) {
      entityPicture = configState.entity_picture;
    } else if (this._config!.entity_picture) {
      entityPicture = this._config!.entity_picture;
    } else if (state) {
      entityPicture = state.attributes && state.attributes.entity_picture ? state.attributes.entity_picture : undefined;
    }
    const entityPictureTemplate = this._getTemplateOrValue(state, entityPicture);
    if (entityPictureTemplate && isMediaSourceContentId(entityPictureTemplate)) {
      return resolveMediaSource(this._hass!, entityPictureTemplate)
        .then((resolved) => resolved.url)
        .catch(() => '');
    }
    return entityPictureTemplate;
  }

  private _buildStyleGeneric(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    styleType: string,
  ): StyleInfo {
    let style: any = {};
    if (this._config!.styles?.[styleType]) {
      style = Object.assign(style, ...this._config!.styles[styleType]);
    }
    if (configState?.styles?.[styleType]) {
      let configStateStyle: StyleInfo = {};
      configStateStyle = Object.assign(configStateStyle, ...configState.styles[styleType]);
      style = {
        ...style,
        ...configStateStyle,
      };
    }
    Object.keys(style).forEach((key) => {
      style[key] = this._getTemplateOrValue(state, style[key]);
    });
    return style;
  }

  private _buildCustomStyleGeneric(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    styleType: string,
  ): StyleInfo {
    let style: any = {};
    if (this._config!.styles?.custom_fields?.[styleType]) {
      style = Object.assign(style, ...this._config!.styles.custom_fields[styleType]);
    }
    if (configState?.styles?.custom_fields?.[styleType]) {
      let configStateStyle: StyleInfo = {};
      configStateStyle = Object.assign(configStateStyle, ...configState.styles.custom_fields[styleType]);
      style = {
        ...style,
        ...configStateStyle,
      };
    }
    Object.keys(style).forEach((key) => {
      style[key] = this._getTemplateOrValue(state, style[key]);
    });
    return style;
  }

  private _buildName(state: HassEntity | undefined, configState: StateConfig | undefined): string | undefined {
    if (this._config!.show_name === false) {
      return undefined;
    }
    let name: string | undefined;

    if (configState?.name) {
      name = configState.name;
    } else if (this._config!.name) {
      name = this._config!.name;
    } else if (state) {
      name =
        state.attributes && state.attributes.friendly_name
          ? state.attributes.friendly_name
          : computeEntity(state.entity_id);
    }
    return this._getTemplateOrValue(state, name);
  }

  private _buildStateString(stateObj: HassEntity | undefined): string | undefined | null {
    let stateString: string | undefined | null;
    if (this._config!.show_state && stateObj && stateObj.state) {
      if (computeDomain(stateObj.entity_id) === 'timer') {
        if (stateObj.state === 'idle' || this._timeRemaining === 0) {
          stateString = computeStateDisplay(
            this._hass!.localize,
            stateObj,
            this._hass!.locale,
            this._hass!.config,
            this._hass!.entities,
            this._config,
          );
        } else {
          stateString = this._computeTimeDisplay(stateObj);
          if (stateObj.state === 'paused') {
            stateString += ` (${computeStateDisplay(
              this._hass!.localize,
              stateObj,
              this._hass!.locale,
              this._hass!.config,
              this._hass!.entities,
              this._config,
            )})`;
          }
        }
      } else {
        stateString = computeStateDisplay(
          this._hass!.localize,
          stateObj,
          this._hass!.locale,
          this._hass!.config,
          this._hass!.entities,
          this._config,
        );
      }
    }
    return stateString;
  }

  private _buildLastChanged(state: HassEntity | undefined, style: StyleInfo): TemplateResult | undefined {
    return this._config!.show_last_changed && state
      ? html`
          <ha-relative-time
            id="label"
            class="ellipsis"
            .hass="${this._hass}"
            .datetime="${state.last_changed}"
            style=${styleMap(style)}
          ></ha-relative-time>
        `
      : undefined;
  }

  private _buildLabel(state: HassEntity | undefined, configState: StateConfig | undefined): string | undefined {
    if (!this._config!.show_label) {
      return undefined;
    }
    let label: string | undefined;

    if (configState?.label) {
      label = configState.label;
    } else {
      label = this._config!.label;
    }

    return this._getTemplateOrValue(state, label);
  }

  private _buildCustomFields(state: HassEntity | undefined, configState: StateConfig | undefined): TemplateResult {
    let result = html``;
    const fields: any = {};
    const cards: any = {};
    if (this._config!.custom_fields) {
      Object.keys(this._config!.custom_fields).forEach((key) => {
        const value = this._config!.custom_fields![key];
        if (!(value as CustomFieldCard).card) {
          fields[key] = this._getTemplateOrValue(state, value);
        } else {
          if ((value as CustomFieldCard).do_not_eval) {
            cards[key] = copy((value as CustomFieldCard).card);
          } else {
            cards[key] = this._objectEvalTemplate(state, (value as CustomFieldCard).card);
          }
        }
      });
    }
    if (configState?.custom_fields) {
      Object.keys(configState.custom_fields).forEach((key) => {
        const value = configState!.custom_fields![key];
        if (!(value as CustomFieldCard)!.card) {
          fields[key] = this._getTemplateOrValue(state, value);
        } else {
          if ((value as CustomFieldCard).do_not_eval) {
            cards[key] = copy((value as CustomFieldCard).card);
          } else {
            cards[key] = this._objectEvalTemplate(state, (value as CustomFieldCard).card);
          }
        }
      });
    }
    Object.keys(fields).forEach((key) => {
      if (fields[key] != undefined) {
        const customStyle: StyleInfo = {
          ...this._buildCustomStyleGeneric(state, configState, key),
          'grid-area': key,
        };
        result = html`
          ${result}
          <div id=${key} class="ellipsis" style=${styleMap(customStyle)}>${this._unsafeHTMLorNot(fields[key])}</div>
        `;
      }
    });
    Object.keys(cards).forEach((key) => {
      if (cards[key] != undefined) {
        const customStyle: StyleInfo = {
          ...this._buildCustomStyleGeneric(state, configState, key),
          'grid-area': key,
        };
        let thing;
        if (!deepEqual(this._cardsConfig[key], cards[key])) {
          if (
            (this._cardsConfig[key] as any)?.type === cards[key]?.type &&
            (this._config!.custom_fields?.[key] as CustomFieldCard)?.force_recreate !== true
          ) {
            // same type, different config
            thing = this._cards[key];
            thing.preview = this.preview;
            this._cardsConfig[key] = copy(cards[key]);
            thing.setConfig(cards[key]);
          } else {
            thing = this._createCard(cards[key]);
            thing.preview = this.preview;
            this._cards[key] = thing;
            this._cardsConfig[key] = copy(cards[key]);
          }
        } else {
          thing = this._cards[key];
        }
        thing.hass = this._hass;
        result = html`
          ${result}
          <div
            id=${key}
            @action=${this._stopPropagation}
            @click=${this._sendToParent}
            @touchstart=${this._sendToParent}
            @mousedown=${this._sendToParent}
            @mouseup=${this._sendToParent}
            @touchend=${this._sendToParent}
            @touchcancel=${this._sendToParent}
            style=${styleMap(customStyle)}
          >
            ${thing}
          </div>
        `;
      }
    });
    return result;
  }

  private _hasChildCards(customFields: CustomFields | undefined): boolean {
    if (!customFields) return false;
    return Object.keys(customFields).some((key) => {
      const value = customFields![key];
      if ((value as CustomFieldCard)!.card) {
        return true;
      }
      return false;
    });
  }

  private _isActionDoingSomething(state: HassEntity | undefined, actionConfig: any | undefined): boolean {
    if (!actionConfig) return false;
    if (typeof actionConfig === 'string') {
      const evaledActionObj = this._getTemplateOrValue(state, actionConfig);
      return !!(evaledActionObj && !['none', null, undefined].includes(evaledActionObj.action));
    } else if (typeof actionConfig === 'object' && actionConfig.action) {
      const evaledActionString = this._getTemplateOrValue(state, actionConfig.action);
      return !['none', null, undefined].includes(evaledActionString);
    }
    return false;
  }

  private _computeIsClickable(state: HassEntity | undefined, configState: StateConfig | undefined): void {
    const tapActive = this._isActionDoingSomething(state, this._config!.tap_action);
    const holdActive = this._isActionDoingSomething(state, this._config!.hold_action);
    const doubleTapActive = this._isActionDoingSomething(state, this._config!.double_tap_action);
    const pressActive = this._isActionDoingSomething(state, this._config!.press_action);
    const releaseActive = this._isActionDoingSomething(state, this._config!.release_action);
    const iconTapActive = this._isActionDoingSomething(state, this._config!.icon_tap_action);
    const iconHoldActive = this._isActionDoingSomething(state, this._config!.icon_hold_action);
    const iconDoubleTapActive = this._isActionDoingSomething(state, this._config!.icon_double_tap_action);
    const iconPressActive = this._isActionDoingSomething(state, this._config!.icon_press_action);
    const iconReleaseActive = this._isActionDoingSomething(state, this._config!.icon_release_action);
    const hasChildCards =
      this._hasChildCards(this._config!.custom_fields) ||
      !!(configState && this._hasChildCards(configState.custom_fields));
    const rippleEnabled = this._getTemplateOrValue(state, this._config!.show_ripple);
    const cardHasActions = tapActive || holdActive || doubleTapActive || pressActive || releaseActive;
    this._cardClickable = cardHasActions || hasChildCards;
    this._hasIconActions =
      iconTapActive || iconHoldActive || iconDoubleTapActive || iconPressActive || iconReleaseActive;
    this._iconClickable = this._cardClickable || this._hasIconActions;
    this._cardRipple = rippleEnabled ?? (cardHasActions || this._hasIconActions);
    this._cardMomentary = pressActive || releaseActive;
    this._iconMomentary = iconPressActive || iconReleaseActive;
  }

  private _rotate(configState: StateConfig | undefined): boolean {
    return !!(
      this._getTemplateOrValue(this._stateObj, configState?.rotate) ??
      this._getTemplateOrValue(this._stateObj, this._config?.rotate)
    );
  }

  private _blankCardColoredHtml(cardStyle: StyleInfo): TemplateResult {
    const blankCardStyle = {
      background: 'none',
      'box-shadow': 'none',
      'border-style': 'none',
      ...cardStyle,
    };
    return html`
      <ha-card class="disabled" style=${styleMap(blankCardStyle)}>
        <div></div>
      </ha-card>
    `;
  }

  private _cardHtml(): TemplateResult {
    const configState = this._getMatchingConfigState(this._stateObj);
    this._computeIsClickable(this._stateObj, configState);
    let color: string = DEFAULT_STATE_COLOR;
    if (!!configState?.color && !AUTO_COLORS.includes(configState.color)) {
      color = configState.color;
    } else if (!!this._config?.color && !AUTO_COLORS.includes(this._config.color)) {
      if (this._stateObj) {
        if (stateActive(this._stateObj)) {
          color = this._config?.color || color;
        } else {
          color = stateColorCss(this._stateObj, this._stateObj.state, this._config?.color_type) || DEFAULT_COLOR;
        }
      } else {
        color = this._config.color;
      }
    } else {
      color = this._buildCssColorAttribute(this._stateObj, configState);
    }
    let buttonColor = color;
    let cardStyle: any = {};
    let lockStyle: any = {};
    let spinnerStyle: any = {};
    const aspectRatio: any = {};
    const lockStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'lock');
    const spinnerStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'spinner');
    const configCardStyle = this._buildStyleGeneric(this._stateObj, configState, 'card');
    const tooltipStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'tooltip');
    const classList: ClassInfo = {
      'button-card-main': true,
      disabled: !this._cardClickable,
      section: !!this._config?.section_mode,
    };
    if (!!this._config?.section_mode) {
      this.classList.add('section');
    }
    if (configCardStyle.width) {
      this.style.setProperty('flex', '0 0 auto');
      this.style.setProperty('max-width', 'fit-content');
    }
    switch (this._config!.color_type) {
      case 'blank-card':
        return this._blankCardColoredHtml(configCardStyle);
      case 'card':
      case 'label-card': {
        const fontColor = getFontColorBasedOnBackgroundColor(this, color);
        cardStyle.color = fontColor;
        lockStyle.color = fontColor;
        cardStyle['background-color'] = color;
        cardStyle = { ...cardStyle, ...configCardStyle };
        buttonColor = 'inherit';
        this.style.setProperty('--button-card-color', fontColor);
        break;
      }
      default:
        cardStyle = configCardStyle;
        this.style.setProperty('--button-card-color', buttonColor);
        break;
    }
    if (this._config!.aspect_ratio) {
      aspectRatio['--aspect-ratio'] = this._config!.aspect_ratio;
      cardStyle.position = 'absolute';
    } else {
      aspectRatio.display = 'inline';
    }
    this.style.setProperty('--button-card-light-color', this._getColorForLightEntity(this._stateObj, true));
    this.style.setProperty(
      '--button-card-light-color-no-temperature',
      this._getColorForLightEntity(this._stateObj, false),
    );
    this.style.setProperty('--button-card-ripple-color', buttonColor);
    lockStyle = { ...lockStyle, ...lockStyleFromConfig };
    spinnerStyle = { ...spinnerStyle, ...spinnerStyleFromConfig };

    const extraStyles = this._config!.extra_styles
      ? html`
          <style>
            ${this._getTemplateOrValue(this._stateObj, this._config!.extra_styles)}
          </style>
        `
      : html``;
    const holdActionEvaluated = this._partialActionEval(this._config!.hold_action);
    return html`
      ${extraStyles}
      <div id="aspect-ratio" style=${styleMap(aspectRatio)}>
        <ha-card
          id="card"
          class=${classMap(classList)}
          style=${styleMap(cardStyle)}
          @wa-show=${this._tooltipShow}
          @action=${(ev: CustomEvent) => this._handleAction(ev, { isIcon: false })}
          .actionHandler=${actionHandler({
            hasDoubleClick: this._isActionDoingSomething(this._stateObj, this._config!.double_tap_action),
            hasHold: this._isActionDoingSomething(this._stateObj, this._config!.hold_action),
            repeat: holdActionEvaluated?.repeat,
            repeatLimit: holdActionEvaluated?.repeat_limit,
            isMomentary: this._cardMomentary,
            disableKbd: this._config?.disable_kbd,
          })}
          .config="${this._config}"
        >
          ${this._buttonContent(this._stateObj, configState, buttonColor)}
          <ha-ripple .disabled=${!this._cardRipple}></ha-ripple>
        </ha-card>
        ${this._getLock(lockStyle)} ${this._getSpinner(spinnerStyle, configState)}
        ${this._getTooltip(tooltipStyleFromConfig, configState)}
      </div>
    `;
  }

  private _getTooltip(tooltipStyle: StyleInfo, configState: StateConfig | undefined): TemplateResult {
    let tooltipConfig: TooltipConfig | undefined;
    if (typeof this._config!.tooltip === 'string') {
      tooltipConfig = {
        content: this._getTemplateOrValue(this._stateObj, this._config!.tooltip),
      };
    } else {
      tooltipConfig = this._objectEvalTemplate(this._stateObj, this._config!.tooltip) ?? {};
    }
    let tooltipStateConfig: TooltipConfig | undefined;
    if (typeof configState?.tooltip === 'string') {
      tooltipStateConfig = {
        content: this._getTemplateOrValue(this._stateObj, configState?.tooltip),
      };
    } else {
      tooltipStateConfig = this._objectEvalTemplate(this._stateObj, configState?.tooltip) ?? {};
    }
    const tooltipMergedConfig = { ...tooltipConfig, ...tooltipStateConfig };

    if (tooltipMergedConfig && tooltipMergedConfig.content) {
      const delayMs = parseDuration(String(tooltipMergedConfig?.delay ?? '150'), 'ms', 'en') as number;
      const hideDelayMs = parseDuration(
        String(tooltipMergedConfig?.hide_delay ?? tooltipMergedConfig?.delay ?? '150'),
        'ms',
        'en',
      ) as number;
      const withoutArrow = tooltipMergedConfig?.arrow ? undefined : true;
      return html`
        <wa-tooltip
          id="tooltip"
          for="card"
          @wa-show=${this._tooltipShow}
          placement=${ifDefined(tooltipMergedConfig.placement || undefined)}
          distance=${ifDefined(tooltipMergedConfig.distance || undefined)}
          skidding=${ifDefined(tooltipMergedConfig.skidding || undefined)}
          show-delay=${delayMs}
          hide-delay=${hideDelayMs}
          without-arrow=${withoutArrow || nothing}
          style=${styleMap(tooltipStyle)}
        >
          <span class="tooltip">${this._unsafeHTMLorNot(tooltipMergedConfig.content)}</span>
        </wa-tooltip>
      `;
    } else {
      return html``;
    }
  }

  private _getSpinner(spinnerStyle: StyleInfo, configState: StateConfig | undefined): TemplateResult {
    const spinnerEnabled =
      this._getTemplateOrValue(this._stateObj, configState?.spinner) ||
      this._getTemplateOrValue(this._stateObj, this._config!.spinner);
    if (this._spinnerActive || spinnerEnabled) {
      return html`
        <div id="spinner" style=${styleMap(spinnerStyle)}>
          <div id="spinner-background"></div>
          <ha-spinner></ha-spinner>
        </div>
      `;
    } else {
      return html``;
    }
  }

  private _getLock(lockStyle: StyleInfo): TemplateResult {
    if (this._config!.lock && this._getTemplateOrValue(this._stateObj, this._config!.lock.enabled)) {
      return html`
        <div
          id="overlay"
          style=${styleMap(lockStyle)}
          @action=${this._handleUnlockType}
          .actionHandler=${actionHandler({
            hasDoubleClick: this._config!.lock!.unlock === 'double_tap',
            hasHold: this._config!.lock!.unlock === 'hold',
            disableKbd: this._config?.disable_kbd,
          })}
          .config="${this._config}"
        >
          <ha-icon id="lock" icon=${this._config!.lock.lock_icon}></ha-icon>
        </div>
      `;
    }
    return html``;
  }

  private _buttonContent(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    color: string,
  ): TemplateResult {
    const name = this._buildName(state, configState);
    const stateDisplayActual = configState?.state_display || this._config!.state_display || undefined;
    const stateDisplay =
      this._config!.show_state && stateDisplayActual ? this._getTemplateOrValue(state, stateDisplayActual) : undefined;
    const stateString = stateDisplay !== undefined ? stateDisplay : this._buildStateString(state);
    const nameStateString = buildNameStateConcat(name, stateString);

    switch (this._config!.layout) {
      case 'icon_name_state':
      case 'name_state':
        return this._gridHtml(state, configState, this._config!.layout, color, nameStateString, undefined);
      default:
        return this._gridHtml(state, configState, this._config!.layout, color, name, stateString);
    }
  }

  private _unsafeHTMLorNot(input: any): any {
    if (input.strings || input.values) {
      return input;
    } else {
      return unsafeHTML(`${input}`);
    }
  }

  private _gridHtml(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    containerClass: string,
    color: string,
    name: string | undefined,
    stateString: string | undefined,
  ): TemplateResult {
    const iconTemplate = this._getIconHtml(state, configState, color);
    const itemClass: string[] = [containerClass];
    const label = this._buildLabel(state, configState);
    const nameStyleFromConfig = this._buildStyleGeneric(state, configState, 'name');
    const stateStyleFromConfig = this._buildStyleGeneric(state, configState, 'state');
    const labelStyleFromConfig = this._buildStyleGeneric(state, configState, 'label');
    const lastChangedTemplate = this._buildLastChanged(state, labelStyleFromConfig);
    const gridStyleFromConfig = this._buildStyleGeneric(state, configState, 'grid');
    if (!iconTemplate) itemClass.push('no-icon');
    if (!name) itemClass.push('no-name');
    if (!stateString) itemClass.push('no-state');
    if (!label && !lastChangedTemplate) itemClass.push('no-label');

    return html`
      <div id="container" class=${itemClass.join(' ')} style=${styleMap(gridStyleFromConfig)}>
        ${iconTemplate ? iconTemplate : ''}
        ${name
          ? html`
              <div id="name" class="ellipsis" style=${styleMap(nameStyleFromConfig)}>
                ${this._unsafeHTMLorNot(name)}
              </div>
            `
          : ''}
        ${stateString
          ? html`
              <div id="state" class="ellipsis" style=${styleMap(stateStyleFromConfig)}>
                ${this._unsafeHTMLorNot(stateString)}
              </div>
            `
          : ''}
        ${label && !lastChangedTemplate
          ? html`
              <div id="label" class="ellipsis" style=${styleMap(labelStyleFromConfig)}>
                ${this._unsafeHTMLorNot(label)}
              </div>
            `
          : ''}
        ${lastChangedTemplate ? lastChangedTemplate : ''} ${this._buildCustomFields(state, configState)}
      </div>
    `;
  }

  private _getIconHtml(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    color: string,
  ): TemplateResult | undefined {
    const icon = this._buildIcon(state, configState);
    const entityPicture = this._buildEntityPicture(state, configState);
    const entityPictureStyleFromConfig = this._buildStyleGeneric(state, configState, 'entity_picture');
    const haIconStyleFromConfig = this._buildStyleGeneric(state, configState, 'icon');
    const imgCellStyleFromConfig = this._buildStyleGeneric(state, configState, 'img_cell');
    const haCardStyleFromConfig = this._buildStyleGeneric(state, configState, 'card');

    const haIconStyle: StyleInfo = {
      color,
      width: this._config!.size,
      '--ha-icon-display': haCardStyleFromConfig.height ? 'inline' : undefined,
      position: !this._config!.aspect_ratio && !haCardStyleFromConfig.height ? 'relative' : 'absolute',
      ...haIconStyleFromConfig,
    };
    const entityPictureStyle: StyleInfo = {
      ...haIconStyle,
      ...entityPictureStyleFromConfig,
    };
    const classList: ClassInfo = {
      enabled: this._iconClickable,
    };
    const liveStream = this._buildLiveStream(entityPictureStyle);
    const shouldShowIcon = this._config!.show_icon && (icon || state);

    if (shouldShowIcon || entityPicture) {
      let domain: string | undefined = undefined;
      if (state) {
        domain = computeStateDomain(state);
      }
      const iconHoldActionEvaluated = this._partialActionEval(this._config!.icon_hold_action);
      return html`
        <div id="img-cell" style=${styleMap(imgCellStyleFromConfig)}>
          ${shouldShowIcon && !entityPicture && !liveStream
            ? html`
                <ha-state-icon
                  class=${classMap(classList)}
                  .state=${state}
                  .stateObj=${state}
                  .hass=${this._hass}
                  ?data-domain=${domain}
                  data-state=${ifDefined(state?.state)}
                  style=${styleMap(haIconStyle)}
                  .icon="${icon}"
                  id="icon"
                  ?rotating=${this._rotate(configState)}
                  @action=${this._hasIconActions
                    ? (ev: CustomEvent) => this._handleAction(ev, { isIcon: true })
                    : undefined}
                  @pointerenter=${this._hasIconActions ? this._handleRippleIcon : undefined}
                  @pointerleave=${this._hasIconActions ? this._handleRippleIcon : undefined}
                  @click=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchstart=${this._hasIconActions ? this._sendToParent : undefined}
                  @mousedown=${this._hasIconActions ? this._sendToParent : undefined}
                  @mouseup=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchend=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchcancel=${this._hasIconActions ? this._sendToParent : undefined}
                  .actionHandler=${this._hasIconActions
                    ? actionHandler({
                        hasDoubleClick: this._isActionDoingSomething(state, this._config!.icon_double_tap_action),
                        hasHold: this._isActionDoingSomething(state, this._config!.icon_hold_action),
                        repeat: iconHoldActionEvaluated?.repeat,
                        repeatLimit: iconHoldActionEvaluated?.repeat_limit,
                        isMomentary: this._iconMomentary,
                        disableKbd: this._config?.disable_kbd,
                      })
                    : undefined}
                ></ha-state-icon>
              `
            : ''}
          ${liveStream ? liveStream : ''}
          ${entityPicture && !liveStream
            ? html`
                <img
                  class=${classMap(classList)}
                  src=${until(entityPicture)}
                  style=${styleMap(entityPictureStyle)}
                  id="icon"
                  ?rotating=${this._rotate(configState)}
                  draggable="false"
                  @action=${this._hasIconActions
                    ? (ev: CustomEvent) => this._handleAction(ev, { isIcon: true })
                    : undefined}
                  @pointerenter=${this._hasIconActions ? this._handleRippleIcon : undefined}
                  @pointerleave=${this._hasIconActions ? this._handleRippleIcon : undefined}
                  @click=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchstart=${this._hasIconActions ? this._sendToParent : undefined}
                  @mousedown=${this._hasIconActions ? this._sendToParent : undefined}
                  @mouseup=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchend=${this._hasIconActions ? this._sendToParent : undefined}
                  @touchcancel=${this._hasIconActions ? this._sendToParent : undefined}
                  .actionHandler=${this._hasIconActions
                    ? actionHandler({
                        hasDoubleClick: this._isActionDoingSomething(state, this._config!.icon_double_tap_action),
                        hasHold: this._isActionDoingSomething(state, this._config!.icon_hold_action),
                        repeat: iconHoldActionEvaluated?.repeat,
                        repeatLimit: iconHoldActionEvaluated?.repeat_limit,
                        isMomentary: this._iconMomentary,
                        disableKbd: this._config?.disable_kbd,
                      })
                    : undefined}
                />
              `
            : ''}
        </div>
      `;
    } else {
      return undefined;
    }
  }

  private _buildLiveStream(style: StyleInfo): TemplateResult | undefined {
    if (this._config!.show_live_stream && this._config!.entity && computeDomain(this._config!.entity) === 'camera') {
      return html`
        <hui-image
          .hass=${this._hass}
          .cameraImage=${this._config!.entity}
          .entity=${this._config!.entity}
          .cameraView=${'live'}
          .aspectRatio=${this._config!.live_stream_aspect_ratio}
          .fitMode=${this._config!.live_stream_fit_mode}
          style=${styleMap(style)}
        ></hui-image>
      `;
    } else {
      return undefined;
    }
  }

  private _configFromLLTemplates(ll: any, config: any): ExternalButtonCardConfig {
    const tpl = config.template;
    if (!tpl) return config;
    let result: any = {};
    let mergedStateConfig: StateConfig[] | undefined;
    const tpls = tpl && Array.isArray(tpl) ? tpl : [tpl];
    tpls?.forEach((template) => {
      if (!ll.config.button_card_templates?.[template])
        throw new Error(`Button-card template '${template}' is missing!`);
      const res = this._configFromLLTemplates(ll, ll.config.button_card_templates[template]);
      result = mergeDeep(result, res);
      mergedStateConfig = mergeStatesById(mergedStateConfig, res.state);
    });
    result = mergeDeep(result, config);
    result.state = mergeStatesById(mergedStateConfig, config.state);
    return result as ExternalButtonCardConfig;
  }

  public setConfig(config: ExternalButtonCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (this._initialSetupComplete) {
      this._initialSetupComplete = false;
    }

    this._cards = {};
    this._cardsConfig = {};
    const ll = getLovelace() || getLovelaceCast();
    let template: ExternalButtonCardConfig = copy(config);
    template = this._configFromLLTemplates(ll, template);
    this._config = {
      type: 'custom:button-card',
      group_expand: false,
      hold_action: { action: 'none' },
      double_tap_action: { action: 'none' },
      press_action: { action: 'none' },
      release_action: { action: 'none' },
      icon_tap_action: { action: 'none' },
      icon_hold_action: { action: 'none' },
      icon_double_tap_action: { action: 'none' },
      icon_press_action: { action: 'none' },
      icon_release_action: { action: 'none' },
      layout: 'vertical',
      size: '40%',
      color_type: 'icon',
      show_name: true,
      show_state: false,
      show_icon: true,
      show_units: true,
      show_label: false,
      show_entity_picture: false,
      show_live_stream: false,
      card_size: 3,
      ...template,
      lock: {
        enabled: false,
        duration: DEFAULT_LOCK_DURATION,
        unlock: 'tap',
        lock_icon: DEFAULT_LOCK_ICON,
        unlock_icon: DEFAULT_UNLOCK_ICON,
        ...template.lock,
      },
    };

    if (!this._initialSetupComplete) {
      this._finishSetup();
    }
  }

  private _loopGroup(entityList: string[] | undefined): void {
    if (entityList) {
      entityList.forEach((childEntity) => {
        if (this._hass?.states[childEntity]) {
          if (this._hass.states[childEntity].attributes?.entity_id) {
            this._loopGroup(this._hass.states[childEntity].attributes.entity_id);
          } else {
            if (!this._monitoredEntities.includes(childEntity)) {
              this._monitoredEntities.push(childEntity);
            }
          }
        }
      });
    }
  }

  private _expandTriggerGroups(): void {
    if (this._hass && this._config?.group_expand && this._monitoredEntities) {
      this._monitoredEntities.forEach((entity) => {
        if (this._hass?.states[entity]?.attributes?.entity_id) {
          this._loopGroup(this._hass?.states[entity].attributes?.entity_id);
        }
      });
    }
  }

  private _updateTimerStart(): void {
    this._updateTimerMS = Date.now();
    this._updateTimer();
  }

  private _updateTimerCancel(): void {
    if (this._updateTimeout) {
      window.clearTimeout(this._updateTimeout);
    }
  }

  private _updateTimerChanged(): boolean {
    if (this._config?.update_timer) {
      const updateInterval = this._getTemplateOrValue(this._stateObj, this._config.update_timer);
      const updateIntervalMS = parseDuration(updateInterval, 'ms', 'en');
      if (updateIntervalMS && updateIntervalMS >= 100 && updateIntervalMS !== this._updateTimerDuration) {
        return true;
      }
    }
    return false;
  }

  private _updateTimer(): void {
    if (this._updateTimeout) {
      window.clearTimeout(this._updateTimeout);
      this._updateTimeout = undefined;
    }
    if (this._config?.update_timer) {
      const updateInterval = this._getTemplateOrValue(this._stateObj, this._config.update_timer);
      const updateIntervalMS = parseDuration(updateInterval, 'ms', 'en');
      if (updateIntervalMS && updateIntervalMS >= 100) {
        this._updateTimerDuration = updateIntervalMS;
        this._updateTimeout = window.setTimeout(() => {
          this._updateRefresh();
        }, updateIntervalMS);
      }
    }
  }

  private _updateRefresh(): void {
    this._updateTimerMS = Date.now();
    this._updateTimeout = undefined;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  public getCardSize(): number {
    return this._config?.card_size || 3;
  }

  public getGridOptions() {
    if (!this._config?.section_mode) {
      return undefined;
    }
    return {
      rows: 2,
      columns: 6,
      min_rows: 1,
      min_columns: 1,
    };
  }

  private _partialActionEval(actionConfig: ActionConfig | undefined): EvaluatedActionConfig {
    if (!actionConfig) {
      return { action: 'none' };
    }
    if (typeof actionConfig === 'string') {
      return this._objectEvalTemplate(this._stateObj, actionConfig) as EvaluatedActionConfig;
    }
    const evaluatedAction: EvaluatedActionConfig = copy(actionConfig);
    ['action', 'repeat', 'repeat_limit'].forEach((key) => {
      evaluatedAction[key] = this._getTemplateOrValue(this._stateObj, evaluatedAction[key]);
    });
    return evaluatedAction;
  }

  private _evalActions(config: ButtonCardConfig, action: ActionConfig): ActionEventData {
    let evaledActionConfig: EvaluatedActionConfig | undefined;
    if (typeof action === 'string') {
      evaledActionConfig = this._objectEvalTemplate(this._stateObj, action);
    } else {
      evaledActionConfig = copy(action);
    }

    const actionType = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.action);

    if (actionType === 'none' || !actionType) {
      const noAction: ActionEventData = {};
      noAction[NORMALISED_ACTION] = { action: 'none' } as NoActionConfig;
      return noAction;
    }
    const repeat = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.repeat);
    const repeat_limit = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.repeat_limit);
    const sound = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.sound);
    let confirmation = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.confirmation);
    if (!confirmation && config.confirmation) {
      confirmation = this._objectEvalTemplate(this._stateObj, config.confirmation);
    }
    const haptic = this._getTemplateOrValue(this._stateObj, evaledActionConfig?.haptic);
    const protect = {
      ...this._objectEvalTemplate(this._stateObj, config.protect),
      ...this._objectEvalTemplate(this._stateObj, evaledActionConfig?.protect),
    };

    const actionData: ActionEventData = {};
    switch (actionType) {
      case 'javascript':
        evaledActionConfig = evaledActionConfig as JavascriptActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'fire-dom-event',
          buttonCardCustomAction: {
            callback: this._customActionsCallback.bind(this),
            type: 'javascript',
            data: {
              javascript: evaledActionConfig?.javascript,
            },
          },
        } as CustomActionConfig;
        break;

      case 'multi-actions':
        evaledActionConfig = evaledActionConfig as MultiActionsActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'fire-dom-event',
          buttonCardCustomAction: {
            callback: this._customActionsCallback.bind(this),
            type: 'multi-actions',
            data: {
              multiActions: evaledActionConfig?.actions,
            },
          },
        } as CustomActionConfig;
        break;

      case 'toast':
        evaledActionConfig = evaledActionConfig as ToastActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'fire-dom-event',
          buttonCardCustomAction: {
            callback: this._customActionsCallback.bind(this),
            type: 'toast',
            data: {
              toast: evaledActionConfig?.toast,
            },
          },
        } as CustomActionConfig;
        break;

      case 'toggle':
        evaledActionConfig = evaledActionConfig as ToggleActionConfig;
        actionData.entity =
          this._getTemplateOrValue(this._stateObj, evaledActionConfig?.entity) ||
          this._getTemplateOrValue(this._stateObj, config.entity);
        actionData[NORMALISED_ACTION] = {
          action: 'toggle',
        } as ToggleActionConfig;
        break;

      case 'more-info':
        evaledActionConfig = evaledActionConfig as MoreInfoActionConfig;
        actionData.entity =
          this._getTemplateOrValue(this._stateObj, evaledActionConfig?.entity) ||
          this._getTemplateOrValue(this._stateObj, config.entity);
        actionData[NORMALISED_ACTION] = {
          action: 'more-info',
        } as MoreInfoActionConfig;
        break;

      case 'navigate':
        evaledActionConfig = evaledActionConfig as NavigateActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'navigate',
          navigation_path: this._getTemplateOrValue(this._stateObj, evaledActionConfig?.navigation_path),
          navigation_replace: this._getTemplateOrValue(this._stateObj, evaledActionConfig?.navigation_replace),
        } as NavigateActionConfig;
        break;

      case 'url':
        evaledActionConfig = evaledActionConfig as UrlActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'url',
          url_path: this._getTemplateOrValue(this._stateObj, evaledActionConfig?.url_path),
        } as UrlActionConfig;
        break;

      case 'perform-action':
      case 'call-service':
        evaledActionConfig = evaledActionConfig as PerformActionActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'perform-action',
          perform_action:
            // backward compatibility with old school service call
            this._getTemplateOrValue(this._stateObj, evaledActionConfig?.perform_action) ||
            this._getTemplateOrValue(
              this._stateObj,
              (evaledActionConfig as unknown as CallServiceActionConfig)?.service,
            ),
          data:
            this._objectEvalTemplate(this._stateObj, evaledActionConfig?.data) ||
            this._objectEvalTemplate(this._stateObj, evaledActionConfig?.service_data),
          target: this._objectEvalTemplate(this._stateObj, evaledActionConfig?.target),
        } as PerformActionActionConfig;
        if (actionData[NORMALISED_ACTION].data?.entity_id === 'entity') {
          actionData[NORMALISED_ACTION].data.entity_id = this._getTemplateOrValue(this._stateObj, config.entity);
        }
        break;

      case 'assist':
        evaledActionConfig = evaledActionConfig as AssistActionConfig;
        actionData[NORMALISED_ACTION] = {
          action: 'assist',
          pipeline_id: this._getTemplateOrValue(this._stateObj, evaledActionConfig?.pipeline_id),
          start_listening: this._getTemplateOrValue(this._stateObj, evaledActionConfig?.start_listening),
        } as AssistActionConfig;
        break;

      case 'fire-dom-event':
        actionData[NORMALISED_ACTION] = {
          action: 'fire-dom-event',
          ...this._objectEvalTemplate(this._stateObj, evaledActionConfig),
        } as CustomActionConfig;
        break;

      default:
        return { [NORMALISED_ACTION]: { action: 'none' } as NoActionConfig };
    }

    actionData[NORMALISED_ACTION] = {
      ...actionData[NORMALISED_ACTION],
      repeat,
      repeat_limit,
      sound,
      haptic,
      confirmation,
      protect,
    };

    if (protect && (protect.password || protect.pin)) {
      this._protectedAction = copy(actionData);
    }
    // action will always be in NORMALISED_ACTION for easier handling
    return actionData;
  }

  private _handleRippleIcon(ev: PointerEvent): void {
    this._ripple.then((r) => {
      if (r) {
        if (ev.type === 'pointerenter') {
          const iconRect = (ev.target as HTMLElement)?.getBoundingClientRect() ?? null;
          const cardRect = r.getBoundingClientRect();
          const iconInset = { top: 0, left: 0, bottom: 0, right: 0 };
          const iconComputedStyle = ev.target ? getComputedStyle(ev.target as HTMLElement) : null;
          const iconInsetPadding = iconComputedStyle
            ? parseInt(iconComputedStyle.getPropertyValue('--button-card-ripple-icon-inset-padding'))
            : 12;
          let insetStyle = '';
          if (iconRect && cardRect) {
            iconInset.top = iconRect.top - cardRect.top - iconInsetPadding;
            iconInset.top = iconInset.top < 0 ? 0 : iconInset.top;
            iconInset.left = iconRect.left - cardRect.left - iconInsetPadding;
            iconInset.left = iconInset.left < 0 ? 0 : iconInset.left;
            iconInset.bottom = cardRect.bottom - iconRect.bottom - iconInsetPadding;
            iconInset.bottom = iconInset.bottom < 0 ? 0 : iconInset.bottom;
            iconInset.right = cardRect.right - iconRect.right - iconInsetPadding;
            iconInset.right = iconInset.right < 0 ? 0 : iconInset.right;
            insetStyle = `${iconInset.top}px ${iconInset.right}px ${iconInset.bottom}px ${iconInset.left}px`;
          }
          r.setAttribute('icon', '');
          if (insetStyle != '') {
            r.style.setProperty('--dynamic-ripple-icon-inset', insetStyle);
          }
        } else if (ev.type === 'pointerleave') {
          r.removeAttribute('icon');
          r.style.removeProperty('--dynamic-ripple-icon-inset');
        }
      }
    });
  }

  private _hapticInterceptHandler(ev: Event): void {
    if (this._hapticCapture && ev.stopPropagation) {
      const hapticType: HapticType | undefined = (ev as CustomEvent).detail;
      if (hapticType !== 'failure') {
        ev.stopPropagation();
      }
    }
  }

  private _handleAction(ev: CustomEvent, options: { isIcon: boolean }): void {
    if (options.isIcon && this._hasIconActions && ev.stopPropagation) {
      // stop event bubbling to avoid triggering card action
      ev.stopPropagation();
    }
    if (ev.detail?.action) {
      const config = this._config;
      if (!config) return;
      const action = ev.detail.action;
      const actionKey = options.isIcon ? `icon_${action}_action` : `${action}_action`;
      if (this._isActionDoingSomething(this._stateObj, config[actionKey])) {
        // always returns the action in NORMALISED_ACTION for easier handling
        const localAction = this._evalActions(config, config[actionKey]);
        this._buildActionConfig(localAction);
      }
    }
  }

  private _buildActionConfig(localAction?: ActionEventData): void {
    if (!localAction) return;
    if (localAction[NORMALISED_ACTION]?.protect?.pin) {
      (window as any).cardHelpers.showEnterCodeDialog(this, {
        submit: (code: string) => this._protectedConfirmedCallback.bind(this)(code, 'pin'),
        cancel: this._cancelledCallback.bind(this),
        codeFormat: 'number',
      });
    } else if (localAction[NORMALISED_ACTION]?.protect?.password) {
      (window as any).cardHelpers.showPromptDialog(this, {
        title: 'Password',
        inputLabel: 'Password',
        inputType: 'password',
        confirm: (password: string) => this._protectedConfirmedCallback.bind(this)(password, 'password'),
        cancel: this._cancelledCallback.bind(this),
      });
    } else {
      this._executeAction(localAction);
    }
  }

  private _executeAction(actionData: ActionEventData): void {
    const soundUrl = actionData[NORMALISED_ACTION]?.sound;
    if (soundUrl) {
      if (isMediaSourceContentId(soundUrl)) {
        resolveMediaSource(this._hass!, soundUrl)
          .then((resolved) => {
            const sound = new Audio(resolved.url);
            sound.play();
          })
          .catch(() => {
            console.error(`button-card: Error loading media source: ${soundUrl}`);
          });
      } else {
        const sound = new Audio(soundUrl);
        sound.play();
      }
    }

    const haptic: HapticType | undefined = actionData[NORMALISED_ACTION]?.haptic;
    this._hapticCapture = haptic !== undefined;
    handleAction(this, this._hass!, actionData, 'tap');
    this._hapticCapture = false;
    if (haptic && haptic != 'none') forwardHaptic(this, haptic);
  }

  private async _customActionsCallback(ev: ActionCustomEvent): Promise<void> {
    if (!ev.detail || !ev.detail.buttonCardCustomAction) {
      return;
    }
    const customAction = ev.detail.buttonCardCustomAction;
    switch (customAction.type) {
      case 'javascript':
        this._getTemplateOrValue(this._stateObj, customAction.data?.javascript);
        break;
      case 'multi-actions':
        let multiActions = customAction.data?.multiActions;
        if (typeof multiActions === 'string') {
          multiActions = this._objectEvalTemplate(this._stateObj, multiActions) as ActionConfig[];
        }
        const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
        if (Array.isArray(multiActions)) {
          this._spinnerActive = multiActions.some((actionConfig) => {
            return (
              typeof actionConfig !== 'string' &&
              ((actionConfig as CustomActionMultiActionsDelay)?.delay ||
                (actionConfig as CustomActionMultiActionsDelay)?.wait_completion)
            );
          });
          for (const actionConfig of multiActions) {
            if (typeof actionConfig !== 'string' && (actionConfig as CustomActionMultiActionsDelay)?.delay) {
              let delay = this._getTemplateOrValue(
                this._stateObj,
                (actionConfig as CustomActionMultiActionsDelay).delay,
              );
              delay = parseDuration(delay || '', 'ms', 'en');
              if (delay) await timer(delay);
            } else if (
              typeof actionConfig !== 'string' &&
              (actionConfig as CustomActionMultiActionsDelay)?.wait_completion
            ) {
              const delayActionConfig = actionConfig as CustomActionMultiActionsDelay;
              await timer(500);
              const timeout = this._getTemplateOrValue(this._stateObj, delayActionConfig.timeout);
              let waitTimeout = 0;
              const timeoutS = parseDuration(timeout || '', 'ms', 'en') || 0;
              while (
                (waitTimeout < timeoutS || timeoutS === 0) &&
                !this._getTemplateOrValue(this._stateObj, delayActionConfig.wait_completion)
              ) {
                await timer(500);
                waitTimeout += 500;
              }
            } else {
              const actionData = this._evalActions(this._config!, actionConfig as ActionConfig);
              delete actionData[NORMALISED_ACTION]?.repeat;
              delete actionData[NORMALISED_ACTION]?.repeat_limit;
              delete actionData[NORMALISED_ACTION]?.sound;
              delete actionData[NORMALISED_ACTION]?.haptic;
              delete actionData[NORMALISED_ACTION]?.confirmation;
              delete actionData[NORMALISED_ACTION]?.protect;
              this._executeAction(actionData);
            }
          }
          this._spinnerActive = false;
        }
        break;
      case 'toast':
        let toast = customAction.data?.toast;
        toast = this._objectEvalTemplate(this._stateObj, toast) as ShowToastParams;
        this._sendToastMessage(toast);
        break;
      default:
        break;
    }
  }

  private _protectedConfirmedCallback(code: string, type: 'pin' | 'password'): void {
    if (this._protectedAction && this._config) {
      if (code === this._protectedAction[NORMALISED_ACTION]?.protect?.[type]) {
        this._sendToastMessage({
          message: this._protectedAction[NORMALISED_ACTION]?.protect?.success_message,
        });
        delete this._protectedAction[NORMALISED_ACTION]?.protect;
        this._executeAction(this._protectedAction);
      } else {
        const message = this._protectedAction[NORMALISED_ACTION]?.protect?.failure_message;
        this._sendToastMessage({
          message: message || DEFAULT_FAILED_TOAST_MESSAGE[type],
        });
      }
    }
    this._protectedAction = undefined;
  }

  private _cancelledCallback(): void {
    this._protectedAction = undefined;
  }

  private _sendToastMessage(toastParams?: ShowToastParams): void {
    if (toastParams?.message === undefined) return;
    this.dispatchEvent(
      new CustomEvent('hass-notification', {
        bubbles: true,
        composed: true,
        detail: {
          ...toastParams,
        },
      }),
    );
  }

  private _handleUnlockType(ev): void {
    const config = this._config as ButtonCardConfig;
    if (!config) return;
    if (config.lock.unlock === ev.detail.action) {
      this._handleLock();
    }
  }

  private _handleLock(): void {
    const lock = this.shadowRoot!.getElementById('lock') as LitElement;
    if (!lock) return;
    if (this._config!.lock!.exemptions) {
      if (!this._hass!.user?.name || !this._hass!.user.id) return;
      let matched = false;
      this._config!.lock!.exemptions.forEach((e) => {
        if (
          (!matched && (e as ExemptionUserConfig).user === this._hass!.user?.id) ||
          (e as ExemptionUsernameConfig).username === this._hass!.user?.name
        ) {
          matched = true;
        }
      });
      if (!matched) {
        lock.classList.add('invalid');
        window.setTimeout(() => {
          if (lock) {
            lock.classList.remove('invalid');
          }
        }, 3000);
        return;
      }
    }
    const overlay = this.shadowRoot!.getElementById('overlay') as LitElement;
    overlay.style.setProperty('pointer-events', 'none');

    if (lock) {
      (lock as any).icon = this._config!.lock.unlock_icon;
      if (!this._config?.lock?.keep_unlock_icon) {
        lock.classList.add('hidden');
      }
    }
    window.setTimeout(() => {
      overlay.style.setProperty('pointer-events', '');
      if (lock) {
        if (!this._config?.lock?.keep_unlock_icon) {
          lock.classList.remove('hidden');
        }
        (lock as any).icon = this._config!.lock!.lock_icon;
      }
    }, this._config!.lock!.duration! * 1000);
  }

  private _stopPropagation(ev: Event): void {
    ev.stopPropagation();
  }

  private _sendToParent(ev: Event): void {
    const event = ev.type?.startsWith('touch')
      ? new TouchEvent(ev.type, ev)
      : ev.type?.startsWith('mouse')
        ? new MouseEvent(ev.type, ev)
        : new CustomEvent(ev.type, ev);
    ev.stopPropagation();
    this.parentElement?.dispatchEvent(event);
    // Send non-bubbling event to ha-card to allow ripples
    const rippleEvent = new CustomEvent(ev.type, {
      ...ev,
      bubbles: false,
      composed: false,
      detail: { ignore: true },
    });
    this._ripple.then((r) => {
      if (r) {
        r.parentElement?.dispatchEvent(rippleEvent);
      }
    });
  }

  private _tooltipShow(ev): void {
    ev.stopPropagation();
    if (ev.detail?.card && ev.detail.card !== this) {
      // child tooltip is showing. hide ours using tooltip hideDelay
      // child tooltip will hide per normal after hideDelay making show/hide parent/chid tooltips have same delay
      const tooltip: HaTooltip | null | undefined = this.shadowRoot?.querySelector('#tooltip');
      if (tooltip) {
        const hideDelay = tooltip.hideDelay ?? 400;
        window.setTimeout(() => {
          tooltip.hide?.();
        }, hideDelay);
      }
    } else {
      const event = new CustomEvent(ev.type, {
        ...ev,
        bubbles: true,
        composed: true,
        detail: {
          card: this,
        },
      });
      this.parentElement?.dispatchEvent(event);
    }
  }
}
