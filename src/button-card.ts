import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
  CSSResult,
  PropertyValues,
} from 'lit-element';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { classMap, ClassInfo } from 'lit-html/directives/class-map';
import {
  HassEntity,
} from 'home-assistant-js-websocket';
import {
  stateIcon,
  HomeAssistant,
  handleClick,
  getLovelace,
  timerTimeRemaining,
  secondsToDuration,
  durationToSeconds,
  createThing,
} from 'custom-card-helpers';
import { BUTTON_CARD_VERSION } from './version-const';
import {
  ButtonCardConfig,
  StateConfig,
  ExemptionUserConfig,
  ExemptionUsernameConfig,
} from './types';
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
  getLovelaceCast,
} from './helpers';
import { styles } from './styles';
import myComputeStateDisplay from './compute_state_display';

/* eslint no-console: 0 */
console.info(
  `%c  BUTTON-CARD  \n%c Version ${BUTTON_CARD_VERSION} `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

@customElement('button-card')
class ButtonCard extends LitElement {
  @property() public hass?: HomeAssistant;

  @property() private config?: ButtonCardConfig;

  @property() private _timeRemaining?: number;

  @property() private _hasTemplate?: boolean;

  @property() private _stateObj: HassEntity | undefined;

  private _interval?: number;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearInterval();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (
      this.config
      && this.config.entity
      && computeDomain(this.config.entity) === 'timer'
    ) {
      const stateObj = this.hass!.states[this.config.entity];
      this._startInterval(stateObj);
    }
  }

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult | void {
    this._stateObj = this.config!.entity ? this.hass!.states[this.config!.entity] : undefined;
    if (!this.config || !this.hass) {
      return html``;
    }
    return this._cardHtml();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    const forceUpdate = this._hasTemplate
      || this.config!.state
      && this.config!.state.find(elt => elt.operator === 'template')
      || changedProps.has('_timeRemaining')
      ? true : false;
    return myHasConfigOrEntityChanged(this, changedProps, forceUpdate);
  }

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);

    if (
      this.config
      && this.config.entity
      && computeDomain(this.config.entity) === 'timer'
      && changedProps.has('hass')
    ) {
      const stateObj = this.hass!.states[this.config.entity];
      const oldHass = changedProps.get('hass') as this['hass'];
      const oldStateObj = oldHass
        ? oldHass.states[this.config.entity]
        : undefined;

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
      this._interval = window.setInterval(
        () => this._calculateRemaining(stateObj),
        1000,
      );
    }
  }

  private _calculateRemaining(stateObj: HassEntity): void {
    this._timeRemaining = timerTimeRemaining(stateObj);
  }

  private _computeTimeDisplay(stateObj: HassEntity): string | undefined {
    if (!stateObj) {
      return undefined;
    }

    return secondsToDuration(
      this._timeRemaining || durationToSeconds(stateObj.attributes.duration),
    );
  }

  private _getMatchingConfigState(state: HassEntity | undefined): StateConfig | undefined {
    if (!this.config!.state) {
      return undefined;
    }
    const hasTemplate = this.config!.state.find(
      elt => elt.operator === 'template',
    );
    if (!state && !hasTemplate) {
      return undefined;
    }
    let def: StateConfig | undefined;
    const retval = this.config!.state.find((elt) => {
      if (elt.operator) {
        switch (elt.operator) {
          case '==':
            /* eslint eqeqeq: 0 */
            return (state && state.state == this._getTemplateOrValue(state, elt.value));
          case '<=':
            return (state && state.state <= this._getTemplateOrValue(state, elt.value));
          case '<':
            return (state && state.state < this._getTemplateOrValue(state, elt.value));
          case '>=':
            return (state && state.state >= this._getTemplateOrValue(state, elt.value));
          case '>':
            return (state && state.state > this._getTemplateOrValue(state, elt.value));
          case '!=':
            return (state && state.state != this._getTemplateOrValue(state, elt.value));
          case 'regex': {
            /* eslint no-unneeded-ternary: 0 */
            const matches = state
              && state.state.match(this._getTemplateOrValue(state, elt.value)) ? true : false;
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
        return state && (this._getTemplateOrValue(state, elt.value) == state.state);
      }
    });
    if (!retval && def) {
      return def;
    }
    return retval;
  }

  private _evalTemplate(state: HassEntity | undefined, func: any): any {
    /* eslint no-new-func: 0 */
    return new Function('states', 'entity', 'user', 'hass', 'variables', 'html',
      `'use strict'; ${func}`)
      .call(this, this.hass!.states, state, this.hass!.user, this.hass,
        this.config!.variables, html);
  }

  private _objectEvalTemplate(
    state: HassEntity | undefined,
    obj: any | undefined,
  ) {
    const objClone = JSON.parse(JSON.stringify(obj));
    return this._getTemplateOrValue(state, objClone);
  }

  private _getTemplateOrValue(
    state: HassEntity | undefined,
    value: any | undefined,
  ): any | undefined {
    if (['number', 'boolean'].includes(typeof value)) return value;
    if (!value) return value;
    if (['object'].includes(typeof value)) {
      Object.keys(value).forEach((key) => {
        value[key] = this._getTemplateOrValue(state, value[key]);
      });
      return value;
    }
    const trimmed = value.trim();
    if (
      trimmed.substring(0, 3) === '[[['
      && trimmed.slice(-3) === ']]]'
    ) {
      return this._evalTemplate(state, trimmed.slice(3, -3));
    } else {
      return value;
    }
  }

  private _getDefaultColorForState(state: HassEntity): string {
    switch (state.state) {
      case 'on':
        return this.config!.color_on;
      case 'off':
        return this.config!.color_off;
      default:
        return this.config!.default_color;
    }
  }

  private _getColorForLightEntity(
    state: HassEntity | undefined,
    useTemperature: boolean,
  ): string {
    let color: string = this.config!.default_color;
    if (state) {
      if (state.attributes.rgb_color) {
        color = `rgb(${state.attributes.rgb_color.join(',')})`;
        if (state.attributes.brightness) {
          color = applyBrightnessToColor(color, (state.attributes.brightness + 245) / 5);
        }
      } else if (useTemperature
        && state.attributes.color_temp
        && state.attributes.min_mireds
        && state.attributes.max_mireds) {
        color = getLightColorBasedOnTemperature(
          state.attributes.color_temp,
          state.attributes.min_mireds,
          state.attributes.max_mireds,
        );
        if (state.attributes.brightness) {
          color = applyBrightnessToColor(color, (state.attributes.brightness + 245) / 5);
        }
      } else if (state.attributes.brightness) {
        color = applyBrightnessToColor(
          this._getDefaultColorForState(state), (state.attributes.brightness + 245) / 5,
        );
      } else {
        color = this._getDefaultColorForState(state);
      }
    }
    return color;
  }

  private _buildCssColorAttribute(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): string {
    let colorValue: string = '';
    let color: undefined | string;
    if (configState && configState.color) {
      colorValue = configState.color;
    } else if (this.config!.color !== 'auto' && state && state.state === 'off') {
      colorValue = this.config!.color_off;
    } else if (this.config!.color) {
      colorValue = this.config!.color;
    }
    if (colorValue == 'auto' || colorValue == 'auto-no-temperature') {
      color = this._getColorForLightEntity(state, colorValue !== 'auto-no-temperature');
    } else if (colorValue) {
      color = colorValue;
    } else if (state) {
      color = this._getDefaultColorForState(state);
    } else {
      color = this.config!.default_color;
    }
    return color;
  }

  private _buildIcon(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): string | undefined {
    if (!this.config!.show_icon) {
      return undefined;
    }
    let icon: undefined | string;
    if (configState && configState.icon) {
      icon = configState.icon;
    } else if (this.config!.icon) {
      icon = this.config!.icon;
    } else {
      if (!state)
        return undefined;
      icon = stateIcon(state);
    }
    return this._getTemplateOrValue(state, icon);
  }

  private _buildEntityPicture(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): string | undefined {
    if (!this.config!.show_entity_picture
      || !state && !configState && !this.config!.entity_picture) {
      return undefined;
    }
    let entityPicture: string | undefined;

    if (configState && configState.entity_picture) {
      entityPicture = configState.entity_picture;
    } else if (this.config!.entity_picture) {
      entityPicture = this.config!.entity_picture;
    } else if (state) {
      entityPicture = state.attributes && state.attributes.entity_picture
        ? state.attributes.entity_picture : undefined;
    }
    return this._getTemplateOrValue(state, entityPicture);
  }

  private _buildStyleGeneric(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    styleType: string,
  ): StyleInfo {
    let style: any = {};
    if (this.config!.styles && this.config!.styles[styleType]) {
      style = Object.assign(style, ...this.config!.styles[styleType]);
    }
    if (configState && configState.styles && configState.styles[styleType]) {
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
    if (this.config!.styles
      && this.config!.styles.custom_fields
      && this.config!.styles.custom_fields[styleType]
    ) {
      style = Object.assign(style, ...this.config!.styles.custom_fields[styleType]);
    }
    if (configState && configState.styles
      && configState.styles.custom_fields
      && configState.styles.custom_fields[styleType]
    ) {
      let configStateStyle: StyleInfo = {};
      configStateStyle = Object.assign(
        configStateStyle,
        ...configState.styles.custom_fields[styleType],
      );
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

  private _buildName(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): string | undefined {
    if (this.config!.show_name === false) {
      return undefined;
    }
    let name: string | undefined;

    if (configState && configState.name) {
      name = configState.name;
    } else if (this.config!.name) {
      name = this.config!.name;
    } else if (state) {
      name = state.attributes && state.attributes.friendly_name
        ? state.attributes.friendly_name : computeEntity(state.entity_id);
    }

    return this._getTemplateOrValue(state, name);
  }

  private _buildStateString(state: HassEntity | undefined): string | undefined {
    let stateString: string | undefined;
    if (this.config!.show_state && state && state.state) {
      const localizedState = myComputeStateDisplay(this.hass!.localize, state);
      const units = this._buildUnits(state);
      if (units) {
        stateString = `${state.state} ${units}`;
      } else if (computeDomain(state.entity_id) === 'timer') {
        if (state.state === 'idle' || this._timeRemaining === 0) {
          stateString = localizedState;
        } else {
          stateString = this._computeTimeDisplay(state);
          if (state.state === 'paused') {
            stateString += ` (${localizedState})`;
          }
        }
      } else {
        stateString = localizedState;
      }
    }
    return stateString;
  }

  private _buildUnits(state: HassEntity | undefined): string | undefined {
    let units: string | undefined;
    if (state) {
      if (this.config!.show_units) {
        if (state.attributes && state.attributes.unit_of_measurement && !this.config!.units) {
          units = state.attributes.unit_of_measurement;
        } else {
          units = this.config!.units ? this.config!.units : undefined;
        }
      }
    }
    return units;
  }

  private _buildLastChanged(
    state: HassEntity | undefined,
    style: StyleInfo,
  ): TemplateResult | undefined {
    return this.config!.show_last_changed && state
      ? html`
        <ha-relative-time
          id="label"
          class="ellipsis"
          .hass="${this.hass}"
          .datetime="${state.last_changed}"
          style=${styleMap(style)}
        ></ha-relative-time>` : undefined;
  }

  private _buildLabel(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
  ): string | undefined {
    if (!this.config!.show_label) {
      return undefined;
    }
    let label: string | undefined;

    if (configState && configState.label) {
      label = configState.label;
    } else {
      label = this.config!.label;
    }

    return this._getTemplateOrValue(state, label);
  }

  private _buildCustomFields(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
  ): TemplateResult {
    let result = html``;
    const fields: any = {};
    const cards: any = {};
    if (this.config!.custom_fields) {
      Object.keys(this.config!.custom_fields).forEach((key) => {
        const value = this.config!.custom_fields![key];
        if (!value.card) {
          fields[key] = this._getTemplateOrValue(state, value);
        } else {
          cards[key] = this._objectEvalTemplate(state, value.card);
        }
      });
    }
    if (configState && configState.custom_fields) {
      Object.keys(configState.custom_fields).forEach((key) => {
        const value = configState!.custom_fields![key];
        if (!value!.card) {
          fields[key] = this._getTemplateOrValue(state, value);
        } else {
          cards[key] = this._objectEvalTemplate(state, value.card);
        }
      });
    }
    Object.keys(fields).forEach((key) => {
      if (fields[key] != undefined) {
        const customStyle: StyleInfo = {
          ...this._buildCustomStyleGeneric(state, configState, key),
          'grid-area': key,
        };
        result = html`${result}
        <div id=${key}
          class="ellipsis"
          style=${styleMap(customStyle)}
        >
          ${fields[key] && (fields[key] as any).type === 'html' ? fields[key] : unsafeHTML(fields[key])}
        </div>`;
      }
    });
    Object.keys(cards).forEach((key) => {
      if (cards[key] != undefined) {
        const customStyle: StyleInfo = {
          ...this._buildCustomStyleGeneric(state, configState, key),
          'grid-area': key,
        };
        const thing = createThing(cards[key]);
        thing.hass = this.hass;
        result = html`${result}
        <div id=${key}
          class="ellipsis"
          @click=${this._stopPropagation}
          @touchstart=${this._stopPropagation}
          style=${styleMap(customStyle)}
        >
          ${thing}
        </div>`;
      }
    });
    return result;
  }

  private _isClickable(state: HassEntity | undefined): boolean {
    let clickable = true;
    if (
      this.config!.tap_action!.action === 'toggle'
      && this.config!.hold_action!.action === 'none'
      && this.config!.double_tap_action!.action === 'none'

      || this.config!.hold_action!.action === 'toggle'
      && this.config!.tap_action!.action === 'none'
      && this.config!.double_tap_action!.action === 'none'

      || this.config!.double_tap_action!.action === 'toggle'
      && this.config!.tap_action!.action === 'none'
      && this.config!.hold_action!.action === 'none'
    ) {
      if (state) {
        switch (computeDomain(state.entity_id)) {
          case 'sensor':
          case 'binary_sensor':
          case 'device_tracker':
            clickable = false;
            break;
          default:
            clickable = true;
            break;
        }
      } else {
        clickable = false;
      }
    } else if (
      this.config!.tap_action!.action != 'none'
      || this.config!.hold_action!.action != 'none'
      || this.config!.double_tap_action!.action != 'none'
    ) {
      clickable = true;
    } else {
      clickable = false;
    }
    return clickable;
  }

  private _rotate(configState: StateConfig | undefined): boolean {
    return configState && configState.spin ? true : false;
  }

  private _blankCardColoredHtml(
    cardStyle: StyleInfo,
  ): TemplateResult {
    const blankCardStyle = {
      background: 'none',
      'box-shadow': 'none',
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
    const color = this._buildCssColorAttribute(this._stateObj, configState);
    let buttonColor = color;
    let cardStyle: any = {};
    let lockStyle: any = {};
    const aspectRatio: any = {};
    const lockStyleFromConfig = this._buildStyleGeneric(this._stateObj, configState, 'lock');
    const configCardStyle = this._buildStyleGeneric(this._stateObj, configState, 'card');
    const classList: ClassInfo = {
      'button-card-main': true,
      disabled: !this._isClickable(this._stateObj),
    };
    if (configCardStyle.width) {
      this.style.setProperty('flex', '0 0 auto');
      this.style.setProperty('max-width', 'fit-content');
    }
    switch (this.config!.color_type) {
      case 'blank-card':
        return this._blankCardColoredHtml(configCardStyle);
      case 'card':
      case 'label-card': {
        const fontColor = getFontColorBasedOnBackgroundColor(color);
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
    if (this.config!.aspect_ratio) {
      aspectRatio['--aspect-ratio'] = this.config!.aspect_ratio;
      cardStyle.position = 'absolute';
    } else {
      aspectRatio.display = 'inline';
    }
    this.style.setProperty('--button-card-light-color', this._getColorForLightEntity(this._stateObj, true));
    this.style.setProperty('--button-card-light-color-no-temperature', this._getColorForLightEntity(this._stateObj, false));
    lockStyle = { ...lockStyle, ...lockStyleFromConfig };

    return html`
      <div style="position: relative;">
        <div id="aspect-ratio" style=${styleMap(aspectRatio)}>
          <ha-card
            id="card"
            class=${classMap(classList)}
            style=${styleMap(cardStyle)}
            @action=${this._handleAction}
            .actionHandler=${actionHandler({
      hasDoubleClick: this.config!.double_tap_action!.action !== 'none',
      hasHold: this.config!.hold_action!.action !== 'none',
      repeat: this.config!.hold_action!.repeat,
    })}
            .config="${this.config}"
          >
            ${this._buttonContent(this._stateObj, configState, buttonColor)}
          </ha-card>
        </div>
        ${this._getLock(lockStyle)}
      </div>
      `;
  }

  private _getLock(lockStyle: StyleInfo): TemplateResult {
    if (this.config!.lock
      && this._getTemplateOrValue(this._stateObj, this.config!.lock.enabled)) {
      return html`
        <div id="overlay" style=${styleMap(lockStyle)}
          @action=${this._handleUnlockType}
          .actionHandler=${actionHandler({
        hasDoubleClick: this.config!.lock!.unlock === 'double_tap',
        hasHold: this.config!.lock!.unlock === 'hold',
      })}
          .config="${this.config}"
        >
          <ha-icon id="lock" icon="mdi:lock-outline"></ha-icon>
        </div>
      `;
    }
    return html`<mwc-ripple id="ripple"></mwc-ripple>`;
  }

  private _buttonContent(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    color: string,
  ): TemplateResult {
    const name = this._buildName(state, configState);
    const stateDisplay = this.config!.show_state && this.config!.state_display
      ? this._getTemplateOrValue(state, this.config!.state_display)
      : undefined;
    const stateString = stateDisplay ? stateDisplay : this._buildStateString(state);
    const nameStateString = buildNameStateConcat(name, stateString);

    switch (this.config!.layout) {
      case 'icon_name_state':
      case 'name_state':
        return this._gridHtml(state, configState, this.config!.layout, color,
          nameStateString, undefined);
      default:
        return this._gridHtml(state, configState, this.config!.layout, color,
          name, stateString);
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
        ${name ? html`<div id="name" class="ellipsis" style=${styleMap(nameStyleFromConfig)}>${(name as any).type === 'html' ? name : unsafeHTML(name)}</div>` : ''}
        ${stateString ? html`<div id="state" class="ellipsis" style=${styleMap(stateStyleFromConfig)}>${(stateString as any).type === 'html' ? stateString : unsafeHTML(stateString)}</div>` : ''}
        ${label && !lastChangedTemplate ? html`<div id="label" class="ellipsis" style=${styleMap(labelStyleFromConfig)}>${(label as any).type === 'html' ? label : unsafeHTML(label)}</div>` : ''}
        ${lastChangedTemplate ? lastChangedTemplate : ''}
        ${this._buildCustomFields(state, configState)}
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
      width: this.config!.size,
      position: !this.config!.aspect_ratio && !haCardStyleFromConfig.height ? 'relative' : 'absolute',
      ...haIconStyleFromConfig,
    };
    const entityPictureStyle: StyleInfo = {
      ...haIconStyle,
      ...entityPictureStyleFromConfig,
    };
    const liveStream = this._buildLiveStream(entityPictureStyle);

    if (icon || entityPicture) {
      return html`
        <div id="img-cell" style=${styleMap(imgCellStyleFromConfig)}>
          ${icon && !entityPicture && !liveStream ? html`<ha-icon style=${styleMap(haIconStyle)}
            .icon="${icon}" id="icon" ?rotating=${this._rotate(configState)}></ha-icon>` : ''}
          ${liveStream ? liveStream : ''}
          ${entityPicture && !liveStream ? html`<img src="${entityPicture}" style=${styleMap(entityPictureStyle)}
            id="icon" ?rotating=${this._rotate(configState)} />` : ''}
        </div>
      `;
    } else {
      return undefined;
    }
  }

  private _buildLiveStream(style: StyleInfo): TemplateResult | undefined {
    if (this.config!.show_live_stream && this.config!.entity && computeDomain(this.config!.entity) === 'camera') {
      return html`
        <hui-image
          .hass=${this.hass}
          .cameraImage=${this.config!.entity}
          .entity=${this.config!.entity}
          cameraView='live'
          style=${styleMap(style)}
        ></hui-image>
      `;
    } else {
      return undefined;
    }
  }

  public setConfig(config: ButtonCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    const ll = getLovelace() || getLovelaceCast();
    let template: ButtonCardConfig = { ...config };
    let tplName: string | undefined = template.template;
    let mergedStateConfig: StateConfig[] | undefined = config.state;
    while (tplName && ll.config.button_card_templates && ll.config.button_card_templates[tplName]) {
      template = mergeDeep(ll.config.button_card_templates[tplName], template);
      mergedStateConfig = mergeStatesById(
        (ll.config.button_card_templates[tplName] as ButtonCardConfig).state,
        mergedStateConfig,
      );
      tplName = (ll.config.button_card_templates[tplName] as ButtonCardConfig).template;
    }
    template.state = mergedStateConfig;
    this.config = {
      tap_action: { action: 'toggle' },
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
      ...template,
    };
    this.config.lock = {
      enabled: false,
      duration: 5,
      unlock: 'tap',
      ...this.config.lock,
    };
    this.config!.default_color = 'var(--primary-text-color)';
    if (this.config!.color_type !== 'icon') {
      this.config!.color_off = 'var(--paper-card-background-color)';
    } else {
      this.config!.color_off = 'var(--paper-item-icon-color)';
    }
    this.config!.color_on = 'var(--paper-item-icon-active-color)';

    const jsonConfig = JSON.stringify(this.config);
    const rxp = new RegExp('\\[\\[\\[.*\\]\\]\\]', 'gm');
    this._hasTemplate = jsonConfig.match(rxp) ? true : false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  public getCardSize(): number {
    return 3;
  }

  private _evalActions(config: ButtonCardConfig, action: string): ButtonCardConfig {
    const state = this.config!.entity ? this.hass!.states[this.config!.entity] : undefined;
    const configDuplicate = JSON.parse(JSON.stringify(config));
    /* eslint no-param-reassign: 0 */
    const __evalObject = (configEval: any): any => {
      if (!configEval) {
        return configEval;
      }
      Object.keys(configEval).forEach((key) => {
        if (typeof configEval[key] === 'object') {
          configEval[key] = __evalObject(configEval[key]);
        } else {
          configEval[key] = this._getTemplateOrValue(state, configEval[key]);
        }
      });
      return configEval;
    };
    configDuplicate[action] = __evalObject(configDuplicate[action]);
    if (!configDuplicate[action].confirmation && configDuplicate.confirmation) {
      configDuplicate[action].confirmation = __evalObject(configDuplicate.confirmation);
    }
    return configDuplicate;
  }

  private _handleAction(ev: any) {
    if (ev.detail && ev.detail.action) {
      switch (ev.detail.action) {
        case 'tap':
          this._handleTap(ev);
          break;
        case 'hold':
          this._handleHold(ev);
          break;
        case 'double_tap':
          this._handleDblTap(ev);
          break;
        default:
          break;
      }
    }
  }

  private _handleTap(ev): void {
    const config = ev.target.config;
    if (!config) return;
    handleClick(this, this.hass!, this._evalActions(config, 'tap_action'), false, false);
  }

  private _handleHold(ev): void {
    const config = ev.target.config;
    if (!config) return;
    handleClick(this, this.hass!, this._evalActions(config, 'hold_action'), true, false);
  }

  private _handleDblTap(ev): void {
    const config = ev.target.config;
    if (!config) return;
    handleClick(this, this.hass!, this._evalActions(config, 'double_tap_action'), false, true);
  }

  private _handleUnlockType(ev) {
    const config = ev.target.config as ButtonCardConfig;
    if (!config) return;
    if (config.lock.unlock === ev.detail.action) {
      this._handleLock();
    }
  }

  private _handleLock(): void {
    const lock = this.shadowRoot!.getElementById('lock') as LitElement;
    if (!lock) return;
    if (this.config!.lock!.exemptions) {
      if (!this.hass!.user.name || !this.hass!.user.id) return;
      let matched = false;
      this.config!.lock!.exemptions.forEach((e) => {
        if (!matched && (e as ExemptionUserConfig).user === this.hass!.user.id
          || (e as ExemptionUsernameConfig).username === this.hass!.user.name) {
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
    const haCard = this.shadowRoot!.getElementById('card') as LitElement;
    overlay.style.setProperty('pointer-events', 'none');
    const paperRipple = document.createElement('paper-ripple');

    if (lock) {
      haCard.appendChild(paperRipple);
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
        haCard.removeChild(paperRipple);
      }
    }, this.config!.lock!.duration! * 1000);
  }

  private _stopPropagation(ev) {
    ev.stopPropagation();
  }
}
