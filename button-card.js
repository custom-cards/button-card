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
        button-card-button div.main {
          padding: 4%;
          text-transform: none;
          font-size: 1.2rem;
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
      if (configState && configState.color) {
        colorValue = configState.color;
      } else {
        if (config.color != 'auto' && state && state.state == 'off')
          colorValue = config.color_off;
        else
          colorValue = config.color;
      }
      if (colorValue == 'auto') {
        if (state) {
          const color = state.attributes.rgb_color ? `rgb(${state.attributes.rgb_color.join(',')})` : config.default_color;
          return color;
        } else {
          return config.default_color;
        }
      } else {
        if (!colorValue) {
          if (state) {
            if (state.state == 'off') {
              const color = config.color_off;
              return color;
            } else {
              const color = config.default_color;
              return color;
            }
          } else {
            const color = config.default_color;
            return color;
          }
        } else {
          const color = colorValue;
          return color;
        }
      }
    }

    buildIcon(state, config, configState) {
      let iconValue = null;
      if (configState && configState.icon) {
        iconValue = configState.icon;
      } else {
        iconValue = config.icon;
      }
      if (iconValue == 'attribute') {
        if (state) {
          const icon = state.attributes.icon;
          return icon;
        } else {
          return undefined;
        }
      } else {
        const icon = iconValue;
        return icon;
      }
    }

    buildStyle(state, config, configState) {
      let cardStyle = '';
      let styleArray = undefined;
      if (state) {
        if (configState && configState.style)
          styleArray = configState.style;
        else if (config.style)
          styleArray = config.style;
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

    blankCardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      return html`
      <ha-card style="color: ${fontColor}; background-color: ${color}; ${config.card_style}" on-tap="${ev => this._toggle(state, config)}">
      </ha-card>
      `;
    }

    labelCardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      const icon = this.buildIcon(state, config, configState);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card style="color: ${fontColor};">
        <button-card-button noink style="background-color: ${color}">
        <div class="main" style="${style}">
          ${icon ? html`<ha-icon style="width: ${config.size}; height: ${config.size};" icon="${icon}"></ha-icon>` : ''}
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
      <ha-card style="color: ${fontColor};" @tap="${ev => this._toggle(state, config)}">
        <button-card-button style="background-color: ${color}; ${config.card_style}">
        <div class="main" style="${style}">
          ${icon ? html`<ha-icon style="width: ${config.size}; height: ${config.size};" icon="${icon}"></ha-icon>` : ''}
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
      <ha-card @tap="${ev => this._toggle(state, config)}">
        <button-card-button style="${config.card_style}">
        <div class="main" style="${style}">
          ${icon ? html`<ha-icon style="color: ${color}; width: ${config.size}; height: ${config.size};" icon="${icon}"></ha-icon>` : ''}
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
      this.config.color = config.color;
      this.config.size = config.size ? config.size : '40%';
      this.config.color_type = config.color_type ? config.color_type : 'icon';
      this.config.color_off = 'var(--disabled-text-color)';
      this.config.default_color = 'var(--primary-text-color)';
      this.config.name = config.name ? config.name : '';
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }

    _toggle(state, config) {
      if (!config.tap_action)
        config.tap_action = 'toggle'
      if (config.tap_action) {
        switch (config.tap_action.action) {
          case 'none':
            break;
          case 'more-info':
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
          case 'location': {
            if (!config.tap_action.navigation_path) break;
            var root = document.querySelector("home-assistant");
            history.pushState(null, "", config.tap_action.navigation_path);
            const detail = {}
            const event = new Event('location-changed', {
              bubbles: true,
              cancelable: false,
              composed: true,
            });
            event.detail = detail;
            root = root && root.shadowRoot;
            root = root && root.querySelector("home-assistant-main");
            root = root && root.shadowRoot;
            root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
            root = root && root.shadowRoot || root;
            root = root && root.querySelector("ha-panel-lovelace");
            root = root && root.shadowRoot;
            root = root && root.querySelector("hui-root");
            root = root && root.shadowRoot;
            root = root && root.querySelector("ha-app-layout #view");
            root = root && root.firstElementChild;
            if (root) root.dispatchEvent(event);
          }
          case 'service':
          case 'call-service': {
            const [domain, service] = config.tap_action.service.split('.', 2);
            this.hass.callService(domain, service, config.tap_action.service_data);
            break;
          }
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
