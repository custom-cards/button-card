import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult,
} from 'lit-element';
import '@polymer/paper-button';

interface ServiceConfig {
  domain: string;
  action: string;
  data?: object;
}

interface StateConfig {
  value?: string;
  color?: string;
  icon?: string;
  default_color?: string;
}

interface ButtonCardConfig {
  type: string;
  entity: string;
  icon?: string;
  color_type?: 'icon' | 'card' | 'blank-card' | 'label-card';
  color?: string;
  color_off?: string;
  size?: string;
  action?: 'toggle' | 'more_info' | 'service';
  service?: ServiceConfig;
  name?: string;
  show_state?: boolean;
  style?: [];
  card_style?: string;
  state?: StateConfig[];
  default_color?: string;
}

@customElement('button-card')
class ButtonCard extends LitElement {
  @property() public hass?: any;

  @property() private _config?: ButtonCardConfig;

  protected render(): TemplateResult | void {
    if (!this._config || !this.hass) {
      return html``;
    }

    const state = this.hass.states[this._config.entity];
    switch (this._config.color_type) {
      case 'blank-card':
        return this.blankCardColoredHtml(state);
      case 'label-card':
        return this.labelCardColoredHtml(state);
      case 'card':
        return this.cardColoredHtml(state);
      case 'icon':
      default:
        return this.iconColoredHtml(state);
    }
  }

  private getFontColorBasedOnBackgroundColor(backgroundColor): string {
    const parsedRgbColor = backgroundColor.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
    );
    const parsedBackgroundColor = parsedRgbColor || this.hexToRgb(backgroundColor.substring(1));
    let fontColor = ''; // don't override by default
    if (parsedBackgroundColor) {
      // Counting the perceptive luminance - human eye favors green color...
      const luminance = (0.299 * parsedBackgroundColor[1] +
        0.587 * parsedBackgroundColor[2] +
        0.114 * parsedBackgroundColor[3]) /
        255;
      if (luminance > 0.5) {
        fontColor = 'rgb(62, 62, 62)'; // bright colors - black font
      } else {
        fontColor = 'rgb(234, 234, 234)'; // dark colors - white font
      }
    }
    return fontColor;
  }

  private hexToRgb(hex: string): (number | undefined)[] {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [, r, g, b];
  }

  private buildCssColorAttribute(state: any): string | undefined {
    let { color } = this._config!;

    if (state) {
      const configState = this._config!.state
        ? this._config!.state.find(config => {
          return config.value === state.state;
        })
        : false;
      if (configState) {
        color = configState.color ? configState.color : this._config!.color_off;
        if (configState.color === 'auto') {
          color = state.attributes.rgb_color
            ? `rgb(${state.attributes.rgb_color.join(',')})`
            : configState.default_color;
        }
      } else {
        if (this._config!.color === 'auto') {
          color = state.attributes.rgb_color
            ? `rgb(${state.attributes.rgb_color.join(',')})`
            : this._config!.default_color;
        }
        color = state.state === 'on' ? color : this._config!.color_off;
      }
    }
    return color;
  }

  private buildIcon(state: any): string | undefined {
    const iconOff = this._config!.icon;
    if (this._config!.icon === 'attribute') {
      if (state) {
        return state.attributes.icon;
      }
      return iconOff;
    }
    const configState = this._config!.state
      ? this._config!.state.find(config => {
        return config.value === state.state;
      })
      : false;
    if (configState && configState.icon) {
      return configState.icon;
    }
    return iconOff;
  }

  private blankCardColoredHtml(state: any): TemplateResult {
    return html`
      <ha-card style='color: xxxxxxxxxxxx; background-color: xxxxxxxx;' @click='${this._toggle(state)}'>
      </ha-card>
    `;
  }

  private labelCardColoredHtml(state: any): TemplateResult {
    const color = this.buildCssColorAttribute(state);
    const fontColor = this.getFontColorBasedOnBackgroundColor(color);
    return html`
      <style>
        ha-icon {
          display: flex;
          margin: auto;
        }
        paper-button {
          display: flex;
          margin: auto;
          text-align: center;
        }
      </style>
      <ha-card style='color: ${fontColor};'>
        <paper-button
          noink
          style='background-color: ${color}; ${this._config!.card_style}'
        >
          <div>
            ${this._config!.icon
        ? html`
                  <ha-icon
                    style='width: ${this._config!.size};
                           height: ${this._config!.size}'
                    .icon='${this._config!.icon}'
                  ></ha-icon>
                `
        : ''}
            ${this._config!.name
        ? html`
                  <span>${this._config!.name}</span>
                `
        : ''}
          </div>
        </paper-button>
      </ha-card>
    `;
  }

  private cardColoredHtml(state: any): TemplateResult {
    const color = this.buildCssColorAttribute(state);
    const fontColor = this.getFontColorBasedOnBackgroundColor(color);
    return html`
      <style>
        ha-icon {
          display: flex;
          margin: auto;
        }
        paper-button {
          display: flex;
          margin: auto;
          text-align: center;
        }
      </style>
      <ha-card style='color: ${fontColor};' @click='${this._toggle(state)}'>
        <paper-button
          style='background-color: ${color}; ${this._config!.card_style}'
        >
          <div>
            ${this._config!.icon
        ? html`
                  <ha-icon
                    style='width: ${this._config!.size}; height: ${this._config!
            .size};'
                    .icon='${this._config!.icon}'
                  ></ha-icon>
                `
        : ''}
            ${this._config!.name
        ? html`
                  <span>${this._config!.name}</span>
                `
        : ''}
            ${this._config!.show_state
        ? html`
                  <span
                    >${state.state}
                    ${state.attributes.unit_of_measurement
            ? state.attributes.unit_of_measurement
            : ''}</span
                  >
                `
        : ''}
          </div>
        </paper-button>
      </ha-card>
    `;
  }

  private iconColoredHtml(state: any): TemplateResult {
    const color = this.buildCssColorAttribute(state);
    const icon = this.buildIcon(state);
    return html`
      <style>
        ha-icon {
          display: flex;
          margin: auto;
        }
        paper-button {
          display: flex;
          margin: auto;
          text-align: center;
        }
      </style>
      <ha-card @click='${this._toggle(state)}'>
        <paper-button style='${this._config!.card_style}'>
          <div>
            ${this._config!.icon
        ? html`
                  <ha-icon
                    style='color: ${color}; width: ${this._config!
            .size}; height: ${this._config!.size};'
                    .icon='${icon}'
                  ></ha-icon>
                `
        : ''}
            ${this._config!.name
        ? html`
                  <div>${this._config!.name}</div>
                `
        : ''}
            ${this._config!.show_state
        ? html`
                  <div>
                    ${state.state}
                    ${state.attributes.unit_of_measurement
            ? state.attributes.unit_of_measurement
            : ''}
                  </div>
                `
        : ''}
          </div>
        </paper-button>
      </ha-card>
    `;
  }

  public setConfig(config: ButtonCardConfig) {
    // if (!_config.entity) {
    //   throw new Error('You need to define entity');
    // }
    this._config = { ...config };
    this._config.color = config.color
      ? config.color
      : 'var(--primary-text-color)';
    this._config.size = config.size ? config.size : '40%';
    let cardStyle = '';
    if (config.style) {
      config.style.forEach(cssObject => () => {
        const attribute = Object.keys(cssObject)[0];
        const value = cssObject[attribute];
        cardStyle += `${attribute}: ${value};\n`;
      });
    }
    this._config.color_type = config.color_type ? config.color_type : 'icon';
    this._config.color_off = config.color_off
      ? config.color_off
      : 'var(--disabled-text-color)';
    this._config.default_color = config.default_color
      ? config.default_color
      : 'var(--primary-text-color)';
    this._config.card_style = cardStyle;
    this._config.name = config.name ? config.name : '';
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  public getCardSize(): number {
    return 3;
  }

  private _toggle(state): Event | undefined {
    switch (this._config!.action) {
      case 'toggle':
        this.hass.callService('homeassistant', 'toggle', {
          entity_id: state.entity_id,
        });
        break;
      case 'more_info': {
        const node = this.shadowRoot;
        const options = {};
        const detail = { entityId: state.entity_id };
        const event = new Event('hass-more-info', {
          bubbles: options.bubbles === undefined ? true : options.bubbles,
          cancelable: Boolean(options.cancelable),
          composed: options.composed === undefined ? true : options.composed,
        });
        event.detail = detail;
        node.dispatchEvent(event);
        return event;
      }
      case 'service':
        if (!this._config!.service) {
          return;
        }
        this.hass.callService(
          this._config!.service.domain,
          this._config!.service.action,
          this._config!.service.data,
        );
        break;
      default:
        this.hass.callService('homeassistant', 'toggle', {
          entity_id: state.entity_id,
        });
        break;
    }
  }
}
