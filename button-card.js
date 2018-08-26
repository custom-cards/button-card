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
    let state = hass.states[config.entity];
    if (config.icon){
      return this.icon(state,config);
    }
    return this.no_icon(state);
  }


  no_icon(state) {
    return html`
    <style>
    paper-button {
      display: block;
      margin: auto;
      text-align: center;
    }
    </style>
    <ha-card>
      <paper-button on-tap="${ev => this._toggle(state)}">
       ${state.state}
      </paper-button>
    </ha-card>
    `;
  }

  icon(state,config) {
    return html`
    <style>
    ha-icon {
      width: ${config.size ? config.size : "40%" };
      height: ${config.size ? config.size : "40%" };
      display: block;
      margin: auto;
      color: ${state.state === 'on' ? (config.color ? config.color : "var(--primary-text-color)") : "var(--disabled-text-color)"};
    }
    </style>
    
    <ha-card>
      <paper-button state="${state.state}" on-tap="${ev => this._toggle(state)}">
       <ha-icon icon="${config.icon}"></ha-icon>
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

  _toggle(state) {
    this.hass.callService('homeassistant', 'toggle', {
      entity_id: state.entity_id
    });
  }
}

customElements.define('button-card', ButtonCard);