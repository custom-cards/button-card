((LitElement, ButtonBase) => {
  var html = LitElement.prototype.html;
  var css = LitElement.prototype.css;

  customElements.define(
    'button-card-button',
    class extends ButtonBase {
      static get styles() {
        return css`
          ${ButtonBase.styles}
          .mdc-button {
            height: auto;
            padding: 0;
            color: inherit !important;
          }
        `
      }
    },
  );

  class ButtonCard extends LitElement {
    static get properties() {
      return {
        hass: Object,
        config: Object,
      };
    }

    static get styles() {
      return css`
        ha-icon {
          display: flex;
          margin: auto;
        }
        button-card-button {
          display: flex;
          margin: auto;
          text-align: center;
        }
        button-card-button div {
          padding: 4%;
          text-transform: none;
          font-size: 1.2rem;
        }
      `;
    }

    render() {
      const state = this.__hass.states[this.config.entity];
      switch (this.config.color_type) {
        case 'blank-card':
          return this.blankCardColoredHtml(state, this.config);
        case 'label-card':
          return this.labelCardColoredHtml(state, this.config);
        case 'card':
          return this.cardColoredHtml(state, this.config);
        case 'icon':
        default:
          return this.iconColoredHtml(state, this.config);
      }
    }


    getFontColorBasedOnBackgroundColor(backgroundColor) {
      const parsedRgbColor = backgroundColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
      const parsedBackgroundColor = parsedRgbColor ? parsedRgbColor : this.hexToRgb(backgroundColor.substring(1));
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

    hexToRgb(hex) {
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;

      return [, r, g, b];
    }

    testConfigState(state, config) {
      var retval = false;
      var def = false;
      if (config.state) {
        retval = config.state.find(function (elt) {
          if (elt.operator) {
            switch (elt.operator) {
              case '==':
                return (state.state == elt.value)
              case '<=':
                return (state.state <= elt.value)
              case '<':
                return (state.state < elt.value)
              case '>=':
                return (state.state >= elt.value)
              case '>':
                return (state.state > elt.value)
              case '!=':
                return (state.state != elt.value)
              case 'regex':
                return (state.state.match(elt.value))
              case 'default':
                def = elt;
            }
          } else {
            return (elt.value === state.state)
          }
        })
        if (!retval)
          if (def)
            return def;
      }
      return retval;
    }

    buildCssColorAttribute(state, config) {
      let color = config.color;
      if (state) {
        let configState = this.testConfigState(state, config);
        if (configState) {
          color = configState.color ? configState.color : config.color_off;
          if (configState.color === 'auto') {
            color = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : configState.default_color;
          }
        } else {
          if (config.color === 'auto') {
            color = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : config.default_color;
          }
          color = state.state === 'on' ? color : config.color_off;
        }
      }
      return color;
    }

    buildIcon(state, config) {
      let iconOff = config.icon;
      if (config.icon == 'attribute') {
        if (state) {
          const icon = state.attributes.icon;
          return icon;
        }
        return iconOff;
      }
      let configState = this.testConfigState(state, config);
      if (configState && configState.icon) {
        const icon = configState.icon;
        return icon;
      }
      return iconOff;
    }

    blankCardColoredHtml(state, config) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      return html`
      <ha-card style="color: ${fontColor}; background-color: ${color}; ${config.card_style}" on-tap="${ev => this._toggle(state, config)}">
      </ha-card>
      `;
    }

    labelCardColoredHtml(state, config) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      return html`
      <ha-card style="color: ${fontColor};">
        <button-card-button noink style="background-color: ${color}">
        <div style="${config.card_style}">
          ${config.icon ? html`<ha-icon style="width: ${config.size}; height: ${config.size};" icon="${config.icon}"></ha-icon>` : ''}
          ${config.name ? html`<span>${config.name}</span>` : ''}
         </div>
        </button-card-button>
      </ha-card>
      `;
    }

    cardColoredHtml(state, config) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      const icon = this.buildIcon(state, config);
      return html`
      <ha-card style="color: ${fontColor};" @tap="${ev => this._toggle(state, config)}">
        <button-card-button style="background-color: ${color}; ${config.card_style}">
        <div style="${config.card_style}">
          ${config.icon || icon ? html`<ha-icon style="width: ${config.size}; height: ${config.size};" icon="${icon}"></ha-icon>` : ''}
          ${config.name ? html`<span>${config.name}</span>` : ''}
          ${config.show_state ? html`<span>${state.state} ${state.attributes.unit_of_measurement ? state.attributes.unit_of_measurement : ''}</span>` : ''}
         </div>
        </button-card-button>
      </ha-card>
      `;
    }

    iconColoredHtml(state, config) {
      const color = this.buildCssColorAttribute(state, config);
      const icon = this.buildIcon(state, config);
      return html`
      <ha-card @tap="${ev => this._toggle(state, config)}">
        <button-card-button style="${config.card_style}">
        <div style="${config.card_style}">
          ${config.icon || icon ? html`<ha-icon style="color: ${color}; width: ${config.size}; height: ${config.size};" icon="${icon}"></ha-icon>` : ''}
          ${config.name ? html`<div>${config.name}</div>` : ''}
          ${config.show_state ? html`<div>${state.state} ${state.attributes.unit_of_measurement ? state.attributes.unit_of_measurement : ''}</div>` : ''}
        </div>
        </button-card-button>
      </ha-card>
      `;
    }

    setConfig(config) {
      // if (!config.entity) {
      //   throw new Error('You need to define entity');
      // }
      this.config = { ...config };
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
})(window.LitElement || Object.getPrototypeOf(customElements.get("home-assistant-main")), customElements.get('mwc-button') || customElements.get('paper-button'));
