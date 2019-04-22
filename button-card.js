/**
 * Return the icon to be used for a domain.
 *
 * Optionally pass in a state to influence the domain icon.
 */
export const DEFAULT_DOMAIN_ICON = "hass:bookmark";

const fixedIcons = {
  alert: "hass:alert",
  automation: "hass:playlist-play",
  calendar: "hass:calendar",
  camera: "hass:video",
  climate: "hass:thermostat",
  configurator: "hass:settings",
  conversation: "hass:text-to-speech",
  device_tracker: "hass:account",
  fan: "hass:fan",
  group: "hass:google-circles-communities",
  history_graph: "hass:chart-line",
  homeassistant: "hass:home-assistant",
  homekit: "hass:home-automation",
  image_processing: "hass:image-filter-frames",
  input_boolean: "hass:drawing",
  input_datetime: "hass:calendar-clock",
  input_number: "hass:ray-vertex",
  input_select: "hass:format-list-bulleted",
  input_text: "hass:textbox",
  light: "hass:lightbulb",
  mailbox: "hass:mailbox",
  notify: "hass:comment-alert",
  person: "hass:account",
  plant: "hass:flower",
  proximity: "hass:apple-safari",
  remote: "hass:remote",
  scene: "hass:google-pages",
  script: "hass:file-document",
  sensor: "hass:eye",
  simple_alarm: "hass:bell",
  sun: "hass:white-balance-sunny",
  switch: "hass:flash",
  timer: "hass:timer",
  updater: "hass:cloud-upload",
  vacuum: "hass:robot-vacuum",
  water_heater: "hass:thermometer",
  weblink: "hass:open-in-new",
};

export default function domainIcon(domain, state) {
  if (domain in fixedIcons) {
    return fixedIcons[domain];
  }

  switch (domain) {
    case "alarm_control_panel":
      switch (state) {
        case "armed_home":
          return "hass:bell-plus";
        case "armed_night":
          return "hass:bell-sleep";
        case "disarmed":
          return "hass:bell-outline";
        case "triggered":
          return "hass:bell-ring";
        default:
          return "hass:bell";
      }

    case "binary_sensor":
      return state && state === "off"
        ? "hass:radiobox-blank"
        : "hass:checkbox-marked-circle";

    case "cover":
      return state === "closed" ? "hass:window-closed" : "hass:window-open";

    case "lock":
      return state && state === "unlocked" ? "hass:lock-open" : "hass:lock";

    case "media_player":
      return state && state !== "off" && state !== "idle"
        ? "hass:cast-connected"
        : "hass:cast";

    case "zwave":
      switch (state) {
        case "dead":
          return "hass:emoticon-dead";
        case "sleeping":
          return "hass:sleep";
        case "initializing":
          return "hass:timer-sand";
        default:
          return "hass:z-wave";
      }

    default:
      // tslint:disable-next-line
      console.warn(
        "Unable to find icon for domain " + domain + " (" + state + ")"
      );
      return DEFAULT_DOMAIN_ICON;
  }
}

((LitElement) => {
  var html = LitElement.prototype.html;
  var css = LitElement.prototype.css;

  class ButtonCard extends LitElement {
    static get properties() {
      return {
        hass: Object,
        config: Object,
      };
    }

    static get styles() {
      return css`
        ha-card {
          cursor: pointer;
          overflow: hidden;
        }
        ha-card.disabled {
          pointer-events: none;
          cursor: default;
        }
        ha-icon {
          display: inline-block;
          margin: auto;
        }
        div.button-card-main {
          padding: 4% 0px;
          text-transform: none;
          font-weight: 400;
          font-size: 1.2rem;
          align-items: center;
          text-align: center;
          letter-spacing: normal;
          width: 100%;
        }
        div.divTable{
          display: table;
          overflow: auto;
          table-layout: fixed;
          width: 100%;
        }
        div.divTableBody {
          display: table-row-group;
        }
        div.divTableRow {
          display: table-row;
        }
        .divTableCell {
          display: table-cell;
          vertical-align: middle;
        }
        div {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          min-width: 100%;
        }
        div.button-card-background-color {
          border-bottom-left-radius: 2px;
          border-bottom-right-radius: 2px;
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
        }
        @keyframes blink{
          0%{opacity:0;}
          50%{opacity:1;}
          100%{opacity:0;}
        }
        @-webkit-keyframes rotating /* Safari and Chrome */ {
          from {
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          to {
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        @keyframes rotating {
          from {
            -ms-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -webkit-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          to {
            -ms-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -webkit-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
        .rotating {
          -webkit-animation: rotating 2s linear infinite;
          -moz-animation: rotating 2s linear infinite;
          -ms-animation: rotating 2s linear infinite;
          -o-animation: rotating 2s linear infinite;
          animation: rotating 2s linear infinite;
        }
      `;
    }

    longpress(element) {
      customElements.whenDefined("long-press").then(() => {
        const longpress = document.body.querySelector("long-press");
        if (longpress) {
          longpress.bind(element);
        } else {
          console.warn("Longpress support not found, only simple clicks are supported. Either add an entity-button in the view, or wait for us to make the card work without. Thanks :)")
          element.addEventListener("click", this._fallbackClick);
        }
      });
      return element;
    }

    _fallbackClick() {
      this.dispatchEvent(new Event("ha-click"));
    };

    firstUpdated() {
      this.longpress(this.shadowRoot.querySelector('ha-card'));
    }

    render() {
      const state = this.__hass.states[this.config.entity];
      const configState = this.testConfigState(state, this.config)
      switch (this.config.color_type) {
        case 'blank-card':
          return this.blankCardColoredHtml(state, this.config, configState);
        case 'label-card':
        case 'card':
          return this.cardColoredHtml(state, this.config, configState);
        case 'icon':
        default:
          return this.iconColoredHtml(state, this.config, configState);
      }
    }


    getFontColorBasedOnBackgroundColor(backgroundColor) {
      let parsedBackgroundColor = null;
      if (backgroundColor.substring(0, 3) === "var") {
        let rgb = getComputedStyle(this.parentNode).getPropertyValue(backgroundColor.substring(4).slice(0, -1)).trim();
        parsedBackgroundColor = this.hexToRgb(rgb.substring(1));
      } else {
        const parsedRgbColor = backgroundColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        parsedBackgroundColor = parsedRgbColor ? parsedRgbColor : this.hexToRgb(backgroundColor.substring(1));
      }
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

    getDefaultColorForState(state) {
      switch (state.state) {
        case 'on':
          return this.config.color_on;
        case 'off':
          return this.config.color_off;
        default:
          return this.config.default_color;
      }
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
          if (state.attributes.rgb_color) {
            color = `rgb(${state.attributes.rgb_color.join(',')})`
          } else {
            color = this.getDefaultColorForState(state)
          }
        } else {
          color = config.default_color;
        }
      } else {
        if (!colorValue) {
          if (state) {
            color = this.getDefaultColorForState(state)
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
      let icon = null;
      if (configState && configState.icon) {
        icon = configState.icon;
      } else if (config.icon) {
        icon = config.icon;
      } else {
        if (state) {
          icon = state.attributes.icon ?
            state.attributes.icon :
            domainIcon(state.entity_id.split('.', 2)[0], state.state);
        }
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

    buildName(state, configState) {
      if (this.config.show_name === false) {
        return null;
      }
      let name = null;
      if (configState && configState.name) {
        name = configState.name;
      } else if (this.config.name) {
        name = this.config.name;
      } else {
        if (state) {
          name = state.attributes && state.attributes.friendly_name ?
            state.attributes.friendly_name : state.entity_id.split('.', 2)[1];
        }
      }
      return name;
    }

    buildStateString(state) {
      let stateString = null;
      if (this.config.show_state && state && state.state) {
        const units = this.buildUnits(state);
        if (units) {
          stateString = state.state + " " + units;
        } else {
          stateString = state.state
        }
      }
      return stateString;
    }

    buildUnits(state) {
      let units = null;
      if (state) {
        if (this.config.show_units) {
          if (state.attributes && state.attributes.unit_of_measurement && !this.config.units) {
            units = state.attributes.unit_of_measurement;
          } else {
            units = this.config.units ? this.config.units : null;
          }
        }
      }
      return units;
    }

    buildNameStateConcat(name, stateString) {
      if (!name && !stateString) {
        return null;
      }
      let nameStateString = null
      if (stateString !== null) {
        if (name) {
          nameStateString = name + ": " + stateString;
        } else {
          nameStateString = stateString;
        }
      } else {
        nameStateString = name;
      }
      return nameStateString;
    }

    isClickable(state, config) {
      let clickable = true;
      if (config.tap_action.action == 'toggle') {
        if (state) {
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
          clickable = false
        }
      } else {
        clickable = (config.tap_action.action != 'none' || config.hold_action && config.hold_action.action != 'none')
      }
      return clickable;
    }

    rotate(configState) {
      return configState && configState.spin ? 'rotating' : '';
    }

    buttonContent(state, configState, color) {
      const icon = this.buildIcon(state, this.config, configState);
      const name = this.buildName(state, configState);
      const stateString = this.buildStateString(state);
      const nameStateString = this.buildNameStateConcat(name, stateString);

      switch (this.config.layout) {
        case 'icon_name_state':
          return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style="width: ${this.config.size}; height: auto;">
                  ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: auto; height: auto; max-width: ${this.config.size};" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                </div>
                ${nameStateString ? html`<div class="divTableCell">${nameStateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
        case 'icon_name':
          return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style="width: ${this.config.size}; height: auto;">
                  ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: auto; height: auto; max-width: ${this.config.size};" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                </div>
                ${name ? html`<div class="divTableCell">${name}</div>` : ''}
              </div>
            </div>
          </div>
          ${stateString != null ? html`<div>${stateString}</div>` : ''}
          `;
        case 'icon_state':
          return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style="width: ${this.config.size}; height: auto;">
                  ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: auto; height: auto; max-width: ${this.config.size};" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                </div>
                ${stateString != null ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          ${name ? html`<div>${name}</div>` : ''}
          `;
        case 'icon_state_name2nd':
          return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style="width: ${this.config.size}; height: auto;">
                  ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: auto; height: auto; max-width: ${this.config.size};" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                </div>
                ${stateString != null && name ? html`<div class="divTableCell">${stateString}<br/>${name}</div>` : ''}
                ${!stateString && name ? html`<div class="divTableCell">${name}</div>` : ''}
                ${stateString && !name ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
        case 'icon_name_state2nd':
          return html`
          <div class="divTable">
            <div class="divTableBody">
              <div class="divTableRow">
                <div class="divTableCell" style="width: ${this.config.size}; height: auto;">
                  ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: auto; height: auto; max-width: ${this.config.size};" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
                </div>
                ${stateString != null && name ? html`<div class="divTableCell">${name}<br/>${stateString}</div>` : ''}
                ${!stateString && name ? html`<div class="divTableCell">${name}</div>` : ''}
                ${stateString && !name ? html`<div class="divTableCell">${stateString}</div>` : ''}
              </div>
            </div>
          </div>
          `;
        case 'name_state':
          return html`
          ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: ${this.config.size}; height: auto;" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
          ${nameStateString ? html`<div>${nameStateString}</div>` : ''}
          `;
        case 'vertical':
        default:
          return html`
          ${this.config.show_icon && icon ? html`<ha-icon style="color: ${color ? color : "inherit"}; width: ${this.config.size}; height: auto;" icon="${icon}" class="${this.rotate(configState)}"></ha-icon>` : ''}
          ${name ? html`<div>${name}</div>` : ''}
          ${stateString ? html`<div>${stateString}</div>` : ''}
          `;
      }
    }

    blankCardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      return html`
      <ha-card class="disabled">
        <div class="button-card-background-color" style="color: ${fontColor}; background-color: ${color};"></div>
      </ha-card>
      `;
    }

    cardColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const fontColor = this.getFontColorBasedOnBackgroundColor(color);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card class="${this.isClickable(state, config) ? '' : "disabled"}" @ha-click="${ev => this._handleTap(state, config, false)}" @ha-hold="${ev => this._handleTap(state, config, true)}">
        <div class="button-card-background-color" style="color: ${fontColor}; background-color: ${color};">
          <div class="button-card-main" style="${style}">
            ${this.buttonContent(state, configState, null)}
          </div>
        </div>
        <mwc-ripple></mwc-ripple>
      </ha-card>
      `;
    }

    iconColoredHtml(state, config, configState) {
      const color = this.buildCssColorAttribute(state, config, configState);
      const style = this.buildStyle(state, config, configState);
      return html`
      <ha-card class="${this.isClickable(state, config) ? '' : "disabled"}" @ha-click="${ev => this._handleTap(state, config, false)}" @ha-hold="${ev => this._handleTap(state, config, true)}">
        <div class="button-card-main" style="${style}">
          ${this.buttonContent(state, configState, color)}
        </div>
        <mwc-ripple></mwc-ripple>
      </ha-card>
      `;
    }

    setConfig(config) {
      this.config = {
        tap_action: { action: "toggle" },
        size: '40%',
        color_type: 'icon',
        default_color: 'var(--primary-text-color)',
        show_name: true,
        show_state: false,
        show_icon: true,
        show_units: true,
        ...config
      };
      this.config.color_off = 'var(--paper-item-icon-color)';
      this.config.color_on = 'var(--paper-item-icon-active-color)';
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
      return 3;
    }

    _handleTap(state, config, hold) {
      if (config.confirmation &&
        !confirm(config.confirmation)) {
        return;
      }

      let action = hold ? config.hold_action : config.tap_action;
      if (action) {
        let event;
        switch (action.action) {
          case 'none':
            break;
          case 'more-info':
            event = new Event('hass-more-info', {
              bubbles: true,
              cancelable: false,
              composed: true,
            });
            event.detail = { entityId: state.entity_id };
            this.shadowRoot.dispatchEvent(event);
            break;
          case 'navigate':
            if (!action.navigation_path) break;
            history.pushState(null, "", action.navigation_path);
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
            if (!action.service) {
              return;
            }
            const [domain, service] = action.service.split('.', 2);
            this.hass.callService(domain, service, action.service_data);
            break;
          case 'url':
            action.url && window.open(action.url);
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
})(window.LitElement || Object.getPrototypeOf(customElements.get("home-assistant-main")));
