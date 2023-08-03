/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LitElement, html, TemplateResult, CSSResult, PropertyValues } from 'lit';
import { customElement, property, queryAsync, eventOptions } from 'lit/decorators';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Ripple } from '@material/mwc-ripple';
import { RippleHandlers } from '@material/mwc-ripple/ripple-handlers';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import { HassEntity } from 'home-assistant-js-websocket';
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
} from './types/types';
import { actionHandler } from './action-handler';
import {
  computeDomain,
  computeEntity,
  getFontColorBasedOnBackgroundColor,
  buildNameStateConcat,
  applyBrightnessToColor,
  myHasConfigOrEntityChanged,
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
  OVERRIDE_CARD_BACKGROUND_COLOR_COLORS,
  OVERRIDE_CARD_BACKGROUND_COLOR_COLOR_TYPE,
} from './common/const';
import { handleAction } from './handle-action';
import { fireEvent } from './common/fire-event';
import { HomeAssistant } from './types/homeassistant';
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

let helpers = (window as any).cardHelpers;
const helperPromise = new Promise<void>(async (resolve) => {
  if (helpers) resolve();
  if ((window as any).loadCardHelpers) {
    helpers = await (window as any).loadCardHelpers();
    (window as any).cardHelpers = helpers;
    resolve();
  }
});

/* eslint no-console: 0 */
console.info(
  `%c  BUTTON-CARD  \n%c Version ${pjson.version} `,
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

@customElement('button-card')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ButtonCard extends LitElement {
  @property() private _hass?: HomeAssistant;

  @property() private _config?: ButtonCardConfig;

  @property() private _timeRemaining?: number;

  @queryAsync('mwc-ripple') private _ripple!: Promise<Ripple | null>;

  private _hasTemplate?: boolean;

  private _stateObj: HassEntity | undefined;

  private _evaledVariables: any | undefined;

  private _interval?: number;

  private _cards: ButtonCardEmbeddedCards = {};

  private _cardsConfig: ButtonCardEmbeddedCardsConfig = {};

  private _entities: string[] = [];

  private _initialSetupComplete = false;

  private get _doIHaveEverything(): boolean {
    return !!this._hass && !!this._config && this.isConnected;
  }

  public set hass(hass: HomeAssistant) {
    this._hass = hass;
    Object.keys(this._cards).forEach((element) => {
      const el = this._cards[element];
      el.hass = this._hass;
    });
    if (!this._initialSetupComplete) {
      this._finishSetup();
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearInterval();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (!this._initialSetupComplete) {
      this._finishSetup();
    } else {
      this._startTimerCountdown();
    }
  }

  private _evaluateVariablesSkipError(stateObj?: HassEntity | undefined) {
    this._evaledVariables = {};
    if (this._config?.variables) {
      const variablesNameOrdered = Object.keys(this._config.variables).sort();
      variablesNameOrdered.forEach((variable) => {
        try {
          this._evaledVariables[variable] = this._objectEvalTemplate(stateObj, this._config!.variables![variable]);
        } catch (e) {}
      });
    }
  }

  private _finishSetup(): void {
    if (!this._initialSetupComplete && this._doIHaveEverything) {
      this._evaluateVariablesSkipError();

      if (this._config!.entity) {
        const entityEvaled = this._getTemplateOrValue(undefined, this._config!.entity);
        this._config!.entity = entityEvaled;
        this._stateObj = this._hass!.states[entityEvaled];
      }

      this._evaluateVariablesSkipError(this._stateObj);

      if (this._config!.entity && DOMAINS_TOGGLE.has(computeDomain(this._config!.entity))) {
        this._config = {
          tap_action: { action: 'toggle' },
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

      const jsonConfig = JSON.stringify(this._config);
      this._entities = [];
      if (Array.isArray(this._config!.triggers_update)) {
        this._config!.triggers_update.forEach((entry) => {
          try {
            const evaluatedEntry = this._getTemplateOrValue(this._stateObj, entry);
            if (evaluatedEntry !== undefined && evaluatedEntry !== null && !this._entities.includes(evaluatedEntry)) {
              this._entities.push(evaluatedEntry);
            }
          } catch (e) {}
        });
      } else if (typeof this._config!.triggers_update === 'string') {
        const result = this._getTemplateOrValue(this._stateObj, this._config!.triggers_update);
        if (result && result !== 'all') {
          this._entities.push(result);
        } else {
          this._config.triggers_update = result;
        }
      }
      if (this._config!.triggers_update !== 'all') {
        const entitiesRxp = new RegExp(/states\[\s*('|\\")([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\1\s*\]/, 'gm');
        const entitiesRxp2 = new RegExp(/states\[\s*('|\\")([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\1\s*\]/, 'm');
        const matched = jsonConfig.match(entitiesRxp);
        matched?.forEach((match) => {
          const res = match.match(entitiesRxp2);
          if (res && !this._entities.includes(res[2])) this._entities.push(res[2]);
        });
      }
      if (this._config!.entity && !this._entities.includes(this._config!.entity))
        this._entities.push(this._config!.entity);
      this._expandTriggerGroups();

      const rxp = new RegExp('\\[\\[\\[.*\\]\\]\\]', 'm');
      this._hasTemplate = this._config!.triggers_update === 'all' && jsonConfig.match(rxp) ? true : false;

      this._startTimerCountdown();
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
      this._evaledVariables = {};
      if (this._config?.variables) {
        const variablesNameOrdered = Object.keys(this._config.variables).sort();
        variablesNameOrdered.forEach((variable) => {
          this._evaledVariables[variable] = this._objectEvalTemplate(
            this._stateObj,
            this._config!.variables![variable],
          );
        });
      }
      return this._cardHtml();
    } catch (e: any) {
      if (e.stack) console.error(e.stack);
      else console.error(e);
      const errorCard = document.createElement('hui-error-card') as LovelaceCard;
      errorCard.setConfig({
        type: 'error',
        error: e.toString(),
        origConfig: this._config,
      });
      return html` ${errorCard} `;
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    const forceUpdate = this._hasTemplate || changedProps.has('_timeRemaining') ? true : false;
    if (forceUpdate || myHasConfigOrEntityChanged(this, changedProps)) {
      this._expandTriggerGroups();
      return true;
    }
    return false;
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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
        this._hass!.states,
        state,
        this._hass!.user,
        this._hass,
        this._evaledVariables,
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
    if (['number', 'boolean'].includes(typeof value)) return value;
    if (!value) return value;
    if (typeof value === 'object') {
      Object.keys(value).forEach((key) => {
        value[key] = this._getTemplateOrValue(state, value[key]);
      });
      return value;
    }
    const trimmed = value.trim();
    if (trimmed.substring(0, 3) === '[[[' && trimmed.slice(-3) === ']]]') {
      return this._evalTemplate(state, trimmed.slice(3, -3));
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

  private _buildEntityPicture(state: HassEntity | undefined, configState: StateConfig | undefined): string | undefined {
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
    return this._getTemplateOrValue(state, entityPicture);
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
          thing = this._createCard(cards[key]);
          this._cards[key] = thing;
          this._cardsConfig[key] = copy(cards[key]);
        } else {
          thing = this._cards[key];
        }
        thing.hass = this._hass;
        result = html`
          ${result}
          <div
            id=${key}
            @action=${this._stopPropagation}
            @click=${this._stopPropagation}
            @touchstart=${this._stopPropagation}
            @mousedown=${this._stopPropagation}
            @mouseup=${this._stopPropagation}
            @touchend=${this._stopPropagation}
            @touchcancel=${this._stopPropagation}
            style=${styleMap(customStyle)}
          >
            ${thing}
          </div>
        `;
      }
    });
    return result;
  }

  private _isClickable(state: HassEntity | undefined, configState: StateConfig | undefined): boolean {
    let clickable = true;
    const tap_action = this._getTemplateOrValue(state, this._config!.tap_action!.action);
    const hold_action = this._getTemplateOrValue(state, this._config!.hold_action!.action);
    const double_tap_action = this._getTemplateOrValue(state, this._config!.double_tap_action!.action);
    let hasChildCards = false;
    if (this._config!.custom_fields) {
      hasChildCards = Object.keys(this._config!.custom_fields).some((key) => {
        const value = this._config!.custom_fields![key];
        if ((value as CustomFieldCard)!.card) {
          return true;
        }
        return false;
      });
    }
    if (!hasChildCards && configState) {
      if (configState.custom_fields) {
        return (hasChildCards = Object.keys(configState.custom_fields).some((key) => {
          const value = configState.custom_fields![key];
          if ((value as CustomFieldCard)!.card) {
            return true;
          }
          return false;
        }));
      }
    }
    if (tap_action != 'none' || hold_action != 'none' || double_tap_action != 'none' || hasChildCards) {
      clickable = true;
    } else {
      clickable = false;
    }
    return clickable;
  }

  private _rotate(configState: StateConfig | undefined): boolean {
    return configState?.spin ? true : false;
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
    let color: string = 'var(--state-inactive-color)';
    if (!!configState?.color && !AUTO_COLORS.includes(configState.color)) {
      color = configState.color;
    } else if (!!this._config?.color && !AUTO_COLORS.includes(this._config.color)) {
      if (this._stateObj) {
        if (stateActive(this._stateObj)) {
          color = this._config?.color || color;
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
    const aspectRatio: any = {};
    const lockStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'lock');
    const configCardStyle = this._buildStyleGeneric(this._stateObj, configState, 'card');
    const tooltipStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'tooltip');
    const classList: ClassInfo = {
      'button-card-main': true,
      disabled: !this._isClickable(this._stateObj, configState),
    };
    if (this._config?.tooltip) {
      this.classList.add('tooltip');
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
        break;
      }
      default:
        cardStyle = configCardStyle;
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
    lockStyle = { ...lockStyle, ...lockStyleFromConfig };

    const extraStyles = this._config!.extra_styles
      ? html`
          <style>
            ${this._getTemplateOrValue(this._stateObj, this._config!.extra_styles)}
          </style>
        `
      : html``;
    return html`
      ${extraStyles}
      <div id="aspect-ratio" style=${styleMap(aspectRatio)}>
        <ha-card
          id="card"
          class=${classMap(classList)}
          style=${styleMap(cardStyle)}
          @action=${this._handleAction}
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleActivate}"
          @mouseup="${this.handleRippleDeactivate}"
          @touchstart="${this.handleRippleActivate}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}"
          .actionHandler=${actionHandler({
            hasDoubleClick: this._config!.double_tap_action!.action !== 'none',
            hasHold: this._config!.hold_action!.action !== 'none',
            repeat: this._config!.hold_action!.repeat,
            repeatLimit: this._config!.hold_action!.repeat_limit,
          })}
          .config="${this._config}"
        >
          ${this._buttonContent(this._stateObj, configState, buttonColor)}
          <mwc-ripple id="ripple"></mwc-ripple>
        </ha-card>
        ${this._getLock(lockStyle)}
      </div>
      ${this._config?.tooltip
        ? html`
            <span class="tooltiptext" style=${styleMap(tooltipStyleFromConfig)}>
              ${this._getTemplateOrValue(this._stateObj, this._config.tooltip)}
            </span>
          `
        : ''}
    `;
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
          })}
          .config="${this._config}"
        >
          <ha-icon id="lock" icon="mdi:lock-outline"></ha-icon>
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
    const stateString = stateDisplay ? stateDisplay : this._buildStateString(state);
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
    const liveStream = this._buildLiveStream(entityPictureStyle);
    const shouldShowIcon = this._config!.show_icon && (icon || state);

    if (shouldShowIcon || entityPicture) {
      let domain: string | undefined = undefined;
      if (state) {
        domain = computeStateDomain(state);
      }
      return html`
        <div id="img-cell" style=${styleMap(imgCellStyleFromConfig)}>
          ${shouldShowIcon && !entityPicture && !liveStream
            ? html`
                <ha-state-icon
                  .state=${state}
                  ?data-domain=${domain}
                  data-state=${ifDefined(state?.state)}
                  style=${styleMap(haIconStyle)}
                  .icon="${icon}"
                  id="icon"
                  ?rotating=${this._rotate(configState)}
                ></ha-state-icon>
              `
            : ''}
          ${liveStream ? liveStream : ''}
          ${entityPicture && !liveStream
            ? html`
                <img
                  src="${entityPicture}"
                  style=${styleMap(entityPictureStyle)}
                  id="icon"
                  ?rotating=${this._rotate(configState)}
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
          cameraView="live"
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
        duration: 5,
        unlock: 'tap',
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
            if (!this._entities.includes(childEntity)) {
              this._entities.push(childEntity);
            }
          }
        }
      });
    }
  }

  private _expandTriggerGroups(): void {
    if (this._hass && this._config?.group_expand && this._entities) {
      this._entities.forEach((entity) => {
        if (this._hass?.states[entity]?.attributes?.entity_id) {
          this._loopGroup(this._hass?.states[entity].attributes?.entity_id);
        }
      });
    }
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  public getCardSize(): number {
    return this._config?.card_size || 3;
  }

  private _evalActions(config: ButtonCardConfig, action: string): ButtonCardConfig {
    const configDuplicate = copy(config);
    /* eslint no-param-reassign: 0 */
    const __evalObject = (configEval: any): any => {
      if (!configEval) {
        return configEval;
      }
      Object.keys(configEval).forEach((key) => {
        if (typeof configEval[key] === 'object') {
          configEval[key] = __evalObject(configEval[key]);
        } else {
          configEval[key] = this._getTemplateOrValue(this._stateObj, configEval[key]);
        }
      });
      return configEval;
    };
    if (configDuplicate[action]?.service_data?.entity_id === 'entity') {
      configDuplicate[action].service_data.entity_id = config.entity;
    }
    if (configDuplicate[action]?.data?.entity_id === 'entity') {
      configDuplicate[action].data.entity_id = config.entity;
    }
    configDuplicate[action] = __evalObject(configDuplicate[action]);
    if (!configDuplicate[action].confirmation && configDuplicate.confirmation) {
      configDuplicate[action].confirmation = __evalObject(configDuplicate.confirmation);
    }
    if (configDuplicate[action]?.entity) {
      configDuplicate.entity = configDuplicate[action].entity;
    }

    return configDuplicate;
  }

  private _rippleHandlers: RippleHandlers = new RippleHandlers(() => {
    // this._shouldRenderRipple = true;
    return this._ripple;
  });

  // backward compatibility
  @eventOptions({ passive: true })
  private handleRippleActivate(evt?: Event): void {
    this._ripple.then((r) => r && typeof r.startPress === 'function' && this._rippleHandlers.startPress(evt));
  }

  private handleRippleDeactivate(): void {
    this._ripple.then((r) => r && typeof r.endPress === 'function' && this._rippleHandlers.endPress());
  }

  private handleRippleFocus(): void {
    this._ripple.then((r) => r && typeof r.startFocus === 'function' && this._rippleHandlers.startFocus());
  }

  private handleRippleBlur(): void {
    this._ripple.then((r) => r && typeof r.endFocus === 'function' && this._rippleHandlers.endFocus());
  }

  private _handleAction(ev: any): void {
    if (ev.detail?.action) {
      switch (ev.detail.action) {
        case 'tap':
        case 'hold':
        case 'double_tap':
          const config = this._config;
          if (!config) return;
          const action = ev.detail.action;
          const localAction = this._evalActions(config, `${action}_action`);
          handleAction(this, this._hass!, localAction, action);
          break;
        default:
          break;
      }
    }
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
      const icon = document.createAttribute('icon');
      icon.value = 'mdi:lock-open-outline';
      lock.attributes.setNamedItem(icon);
      lock.classList.add('hidden');
    }
    window.setTimeout(() => {
      overlay.style.setProperty('pointer-events', '');
      if (lock) {
        lock.classList.remove('hidden');
        const icon = document.createAttribute('icon');
        icon.value = 'mdi:lock-outline';
        lock.attributes.setNamedItem(icon);
      }
    }, this._config!.lock!.duration! * 1000);
  }

  private _stopPropagation(ev: Event): void {
    ev.stopPropagation();
  }
}
