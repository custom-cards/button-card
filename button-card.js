import {
  LitElement, html
} from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

class ButtonCard extends LitElement {

  static get properties() {
    return {
      hass: Object,
      config: Object,
    }
  }

  _render({ hass, config }) {
    const state = hass.states[config.entity];
    if (config.icon) {
      return this.icon(state, config);
    }
    return this.no_icon(state, config);
  }


  no_icon(state, config) {
    return html`
    <style>
    paper-button {
      display: block;
      margin: auto;
      text-align: center;
    }
    </style>
    <ha-card>
      <paper-button on-tap="${ev => this._toggle(state, config)}">
       ${state.state}
      </paper-button>
    </ha-card>
    `;
  }

  icon(state, config) {
    const color = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : (
      config.color ? config.color : "var(--primary-text-color)"
    )
    const color_on = state.state === 'on' ? color : "var(--disabled-text-color)";
    let card_style = '';
    if (config.style){
      config.style.forEach( cssObject => {
        const attribute = Object.keys(cssObject)[0]
        const value = cssObject[attribute]
        card_style += `${attribute}: ${value};\n`
      })
    }
    
    return html`
    <style>
    ha-icon {  
      display: block;
      margin: auto;
    }
    paper-button {
      display: block;
      margin: auto;
      text-align: center;
    }
    </style>
    <ha-card>
      <paper-button style="${card_style != '' ? card_style : ""}" on-tap="${ev => this._toggle(state, config)}">
       <ha-icon style="color: ${color_on}; width: ${config.size ? config.size : "40%"}; height: ${config.size ? config.size : "40%"};" icon="${config.icon}"></ha-icon>
       ${config.name ? config.name : ""}
      </paper-button>
    </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define entity');
    }
    this.config = config;
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