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
import {
  HassEntity,
} from 'home-assistant-js-websocket';
import domainIcon from './domain_icons';
import {
  ButtonCardConfig,
  HomeAssistant,
  StateConfig,
  CssStyleConfig,
} from './types';
import {
  computeDomain,
  computeEntity,
  getFontColorBasedOnBackgroundColor,
  buildNameStateConcat,
  applyBrightnessToColor,
  hasConfigOrEntityChanged,
} from './helpers';
import { handleClick } from './handle-click';
import { longPress } from './long-press';
import { styles } from './styles';

@customElement('button-card')
class ButtonCard extends LitElement {
  @property() public hass?: HomeAssistant;

  @property() private config?: ButtonCardConfig;

  static get styles(): CSSResult {
    return styles;
  }

  protected render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }
    return this._cardHtml();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    const state = this.config!.entity ? this.hass!.states[this.config!.entity] : undefined;
    const configState = this._getMatchingConfigState(state);
    const forceUpdate = (this.config!.show_label
      && (configState
        && configState.label_template
        || this.config!.label_template)
    )
      || this.config!.state
      && this.config!.state.find((elt) => { return elt.operator === 'template'; })
      ? true : false;
    return hasConfigOrEntityChanged(this, changedProps, forceUpdate);
  }

  private _getMatchingConfigState(state: HassEntity | undefined): StateConfig | undefined {
    if (!state || !this.config!.state) {
      return undefined;
    }
    let def: StateConfig | undefined;
    const retval = this.config!.state.find((elt) => {
      if (elt.operator) {
        switch (elt.operator) {
          case '==':
            /* eslint eqeqeq: 0 */
            return (state!.state == elt.value);
          case '<=':
            return (state!.state <= elt.value);
          case '<':
            return (state!.state < elt.value);
          case '>=':
            return (state!.state >= elt.value);
          case '>':
            return (state.state > elt.value);
          case '!=':
            return (state.state != elt.value);
          case 'regex': {
            /* eslint no-unneeded-ternary: 0 */
            const matches = state.state.match(elt.value) ? true : false;
            return matches;
          }
          case 'template': {
            return new Function('states', 'entity', 'user', 'hass',
              `'use strict'; ${elt.value}`)
              .call(this, this.hass!.states, state, this.hass!.user, this.hass);
          }
          case 'default':
            def = elt;
            return false;
          default:
            return false;
        }
      } else {
        return (elt.value == state.state);
      }
    });
    if (!retval && def) {
      return def;
    }
    return retval;
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
    if (colorValue == 'auto') {
      if (state) {
        if (state.attributes.rgb_color) {
          color = `rgb(${state.attributes.rgb_color.join(',')})`;
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
      } else {
        color = this.config!.default_color;
      }
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
    } else if (state && state.attributes) {
      icon = state.attributes.icon
        ? state.attributes.icon
        : domainIcon(computeDomain(state.entity_id), state.state);
    }
    return icon;
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
    } else {
      entityPicture = state && state.attributes && state.attributes.entity_picture
        ? state.attributes.entity_picture : undefined;
    }
    return entityPicture;
  }

  private _buildStyle(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): StyleInfo {
    let cardStyle: StyleInfo = {};
    let styleArray: CssStyleConfig[] | undefined;
    if (state) {
      if (configState && configState.style) {
        styleArray = configState.style;
      } else if (this.config!.style) {
        styleArray = this.config!.style;
      }
    } else if (this.config!.style) {
      styleArray = this.config!.style;
    }
    if (styleArray) {
      cardStyle = Object.assign(cardStyle, ...styleArray);
    }
    return cardStyle;
  }

  private _buildEntityPictureStyle(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): StyleInfo {
    let entityPictureStyle: StyleInfo = {};
    let styleArray: CssStyleConfig[] | undefined;
    if (state) {
      if (configState && configState.entity_picture_style) {
        styleArray = configState.entity_picture_style;
      } else if (this.config!.entity_picture_style) {
        styleArray = this.config!.entity_picture_style;
      }
    } else if (this.config!.entity_picture_style) {
      styleArray = this.config!.entity_picture_style;
    }
    if (styleArray) {
      entityPictureStyle = Object.assign(entityPictureStyle, ...styleArray);
    }
    return entityPictureStyle;
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
    return name;
  }

  private _buildStateString(state: HassEntity | undefined): string | undefined {
    let stateString: string | undefined;
    if (this.config!.show_state && state && state.state) {
      const units = this._buildUnits(state);
      if (units) {
        stateString = `${state.state} ${units}`;
      } else {
        stateString = state.state;
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

  private _buildLabel(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
  ): string | undefined {
    if (!this.config!.show_label) {
      return undefined;
    }
    let label: string | undefined;
    let matchingLabelTemplate: string | undefined;

    if (configState && configState.label_template) {
      matchingLabelTemplate = configState.label_template;
    } else {
      matchingLabelTemplate = this.config!.label_template;
    }
    if (!matchingLabelTemplate) {
      if (configState && configState.label) {
        label = configState.label;
      } else {
        label = this.config!.label;
      }
      return label;
    }

    /* eslint no-new-func: 0 */
    return new Function('states', 'entity', 'user', 'hass',
      `'use strict'; ${matchingLabelTemplate}`)
      .call(this, this.hass!.states, state, this.hass!.user, this.hass);
  }

  private _isClickable(state: HassEntity | undefined): boolean {
    let clickable = true;
    if (this.config!.tap_action!.action === 'toggle' && this.config!.hold_action!.action === 'none'
      || this.config!.hold_action!.action === 'toggle' && this.config!.tap_action!.action === 'none') {
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
    } else if (this.config!.tap_action!.action != 'none'
      || this.config!.hold_action!.action != 'none') {
      clickable = true;
    } else {
      clickable = false;
    }
    return clickable;
  }

  private _rotate(configState: StateConfig | undefined): Boolean {
    return configState && configState.spin ? true : false;
  }

  private _blankCardColoredHtml(state: HassEntity | undefined): TemplateResult {
    const color = this._buildCssColorAttribute(state, undefined);
    const fontColor = getFontColorBasedOnBackgroundColor(color);
    return html`
      <ha-card class="disabled">
        <div style="color: ${fontColor}; background-color: ${color};"></div>
      </ha-card>
      `;
  }

  private _cardHtml(): TemplateResult {
    const state = this.config!.entity ? this.hass!.states[this.config!.entity] : undefined;
    const configState = this._getMatchingConfigState(state);
    const color = this._buildCssColorAttribute(state, configState);
    let buttonColor = color;
    let cardStyle: StyleInfo = {};
    const configCardStyle = this._buildStyle(state, configState);

    switch (this.config!.color_type) {
      case 'blank-card':
        return this._blankCardColoredHtml(state);
      case 'card':
      case 'label-card': {
        const fontColor = getFontColorBasedOnBackgroundColor(color);
        cardStyle.color = fontColor;
        cardStyle['background-color'] = color;
        cardStyle = { ...cardStyle, ...configCardStyle };
        buttonColor = 'inherit';
        break;
      }
      default:
        cardStyle = configCardStyle;
        break;
    }
    if (configCardStyle.width) {
      this.style.setProperty('flex', '0 0 auto');
      this.style.setProperty('max-width', 'fit-content');
    }

    return html`
      <ha-card class="button-card-main ${this._isClickable(state) ? '' : 'disabled'}" style=${styleMap(cardStyle)} @ha-click="${this._handleTap}" @ha-hold="${this._handleHold}" .longpress="${longPress()}" .config="${this.config}">
        ${this._buttonContent(state, configState, buttonColor)}
      <mwc-ripple></mwc-ripple>
      </ha-card>
      `;
  }

  private _buttonContent(
    state: HassEntity | undefined,
    configState: StateConfig | undefined,
    color: string,
  ): TemplateResult {
    const name = this._buildName(state, configState);
    const stateString = this._buildStateString(state);
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
    const itemClass: string[] = ['container', containerClass];
    const label = this._buildLabel(state, configState);
    if (!iconTemplate) itemClass.push('no-icon');
    if (!name) itemClass.push('no-name');
    if (!stateString) itemClass.push('no-state');
    if (!label) itemClass.push('no-label');

    return html`
      <div class=${itemClass.join(' ')}>
        ${iconTemplate ? iconTemplate : ''}
        ${name ? html`<div class="name">${name}</div>` : ''}
        ${stateString ? html`<div class="state">${stateString}</div>` : ''}
        ${label ? html`<div class="label">${label}</div>` : ''}
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
    const entityPictureStyleFromConfig = this._buildEntityPictureStyle(state, configState);

    const haIconStyle = {
      color,
      width: this.config!.size,
      'min-width': this.config!.size,
    };
    const entityPictureStyle = {
      ...haIconStyle,
      ...entityPictureStyleFromConfig,
    };

    if (icon || entityPicture) {
      return html`
        <div class="img-cell">
          ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconStyle)}
            .icon="${icon}" class="icon" ?rotating=${this._rotate(configState)}></ha-icon>` : ''}
          ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureStyle)}
            class="icon" ?rotating=${this._rotate(configState)} />` : ''}
        </div>
      `;
    } else {
      return undefined;
    }
  }

  public setConfig(config: ButtonCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this.config = {
      tap_action: { action: 'toggle' },
      hold_action: { action: 'none' },
      layout: 'vertical',
      size: '40%',
      color_type: 'icon',
      show_name: true,
      show_state: false,
      show_icon: true,
      show_units: true,
      show_label: false,
      show_entity_picture: false,
      ...config,
    };
    this.config!.default_color = 'var(--primary-text-color)';
    if (this.config!.color_type !== 'icon') {
      this.config!.color_off = 'var(--paper-card-background-color)';
    } else {
      this.config!.color_off = 'var(--paper-item-icon-color)';
    }
    this.config!.color_on = 'var(--paper-item-icon-active-color)';
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  public getCardSize(): number {
    return 3;
  }

  private _handleTap(ev): void {
    /* eslint no-alert: 0 */
    if (this.config!.confirmation
      && !window.confirm(this.config!.confirmation)) {
      return;
    }
    const config = ev.target.config;
    handleClick(this, this.hass!, config, false);
  }

  private _handleHold(ev): void {
    /* eslint no-alert: 0 */
    if (this.config!.confirmation
      && !window.confirm(this.config!.confirmation)) {
      return;
    }
    const config = ev.target.config;
    handleClick(this, this.hass!, config, true);
  }
}
