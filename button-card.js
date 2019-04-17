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
        button-card-button.disabled {
            pointer-events: none;
            cursor: default;
        }
        button-card-button div.main {
          padding: 4% 0px;
          text-transform: none;
          font-weight: 400;
          font-size: 1.2rem;
          align-items: center;
          text-align: center;
          letter-spacing: normal;
          width: 100%;
        }
      `;
    }

    render() {
      const state = this.__hass.states[this.config.entity];
      const configState = this.testConfigState(state, this.config)
      switch (this.config.color_type) {
        case 'blank-card':
          return this.blankCardColoredHtml(state, this.config, configState);
        case 'label-card':
          return this.labelCardColoredHtml(state, this.config, configState);
        case 'card':
          return this.cardColoredHtml(state, this.config, configState);
        case 'icon':
        default:
          return this.iconColoredHtml(state, this.config, configState);
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
            return (elt.value == state.state)
          }
        })
        if (!retval)
          if (def)
            return def;
      }
      return retval;
    }

    buildCssColorAttribute(state, config, configState) {
      let colorValue = null;
      let color = null;
      if (configState && configState.color) {
        colorValue = configState.color;
      } else {
        if (config.color != 'auto' && state && state.state == 'off') {
          colorValue = config.color_off;
        } else {
          colorValue = config.color;
        }
      }
      if (colorValue == 'auto') {
        if (state) {
          color = state.attributes.rgb_color ?
            `rgb(${state.attributes.rgb_color.join(',')})` : config.default_color;
        } else {
          color = config.default_color;
        }
      } else {
        if (!colorValue) {
          if (state) {
            if (state.state == 'off') {
              color = config.color_off;
            } else {
              color = config.default_color;
            }
          } else {
            color = config.default_color;
          }
        } else {
          color = colorValue;
        }
      }
      return color;
    }

    buildIcon(state, config, configState) {
      let iconValue = null;
      let icon = null;
      if (configState && configState.icon) {
        iconValue = configState.icon;
      } else {
        iconValue = config.icon;
      }
      if (iconValue == 'attribute') {
        if (state) {
          icon = state.attributes.icon;
        } else {
          icon = undefined;
        }
      } else {
        icon = iconValue;
      }
      return icon;
    }

    buildStyle(state, config, configState) {
      let cardStyle = '';
      let styleArray = undefined;
      if (state) {
        if (configState && configState.style) {
          styleArray = configState.style;
        } else if (config.style) {
          styleArray = config.style;
        }
      } else {
        if (config.style)
          styleArray = config.style;
      }
      if (styleArray) {
        styleArray.forEach((cssObject) => {
          const attribute = Object.keys(cssObject)[0];
          const value = cssObject[attribute];
          cardStyle += `${attribute}: ${value};\n`;
        });
      }
      return cardStyle;
    }

    isClickable(state, config) {
      let clickable = true;
      if (config.tap_action.action == 'toggle' && state) {
        switch (state.entity_id.split('.', 2)[0]) {
          case 'sensor':
          case 'binary_sensor':
            clickable = false
            break;
          default:
            clickable = true
            break;
        }
      } else {
        if (config.tap_action.action == 'none') {
          clickable = false
        } else {
          clickable = true
        }
      }
      return clickable;
    }


    blankCardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      return html`
      <ha-card class="disabled" style="color: ${fontColor}; background-color: ${color}; position: relative;">
      </ha-card>
      `;
    }

    labelCardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      const icon = this.buildIcon(state, config, configState);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card style="color: ${fontColor}; position: relative;" @tap="${ev => this._handleTap(state, config)}">
        <button-card-button class="${this.isClickable(state, config) ? '' : "disabled"}" style="background-color: ${color}">
          <div class="main" style="${style}">
            ${icon ? html`<ha-icon style="width: ${config.size}; height: auto;" icon="${icon}"></ha-icon>` : ''}
            ${config.name ? html`<div>${config.name}</div>` : ''}
          </div>
        </button-card-button>
      </ha-card>
      `;
    }

    cardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      const icon = this.buildIcon(state, config, configState);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card style="color: ${fontColor}; position: relative;" @tap="${ev => this._handleTap(state, config)}">
        <button-card-button class="${this.isClickable(state, config) ? '' : "disabled"}" style="background-color: ${color};">
          <div class="main" style="${style}">
            ${icon ? html`<ha-icon style="width: ${config.size}; height: auto;" icon="${icon}"></ha-icon>` : ''}
            ${config.name ? html`<div>${config.name}</div>` : ''}
            ${config.show_state ? html`<div>${state.state} ${state.attributes.unit_of_measurement ? state.attributes.unit_of_measurement : ''}</div>` : ''}
          </div>
        </button-card-button>
      </ha-card>
      `;
    }

    iconColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const icon = this.buildIcon(state, config, configState);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card style="position: relative;" @tap="${ev => this._handleTap(state, config)}">
        <button-card-button class="${this.isClickable(state, config) ? '' : "disabled"}">
          <div class="main" style="${style}">
            ${icon ? html`<ha-icon style="color: ${color}; width: ${config.size}; height: auto;" icon="${icon}"></ha-icon>` : ''}
            ${config.name ? html`<div>${config.name}</div>` : ''}
            ${config.show_state ? html`<div>${state.state} ${state.attributes.unit_of_measurement ? state.attributes.unit_of_measurement : ''}</div>` : ''}
          </div>
        </button-card-button>
      </ha-card>
      `;
    }

    setConfig(config) {
      this.config = {
        tap_action: { action: "toggle" },
        size: '40%',
        color_type: 'icon',
        color_off: 'var(--disabled-text-color)',
        default_color: 'var(--primary-text-color)',
        name: '',
        ...config
      };
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }

    _handleTap(state, config) {
      if (config.tap_action) {
        let event;
        switch (config.tap_action.action) {
          case 'none':
            break;
          case 'more-info':
          case 'more_info':
            event = new Event('hass-more-info', {
              bubbles: true,
              cancelable: false,
              composed: true,
            });
            event.detail = { entityId: state.entity_id };
            this.shadowRoot.dispatchEvent(event);
            break;
          case 'navigate':
            if (!config.tap_action.navigation_path) break;
            history.pushState(null, "", config.tap_action.navigation_path);
            event = new Event('location-changed', {
              bubbles: true,
              cancelable: false,
              composed: true,
            });
            event.detail = {};
            this.shadowRoot.dispatchEvent(event);
            break;
          case 'service':
          case 'call-service':
            if (!config.tap_action.service) {
              return;
            }
            const [domain, service] = config.tap_action.service.split('.', 2);
            this.hass.callService(domain, service, config.tap_action.service_data);
            break;
          case 'toggle':
          default:
            this.hass.callService('homeassistant', 'toggle', {
              entity_id: state.entity_id,
            });
            break;
        }
      }
    }
  }

  customElements.define('button-card', ButtonCard);
})(window.LitElement || Object.getPrototypeOf(customElements.get("home-assistant-main")), customElements.get('mwc-button') || customElements.get('paper-button'));
