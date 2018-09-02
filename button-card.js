import {
  LitElement, html
} from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

class ButtonCard extends LitElement {

  static get properties() {
    return {
      hass: Object,
      config: Object
    }
  }

  _render({ hass, config }) {
    const state = hass.states[config.entity];
    switch (config.color_type) {
      case "card":
        return this.card_colored_html(state, config);
        break;
      case "icon":
      default:
        return this.icon_colored_html(state, config);
        break;
    }
  }


  get_font_color_based_on_background_color(background_color) {
    background_color = background_color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    let fontColor = ""; // don't override by default
    if (background_color) {
      // Counting the perceptive luminance - human eye favors green color... 
      const luminance = (0.299 * background_color[1] + 0.587 * background_color[2] + 0.114 * background_color[3]) / 255;
      if (luminance > 0.5) {
        fontColor = "rgb(62, 62, 62)"; // bright colors - black font
      } else {
        fontColor = "rgb(234, 234, 234)"// dark colors - white font
      }
    }
    return fontColor;
  }

  build_css_color_attribute(state, config) {
    let color_on = config.color;
    if (config.color == "auto") {
      color_on = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : config.default_color;
    }
    let color = state.state === 'on' ? color_on : config.color_off;
    return color;
  }

  card_colored_html(state, config) {
    const color = this.build_css_color_attribute(state, config);
    const fontColor = this.get_font_color_based_on_background_color(color);
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

  icon_colored_html(state, config) {
    const color = this.build_css_color_attribute(state, config);
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
    if (!config.entity) {
      throw new Error('You need to define entity');
    }
    this.config = config;
    this.config.color = config.color ? config.color : "var(--primary-text-color)";
    this.config.size = config.size ? config.size : "40%";
    let card_style = '';
    if (config.style) {
      config.style.forEach(cssObject => {
        const attribute = Object.keys(cssObject)[0]
        const value = cssObject[attribute]
        card_style += `${attribute}: ${value};\n`
      })
    }
    this.config.color_type = config.color_type ? config.color_type : "icon";
    this.config.color_off = config.color_off ? config.color_off : "var(--disabled-text-color)";
    this.config.default_color = config.default_color ? config.default_color : "var(--primary-text-color)";
    this.config.card_style = card_style;
    this.config.name = config.name ? config.name : "";
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
          entity_id: state.entity_id
        });
        break;
      case 'more_info':
        const node = this.shadowRoot;
        let options = {};
        const detail = { entityId: state.entity_id };
        const event = new Event('hass-more-info', {
          bubbles: options.bubbles === undefined ? true : options.bubbles,
          cancelable: Boolean(options.cancelable),
          composed: options.composed === undefined ? true : options.composed
        });
        event.detail = detail;
        node.dispatchEvent(event);
        return event;
        break;
      default:
        this.hass.callService('homeassistant', 'toggle', {
          entity_id: state.entity_id
        });
        break;
    }

  }
}

customElements.define('button-card', ButtonCard);