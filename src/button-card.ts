import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
  css,
  CSSResult,
  PropertyValues,
} from 'lit-element';
import { styleMap, StyleInfo } from 'lit-html/directives/style-map';
import {
  HassEntity,
} from 'home-assistant-js-websocket';
import { TinyColor } from '@ctrl/tinycolor';
import domainIcon from './domain_icons';
import {
  ButtonCardConfig,
  HomeAssistant,
  StateConfig,
  CssStyleConfig,
} from './types';
import * as helpers from './helpers';
import { handleClick } from './handle-click';
import { longPress } from './long-press';
import { hasConfigOrEntityChanged } from './has-changed';

@customElement('button-card')
class ButtonCard extends LitElement {
  @property() public hass?: HomeAssistant;

  @property() private config?: ButtonCardConfig;

  static get styles(): CSSResult {
    return css`
        ha-card {
          cursor: pointer;
          overflow: hidden;
          box-sizing: border-box;
        }
        ha-card.disabled {
          pointer-events: none;
          cursor: default;
        }
        ha-icon {
          display: inline-block;
          margin: auto;
        }
        ha-card.button-card-main {
          padding: 4% 0px;
          text-transform: none;
          font-weight: 400;
          font-size: 1.2rem;
          align-items: center;
          text-align: center;
          letter-spacing: normal;
          width: 100%;
        }
        div.divTable{
          display: table;
          overflow: auto;
          table-layout: fixed;
          width: 100%;
        }
        div.divTableBody {
          display: table-row-group;
        }
        div.divTableRow {
          display: table-row;
        }
        .divTableCell {
          display: table-cell;
          vertical-align: middle;
        }
        div {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          min-width: 100%;
        }
        @keyframes blink{
          0%{opacity:0;}
          50%{opacity:1;}
          100%{opacity:0;}
        }
        @-webkit-keyframes rotating /* Safari and Chrome */ {
          from {
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          to {
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes rotating {
          from {
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          to {
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        .rotating {
          -webkit-animation: rotating 2s linear infinite;
          -moz-animation: rotating 2s linear infinite;
          -ms-animation: rotating 2s linear infinite;
          -o-animation: rotating 2s linear infinite;
          animation: rotating 2s linear infinite;
        }
      `;
  }

  protected render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }
    const state = this.config.entity ? this.hass.states[this.config.entity] : undefined;
    const configState = this.testConfigState(state);
    switch (this.config.color_type) {
      case 'blank-card':
        return this.blankCardColoredHtml(state);
      case 'label-card':
      case 'card':
        return this.cardColoredHtml(state, configState);
      case 'icon':
      default:
        return this.iconColoredHtml(state, configState);
    }
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    return hasConfigOrEntityChanged(this, changedProps);
  }

  private getFontColorBasedOnBackgroundColor(backgroundColor: string): string {
    let localColor = backgroundColor;
    if (backgroundColor.substring(0, 3) === 'var') {
      localColor = window.getComputedStyle(document.documentElement)
        .getPropertyValue(backgroundColor.substring(4).slice(0, -1)).trim();
    }
    const colorObj = new TinyColor(localColor);
    let fontColor = ''; // don't override by default
    if (colorObj.isValid && colorObj.getLuminance() > 0.5) {
      fontColor = 'rgb(62, 62, 62)'; // bright colors - black font
    } else {
      fontColor = 'rgb(234, 234, 234)';// dark colors - white font
    }
    return fontColor;
  }

  private testConfigState(state: HassEntity | undefined): StateConfig | undefined {
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

  private getDefaultColorForState(state: HassEntity): string {
    switch (state.state) {
      case 'on':
        return this.config!.color_on;
      case 'off':
        return this.config!.color_off;
      default:
        return this.config!.default_color;
    }
  }

  private buildCssColorAttribute(
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
        } else {
          color = this.getDefaultColorForState(state);
        }
      } else {
        color = this.config!.default_color;
      }
    } else if (colorValue) {
      color = colorValue;
    } else if (state) {
      color = this.getDefaultColorForState(state);
    } else {
      color = this.config!.default_color;
    }
    return color;
  }

  private buildIcon(
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
        : domainIcon(helpers.computeDomain(state.entity_id), state.state);
    }
    return icon;
  }

  private buildEntityPicture(
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

  private buildStyle(
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

  private buildEntityPictureStyle(
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

  private buildName(
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
        ? state.attributes.friendly_name : helpers.computeEntity(state.entity_id);
    }
    return name;
  }

  private buildStateString(state: HassEntity | undefined): string | undefined {
    let stateString: string | undefined;
    if (this.config!.show_state && state && state.state) {
      const units = this.buildUnits(state);
      if (units) {
        stateString = `${state.state} ${units}`;
      } else {
        stateString = state.state;
      }
    }
    return stateString;
  }

  private buildUnits(state: HassEntity | undefined): string | undefined {
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

  private buildNameStateConcat(
    name: string | undefined, stateString: string | undefined,
  ): string | undefined {
    if (!name && !stateString) {
      return undefined;
    }
    let nameStateString: string | undefined;
    if (stateString) {
      if (name) {
        nameStateString = `${name}: ${stateString}`;
      } else {
        nameStateString = stateString;
      }
    } else {
      nameStateString = name;
    }
    return nameStateString;
  }

  private isClickable(state: HassEntity | undefined): boolean {
    let clickable = true;
    if (this.config!.tap_action!.action === 'toggle' && this.config!.hold_action!.action === 'none'
      || this.config!.hold_action!.action === 'toggle' && this.config!.tap_action!.action === 'none') {
      if (state) {
        switch (helpers.computeDomain(state.entity_id)) {
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

  private rotate(configState: StateConfig | undefined): string {
    return configState && configState.spin ? 'rotating' : '';
  }

  private buttonContent(
    state: HassEntity | undefined, configState: StateConfig | undefined, color: string,
  ): TemplateResult {
    const icon = this.buildIcon(state, configState);
    const name = this.buildName(state, configState);
    const stateString = this.buildStateString(state);
    const nameStateString = this.buildNameStateConcat(name, stateString);
    const entityPicture = this.buildEntityPicture(state, configState);
    const entityPictureStyle = this.buildEntityPictureStyle(state, configState);

    const divTableCellStyles = { width: this.config!.size, height: 'auto' };
    const haIconInlineStyle = {
      color,
      width: this.config!.size,
      height: 'auto',
    };
    const haIconTableStyle = {
      ...haIconInlineStyle,
      width: 'auto',
      'max-width': this.config!.size,
    };

    const entityPictureInlineStyle = {
      ...haIconInlineStyle,
      ...entityPictureStyle,
    };
    const entityPictureTableStyle = {
      ...haIconTableStyle,
      ...entityPictureStyle,
    };

    switch (this.config!.layout) {
      case 'icon_name_state':
        return html`
          <div class='divTable'>
            <div class='divTableBody'>
              <div class='divTableRow'>
                <div class='divTableCell' style=${styleMap(divTableCellStyles)}>
                  ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconTableStyle)}
                    icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                  ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureTableStyle)}
                    class="${this.rotate(configState)}" />` : ''}
                </div>
                ${nameStateString ? html`<div class="divTableCell">${nameStateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
      case 'icon_name':
        return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style=${styleMap(divTableCellStyles)}>
                  ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconTableStyle)}
                    icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                  ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureTableStyle)}
                    class="${this.rotate(configState)}" />` : ''}
                </div>
                ${name ? html`<div class="divTableCell">${name}</div>` : ''}
              </div>
            </div>
          </div>
          ${stateString !== undefined ? html`<div>${stateString}</div>` : ''}
          `;
      case 'icon_state':
        return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style=${styleMap(divTableCellStyles)}>
                  ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconTableStyle)}
                    icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                  ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureTableStyle)}
                    class="${this.rotate(configState)}" />` : ''}
                </div>
                ${stateString !== undefined ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          ${name ? html`<div>${name}</div>` : ''}
          `;
      case 'icon_state_name2nd':
        return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style=${styleMap(divTableCellStyles)}>
                  ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconTableStyle)}
                    icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                  ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureTableStyle)}
                    class="${this.rotate(configState)}" />` : ''}
                </div>
                ${stateString !== undefined && name ? html`<div class="divTableCell">${stateString}<br />${name}</div>` : ''}
                ${!stateString && name ? html`<div class="divTableCell">${name}</div>` : ''}
                ${stateString && !name ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
      case 'icon_name_state2nd':
        return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style=${styleMap(divTableCellStyles)}>
                  ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconTableStyle)}
                    icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                  ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureTableStyle)}
                    class="${this.rotate(configState)}" />` : ''}
                </div>
                ${stateString !== undefined && name ? html`<div class="divTableCell">${name}<br />${stateString}</div>` : ''}
                ${!stateString && name ? html`<div class="divTableCell">${name}</div>` : ''}
                ${stateString && !name ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
      case 'name_state':
        return html`
          ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconInlineStyle)}
            icon=${icon} class="${this.rotate(configState)}"></ha-icon>` : ''}
          ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureInlineStyle)}
            class="${this.rotate(configState)}" />` : ''}
          ${nameStateString ? html`<div>${nameStateString}</div>` : ''}
          `;
      case 'vertical':
      default:
        return html`
          ${icon && !entityPicture ? html`<ha-icon style=${styleMap(haIconInlineStyle)}
            icon=${icon} class="${this.rotate(configState)}"></ha-icon>` : ''}
          ${entityPicture ? html`<img src="${entityPicture}" style=${styleMap(entityPictureInlineStyle)}
            class="${this.rotate(configState)}" />` : ''}
          ${name ? html`<div>${name}</div>` : ''}
          ${stateString ? html`<div>${stateString}</div>` : ''}
          `;
    }
  }

  private blankCardColoredHtml(state: HassEntity | undefined): TemplateResult {
    const color = this.buildCssColorAttribute(state, undefined);
    const fontColor = this.getFontColorBasedOnBackgroundColor(color);
    return html`
      <ha-card class="disabled">
        <div style="color: ${fontColor}; background-color: ${color};"></div>
      </ha-card>
      `;
  }

  private cardColoredHtml(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): TemplateResult {
    const color = this.buildCssColorAttribute(state, configState);
    const fontColor = this.getFontColorBasedOnBackgroundColor(color);
    const style = {
      color: fontColor,
      'background-color': color,
      ...this.buildStyle(state, configState),
    };
    return html`
      <ha-card class="button-card-main ${this.isClickable(state) ? '' : 'disabled'}" style=${styleMap(style)} @ha-click="${this._handleTap}" @ha-hold="${this._handleHold}" .longpress="${longPress()}" .config="${this.config}">
        ${this.buttonContent(state, configState, 'inherit')}
      <mwc-ripple></mwc-ripple>
      </ha-card>
      `;
  }

  private iconColoredHtml(
    state: HassEntity | undefined, configState: StateConfig | undefined,
  ): TemplateResult {
    const color = this.buildCssColorAttribute(state, configState);
    const style = this.buildStyle(state, configState);
    return html`
      <ha-card class="button-card-main ${this.isClickable(state) ? '' : 'disabled'}" style=${styleMap(style)} @ha-click="${this._handleTap}" @ha-hold="${this._handleHold}" .longpress="${longPress()}" .config="${this.config}">
          ${this.buttonContent(state, configState, color)}
      <mwc-ripple></mwc-ripple>
      </ha-card>
      `;
  }

  public setConfig(config: ButtonCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this.config = {
      tap_action: { action: 'toggle' },
      hold_action: { action: 'none' },
      size: '40%',
      color_type: 'icon',
      show_name: true,
      show_state: false,
      show_icon: true,
      show_units: true,
      show_entity_picture: false,
      ...config,
    };
    this.config!.default_color = 'var(--primary-text-color)';
    this.config!.color_off = 'var(--paper-item-icon-color)';
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
