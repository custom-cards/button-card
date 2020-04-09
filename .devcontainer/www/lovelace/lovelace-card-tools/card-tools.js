customElements.define('card-tools',
class {
  static get CUSTOM_TYPE_PREFIX() { return "custom:"}
  static get version() { return "0.4"}

  static checkVersion(v) {
    if (this.version < v) {
      throw new Error(`Old version of card-tools found. Get the latest version of card-tools.js from https://github.com/thomasloven/lovelace-card-tools`);
    }
  }

  static deprecationWarning() {
    if(window.cardTools_deprecationWarning) return;
    console.warn("One or more of your lovelace plugins are using the functions cardTools.litElement(), cardTools.litHtml() or cardTools.hass(). Those are replaced with better alternatives and will be removed a some point in the future.")
    console.warn("If you are a plugin developer, make sure you are using the new functions (see documentation).");
    console.warn("If you are a plugin user, feel free to ignore this warning (or poke the developer of your plugins - not me though, I already know about this).")
    console.warn("Best regards / thomasloven - " + (document.currentScript && document.currentScript.src));
  window.cardTools_deprecationWarning = true;
  }

  static get LitElement() {
    return Object.getPrototypeOf(customElements.get('home-assistant-main'));
  }
  static litElement() { // Backwards compatibility - deprecated
    this.deprecationWarning();
    return this.LitElement;
  }

  static get LitHtml() {
    return this.LitElement.prototype.html;
  }
  static litHtml() { // Backwards compatibility - deprecated
    this.deprecationWarning();
    return this.LitHtml;
  }

  static get LitCSS() {
    return this.LitElement.prototype.css;
  }

  static get hass() {
    var hass = function() { // Backwards compatibility - deprecated
      this.deprecationWarning();
      return hass;
    }
    for (var k in document.querySelector('home-assistant').hass)
      hass[k] = document.querySelector('home-assistant').hass[k];
    hass.original = document.querySelector('home-assistant').hass;
    return hass;
  }

  static fireEvent(ev, detail, entity=null) {
    ev = new Event(ev, {
      bubbles: true,
      cancelable: false,
      composed: true,
    });
    ev.detail = detail || {};
    if(entity) {
      entity.dispatchEvent(ev);
    } else {
      var root = document.querySelector("home-assistant");
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
      if (root) root.dispatchEvent(ev);
    }
  }

  static get lovelace() {
    var root = document.querySelector("home-assistant");
    root = root && root.shadowRoot;
    root = root && root.querySelector("home-assistant-main");
    root = root && root.shadowRoot;
    root = root && root.querySelector("app-drawer-layout partial-panel-resolver");
    root = root && root.shadowRoot || root;
    root = root && root.querySelector("ha-panel-lovelace")
    root = root && root.shadowRoot;
    root = root && root.querySelector("hui-root")
    if (root) {
      var ll =  root.lovelace
      ll.current_view = root.___curView;
      return ll;
    }
    return null;
  }

  static createThing(thing, config) {
    const _createThing = (tag, config) => {
      const element = document.createElement(tag);
      try {
        element.setConfig(config);
      } catch (err) {
        console.error(tag, err);
        return _createError(err.message, config);
      }
      return element;
    };

    const _createError = (error, config) => {
      return _createThing("hui-error-card", {
        type: "error",
        error,
        config,
      });
    };

    if(!config || typeof config !== "object" || !config.type)
      return _createError(`No ${thing} type configured`, config);
    let tag = config.type;
    if(config.error) {
      const err = config.error;
      delete config.error;
      return _createError(err, config);
    }
    if(tag.startsWith(this.CUSTOM_TYPE_PREFIX))
      tag = tag.substr(this.CUSTOM_TYPE_PREFIX.length);
    else
      tag = `hui-${tag}-${thing}`;

    if(customElements.get(tag))
      return _createThing(tag, config);

    // If element doesn't exist (yet) create an error
    const element = _createError(
      `Custom element doesn't exist: ${tag}.`,
      config
    );
    element.style.display = "None";
    const timer = setTimeout(() => {
      element.style.display = "";
    }, 2000);
    // Remove error if element is defined later
    customElements.whenDefined(tag).then(() => {
      clearTimeout(timer);
      this.fireEvent("ll-rebuild", {}, element);
    });

    return element;
  }

  static createCard(config) {
    return this.createThing("card", config);
  }

  static createElement(config) {
    return this.createThing("element", config);
  }

  static createEntityRow(config) {
    const SPECIAL_TYPES = new Set([
      "call-service",
      "divider",
      "section",
      "weblink",
    ]);
    const DEFAULT_ROWS = {
      alert: "toggle",
      automation: "toggle",
      climate: "climate",
      cover: "cover",
      fan: "toggle",
      group: "group",
      input_boolean: "toggle",
      input_number: "input-number",
      input_select: "input-select",
      input_text: "input-text",
      light: "toggle",
      media_player: "media-player",
      lock: "lock",
      scene: "scene",
      script: "script",
      sensor: "sensor",
      timer: "timer",
      switch: "toggle",
      vacuum: "toggle",
      water_heater: "climate",
    };

    if(!config || typeof config !== "object" || (!config.entity && !config.type)) {
      Object.assign(config, {error: "Invalid config given"});
      return this.createThing("", config);
    }

    const type = config.type || "default";
    if(SPECIAL_TYPES.has(type) || type.startsWith(this.CUSTOM_TYPE_PREFIX))
      return this.createThing("row", config);

    const domain = config.entity.split(".", 1)[0];
    Object.assign(config, {type: DEFAULT_ROWS[domain] || "text"});
    return this.createThing("entity-row", config);
  }

  static get deviceID() {
    const ID_STORAGE_KEY = 'lovelace-player-device-id';
    if(window['fully'] && typeof fully.getDeviceId === "function")
      return fully.getDeviceId();
    if(!localStorage[ID_STORAGE_KEY])
    {
      const s4 = () => {
        return Math.floor((1+Math.random())*100000).toString(16).substring(1);
      }
      localStorage[ID_STORAGE_KEY] = `${s4()}${s4()}-${s4()}${s4()}`;
    }
    return localStorage[ID_STORAGE_KEY];
  }

  static moreInfo(entity) {
    this.fireEvent("hass-more-info", {entityId: entity});
  }

  static longpress(element) {
    customElements.whenDefined("long-press").then(() => {
      const longpress = document.body.querySelector("long-press");
      longpress.bind(element);
    });
    return element;
  }

  static hasTemplate(text) {
    return /\[\[\s+.*\s+\]\]/.test(text);
  }

  static parseTemplateString(str, specialData = {}) {
    if(typeof(str) !== "string") return text;
    const FUNCTION = /^[a-zA-Z0-9_]+\(.*\)$/;
    const EXPR = /([^=<>!]+)\s*(==|!=|<|>|<=|>=)\s*([^=<>!]+)/;
    const SPECIAL = /^\{.+\}$/;
    const STRING = /^"[^"]*"|'[^']*'$/;

    if(typeof(specialData) === "string") specialData = {};
    specialData = Object.assign({
      user: this.hass.user.name,
      browser: this.deviceID,
      hash: location.hash.substr(1) || ' ',
    }, specialData);

    const _parse_function = (str) => {
      let args = [str.substr(0, str.indexOf('(')).trim()]
      str = str.substr(str.indexOf('(')+1);
      while(str) {
        let index = 0;
        let parens = 0;
        let quote = false;
        while(str[index]) {
          let c = str[index++];

          if(c === quote && index > 1 && str[index-2] !== "\\")
              quote = false;
          else if(`"'`.includes(c))
            quote = c;
          if(quote) continue;

          if(c === '(')
            parens = parens + 1;
          else if(c === ')') {
            parens = parens - 1;
            continue
          }
          if(parens > 0) continue;

          if(",)".includes(c)) break;
        }
        args.push(str.substr(0, index-1).trim());
        str = str.substr(index);
      }
      return args;
    };

    const _parse_special = (str) => {
      str = str.substr(1, str.length - 2);
      return specialData[str] || `{${str}}`;
    };

    const _parse_entity = (str) => {
      str = str.split(".");
      let v;
      if(str[0].match(SPECIAL)) {
        v = _parse_special(str.shift());
        v = this.hass.states[v] || v;
      } else {
        v = this.hass.states[`${str.shift()}.${str.shift()}`];
        if(!str.length) return v['state'];
      }
      str.forEach(item => v=v[item]);
      return v;
    }

    const _eval_expr = (str) => {
      str = EXPR.exec(str);
      if(str === null) return false;
      const lhs = this.parseTemplateString(str[1]);
      const rhs = this.parseTemplateString(str[3]);
      var expr = ''
      if(!parseFloat(lhs))
        expr = `"${lhs}" ${str[2]} "${rhs}"`;
      else
        expr = `${parseFloat(lhs)} ${str[2]} ${parseFloat(rhs)}`
      return eval(expr);
    }

    const _eval_function = (args) => {
      if(args[0] === "if") {
        if(_eval_expr(args[1]))
          return this.parseTemplateString(args[2]);
        return this.parseTemplateString(args[3]);
      }
    }

    try {
      str = str.trim();
      if(str.match(STRING))
        return str.substr(1, str.length - 2);
      if(str.match(SPECIAL))
        return _parse_special(str);
      if(str.match(FUNCTION))
        return _eval_function(_parse_function(str));
      if(str.includes("."))
        return _parse_entity(str);
      return str;
    } catch (err) {
      return `[[ Template matching failed: ${str} ]]`;
    }
  }

  static parseTemplate(text, data = {}) {
    if(typeof(text) !== "string") return text;
    // Note: .*? is javascript regex syntax for NON-greedy matching
    var RE_template = /\[\[\s(.*?)\s\]\]/g;
    text = text.replace(RE_template, (str, p1, offset, s) => this.parseTemplateString(p1, data));
    return text;
  }

  static args(script=null) {
    script = script || document.currentScript;
    var url = script.src;
    url = url.substr(url.indexOf("?")+1)
    let args = {};
    url.split("&").forEach((a) => {
      if(a.indexOf("=")) {
        let parts = a.split("=");
        args[parts[0]] = parts[1]
      } else {
        args[a] = true;
      }
    });
    return args;
  }

  static localize(key, def="") {
    const language = this.hass.language;
    if(this.hass.resources[language] && this.hass.resources[language][key])
      return this.hass.resources[language][key];
    return def;
  }

  static popUp(title, message, large=false) {
    let popup = document.createElement('div');
    popup.innerHTML = `
    <style>
      app-toolbar {
        color: var(--more-info-header-color);
        background-color: var(--more-info-header-background);
      }
    </style>
    <app-toolbar>
      <paper-icon-button
        icon="hass:close"
        dialog-dismiss=""
      ></paper-icon-button>
      <div class="main-title" main-title="">
        ${title}
      </div>
    </app-toolbar>
  `;
    popup.appendChild(message);
    this.moreInfo(Object.keys(this.hass.states)[0]);
    let moreInfo = document.querySelector("home-assistant")._moreInfoEl;
    moreInfo._page = "none";
    moreInfo.shadowRoot.appendChild(popup);
    moreInfo.large = large;
    document.querySelector("home-assistant").provideHass(message);

    setTimeout(() => {
      let interval = setInterval(() => {
        if (moreInfo.getAttribute('aria-hidden')) {
          popup.parentNode.removeChild(popup);
          clearInterval(interval);
        }
      }, 100)
    }, 1000);
  return moreInfo;
  }
  static closePopUp() {
    let moreInfo = document.querySelector("home-assistant")._moreInfoEl;
    if (moreInfo) moreInfo.close()
  }

  static logger(message, script=null) {
    if(!('debug' in this.args(script))) return;

    if(typeof message !== "string")
      message = JSON.stringify(message);
    console.log(`%cDEBUG:%c ${message}`,
      "color: blue; font-weight: bold", "");
  }

});

// Global definition of cardTools
var cardTools = customElements.get('card-tools');

console.info(`%cCARD-TOOLS IS INSTALLED
%cDeviceID: ${customElements.get('card-tools').deviceID}`,
"color: green; font-weight: bold",
"");
