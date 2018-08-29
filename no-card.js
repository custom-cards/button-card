import {
  LitElement, html
} from 'https://unpkg.com/@polymer/lit-element@^0.5.2/lit-element.js?module';

class NoCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    }
  }
  _render({ hass, config }) {
    return html`
    <ha-card>
    </ha-card>
    `;
  }
  setConfig(config) {
    this.config = config;
  }

}

customElements.define('no-card', NoCard);
