import {
  LitElement, html,
} from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

class ButtonCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  _render({ hass, config }) {
    const state = hass.states[config.entity];
    switch (config.color_type) {
      case 'blank-card':
        return this.blankCardColoredHtml(state, config);
      case 'card':
        return this.cardColoredHtml(state, config);
      case 'icon':
      default:
        return this.iconColoredHtml(state, config);
    }
  }


  getFontColorBasedOnBackgroundColor(backgroundColor) {
    const parsedBackgroundColor = backgroundColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    let fontColor = ''; // don't override by default
    if (parsedBackgroundColor) {
      // Counting the perceptive luminance - human eye favors green color...
      const luminance = (0.299 * parsedBackgroundColor[1] + 0.587 * parsedBackgroundColor[2] + 0.114 * parsedBackgroundColor[3]) / 255;
      if (luminance > 0.5) {
        fontColor = 'rgb(62, 62, 62)'; // bright colors - black font
      } else {
        fontColor = 'rgb(234, 234, 234)';// dark colors - white font
      }
    }
    return fontColor;
  }

  buildCssColorAttribute(state, config) {
    let colorOn = config.color;
    if (state) {
      if (config.color === 'auto') {
        colorOn = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : config.default_color;
      }
      const color = state.state === 'on' ? colorOn : config.color_off;
      return color;
    }
    return colorOn;
  }

  blankCardColoredHtml(state, config) {
    const color = this.buildCssColorAttribute(state, config);
    const fontColor = this.getFontColorBasedOnBackgroundColor(color);
    return html`
    <ha-card style="color: ${fontColor}; background-color: ${color}; ${config.card_style}" on-tap="${ev => this._toggle(state, config)}">
    </ha-card>
    `;
  }

  cardColoredHtml(state, config) {
    const color = this.buildCssColorAttribute(state, config);
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
    <ha-card style="color: ${fontColor};" on-tap="${ev => this._toggle(state, config)}">
      <paper-button style="background-color: ${color}; ${config.card_style}">
      <div>
        ${config.icon ? html`<ha-icon style="width: ${config.size}; height: ${config.size};" icon="${config.icon}"></ha-icon>` : ''}
        ${config.name ? html`<span>${config.name}</span>` : ''}
        ${config.show_state ? html`<span>${state.state}</span>` : ''}
       </div>
      </paper-button>
    </ha-card>
    `;
  }

  iconColoredHtml(state, config) {
    const color = this.buildCssColorAttribute(state, config);
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
    <ha-card on-tap="${ev => this._toggle(state, config)}">
      <paper-button style="${config.card_style}">
      <div>
        ${config.icon ? html`<ha-icon style="color: ${color}; width: ${config.size}; height: ${config.size};" icon="${config.icon}"></ha-icon>` : ''}
        ${config.name ? html`<span>${config.name}</span>` : ''}
        ${config.show_state ? html`<span>${state.state}</span>` : ''}
      </div>
      </paper-button>
    </ha-card>
    `;
  }

  setConfig(config) {
    // if (!config.entity) {
    //   throw new Error('You need to define entity');
    // }
    this.config = config;
    this.config.color = config.color ? config.color : 'var(--primary-text-color)';
    this.config.size = config.size ? config.size : '40%';
    let cardStyle = '';
    if (config.style) {
      config.style.forEach((cssObject) => {
        const attribute = Object.keys(cssObject)[0];
        const value = cssObject[attribute];
        cardStyle += `${attribute}: ${value};\n`;
      });
    }
    this.config.color_type = config.color_type ? config.color_type : 'icon';
    this.config.color_off = config.color_off ? config.color_off : 'var(--disabled-text-color)';
    this.config.default_color = config.default_color ? config.default_color : 'var(--primary-text-color)';
    this.config.card_style = cardStyle;
    this.config.name = config.name ? config.name : '';
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }

  _toggle(state, config) {
    switch (config.action) {
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
        this.hass.callService(config.service.domain, config.service.action, config.service.data);
        break;
      default:
        this.hass.callService('homeassistant', 'toggle', {
          entity_id: state.entity_id,
        });
        break;
    }
  }
}

customElements.define('button-card', ButtonCard);
