customElements.whenDefined('card-tools').then(() => {
class CardModder extends cardTools.LitElement {

  constructor() {
    super();
    this.EL_STYLES = ["left", "top", "right", "bottom", "position"];
  }

  static get properties() {
    return {
      card: {},
    };
  }

  async setConfig(config) {
    cardTools.checkVersion(0.3);

    if(!config || !config.card) {
      throw new Error("Card config incorrect");
    }
    if(Array.isArray(config.card)) {
      throw new Error("It says 'card', not 'cardS'. Remove the dash.");
    }

    this.templated = [];
    this.attempts = 5;

    if (config.entities)
      config.card.entities = config.entities;

    this.card = cardTools.createCard(config.card);
    if(this._hass)
      this.card.hass = this._hass;

    if(this._config)
      this._cardMod();

    this._config = config;

    window.addEventListener("location-changed", () => this.hass = this._hass);
  }

  createRenderRoot() {
    return this;
  }
  render() {
    return cardTools.LitHtml`
    <div id="root">${this.card}</div>
    `;
  }

  async firstUpdated() {
    this._cardMod();
  }

  async _cardMod() {
    if(!this._config.style) return;

    let root = this.card;
    let target = null;
    let styles = null;
    while(!target) {
      await root.updateComplete;
      if(root._cardModder) {
        target = root._cardModder.target;
        styles = root._cardModder.styles;
        continue;
      }
      if(root.querySelector("style"))
        styles = root.querySelector("style");
      if(root.querySelector("ha-card")) {
        target = root.querySelector("ha-card");
        continue;
      }
      if(root.querySelector("vertical-stack-in-card")) {
        target = root.querySelector("vertical-stack-in-card");
        continue;
      }
      if(root.card) {
        root = root.card;
        continue;
      }
      if(root.shadowRoot) {
        root = root.shadowRoot;
        continue;
      }
      if(root.querySelector("#root")) {
        root = root.querySelector("#root");
        continue;
      }
      if(root.firstElementChild) {
        root = root.firstElementChild;
        continue;
      }
      break;
    }
    if(this.classList.contains("element")) {
      if(!target)
        target = this.card;
      root = this;
    }
    if(!target && this.attempts) // Try again
      setTimeout(() => this._cardMod(), 100);
    this.attempts--;
    target = target || this.card;

    if(this._config.extra_styles) {
      if(!styles) {
        styles = document.createElement('style');
        root.appendChild(styles);
      }
      if(!styles.innerHTML.includes(this._config.extra_styles))
        styles.innerHTML += this._config.extra_styles;
    }

    if(this._config.style) {
      for(var k in this._config.style) {
        if(cardTools.hasTemplate(this._config.style[k]))
          this.templated.push(k);
        if(this.card.style.setProperty)
          this.card.style.setProperty(k, '');
        if(target.style.setProperty) {
          target.style.setProperty(k, cardTools.parseTemplate(this._config.style[k]));
        }
        if(this.classList.contains("element") && this.EL_STYLES.indexOf(k) > -1) {
          this.style.setProperty(k, cardTools.parseTemplate(this._config.style[k]));
        }
      }
    }
    this.target = target;
  }

  set hass(hass) {
    this._hass = hass;
    if(this.card) this.card.hass = hass;
    if(this.templated)
      this.templated.forEach((k) => {
        this.target.style.setProperty(k, cardTools.parseTemplate(this._config.style[k], ''));
        if(this.classList.contains("element") && this.EL_STYLES.indexOf(k) > -1) {
          this.style.setProperty(k, cardTools.parseTemplate(this._config.style[k]));
        }
      });
  }

  getCardSize() {
    if(this._config && this._config.report_size)
      return this._config.report_size;
    if(this.card)
      return typeof this.card.getCardSize === "function" ? this.card.getCardSize() : 1;
    return 1;
  }
}

customElements.define('card-modder', CardModder);
});

window.setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('card-modder', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
