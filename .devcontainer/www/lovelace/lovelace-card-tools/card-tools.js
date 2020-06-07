!(function(e) {
  const t = {};
  function r(n) {
    if (t[n]) return t[n].exports;
    const o = (t[n] = { i: n, l: !1, exports: {} });
    return e[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
  }
  (r.m = e),
    (r.c = t),
    (r.d = function(e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
    }),
    (r.r = function(e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (r.t = function(e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      const n = Object.create(null);
      if ((r.r(n), Object.defineProperty(n, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (const o in e)
          r.d(
            n,
            o,
            function(t) {
              return e[t];
            }.bind(null, o),
          );
      return n;
    }),
    (r.n = function(e) {
      const t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return r.d(t, 'a', t), t;
    }),
    (r.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.p = ''),
    r((r.s = 4));
})([
  function(e, t, r) {
    'use strict';
    function n() {
      return document.querySelector('hc-main')
        ? document.querySelector('hc-main').hass
        : document.querySelector('home-assistant')
        ? document.querySelector('home-assistant').hass
        : void 0;
    }
    function o(e) {
      return document.querySelector('hc-main')
        ? document.querySelector('hc-main').provideHass(e)
        : document.querySelector('home-assistant')
        ? document.querySelector('home-assistant').provideHass(e)
        : void 0;
    }
    function s() {
      let e,
        t = document.querySelector('hc-main');
      return t
        ? (((e = t._lovelaceConfig).current_view = t._lovelacePath), e)
        : (t =
            (t =
              (t =
                (t =
                  ((t =
                    (t =
                      (t =
                        (t = (t = document.querySelector('home-assistant')) && t.shadowRoot) &&
                        t.querySelector('home-assistant-main')) && t.shadowRoot) &&
                    t.querySelector('app-drawer-layout partial-panel-resolver')) &&
                    t.shadowRoot) ||
                  t) && t.querySelector('ha-panel-lovelace')) && t.shadowRoot) && t.querySelector('hui-root'))
        ? (((e = t.lovelace).current_view = t.___curView), e)
        : null;
    }
    function a() {
      let e = document.querySelector('hc-main');
      return (e = e
        ? ((e = (e = (e = e && e.shadowRoot) && e.querySelector('hc-lovelace')) && e.shadowRoot) &&
            e.querySelector('hui-view')) ||
          e.querySelector('hui-panel-view')
        : (e =
            (e =
              (e =
                (e =
                  (e =
                    (e =
                      ((e =
                        (e =
                          (e =
                            (e = (e = document.querySelector('home-assistant')) && e.shadowRoot) &&
                            e.querySelector('home-assistant-main')) && e.shadowRoot) &&
                        e.querySelector('app-drawer-layout partial-panel-resolver')) &&
                        e.shadowRoot) ||
                      e) && e.querySelector('ha-panel-lovelace')) && e.shadowRoot) && e.querySelector('hui-root')) &&
              e.shadowRoot) && e.querySelector('ha-app-layout #view')) && e.firstElementChild);
    }
    function i() {
      if (customElements.get('hui-view')) return !0;
      const e = document.createElement('partial-panel-resolver');
      if (((e.hass = n()), !e.hass || !e.hass.panels)) return !1;
      (e.route = { path: '/lovelace/' }), e._updateRoutes();
      try {
        document.querySelector('home-assistant').appendChild(e);
      } catch (e) {
      } finally {
        document.querySelector('home-assistant').removeChild(e);
      }
      return !!customElements.get('hui-view');
    }
    r.d(t, 'a', function() {
      return n;
    }),
      r.d(t, 'e', function() {
        return o;
      }),
      r.d(t, 'c', function() {
        return s;
      }),
      r.d(t, 'd', function() {
        return a;
      }),
      r.d(t, 'b', function() {
        return i;
      });
  },
  function(e, t, r) {
    'use strict';
    r.d(t, 'a', function() {
      return n;
    });
    const n = (function() {
      if (window.fully && 'function' == typeof fully.getDeviceId) return fully.getDeviceId();
      if (!localStorage['lovelace-player-device-id']) {
        const e = () =>
          Math.floor(1e5 * (1 + Math.random()))
            .toString(16)
            .substring(1);
        localStorage['lovelace-player-device-id'] = `${e()}${e()}-${e()}${e()}`;
      }
      return localStorage['lovelace-player-device-id'];
    })();
  },
  function(module, __webpack_exports__, __webpack_require__) {
    'use strict';
    __webpack_require__.d(__webpack_exports__, 'a', function() {
      return hasOldTemplate;
    }),
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return parseOldTemplate;
      });
    const _hass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
      _deviceID_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
    function hasOldTemplate(e) {
      return /\[\[\s+.*\s+\]\]/.test(e);
    }
    function parseTemplateString(str, specialData = {}) {
      if ('string' != typeof str) return text;
      const FUNCTION = /^[a-zA-Z0-9_]+\(.*\)$/,
        EXPR = /([^=<>!]+)\s*(==|!=|<|>|<=|>=)\s*([^=<>!]+)/,
        SPECIAL = /^\{.+\}$/,
        STRING = /^"[^"]*"|'[^']*'$/;
      'string' == typeof specialData && (specialData = {}),
        (specialData = Object.assign(
          {
            user: Object(_hass_js__WEBPACK_IMPORTED_MODULE_0__.a)().user.name,
            browser: _deviceID_js__WEBPACK_IMPORTED_MODULE_1__.a,
            hash: location.hash.substr(1) || ' ',
          },
          specialData,
        ));
      const _parse_function = e => {
          const t = [e.substr(0, e.indexOf('(')).trim()];
          for (e = e.substr(e.indexOf('(') + 1); e; ) {
            let r = 0,
              n = 0,
              o = !1;
            for (; e[r]; ) {
              const t = e[r++];
              if ((t === o && r > 1 && '\\' !== e[r - 2] ? (o = !1) : '"\''.includes(t) && (o = t), !o)) {
                if ('(' === t) n += 1;
                else if (')' === t) {
                  n -= 1;
                  continue;
                }
                if (!(n > 0) && ',)'.includes(t)) break;
              }
            }
            t.push(e.substr(0, r - 1).trim()), (e = e.substr(r));
          }
          return t;
        },
        _parse_special = e => ((e = e.substr(1, e.length - 2)), specialData[e] || `{${e}}`),
        _parse_entity = e => {
          let t;
          if ((e = e.split('.'))[0].match(SPECIAL))
            (t = _parse_special(e.shift())), (t = Object(_hass_js__WEBPACK_IMPORTED_MODULE_0__.a)().states[t] || t);
          else if (
            ((t = Object(_hass_js__WEBPACK_IMPORTED_MODULE_0__.a)().states[`${e.shift()}.${e.shift()}`]), !e.length)
          )
            return t.state;
          return e.forEach(e => (t = t[e])), t;
        },
        _eval_expr = str => {
          if (((str = EXPR.exec(str)), null === str)) return !1;
          const lhs = parseTemplateString(str[1]),
            rhs = parseTemplateString(str[3]);
          let expr = '';
          return (
            (expr =
              parseFloat(lhs) != lhs
                ? `"${lhs}" ${str[2]} "${rhs}"`
                : `${parseFloat(lhs)} ${str[2]} ${parseFloat(rhs)}`),
            eval(expr)
          );
        },
        _eval_function = e => {
          if ('if' === e[0]) return _eval_expr(e[1]) ? parseTemplateString(e[2]) : parseTemplateString(e[3]);
        };
      try {
        return (
          (str = str.trim()),
          str.match(STRING)
            ? str.substr(1, str.length - 2)
            : str.match(SPECIAL)
            ? _parse_special(str)
            : str.match(FUNCTION)
            ? _eval_function(_parse_function(str))
            : str.includes('.')
            ? _parse_entity(str)
            : str
        );
      } catch (e) {
        return `[[ Template matching failed: ${str} ]]`;
      }
    }
    function parseOldTemplate(e, t = {}) {
      if ('string' != typeof e) return e;
      return (e = e.replace(/\[\[\s(.*?)\s\]\]/g, (e, r, n, o) => parseTemplateString(r, t)));
    }
  },
  function(e) {
    e.exports = JSON.parse(
      '{"name":"card-tools","private":true,"version":"2.1.2","description":"Lovelace Card Tools","scripts":{"build":"webpack","watch":"webpack --watch --mode=development"},"repository":{"type":"git","url":"github.com:thomasloven/card-tools"},"author":"Thomas Lovén","license":"MIT","devDependencies":{"webpack":"^4.43.0","webpack-cli":"^3.3.11"}}',
    );
  },
  function(e, t, r) {
    'use strict';
    r.r(t);
    const n = customElements.get('home-assistant-main')
        ? Object.getPrototypeOf(customElements.get('home-assistant-main'))
        : Object.getPrototypeOf(customElements.get('hui-view')),
      o = n.prototype.html,
      s = n.prototype.css;
    const a = r(0);
    function i(e, t, r = null) {
      if ((((e = new Event(e, { bubbles: !0, cancelable: !1, composed: !0 })).detail = t || {}), r)) r.dispatchEvent(e);
      else {
        const n = Object(a.d)();
        n && n.dispatchEvent(e);
      }
    }
    let c = window.cardHelpers;
    const l = new Promise(async (e, t) => {
      c && e();
      const r = async () => {
        (c = await window.loadCardHelpers()), (window.cardHelpers = c), e();
      };
      window.loadCardHelpers
        ? r()
        : window.addEventListener('load', async () => {
            Object(a.b)(), window.loadCardHelpers && r();
          });
    });
    function u(e, t) {
      const r = document.createElement('hui-error-card');
      return (
        customElements.whenDefined('hui-error-card').then(() => {
          r.setConfig({ type: 'error', error: e, origConfig: t });
        }),
        l.then(() => {
          i('ll-rebuild', {}, r);
        }),
        r
      );
    }
    function d(e, t) {
      if (!t || 'object' != typeof t || !t.type) return u(`No ${e} type configured`, t);
      let r = t.type;
      if (((r = r.startsWith('custom:') ? r.substr('custom:'.length) : `hui-${r}-${e}`), customElements.get(r)))
        return (function(e, t) {
          let r = document.createElement(e);
          try {
            r.setConfig(JSON.parse(JSON.stringify(t)));
          } catch (e) {
            r = u(e, t);
          }
          return (
            l.then(() => {
              i('ll-rebuild', {}, r);
            }),
            r
          );
        })(r, t);
      const n = u(`Custom element doesn't exist: ${r}.`, t);
      n.style.display = 'None';
      const o = setTimeout(() => {
        n.style.display = '';
      }, 2e3);
      return (
        customElements.whenDefined(r).then(() => {
          clearTimeout(o), i('ll-rebuild', {}, n);
        }),
        n
      );
    }
    function p(e) {
      return c ? c.createCardElement(e) : d('card', e);
    }
    function m(e) {
      return c ? c.createHuiElement(e) : d('element', e);
    }
    function h(e) {
      if (c) return c.createRowElement(e);
      const t = new Set(['call-service', 'cast', 'conditional', 'divider', 'section', 'select', 'weblink']);
      if (!e) return u('Invalid configuration given.', e);
      if (('string' == typeof e && (e = { entity: e }), 'object' != typeof e || (!e.entity && !e.type)))
        return u('Invalid configuration given.', e);
      const r = e.type || 'default';
      if (t.has(r) || r.startsWith('custom:')) return d('row', e);
      return d('entity-row', {
        type:
          {
            alert: 'toggle',
            automation: 'toggle',
            climate: 'climate',
            cover: 'cover',
            fan: 'toggle',
            group: 'group',
            input_boolean: 'toggle',
            input_number: 'input-number',
            input_select: 'input-select',
            input_text: 'input-text',
            light: 'toggle',
            lock: 'lock',
            media_player: 'media-player',
            remote: 'toggle',
            scene: 'scene',
            script: 'script',
            sensor: 'sensor',
            timer: 'timer',
            switch: 'toggle',
            vacuum: 'toggle',
            water_heater: 'climate',
            input_datetime: 'input-datetime',
          }[e.entity.split('.', 1)[0]] || 'text',
        ...e,
      });
    }
    class f extends n {
      static get version() {
        return 2;
      }
      static get properties() {
        return { noHass: { type: Boolean } };
      }
      setConfig(e) {
        (this._config = e),
          this.el
            ? this.el.setConfig(e)
            : ((this.el = this.create(e)), this._hass && (this.el.hass = this._hass), this.noHass && Object(a.e)(this));
      }
      set config(e) {
        this.setConfig(e);
      }
      set hass(e) {
        (this._hass = e), this.el && (this.el.hass = e);
      }
      createRenderRoot() {
        return this;
      }
      render() {
        return o`${this.el}`;
      }
    }
    const _ = function(e, t) {
        const r = Object.getOwnPropertyDescriptors(t.prototype);
        for (const [t, n] of Object.entries(r)) 'constructor' !== t && Object.defineProperty(e.prototype, t, n);
        const n = Object.getOwnPropertyDescriptors(t);
        for (const [t, r] of Object.entries(n)) 'prototype' !== t && Object.defineProperty(e, t, r);
        const o = Object.getPrototypeOf(t),
          s = Object.getOwnPropertyDescriptors(o.prototype);
        for (const [t, r] of Object.entries(s))
          'constructor' !== t && Object.defineProperty(Object.getPrototypeOf(e).prototype, t, r);
        const a = Object.getOwnPropertyDescriptors(o);
        for (const [t, r] of Object.entries(a))
          'prototype' !== t && Object.defineProperty(Object.getPrototypeOf(e), t, r);
      },
      g = customElements.get('card-maker');
    if (!g || !g.version || g.version < 2) {
      class e extends f {
        create(e) {
          return p(e);
        }
        getCardSize() {
          return this.firstElementChild && this.firstElementChild.getCardSize
            ? this.firstElementChild.getCardSize()
            : 1;
        }
      }
      g ? _(g, e) : customElements.define('card-maker', e);
    }
    const y = customElements.get('element-maker');
    if (!y || !y.version || y.version < 2) {
      class e extends f {
        create(e) {
          return m(e);
        }
      }
      y ? _(y, e) : customElements.define('element-maker', e);
    }
    const w = customElements.get('entity-row-maker');
    if (!w || !w.version || w.version < 2) {
      class e extends f {
        create(e) {
          return h(e);
        }
      }
      w ? _(w, e) : customElements.define('entity-row-maker', e);
    }
    const b = r(1);
    function v(e, t = {}) {
      return (
        customElements.whenDefined('long-press').then(() => {
          document.body.querySelector('long-press').bind(e);
        }),
        customElements.whenDefined('action-handler').then(() => {
          document.body.querySelector('action-handler').bind(e, t);
        }),
        e
      );
    }
    function O(e, t = !1) {
      const r = document.querySelector('hc-main') || document.querySelector('home-assistant');
      i('hass-more-info', { entityId: e }, r);
      const n = r._moreInfoEl;
      return (n.large = t), n;
    }
    function E() {
      const e = document.querySelector('hc-main') || document.querySelector('home-assistant'),
        t = e && e._moreInfoEl;
      t && t.close();
    }
    function S(e, t, r = !1, n = null, o = !1) {
      const s = document.querySelector('hc-main') || document.querySelector('home-assistant');
      i('hass-more-info', { entityId: null }, s);
      const c = s._moreInfoEl;
      c.close(), c.open();
      const l = c.shadowRoot.querySelector('more-info-controls');
      l && (l.style.display = 'none');
      const u = document.createElement('div');
      u.innerHTML = `\n  <style>\n    app-toolbar {\n      color: var(--more-info-header-color);\n      background-color: var(--more-info-header-background);\n    }\n    .scrollable {\n      overflow: auto;\n      max-width: 100% !important;\n    }\n  </style>\n  ${
        o
          ? ''
          : `\n      <app-toolbar>\n        <ha-icon-button\n          icon="hass:close"\n          dialog-dismiss=""\n          aria-label="Dismiss dialog"\n        ></ha-icon-button>\n        <div class="main-title" main-title="">\n          ${e}\n        </div>\n      </app-toolbar>\n      `
      }\n    <div class="scrollable">\n    </div>\n  `;
      const d = u.querySelector('.scrollable'),
        m = p(t);
      Object(a.e)(m),
        d.appendChild(m),
        m.addEventListener(
          'll-rebuild',
          e => {
            e.stopPropagation();
            const r = p(t);
            Object(a.e)(r), d.replaceChild(r, m);
          },
          { once: !0 },
        ),
        (c.sizingTarget = d),
        (c.large = r),
        (c._page = 'none'),
        c.shadowRoot.appendChild(u);
      const h = {};
      if (n) for (const f in (c.resetFit(), n)) (h[f] = c.style[f]), c.style.setProperty(f, n[f]);
      return (
        (c._dialogOpenChanged = function(e) {
          if (
            !e &&
            (this.stateObj && this.fire('hass-more-info', { entityId: null }), this.shadowRoot == u.parentNode)
          ) {
            (this._page = null), this.shadowRoot.removeChild(u);
            const e = this.shadowRoot.querySelector('more-info-controls');
            if ((e && (e.style.display = 'inline'), n))
              for (const t in (c.resetFit(), h)) h[t] ? c.style.setProperty(t, h[t]) : c.style.removeProperty(t);
          }
        }),
        c
      );
    }
    function C(e, t, r) {
      e || (e = Object(a.a)().connection);
      const n = { user: Object(a.a)().user.name, browser: b.a, hash: location.hash.substr(1) || ' ', ...r.variables },
        o = r.template,
        s = r.entity_ids;
      return e.subscribeMessage(
        e => {
          let r = e.result;
          (r = r.replace(/_\([^)]*\)/g, e => Object(a.a)().localize(e.substring(2, e.length - 1)) || e)), t(r);
        },
        { type: 'render_template', template: o, variables: n, entity_ids: s },
      );
    }
    const j = r(2);
    const D = Object(a.a)().callWS({ type: 'config/area_registry/list' }),
      T = Object(a.a)().callWS({ type: 'config/device_registry/list' }),
      q = Object(a.a)().callWS({ type: 'config/entity_registry/list' });
    async function P() {
      return (
        (window.cardToolsData = window.cardToolsData || { areas: await D, devices: await T, entities: await q }),
        window.cardToolsData
      );
    }
    function R(e) {
      const t = window.cardToolsData;
      for (const r of t.areas) if (r.name.toLowerCase() === e.toLowerCase()) return r;
      return null;
    }
    function I(e) {
      const t = window.cardToolsData;
      const r = [];
      if (!e) return r;
      for (const n of t.devices) n.area_id === e.area_id && r.push(n);
      return r;
    }
    function k(e) {
      const t = window.cardToolsData;
      for (const r of t.devices) if (r.name.toLowerCase() === e.toLowerCase()) return r;
      return null;
    }
    function x(e) {
      const t = window.cardToolsData;
      const r = [];
      if (!e) return r;
      for (const n of t.entities) n.device_id === e.id && r.push(n.entity_id);
      return r;
    }
    function L(e, t) {
      window._registerCard ||
        ((window._customCardButtons = []),
        (window._registerCard = (e, t) => {
          window._customCardButtons.push({ el: e, name: t });
        }),
        customElements.whenDefined('hui-card-picker').then(() => {
          customElements.get('hui-card-picker').prototype.firstUpdated = function() {
            (this._customCardButtons = document.createElement('div')),
              this._customCardButtons.classList.add('cards-container'),
              (this._customCardButtons.id = 'custom'),
              (this._customCardButtons.style.borderTop = '1px solid var(--primary-color)'),
              window._customCardButtons.forEach,
              this.shadowRoot.appendChild(this._customCardButtons),
              window._customCardButtons.forEach(e => {
                const t = document.createElement('mwc-button');
                (t.type = 'custom:' + e.el),
                  (t.innerHTML = e.name),
                  t.addEventListener('click', this._cardPicked),
                  this._customCardButtons.appendChild(t);
              });
          };
        })),
        window._registerCard(e, t);
    }
    P();
    const $ = new Promise(e => {
      document.querySelector('home-assistant').addEventListener(
        'show-dialog',
        async t => {
          t.detail.dialogImport().then(() => {
            const t = document.querySelector('home-assistant').shadowRoot.querySelector('hui-dialog-edit-card');
            t.updateComplete.then(() => {
              t._close(), e();
            });
          });
        },
        { once: !0 },
      ),
        Object(a.d)()._addCard();
    });
    async function M(e) {
      await $;
      const t = document.createElement('hui-card-editor');
      return (t.yaml = e), t.value;
    }
    class B {
      static checkVersion(e) {}
      static args() {}
      static logger() {}
      static get localize() {
        return Object(a.a)().localize;
      }
      static get deviceID() {
        return b.a;
      }
      static get fireEvent() {
        return i;
      }
      static get hass() {
        return Object(a.a)();
      }
      static get lovelace() {
        return Object(a.c)();
      }
      static get lovelace_view() {
        return a.d;
      }
      static get provideHass() {
        return a.e;
      }
      static get LitElement() {
        return n;
      }
      static get LitHtml() {
        return o;
      }
      static get LitCSS() {
        return s;
      }
      static get longpress() {
        return v;
      }
      static get createCard() {
        return p;
      }
      static get createElement() {
        return m;
      }
      static get createEntityRow() {
        return h;
      }
      static get moreInfo() {
        return O;
      }
      static get popUp() {
        return S;
      }
      static get closePopUp() {
        return E;
      }
      static get hasTemplate() {
        return e => {
          return (t = e), !!String(t).includes('{%') || !!String(t).includes('{{') || void 0 || Object(j.a)(e);
          let t;
        };
      }
      static parseTemplate(e, t, r = {}) {
        return 'string' == typeof e
          ? Object(j.b)(e, t)
          : (async function(e, t, r = {}) {
              for (const n in (e || (e = e()),
              (r = {}),
              (r = Object.assign({ user: e.user.name, browser: b.a, hash: location.hash.substr(1) || ' ' }, r)))) {
                const o = new RegExp(`\\{${n}\\}`, 'g');
                t = t.replace(o, r[n]);
              }
              return e.callApi('POST', 'template', { template: t });
            })(e, t, r);
      }
      static get subscribeRenderTemplate() {
        return C;
      }
      static get getData() {
        return P;
      }
      static get areaByName() {
        return R;
      }
      static get areaDevices() {
        return I;
      }
      static get deviceByName() {
        return k;
      }
      static get deviceEntities() {
        return x;
      }
      static get registerCard() {
        return L;
      }
      static get yaml2json() {
        return M;
      }
    }
    const N = r(3);
    customElements.get('card-tools') ||
      (customElements.define('card-tools', B),
      (window.cardTools = customElements.get('card-tools')),
      console.info(
        `%cCARD-TOOLS ${N.version} IS INSTALLED\n  %cDeviceID: ${customElements.get('card-tools').deviceID}`,
        'color: green; font-weight: bold',
        '',
      ));
  },
]);
