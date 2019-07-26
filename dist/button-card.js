function t(t, e, n, i) {
  var s,
      r = arguments.length,
      a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, i);else for (var o = t.length - 1; o >= 0; o--) (s = t[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(e, n, a) : s(e, n)) || a);return r > 3 && a && Object.defineProperty(e, n, a), a;
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
}const e = new WeakMap(),
      n = t => (...n) => {
  const i = t(...n);return e.set(i, !0), i;
},
      i = t => "function" == typeof t && e.has(t),
      s = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
      r = (t, e, n = null) => {
  for (; e !== n;) {
    const n = e.nextSibling;t.removeChild(e), e = n;
  }
},
      a = {},
      o = {},
      c = `{{lit-${String(Math.random()).slice(2)}}}`,
      l = `\x3c!--${c}--\x3e`,
      h = new RegExp(`${c}|${l}`),
      d = "$lit$";class u {
  constructor(t, e) {
    this.parts = [], this.element = e;const n = [],
          i = [],
          s = document.createTreeWalker(e.content, 133, null, !1);let r = 0,
        a = -1,
        o = 0;const { strings: l, values: { length: u } } = t;for (; o < u;) {
      const t = s.nextNode();if (null !== t) {
        if (a++, 1 === t.nodeType) {
          if (t.hasAttributes()) {
            const e = t.attributes,
                  { length: n } = e;let i = 0;for (let t = 0; t < n; t++) p(e[t].name, d) && i++;for (; i-- > 0;) {
              const e = l[o],
                    n = g.exec(e)[2],
                    i = n.toLowerCase() + d,
                    s = t.getAttribute(i);t.removeAttribute(i);const r = s.split(h);this.parts.push({ type: "attribute", index: a, name: n, strings: r }), o += r.length - 1;
            }
          }"TEMPLATE" === t.tagName && (i.push(t), s.currentNode = t.content);
        } else if (3 === t.nodeType) {
          const e = t.data;if (e.indexOf(c) >= 0) {
            const i = t.parentNode,
                  s = e.split(h),
                  r = s.length - 1;for (let e = 0; e < r; e++) {
              let n,
                  r = s[e];if ("" === r) n = m();else {
                const t = g.exec(r);null !== t && p(t[2], d) && (r = r.slice(0, t.index) + t[1] + t[2].slice(0, -d.length) + t[3]), n = document.createTextNode(r);
              }i.insertBefore(n, t), this.parts.push({ type: "node", index: ++a });
            }"" === s[r] ? (i.insertBefore(m(), t), n.push(t)) : t.data = s[r], o += r;
          }
        } else if (8 === t.nodeType) if (t.data === c) {
          const e = t.parentNode;null !== t.previousSibling && a !== r || (a++, e.insertBefore(m(), t)), r = a, this.parts.push({ type: "node", index: a }), null === t.nextSibling ? t.data = "" : (n.push(t), a--), o++;
        } else {
          let e = -1;for (; -1 !== (e = t.data.indexOf(c, e + 1));) this.parts.push({ type: "node", index: -1 }), o++;
        }
      } else s.currentNode = i.pop();
    }for (const t of n) t.parentNode.removeChild(t);
  }
}const p = (t, e) => {
  const n = t.length - e.length;return n >= 0 && t.slice(n) === e;
},
      f = t => -1 !== t.index,
      m = () => document.createComment(""),
      g = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class b {
  constructor(t, e, n) {
    this.__parts = [], this.template = t, this.processor = e, this.options = n;
  }update(t) {
    let e = 0;for (const n of this.__parts) void 0 !== n && n.setValue(t[e]), e++;for (const t of this.__parts) void 0 !== t && t.commit();
  }_clone() {
    const t = s ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
          e = [],
          n = this.template.parts,
          i = document.createTreeWalker(t, 133, null, !1);let r,
        a = 0,
        o = 0,
        c = i.nextNode();for (; a < n.length;) if (r = n[a], f(r)) {
      for (; o < r.index;) o++, "TEMPLATE" === c.nodeName && (e.push(c), i.currentNode = c.content), null === (c = i.nextNode()) && (i.currentNode = e.pop(), c = i.nextNode());if ("node" === r.type) {
        const t = this.processor.handleTextExpression(this.options);t.insertAfterNode(c.previousSibling), this.__parts.push(t);
      } else this.__parts.push(...this.processor.handleAttributeExpressions(c, r.name, r.strings, this.options));a++;
    } else this.__parts.push(void 0), a++;return s && (document.adoptNode(t), customElements.upgrade(t)), t;
  }
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */class _ {
  constructor(t, e, n, i) {
    this.strings = t, this.values = e, this.type = n, this.processor = i;
  }getHTML() {
    const t = this.strings.length - 1;let e = "",
        n = !1;for (let i = 0; i < t; i++) {
      const t = this.strings[i],
            s = t.lastIndexOf("\x3c!--");n = (s > -1 || n) && -1 === t.indexOf("--\x3e", s + 1);const r = g.exec(t);e += null === r ? t + (n ? c : l) : t.substr(0, r.index) + r[1] + r[2] + d + r[3] + c;
    }return e += this.strings[t];
  }getTemplateElement() {
    const t = document.createElement("template");return t.innerHTML = this.getHTML(), t;
  }
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const y = t => null === t || !("object" == typeof t || "function" == typeof t),
      v = t => Array.isArray(t) || !(!t || !t[Symbol.iterator]);class w {
  constructor(t, e, n) {
    this.dirty = !0, this.element = t, this.name = e, this.strings = n, this.parts = [];for (let t = 0; t < n.length - 1; t++) this.parts[t] = this._createPart();
  }_createPart() {
    return new S(this);
  }_getValue() {
    const t = this.strings,
          e = t.length - 1;let n = "";for (let i = 0; i < e; i++) {
      n += t[i];const e = this.parts[i];if (void 0 !== e) {
        const t = e.value;if (y(t) || !v(t)) n += "string" == typeof t ? t : String(t);else for (const e of t) n += "string" == typeof e ? e : String(e);
      }
    }return n += t[e];
  }commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }
}class S {
  constructor(t) {
    this.value = void 0, this.committer = t;
  }setValue(t) {
    t === a || y(t) && t === this.value || (this.value = t, i(t) || (this.committer.dirty = !0));
  }commit() {
    for (; i(this.value);) {
      const t = this.value;this.value = a, t(this);
    }this.value !== a && this.committer.commit();
  }
}class x {
  constructor(t) {
    this.value = void 0, this.__pendingValue = void 0, this.options = t;
  }appendInto(t) {
    this.startNode = t.appendChild(m()), this.endNode = t.appendChild(m());
  }insertAfterNode(t) {
    this.startNode = t, this.endNode = t.nextSibling;
  }appendIntoPart(t) {
    t.__insert(this.startNode = m()), t.__insert(this.endNode = m());
  }insertAfterPart(t) {
    t.__insert(this.startNode = m()), this.endNode = t.endNode, t.endNode = this.startNode;
  }setValue(t) {
    this.__pendingValue = t;
  }commit() {
    for (; i(this.__pendingValue);) {
      const t = this.__pendingValue;this.__pendingValue = a, t(this);
    }const t = this.__pendingValue;t !== a && (y(t) ? t !== this.value && this.__commitText(t) : t instanceof _ ? this.__commitTemplateResult(t) : t instanceof Node ? this.__commitNode(t) : v(t) ? this.__commitIterable(t) : t === o ? (this.value = o, this.clear()) : this.__commitText(t));
  }__insert(t) {
    this.endNode.parentNode.insertBefore(t, this.endNode);
  }__commitNode(t) {
    this.value !== t && (this.clear(), this.__insert(t), this.value = t);
  }__commitText(t) {
    const e = this.startNode.nextSibling,
          n = "string" == typeof (t = null == t ? "" : t) ? t : String(t);e === this.endNode.previousSibling && 3 === e.nodeType ? e.data = n : this.__commitNode(document.createTextNode(n)), this.value = t;
  }__commitTemplateResult(t) {
    const e = this.options.templateFactory(t);if (this.value instanceof b && this.value.template === e) this.value.update(t.values);else {
      const n = new b(e, t.processor, this.options),
            i = n._clone();n.update(t.values), this.__commitNode(i), this.value = n;
    }
  }__commitIterable(t) {
    Array.isArray(this.value) || (this.value = [], this.clear());const e = this.value;let n,
        i = 0;for (const s of t) void 0 === (n = e[i]) && (n = new x(this.options), e.push(n), 0 === i ? n.appendIntoPart(this) : n.insertAfterPart(e[i - 1])), n.setValue(s), n.commit(), i++;i < e.length && (e.length = i, this.clear(n && n.endNode));
  }clear(t = this.startNode) {
    r(this.startNode.parentNode, t.nextSibling, this.endNode);
  }
}class k {
  constructor(t, e, n) {
    if (this.value = void 0, this.__pendingValue = void 0, 2 !== n.length || "" !== n[0] || "" !== n[1]) throw new Error("Boolean attributes can only contain a single expression");this.element = t, this.name = e, this.strings = n;
  }setValue(t) {
    this.__pendingValue = t;
  }commit() {
    for (; i(this.__pendingValue);) {
      const t = this.__pendingValue;this.__pendingValue = a, t(this);
    }if (this.__pendingValue === a) return;const t = !!this.__pendingValue;this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name), this.value = t), this.__pendingValue = a;
  }
}class M extends w {
  constructor(t, e, n) {
    super(t, e, n), this.single = 2 === n.length && "" === n[0] && "" === n[1];
  }_createPart() {
    return new E(this);
  }_getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }
}class E extends S {}let C = !1;try {
  const t = { get capture() {
      return C = !0, !1;
    } };window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}class T {
  constructor(t, e, n) {
    this.value = void 0, this.__pendingValue = void 0, this.element = t, this.eventName = e, this.eventContext = n, this.__boundHandleEvent = t => this.handleEvent(t);
  }setValue(t) {
    this.__pendingValue = t;
  }commit() {
    for (; i(this.__pendingValue);) {
      const t = this.__pendingValue;this.__pendingValue = a, t(this);
    }if (this.__pendingValue === a) return;const t = this.__pendingValue,
          e = this.value,
          n = null == t || null != e && (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive),
          s = null != t && (null == e || n);n && this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options), s && (this.__options = P(t), this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options)), this.value = t, this.__pendingValue = a;
  }handleEvent(t) {
    "function" == typeof this.value ? this.value.call(this.eventContext || this.element, t) : this.value.handleEvent(t);
  }
}const P = t => t && (C ? { capture: t.capture, passive: t.passive, once: t.once } : t.capture);
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */const N = new class {
  handleAttributeExpressions(t, e, n, i) {
    const s = e[0];return "." === s ? new M(t, e.slice(1), n).parts : "@" === s ? [new T(t, e.slice(1), i.eventContext)] : "?" === s ? [new k(t, e.slice(1), n)] : new w(t, e, n).parts;
  }handleTextExpression(t) {
    return new x(t);
  }
}();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function A(t) {
  let e = O.get(t.type);void 0 === e && (e = { stringsArray: new WeakMap(), keyString: new Map() }, O.set(t.type, e));let n = e.stringsArray.get(t.strings);if (void 0 !== n) return n;const i = t.strings.join(c);return void 0 === (n = e.keyString.get(i)) && (n = new u(t, t.getTemplateElement()), e.keyString.set(i, n)), e.stringsArray.set(t.strings, n), n;
}const O = new Map(),
      R = new WeakMap();
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.1.1");const $ = (t, ...e) => new _(t, e, "html", N),
      H = 133;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */function D(t, e) {
  const { element: { content: n }, parts: i } = t,
        s = document.createTreeWalker(n, H, null, !1);let r = L(i),
      a = i[r],
      o = -1,
      c = 0;const l = [];let h = null;for (; s.nextNode();) {
    o++;const t = s.currentNode;for (t.previousSibling === h && (h = null), e.has(t) && (l.push(t), null === h && (h = t)), null !== h && c++; void 0 !== a && a.index === o;) a.index = null !== h ? -1 : a.index - c, a = i[r = L(i, r)];
  }l.forEach(t => t.parentNode.removeChild(t));
}const j = t => {
  let e = 11 === t.nodeType ? 0 : 1;const n = document.createTreeWalker(t, H, null, !1);for (; n.nextNode();) e++;return e;
},
      L = (t, e = -1) => {
  for (let n = e + 1; n < t.length; n++) {
    const e = t[n];if (f(e)) return n;
  }return -1;
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const V = (t, e) => `${t}--${e}`;let I = !0;void 0 === window.ShadyCSS ? I = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."), I = !1);const F = t => e => {
  const n = V(e.type, t);let i = O.get(n);void 0 === i && (i = { stringsArray: new WeakMap(), keyString: new Map() }, O.set(n, i));let s = i.stringsArray.get(e.strings);if (void 0 !== s) return s;const r = e.strings.join(c);if (void 0 === (s = i.keyString.get(r))) {
    const n = e.getTemplateElement();I && window.ShadyCSS.prepareTemplateDom(n, t), s = new u(e, n), i.keyString.set(r, s);
  }return i.stringsArray.set(e.strings, s), s;
},
      Y = ["html", "svg"],
      z = new Set(),
      q = (t, e, n) => {
  z.add(t);const i = n ? n.element : document.createElement("template"),
        s = e.querySelectorAll("style"),
        { length: r } = s;if (0 === r) return void window.ShadyCSS.prepareTemplateStyles(i, t);const a = document.createElement("style");for (let t = 0; t < r; t++) {
    const e = s[t];e.parentNode.removeChild(e), a.textContent += e.textContent;
  }(t => {
    Y.forEach(e => {
      const n = O.get(V(e, t));void 0 !== n && n.keyString.forEach(t => {
        const { element: { content: e } } = t,
              n = new Set();Array.from(e.querySelectorAll("style")).forEach(t => {
          n.add(t);
        }), D(t, n);
      });
    });
  })(t);const o = i.content;n ? function (t, e, n = null) {
    const { element: { content: i }, parts: s } = t;if (null == n) return void i.appendChild(e);const r = document.createTreeWalker(i, H, null, !1);let a = L(s),
        o = 0,
        c = -1;for (; r.nextNode();) for (c++, r.currentNode === n && (o = j(e), n.parentNode.insertBefore(e, n)); -1 !== a && s[a].index === c;) {
      if (o > 0) {
        for (; -1 !== a;) s[a].index += o, a = L(s, a);return;
      }a = L(s, a);
    }
  }(n, a, o.firstChild) : o.insertBefore(a, o.firstChild), window.ShadyCSS.prepareTemplateStyles(i, t);const c = o.querySelector("style");if (window.ShadyCSS.nativeShadow && null !== c) e.insertBefore(c.cloneNode(!0), e.firstChild);else if (n) {
    o.insertBefore(a, o.firstChild);const t = new Set();t.add(a), D(n, t);
  }
};
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
window.JSCompiler_renameProperty = (t, e) => t;const U = { toAttribute(t, e) {
    switch (e) {case Boolean:
        return t ? "" : null;case Object:case Array:
        return null == t ? t : JSON.stringify(t);}return t;
  }, fromAttribute(t, e) {
    switch (e) {case Boolean:
        return null !== t;case Number:
        return null === t ? null : Number(t);case Object:case Array:
        return JSON.parse(t);}return t;
  } },
      B = (t, e) => e !== t && (e == e || t == t),
      W = { attribute: !0, type: String, converter: U, reflect: !1, hasChanged: B },
      G = Promise.resolve(!0),
      J = 1,
      Z = 4,
      X = 8,
      K = 16,
      Q = 32;class tt extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = G, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
  }static get observedAttributes() {
    this.finalize();const t = [];return this._classProperties.forEach((e, n) => {
      const i = this._attributeNameForProperty(n, e);void 0 !== i && (this._attributeToPropertyMap.set(i, n), t.push(i));
    }), t;
  }static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = new Map();const t = Object.getPrototypeOf(this)._classProperties;void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
    }
  }static createProperty(t, e = W) {
    if (this._ensureClassProperties(), this._classProperties.set(t, e), e.noAccessor || this.prototype.hasOwnProperty(t)) return;const n = "symbol" == typeof t ? Symbol() : `__${t}`;Object.defineProperty(this.prototype, t, { get() {
        return this[n];
      }, set(e) {
        const i = this[t];this[n] = e, this._requestUpdate(t, i);
      }, configurable: !0, enumerable: !0 });
  }static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this)) && this.finalized) return;const t = Object.getPrototypeOf(this);if ("function" == typeof t.finalize && t.finalize(), this.finalized = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map(), this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const t = this.properties,
            e = [...Object.getOwnPropertyNames(t), ...("function" == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t) : [])];for (const n of e) this.createProperty(n, t[n]);
    }
  }static _attributeNameForProperty(t, e) {
    const n = e.attribute;return !1 === n ? void 0 : "string" == typeof n ? n : "string" == typeof t ? t.toLowerCase() : void 0;
  }static _valueHasChanged(t, e, n = B) {
    return n(t, e);
  }static _propertyValueFromAttribute(t, e) {
    const n = e.type,
          i = e.converter || U,
          s = "function" == typeof i ? i : i.fromAttribute;return s ? s(t, n) : t;
  }static _propertyValueToAttribute(t, e) {
    if (void 0 === e.reflect) return;const n = e.type,
          i = e.converter;return (i && i.toAttribute || U.toAttribute)(t, n);
  }initialize() {
    this._saveInstanceProperties(), this._requestUpdate();
  }_saveInstanceProperties() {
    this.constructor._classProperties.forEach((t, e) => {
      if (this.hasOwnProperty(e)) {
        const t = this[e];delete this[e], this._instanceProperties || (this._instanceProperties = new Map()), this._instanceProperties.set(e, t);
      }
    });
  }_applyInstanceProperties() {
    this._instanceProperties.forEach((t, e) => this[e] = t), this._instanceProperties = void 0;
  }connectedCallback() {
    this._updateState = this._updateState | Q, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
  }disconnectedCallback() {}attributeChangedCallback(t, e, n) {
    e !== n && this._attributeToProperty(t, n);
  }_propertyToAttribute(t, e, n = W) {
    const i = this.constructor,
          s = i._attributeNameForProperty(t, n);if (void 0 !== s) {
      const t = i._propertyValueToAttribute(e, n);if (void 0 === t) return;this._updateState = this._updateState | X, null == t ? this.removeAttribute(s) : this.setAttribute(s, t), this._updateState = this._updateState & ~X;
    }
  }_attributeToProperty(t, e) {
    if (this._updateState & X) return;const n = this.constructor,
          i = n._attributeToPropertyMap.get(t);if (void 0 !== i) {
      const t = n._classProperties.get(i) || W;this._updateState = this._updateState | K, this[i] = n._propertyValueFromAttribute(e, t), this._updateState = this._updateState & ~K;
    }
  }_requestUpdate(t, e) {
    let n = !0;if (void 0 !== t) {
      const i = this.constructor,
            s = i._classProperties.get(t) || W;i._valueHasChanged(this[t], e, s.hasChanged) ? (this._changedProperties.has(t) || this._changedProperties.set(t, e), !0 !== s.reflect || this._updateState & K || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(t, s))) : n = !1;
    }!this._hasRequestedUpdate && n && this._enqueueUpdate();
  }requestUpdate(t, e) {
    return this._requestUpdate(t, e), this.updateComplete;
  }async _enqueueUpdate() {
    let t, e;this._updateState = this._updateState | Z;const n = this._updatePromise;this._updatePromise = new Promise((n, i) => {
      t = n, e = i;
    });try {
      await n;
    } catch (t) {}this._hasConnected || (await new Promise(t => this._hasConnectedResolver = t));try {
      const t = this.performUpdate();null != t && (await t);
    } catch (t) {
      e(t);
    }t(!this._hasRequestedUpdate);
  }get _hasConnected() {
    return this._updateState & Q;
  }get _hasRequestedUpdate() {
    return this._updateState & Z;
  }get hasUpdated() {
    return this._updateState & J;
  }performUpdate() {
    this._instanceProperties && this._applyInstanceProperties();let t = !1;const e = this._changedProperties;try {
      (t = this.shouldUpdate(e)) && this.update(e);
    } catch (e) {
      throw t = !1, e;
    } finally {
      this._markUpdated();
    }t && (this._updateState & J || (this._updateState = this._updateState | J, this.firstUpdated(e)), this.updated(e));
  }_markUpdated() {
    this._changedProperties = new Map(), this._updateState = this._updateState & ~Z;
  }get updateComplete() {
    return this._updatePromise;
  }shouldUpdate(t) {
    return !0;
  }update(t) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)), this._reflectingProperties = void 0);
  }updated(t) {}firstUpdated(t) {}
}tt.finalized = !0;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const et = (t, e) => "method" !== e.kind || !e.descriptor || "value" in e.descriptor ? { kind: "field", key: Symbol(), placement: "own", descriptor: {}, initializer() {
    "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
  }, finisher(n) {
    n.createProperty(e.key, t);
  } } : Object.assign({}, e, { finisher(n) {
    n.createProperty(e.key, t);
  } }),
      nt = (t, e, n) => {
  e.constructor.createProperty(n, t);
};function it(t) {
  return (e, n) => void 0 !== n ? nt(t, e, n) : et(t, e);
}
/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/const st = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      rt = Symbol();class at {
  constructor(t, e) {
    if (e !== rt) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText = t;
  }get styleSheet() {
    return void 0 === this._styleSheet && (st ? (this._styleSheet = new CSSStyleSheet(), this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
  }toString() {
    return this.cssText;
  }
}
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
(window.litElementVersions || (window.litElementVersions = [])).push("2.2.0");const ot = t => t.flat ? t.flat(1 / 0) : function t(e, n = []) {
  for (let i = 0, s = e.length; i < s; i++) {
    const s = e[i];Array.isArray(s) ? t(s, n) : n.push(s);
  }return n;
}(t);class ct extends tt {
  static finalize() {
    super.finalize(), this._styles = this.hasOwnProperty(JSCompiler_renameProperty("styles", this)) ? this._getUniqueStyles() : this._styles || [];
  }static _getUniqueStyles() {
    const t = this.styles,
          e = [];if (Array.isArray(t)) {
      ot(t).reduceRight((t, e) => (t.add(e), t), new Set()).forEach(t => e.unshift(t));
    } else t && e.push(t);return e;
  }initialize() {
    super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }createRenderRoot() {
    return this.attachShadow({ mode: "open" });
  }adoptStyles() {
    const t = this.constructor._styles;0 !== t.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? st ? this.renderRoot.adoptedStyleSheets = t.map(t => t.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t => t.cssText), this.localName));
  }connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }update(t) {
    super.update(t);const e = this.render();e instanceof _ && this.constructor.render(e, this.renderRoot, { scopeName: this.localName, eventContext: this }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(t => {
      const e = document.createElement("style");e.textContent = t.cssText, this.renderRoot.appendChild(e);
    }));
  }render() {}
}ct.finalized = !0, ct.render = (t, e, n) => {
  if (!n || "object" != typeof n || !n.scopeName) throw new Error("The `scopeName` option is required.");const i = n.scopeName,
        s = R.has(e),
        a = I && 11 === e.nodeType && !!e.host,
        o = a && !z.has(i),
        c = o ? document.createDocumentFragment() : e;if (((t, e, n) => {
    let i = R.get(e);void 0 === i && (r(e, e.firstChild), R.set(e, i = new x(Object.assign({ templateFactory: A }, n))), i.appendInto(e)), i.setValue(t), i.commit();
  })(t, c, Object.assign({ templateFactory: F(i) }, n)), o) {
    const t = R.get(c);R.delete(c);const n = t.value instanceof b ? t.value.template : void 0;q(i, c, n), r(e, e.firstChild), e.appendChild(c), R.set(e, t);
  }!s && a && window.ShadyCSS.styleElement(e.host);
};
/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const lt = new WeakMap(),
      ht = n(t => e => {
  if (!(e instanceof S) || e instanceof E || "style" !== e.committer.name || e.committer.parts.length > 1) throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");const { committer: n } = e,
        { style: i } = n.element;lt.has(e) || (i.cssText = n.strings.join(" "));const s = lt.get(e);for (const e in s) e in t || (-1 === e.indexOf("-") ? i[e] = null : i.removeProperty(e));for (const e in t) -1 === e.indexOf("-") ? i[e] = t[e] : i.setProperty(e, t[e]);lt.set(e, t);
}),
      dt = new WeakMap(),
      ut = n(t => e => {
  if (!(e instanceof x)) throw new Error("unsafeHTML can only be used in text bindings");const n = dt.get(e);if (void 0 !== n && y(t) && t === n.value && e.value === n.fragment) return;const i = document.createElement("template");i.innerHTML = t;const s = document.importNode(i.content, !0);e.setValue(s), dt.set(e, { value: t, fragment: s });
}),
      pt = n(t => e => {
  if (void 0 === t && e instanceof S) {
    if (t !== e.value) {
      const t = e.committer.name;e.committer.element.removeAttribute(t);
    }
  } else e.setValue(t);
}),
      ft = new WeakMap(),
      mt = n(t => e => {
  if (!(e instanceof S) || e instanceof E || "class" !== e.committer.name || e.committer.parts.length > 1) throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");const { committer: n } = e,
        { element: i } = n;ft.has(e) || (i.className = n.strings.join(" "));const { classList: s } = i,
        r = ft.get(e);for (const e in r) e in t || s.remove(e);for (const e in t) {
    const n = t[e];if (!r || n !== r[e]) {
      s[n ? "add" : "remove"](e);
    }
  }ft.set(e, t);
});var gt = {},
    bt = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
    _t = "[^\\s]+",
    yt = /\[([^]*?)\]/gm,
    vt = function () {};function wt(t, e) {
  for (var n = [], i = 0, s = t.length; i < s; i++) n.push(t[i].substr(0, e));return n;
}function St(t) {
  return function (e, n, i) {
    var s = i[t].indexOf(n.charAt(0).toUpperCase() + n.substr(1).toLowerCase());~s && (e.month = s);
  };
}function xt(t, e) {
  for (t = String(t), e = e || 2; t.length < e;) t = "0" + t;return t;
}var kt = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    Mt = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    Et = wt(Mt, 3),
    Ct = wt(kt, 3);gt.i18n = { dayNamesShort: Ct, dayNames: kt, monthNamesShort: Et, monthNames: Mt, amPm: ["am", "pm"], DoFn: function (t) {
    return t + ["th", "st", "nd", "rd"][t % 10 > 3 ? 0 : (t - t % 10 != 10) * t % 10];
  } };var Tt = { D: function (t) {
    return t.getDate();
  }, DD: function (t) {
    return xt(t.getDate());
  }, Do: function (t, e) {
    return e.DoFn(t.getDate());
  }, d: function (t) {
    return t.getDay();
  }, dd: function (t) {
    return xt(t.getDay());
  }, ddd: function (t, e) {
    return e.dayNamesShort[t.getDay()];
  }, dddd: function (t, e) {
    return e.dayNames[t.getDay()];
  }, M: function (t) {
    return t.getMonth() + 1;
  }, MM: function (t) {
    return xt(t.getMonth() + 1);
  }, MMM: function (t, e) {
    return e.monthNamesShort[t.getMonth()];
  }, MMMM: function (t, e) {
    return e.monthNames[t.getMonth()];
  }, YY: function (t) {
    return xt(String(t.getFullYear()), 4).substr(2);
  }, YYYY: function (t) {
    return xt(t.getFullYear(), 4);
  }, h: function (t) {
    return t.getHours() % 12 || 12;
  }, hh: function (t) {
    return xt(t.getHours() % 12 || 12);
  }, H: function (t) {
    return t.getHours();
  }, HH: function (t) {
    return xt(t.getHours());
  }, m: function (t) {
    return t.getMinutes();
  }, mm: function (t) {
    return xt(t.getMinutes());
  }, s: function (t) {
    return t.getSeconds();
  }, ss: function (t) {
    return xt(t.getSeconds());
  }, S: function (t) {
    return Math.round(t.getMilliseconds() / 100);
  }, SS: function (t) {
    return xt(Math.round(t.getMilliseconds() / 10), 2);
  }, SSS: function (t) {
    return xt(t.getMilliseconds(), 3);
  }, a: function (t, e) {
    return t.getHours() < 12 ? e.amPm[0] : e.amPm[1];
  }, A: function (t, e) {
    return t.getHours() < 12 ? e.amPm[0].toUpperCase() : e.amPm[1].toUpperCase();
  }, ZZ: function (t) {
    var e = t.getTimezoneOffset();return (e > 0 ? "-" : "+") + xt(100 * Math.floor(Math.abs(e) / 60) + Math.abs(e) % 60, 4);
  } },
    Pt = { D: ["\\d\\d?", function (t, e) {
    t.day = e;
  }], Do: ["\\d\\d?" + _t, function (t, e) {
    t.day = parseInt(e, 10);
  }], M: ["\\d\\d?", function (t, e) {
    t.month = e - 1;
  }], YY: ["\\d\\d?", function (t, e) {
    var n = +("" + new Date().getFullYear()).substr(0, 2);t.year = "" + (e > 68 ? n - 1 : n) + e;
  }], h: ["\\d\\d?", function (t, e) {
    t.hour = e;
  }], m: ["\\d\\d?", function (t, e) {
    t.minute = e;
  }], s: ["\\d\\d?", function (t, e) {
    t.second = e;
  }], YYYY: ["\\d{4}", function (t, e) {
    t.year = e;
  }], S: ["\\d", function (t, e) {
    t.millisecond = 100 * e;
  }], SS: ["\\d{2}", function (t, e) {
    t.millisecond = 10 * e;
  }], SSS: ["\\d{3}", function (t, e) {
    t.millisecond = e;
  }], d: ["\\d\\d?", vt], ddd: [_t, vt], MMM: [_t, St("monthNamesShort")], MMMM: [_t, St("monthNames")], a: [_t, function (t, e, n) {
    var i = e.toLowerCase();i === n.amPm[0] ? t.isPm = !1 : i === n.amPm[1] && (t.isPm = !0);
  }], ZZ: ["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z", function (t, e) {
    var n,
        i = (e + "").match(/([+-]|\d\d)/gi);i && (n = 60 * i[1] + parseInt(i[2], 10), t.timezoneOffset = "+" === i[0] ? n : -n);
  }] };function Nt(t) {
  var e = t.split(":").map(Number);return 3600 * e[0] + 60 * e[1] + e[2];
}Pt.dd = Pt.d, Pt.dddd = Pt.ddd, Pt.DD = Pt.D, Pt.mm = Pt.m, Pt.hh = Pt.H = Pt.HH = Pt.h, Pt.MM = Pt.M, Pt.ss = Pt.s, Pt.A = Pt.a, gt.masks = { default: "ddd MMM DD YYYY HH:mm:ss", shortDate: "M/D/YY", mediumDate: "MMM D, YYYY", longDate: "MMMM D, YYYY", fullDate: "dddd, MMMM D, YYYY", shortTime: "HH:mm", mediumTime: "HH:mm:ss", longTime: "HH:mm:ss.SSS" }, gt.format = function (t, e, n) {
  var i = n || gt.i18n;if ("number" == typeof t && (t = new Date(t)), "[object Date]" !== Object.prototype.toString.call(t) || isNaN(t.getTime())) throw new Error("Invalid Date in fecha.format");e = gt.masks[e] || e || gt.masks.default;var s = [];return (e = (e = e.replace(yt, function (t, e) {
    return s.push(e), "@@@";
  })).replace(bt, function (e) {
    return e in Tt ? Tt[e](t, i) : e.slice(1, e.length - 1);
  })).replace(/@@@/g, function () {
    return s.shift();
  });
}, gt.parse = function (t, e, n) {
  var i = n || gt.i18n;if ("string" != typeof e) throw new Error("Invalid format in fecha.parse");if (e = gt.masks[e] || e, t.length > 1e3) return null;var s = {},
      r = [],
      a = [];e = e.replace(yt, function (t, e) {
    return a.push(e), "@@@";
  });var o,
      c = (o = e, o.replace(/[|\\{()[^$+*?.-]/g, "\\$&")).replace(bt, function (t) {
    if (Pt[t]) {
      var e = Pt[t];return r.push(e[1]), "(" + e[0] + ")";
    }return t;
  });c = c.replace(/@@@/g, function () {
    return a.shift();
  });var l = t.match(new RegExp(c, "i"));if (!l) return null;for (var h = 1; h < l.length; h++) r[h - 1](s, l[h], i);var d,
      u = new Date();return !0 === s.isPm && null != s.hour && 12 != +s.hour ? s.hour = +s.hour + 12 : !1 === s.isPm && 12 == +s.hour && (s.hour = 0), null != s.timezoneOffset ? (s.minute = +(s.minute || 0) - +s.timezoneOffset, d = new Date(Date.UTC(s.year || u.getFullYear(), s.month || 0, s.day || 1, s.hour || 0, s.minute || 0, s.second || 0, s.millisecond || 0))) : d = new Date(s.year || u.getFullYear(), s.month || 0, s.day || 1, s.hour || 0, s.minute || 0, s.second || 0, s.millisecond || 0), d;
};(function () {
  try {
    new Date().toLocaleDateString("i");
  } catch (t) {
    return "RangeError" === t.name;
  }
})(), function () {
  try {
    new Date().toLocaleString("i");
  } catch (t) {
    return "RangeError" === t.name;
  }
}(), function () {
  try {
    new Date().toLocaleTimeString("i");
  } catch (t) {
    return "RangeError" === t.name;
  }
}();var At = function (t) {
  return t < 10 ? "0" + t : t;
};var Ot = "hass:bookmark",
    Rt = ["closed", "locked", "off"],
    $t = function (t, e, n, i) {
  i = i || {}, n = null == n ? {} : n;var s = new Event(e, { bubbles: void 0 === i.bubbles || i.bubbles, cancelable: Boolean(i.cancelable), composed: void 0 === i.composed || i.composed });return s.detail = n, t.dispatchEvent(s), s;
},
    Ht = { alert: "hass:alert", automation: "hass:playlist-play", calendar: "hass:calendar", camera: "hass:video", climate: "hass:thermostat", configurator: "hass:settings", conversation: "hass:text-to-speech", device_tracker: "hass:account", fan: "hass:fan", group: "hass:google-circles-communities", history_graph: "hass:chart-line", homeassistant: "hass:home-assistant", homekit: "hass:home-automation", image_processing: "hass:image-filter-frames", input_boolean: "hass:drawing", input_datetime: "hass:calendar-clock", input_number: "hass:ray-vertex", input_select: "hass:format-list-bulleted", input_text: "hass:textbox", light: "hass:lightbulb", mailbox: "hass:mailbox", notify: "hass:comment-alert", person: "hass:account", plant: "hass:flower", proximity: "hass:apple-safari", remote: "hass:remote", scene: "hass:google-pages", script: "hass:file-document", sensor: "hass:eye", simple_alarm: "hass:bell", sun: "hass:white-balance-sunny", switch: "hass:flash", timer: "hass:timer", updater: "hass:cloud-upload", vacuum: "hass:robot-vacuum", water_heater: "hass:thermometer", weblink: "hass:open-in-new" };var Dt = function (t, e) {
  $t(t, "haptic", e);
},
    jt = function (t, e, n, i, s) {
  var r;switch (s && n.dbltap_action ? r = n.dbltap_action : i && n.hold_action ? r = n.hold_action : !i && n.tap_action && (r = n.tap_action), r || (r = { action: "more-info" }), r.action) {case "more-info":
      (n.entity || n.camera_image) && ($t(t, "hass-more-info", { entityId: r.entity ? r.entity : n.entity ? n.entity : n.camera_image }), r.haptic && Dt(t, r.haptic));break;case "navigate":
      r.navigation_path && (function (t, e, n) {
        void 0 === n && (n = !1), n ? history.replaceState(null, "", e) : history.pushState(null, "", e), $t(window, "location-changed", { replace: n });
      }(0, r.navigation_path), r.haptic && Dt(t, r.haptic));break;case "url":
      r.url && window.open(r.url), r.haptic && Dt(t, r.haptic);break;case "toggle":
      n.entity && (function (t, e) {
        (function (t, e, n) {
          void 0 === n && (n = !0);var i,
              s = function (t) {
            return t.substr(0, t.indexOf("."));
          }(e),
              r = "group" === s ? "homeassistant" : s;switch (s) {case "lock":
              i = n ? "unlock" : "lock";break;case "cover":
              i = n ? "open_cover" : "close_cover";break;default:
              i = n ? "turn_on" : "turn_off";}t.callService(r, i, { entity_id: e });
        })(t, e, Rt.includes(t.states[e].state));
      }(e, n.entity), r.haptic && Dt(t, r.haptic));break;case "call-service":
      if (!r.service) return;var a = r.service.split(".", 2),
          o = a[0],
          c = a[1],
          l = Object.assign({}, r.service_data);"entity" === l.entity_id && (l.entity_id = n.entity), e.callService(o, c, l), r.haptic && Dt(t, r.haptic);}
};String(Math.random()).slice(2);try {
  const t = { get capture() {
      return !1;
    } };window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");var Lt = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    Vt = function (t) {
  function e() {
    t.call(this), this.holdTime = 500, this.ripple = document.createElement("paper-ripple"), this.timer = void 0, this.held = !1, this.cooldownStart = !1, this.cooldownEnd = !1, this.nbClicks = 0;
  }return t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e, e.prototype.connectedCallback = function () {
    var t = this;Object.assign(this.style, { borderRadius: "50%", position: "absolute", width: Lt ? "100px" : "50px", height: Lt ? "100px" : "50px", transform: "translate(-50%, -50%)", pointerEvents: "none" }), this.appendChild(this.ripple), this.ripple.style.color = "#03a9f4", this.ripple.style.color = "var(--primary-color)", ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(function (e) {
      document.addEventListener(e, function () {
        clearTimeout(t.timer), t.stopAnimation(), t.timer = void 0;
      }, { passive: !0 });
    });
  }, e.prototype.bind = function (t) {
    var e = this;if (!t.longPress) {
      t.longPress = !0, t.addEventListener("contextmenu", function (t) {
        var e = t || window.event;return e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, !1;
      });var n = function (n) {
        var i, s;e.cooldownStart || (e.held = !1, n.touches ? (i = n.touches[0].pageX, s = n.touches[0].pageY) : (i = n.pageX, s = n.pageY), e.timer = window.setTimeout(function () {
          e.startAnimation(i, s), e.held = !0, t.repeat && !t.isRepeating && (t.isRepeating = !0, e.repeatTimeout = setInterval(function () {
            t.dispatchEvent(new Event("ha-hold"));
          }, t.repeat));
        }, e.holdTime), e.cooldownStart = !0, window.setTimeout(function () {
          return e.cooldownStart = !1;
        }, 100));
      },
          i = function (n) {
        e.cooldownEnd || ["touchend", "touchcancel"].includes(n.type) && void 0 === e.timer ? t.isRepeating && e.repeatTimeout && (clearInterval(e.repeatTimeout), t.isRepeating = !1) : (clearTimeout(e.timer), t.isRepeating && e.repeatTimeout && clearInterval(e.repeatTimeout), t.isRepeating = !1, e.stopAnimation(), e.timer = void 0, e.held ? t.repeat || t.dispatchEvent(new Event("ha-hold")) : t.hasDblClick ? 0 === e.nbClicks ? (e.nbClicks += 1, e.dblClickTimeout = window.setTimeout(function () {
          1 === e.nbClicks && (e.nbClicks = 0, t.dispatchEvent(new Event("ha-click")));
        }, 250)) : (e.nbClicks = 0, clearTimeout(e.dblClickTimeout), t.dispatchEvent(new Event("ha-dblclick"))) : t.dispatchEvent(new Event("ha-click")), e.cooldownEnd = !0, window.setTimeout(function () {
          return e.cooldownEnd = !1;
        }, 100));
      };t.addEventListener("touchstart", n, { passive: !0 }), t.addEventListener("touchend", i), t.addEventListener("touchcancel", i), t.addEventListener("mousedown", n, { passive: !0 }), t.addEventListener("click", i);
    }
  }, e.prototype.startAnimation = function (t, e) {
    Object.assign(this.style, { left: t + "px", top: e + "px", display: null }), this.ripple.holdDown = !0, this.ripple.simulatedRipple();
  }, e.prototype.stopAnimation = function () {
    this.ripple.holdDown = !1, this.style.display = "none";
  }, e;
}(HTMLElement);customElements.get("long-press-custom-card-helpers") || customElements.define("long-press-custom-card-helpers", Vt);const It = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;customElements.define("long-press-button-card", class extends HTMLElement {
  constructor() {
    super(), this.holdTime = 500, this.ripple = document.createElement("paper-ripple"), this.timer = void 0, this.held = !1, this.cooldownStart = !1, this.cooldownEnd = !1, this.nbClicks = 0;
  }connectedCallback() {
    Object.assign(this.style, { borderRadius: "50%", position: "absolute", width: It ? "100px" : "50px", height: It ? "100px" : "50px", transform: "translate(-50%, -50%)", pointerEvents: "none" }), this.appendChild(this.ripple), this.ripple.style.color = "#03a9f4", this.ripple.style.color = "var(--primary-color)", ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(t => {
      document.addEventListener(t, () => {
        clearTimeout(this.timer), this.stopAnimation(), this.timer = void 0;
      }, { passive: !0 });
    });
  }bind(t) {
    if (t.longPress) return;t.longPress = !0, t.addEventListener("contextmenu", t => {
      const e = t || window.event;return e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, !1;
    });const e = e => {
      if (e.stopPropagation(), this.cooldownStart) return;let n, i;this.held = !1, e.touches ? (n = e.touches[0].pageX, i = e.touches[0].pageY) : (n = e.pageX, i = e.pageY), this.timer = window.setTimeout(() => {
        this.startAnimation(n, i), this.held = !0, t.repeat && !t.isRepeating && (t.isRepeating = !0, this.repeatTimeout = setInterval(() => {
          t.dispatchEvent(new Event("ha-hold"));
        }, t.repeat));
      }, this.holdTime), this.cooldownStart = !0, window.setTimeout(() => this.cooldownStart = !1, 100);
    },
          n = e => {
      e.stopPropagation(), this.cooldownEnd || ["touchend", "touchcancel"].includes(e.type) && void 0 === this.timer ? t.isRepeating && this.repeatTimeout && (clearInterval(this.repeatTimeout), t.isRepeating = !1) : (clearTimeout(this.timer), t.isRepeating && this.repeatTimeout && clearInterval(this.repeatTimeout), t.isRepeating = !1, this.stopAnimation(), this.timer = void 0, this.held ? t.repeat || t.dispatchEvent(new Event("ha-hold")) : t.hasDblClick ? 0 === this.nbClicks ? (this.nbClicks += 1, this.dblClickTimeout = window.setTimeout(() => {
        1 === this.nbClicks && (this.nbClicks = 0, t.dispatchEvent(new Event("ha-click")));
      }, 250)) : (this.nbClicks = 0, clearTimeout(this.dblClickTimeout), t.dispatchEvent(new Event("ha-dblclick"))) : t.dispatchEvent(new Event("ha-click")), this.cooldownEnd = !0, window.setTimeout(() => this.cooldownEnd = !1, 100));
    };t.addEventListener("touchstart", e, { passive: !0 }), t.addEventListener("touchend", n), t.addEventListener("touchcancel", n), t.addEventListener("mousedown", e, { passive: !0 }), t.addEventListener("click", n);
  }startAnimation(t, e) {
    Object.assign(this.style, { left: `${t}px`, top: `${e}px`, display: null }), this.ripple.holdDown = !0, this.ripple.simulatedRipple();
  }stopAnimation() {
    this.ripple.holdDown = !1, this.style.display = "none";
  }
});const Ft = t => {
  const e = (() => {
    const t = document.body;if (t.querySelector("long-press-button-card")) return t.querySelector("long-press-button-card");const e = document.createElement("long-press-button-card");return t.appendChild(e), e;
  })();e && e.bind(t);
},
      Yt = n(() => t => {
  Ft(t.committer.element);
});function zt(t, e) {
  (function (t) {
    return "string" == typeof t && t.includes(".") && 1 === parseFloat(t);
  })(t) && (t = "100%");var n = function (t) {
    return "string" == typeof t && t.includes("%");
  }(t);return t = 360 === e ? t : Math.min(e, Math.max(0, parseFloat(t))), n && (t = parseInt(String(t * e), 10) / 100), Math.abs(t - e) < 1e-6 ? 1 : t = 360 === e ? (t < 0 ? t % e + e : t % e) / parseFloat(String(e)) : t % e / parseFloat(String(e));
}function qt(t) {
  return Math.min(1, Math.max(0, t));
}function Ut(t) {
  return t = parseFloat(t), (isNaN(t) || t < 0 || t > 1) && (t = 1), t;
}function Bt(t) {
  return t <= 1 ? 100 * Number(t) + "%" : t;
}function Wt(t) {
  return 1 === t.length ? "0" + t : String(t);
}function Gt(t, e, n) {
  t = zt(t, 255), e = zt(e, 255), n = zt(n, 255);var i = Math.max(t, e, n),
      s = Math.min(t, e, n),
      r = 0,
      a = 0,
      o = (i + s) / 2;if (i === s) a = 0, r = 0;else {
    var c = i - s;switch (a = o > .5 ? c / (2 - i - s) : c / (i + s), i) {case t:
        r = (e - n) / c + (e < n ? 6 : 0);break;case e:
        r = (n - t) / c + 2;break;case n:
        r = (t - e) / c + 4;}r /= 6;
  }return { h: r, s: a, l: o };
}function Jt(t, e, n) {
  t = zt(t, 255), e = zt(e, 255), n = zt(n, 255);var i = Math.max(t, e, n),
      s = Math.min(t, e, n),
      r = 0,
      a = i,
      o = i - s,
      c = 0 === i ? 0 : o / i;if (i === s) r = 0;else {
    switch (i) {case t:
        r = (e - n) / o + (e < n ? 6 : 0);break;case e:
        r = (n - t) / o + 2;break;case n:
        r = (t - e) / o + 4;}r /= 6;
  }return { h: r, s: c, v: a };
}function Zt(t, e, n, i) {
  var s = [Wt(Math.round(t).toString(16)), Wt(Math.round(e).toString(16)), Wt(Math.round(n).toString(16))];return i && s[0].charAt(0) === s[0].charAt(1) && s[1].charAt(0) === s[1].charAt(1) && s[2].charAt(0) === s[2].charAt(1) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("");
}function Xt(t) {
  return Kt(t) / 255;
}function Kt(t) {
  return parseInt(t, 16);
}var Qt = { aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", rebeccapurple: "#663399", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32" };function te(t) {
  var e,
      n,
      i,
      s = { r: 0, g: 0, b: 0 },
      r = 1,
      a = null,
      o = null,
      c = null,
      l = !1,
      h = !1;return "string" == typeof t && (t = function (t) {
    if (0 === (t = t.trim().toLowerCase()).length) return !1;var e = !1;if (Qt[t]) t = Qt[t], e = !0;else if ("transparent" === t) return { r: 0, g: 0, b: 0, a: 0, format: "name" };var n = se.rgb.exec(t);if (n) return { r: n[1], g: n[2], b: n[3] };if (n = se.rgba.exec(t)) return { r: n[1], g: n[2], b: n[3], a: n[4] };if (n = se.hsl.exec(t)) return { h: n[1], s: n[2], l: n[3] };if (n = se.hsla.exec(t)) return { h: n[1], s: n[2], l: n[3], a: n[4] };if (n = se.hsv.exec(t)) return { h: n[1], s: n[2], v: n[3] };if (n = se.hsva.exec(t)) return { h: n[1], s: n[2], v: n[3], a: n[4] };if (n = se.hex8.exec(t)) return { r: Kt(n[1]), g: Kt(n[2]), b: Kt(n[3]), a: Xt(n[4]), format: e ? "name" : "hex8" };if (n = se.hex6.exec(t)) return { r: Kt(n[1]), g: Kt(n[2]), b: Kt(n[3]), format: e ? "name" : "hex" };if (n = se.hex4.exec(t)) return { r: Kt(n[1] + n[1]), g: Kt(n[2] + n[2]), b: Kt(n[3] + n[3]), a: Xt(n[4] + n[4]), format: e ? "name" : "hex8" };if (n = se.hex3.exec(t)) return { r: Kt(n[1] + n[1]), g: Kt(n[2] + n[2]), b: Kt(n[3] + n[3]), format: e ? "name" : "hex" };return !1;
  }(t)), "object" == typeof t && (re(t.r) && re(t.g) && re(t.b) ? (e = t.r, n = t.g, i = t.b, s = { r: 255 * zt(e, 255), g: 255 * zt(n, 255), b: 255 * zt(i, 255) }, l = !0, h = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : re(t.h) && re(t.s) && re(t.v) ? (a = Bt(t.s), o = Bt(t.v), s = function (t, e, n) {
    t = 6 * zt(t, 360), e = zt(e, 100), n = zt(n, 100);var i = Math.floor(t),
        s = t - i,
        r = n * (1 - e),
        a = n * (1 - s * e),
        o = n * (1 - (1 - s) * e),
        c = i % 6;return { r: 255 * [n, a, r, r, o, n][c], g: 255 * [o, n, n, a, r, r][c], b: 255 * [r, r, o, n, n, a][c] };
  }(t.h, a, o), l = !0, h = "hsv") : re(t.h) && re(t.s) && re(t.l) && (a = Bt(t.s), c = Bt(t.l), s = function (t, e, n) {
    var i, s, r;function a(t, e, n) {
      return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + 6 * n * (e - t) : n < .5 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
    }if (t = zt(t, 360), e = zt(e, 100), n = zt(n, 100), 0 === e) s = n, r = n, i = n;else {
      var o = n < .5 ? n * (1 + e) : n + e - n * e,
          c = 2 * n - o;i = a(c, o, t + 1 / 3), s = a(c, o, t), r = a(c, o, t - 1 / 3);
    }return { r: 255 * i, g: 255 * s, b: 255 * r };
  }(t.h, a, c), l = !0, h = "hsl"), Object.prototype.hasOwnProperty.call(t, "a") && (r = t.a)), r = Ut(r), { ok: l, format: t.format || h, r: Math.min(255, Math.max(s.r, 0)), g: Math.min(255, Math.max(s.g, 0)), b: Math.min(255, Math.max(s.b, 0)), a: r };
}var ee = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",
    ne = "[\\s|\\(]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")\\s*\\)?",
    ie = "[\\s|\\(]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")\\s*\\)?",
    se = { CSS_UNIT: new RegExp(ee), rgb: new RegExp("rgb" + ne), rgba: new RegExp("rgba" + ie), hsl: new RegExp("hsl" + ne), hsla: new RegExp("hsla" + ie), hsv: new RegExp("hsv" + ne), hsva: new RegExp("hsva" + ie), hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ };function re(t) {
  return Boolean(se.CSS_UNIT.exec(String(t)));
}var ae = function () {
  function t(e, n) {
    if (void 0 === e && (e = ""), void 0 === n && (n = {}), e instanceof t) return e;this.originalInput = e;var i = te(e);this.originalInput = e, this.r = i.r, this.g = i.g, this.b = i.b, this.a = i.a, this.roundA = Math.round(100 * this.a) / 100, this.format = n.format || i.format, this.gradientType = n.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = i.ok;
  }return t.prototype.isDark = function () {
    return this.getBrightness() < 128;
  }, t.prototype.isLight = function () {
    return !this.isDark();
  }, t.prototype.getBrightness = function () {
    var t = this.toRgb();return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3;
  }, t.prototype.getLuminance = function () {
    var t = this.toRgb(),
        e = t.r / 255,
        n = t.g / 255,
        i = t.b / 255;return .2126 * (e <= .03928 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4)) + .7152 * (n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4)) + .0722 * (i <= .03928 ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4));
  }, t.prototype.getAlpha = function () {
    return this.a;
  }, t.prototype.setAlpha = function (t) {
    return this.a = Ut(t), this.roundA = Math.round(100 * this.a) / 100, this;
  }, t.prototype.toHsv = function () {
    var t = Jt(this.r, this.g, this.b);return { h: 360 * t.h, s: t.s, v: t.v, a: this.a };
  }, t.prototype.toHsvString = function () {
    var t = Jt(this.r, this.g, this.b),
        e = Math.round(360 * t.h),
        n = Math.round(100 * t.s),
        i = Math.round(100 * t.v);return 1 === this.a ? "hsv(" + e + ", " + n + "%, " + i + "%)" : "hsva(" + e + ", " + n + "%, " + i + "%, " + this.roundA + ")";
  }, t.prototype.toHsl = function () {
    var t = Gt(this.r, this.g, this.b);return { h: 360 * t.h, s: t.s, l: t.l, a: this.a };
  }, t.prototype.toHslString = function () {
    var t = Gt(this.r, this.g, this.b),
        e = Math.round(360 * t.h),
        n = Math.round(100 * t.s),
        i = Math.round(100 * t.l);return 1 === this.a ? "hsl(" + e + ", " + n + "%, " + i + "%)" : "hsla(" + e + ", " + n + "%, " + i + "%, " + this.roundA + ")";
  }, t.prototype.toHex = function (t) {
    return void 0 === t && (t = !1), Zt(this.r, this.g, this.b, t);
  }, t.prototype.toHexString = function (t) {
    return void 0 === t && (t = !1), "#" + this.toHex(t);
  }, t.prototype.toHex8 = function (t) {
    return void 0 === t && (t = !1), function (t, e, n, i, s) {
      var r,
          a = [Wt(Math.round(t).toString(16)), Wt(Math.round(e).toString(16)), Wt(Math.round(n).toString(16)), Wt((r = i, Math.round(255 * parseFloat(r)).toString(16)))];return s && a[0].charAt(0) === a[0].charAt(1) && a[1].charAt(0) === a[1].charAt(1) && a[2].charAt(0) === a[2].charAt(1) && a[3].charAt(0) === a[3].charAt(1) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0) : a.join("");
    }(this.r, this.g, this.b, this.a, t);
  }, t.prototype.toHex8String = function (t) {
    return void 0 === t && (t = !1), "#" + this.toHex8(t);
  }, t.prototype.toRgb = function () {
    return { r: Math.round(this.r), g: Math.round(this.g), b: Math.round(this.b), a: this.a };
  }, t.prototype.toRgbString = function () {
    var t = Math.round(this.r),
        e = Math.round(this.g),
        n = Math.round(this.b);return 1 === this.a ? "rgb(" + t + ", " + e + ", " + n + ")" : "rgba(" + t + ", " + e + ", " + n + ", " + this.roundA + ")";
  }, t.prototype.toPercentageRgb = function () {
    var t = function (t) {
      return Math.round(100 * zt(t, 255)) + "%";
    };return { r: t(this.r), g: t(this.g), b: t(this.b), a: this.a };
  }, t.prototype.toPercentageRgbString = function () {
    var t = function (t) {
      return Math.round(100 * zt(t, 255));
    };return 1 === this.a ? "rgb(" + t(this.r) + "%, " + t(this.g) + "%, " + t(this.b) + "%)" : "rgba(" + t(this.r) + "%, " + t(this.g) + "%, " + t(this.b) + "%, " + this.roundA + ")";
  }, t.prototype.toName = function () {
    if (0 === this.a) return "transparent";if (this.a < 1) return !1;for (var t = "#" + Zt(this.r, this.g, this.b, !1), e = 0, n = Object.keys(Qt); e < n.length; e++) {
      var i = n[e];if (Qt[i] === t) return i;
    }return !1;
  }, t.prototype.toString = function (t) {
    var e = Boolean(t);t = t || this.format;var n = !1,
        i = this.a < 1 && this.a >= 0;return e || !i || !t.startsWith("hex") && "name" !== t ? ("rgb" === t && (n = this.toRgbString()), "prgb" === t && (n = this.toPercentageRgbString()), "hex" !== t && "hex6" !== t || (n = this.toHexString()), "hex3" === t && (n = this.toHexString(!0)), "hex4" === t && (n = this.toHex8String(!0)), "hex8" === t && (n = this.toHex8String()), "name" === t && (n = this.toName()), "hsl" === t && (n = this.toHslString()), "hsv" === t && (n = this.toHsvString()), n || this.toHexString()) : "name" === t && 0 === this.a ? this.toName() : this.toRgbString();
  }, t.prototype.clone = function () {
    return new t(this.toString());
  }, t.prototype.lighten = function (e) {
    void 0 === e && (e = 10);var n = this.toHsl();return n.l += e / 100, n.l = qt(n.l), new t(n);
  }, t.prototype.brighten = function (e) {
    void 0 === e && (e = 10);var n = this.toRgb();return n.r = Math.max(0, Math.min(255, n.r - Math.round(-e / 100 * 255))), n.g = Math.max(0, Math.min(255, n.g - Math.round(-e / 100 * 255))), n.b = Math.max(0, Math.min(255, n.b - Math.round(-e / 100 * 255))), new t(n);
  }, t.prototype.darken = function (e) {
    void 0 === e && (e = 10);var n = this.toHsl();return n.l -= e / 100, n.l = qt(n.l), new t(n);
  }, t.prototype.tint = function (t) {
    return void 0 === t && (t = 10), this.mix("white", t);
  }, t.prototype.shade = function (t) {
    return void 0 === t && (t = 10), this.mix("black", t);
  }, t.prototype.desaturate = function (e) {
    void 0 === e && (e = 10);var n = this.toHsl();return n.s -= e / 100, n.s = qt(n.s), new t(n);
  }, t.prototype.saturate = function (e) {
    void 0 === e && (e = 10);var n = this.toHsl();return n.s += e / 100, n.s = qt(n.s), new t(n);
  }, t.prototype.greyscale = function () {
    return this.desaturate(100);
  }, t.prototype.spin = function (e) {
    var n = this.toHsl(),
        i = (n.h + e) % 360;return n.h = i < 0 ? 360 + i : i, new t(n);
  }, t.prototype.mix = function (e, n) {
    void 0 === n && (n = 50);var i = this.toRgb(),
        s = new t(e).toRgb(),
        r = n / 100;return new t({ r: (s.r - i.r) * r + i.r, g: (s.g - i.g) * r + i.g, b: (s.b - i.b) * r + i.b, a: (s.a - i.a) * r + i.a });
  }, t.prototype.analogous = function (e, n) {
    void 0 === e && (e = 6), void 0 === n && (n = 30);var i = this.toHsl(),
        s = 360 / n,
        r = [this];for (i.h = (i.h - (s * e >> 1) + 720) % 360; --e;) i.h = (i.h + s) % 360, r.push(new t(i));return r;
  }, t.prototype.complement = function () {
    var e = this.toHsl();return e.h = (e.h + 180) % 360, new t(e);
  }, t.prototype.monochromatic = function (e) {
    void 0 === e && (e = 6);for (var n = this.toHsv(), i = n.h, s = n.s, r = n.v, a = [], o = 1 / e; e--;) a.push(new t({ h: i, s: s, v: r })), r = (r + o) % 1;return a;
  }, t.prototype.splitcomplement = function () {
    var e = this.toHsl(),
        n = e.h;return [this, new t({ h: (n + 72) % 360, s: e.s, l: e.l }), new t({ h: (n + 216) % 360, s: e.s, l: e.l })];
  }, t.prototype.triad = function () {
    return this.polyad(3);
  }, t.prototype.tetrad = function () {
    return this.polyad(4);
  }, t.prototype.polyad = function (e) {
    for (var n = this.toHsl(), i = n.h, s = [this], r = 360 / e, a = 1; a < e; a++) s.push(new t({ h: (i + a * r) % 360, s: n.s, l: n.l }));return s;
  }, t.prototype.equals = function (e) {
    return this.toRgbString() === new t(e).toRgbString();
  }, t;
}();function oe(t, e) {
  return void 0 === t && (t = ""), void 0 === e && (e = {}), new ae(t, e);
}function ce(t) {
  return t.substr(0, t.indexOf("."));
}function le(t) {
  return "var" === t.substring(0, 3) ? window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0, -1)).trim() : t;
}function he(t, e) {
  const n = new ae(le(t));if (n.isValid) {
    const t = n.mix("black", 100 - e).toString();if (t) return t;
  }return t;
}function de(...t) {
  const e = t => t && "object" == typeof t;return t.reduce((t, n) => (Object.keys(n).forEach(i => {
    const s = t[i],
          r = n[i];Array.isArray(s) && Array.isArray(r) ? t[i] = s.concat(...r) : e(s) && e(r) ? t[i] = de(s, r) : t[i] = r;
  }), t), {});
}function ue(t, e) {
  let n = [];return t && t.forEach(t => {
    let i = t;e && e.forEach(e => {
      e.id && t.id && e.id == t.id && (i = de(i, e));
    }), n.push(i);
  }), e && (n = n.concat(e.filter(e => !t || !t.find(t => !(!t.id || !e.id) && t.id == e.id)))), n;
}const pe = ((t, ...e) => {
  const n = e.reduce((e, n, i) => e + (t => {
    if (t instanceof at) return t.cssText;if ("number" == typeof t) return t;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(n) + t[i + 1], t[0]);return new at(n, rt);
})`
  ha-card {
    cursor: pointer;
    overflow: hidden;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  ha-card.disabled {
    pointer-events: none;
    cursor: default;
  }
  ha-icon {
    display: inline-block;
    margin: auto;
  }
  ha-card.button-card-main {
    padding: 4% 0px;
    text-transform: none;
    font-weight: 400;
    font-size: 1.2rem;
    align-items: center;
    text-align: center;
    letter-spacing: normal;
    width: 100%;
  }
  .ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  #overlay {
    align-items: flex-start;
    justify-content: flex-end;
    padding: 8px 7px;
    opacity: 0.5;
    /* DO NOT override items below */
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;
    display: flex;
  }
  #lock {
    -webkit-animation-duration: 5s;
    animation-duration: 5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    margin: unset;
  }
  @keyframes fadeOut{
    0% {opacity: 0.5;}
    20% {opacity: 0;}
    80% {opacity: 0;}
    100% {opacity: 0.5;}
  }
  .fadeOut {
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
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
  [rotating] {
    -webkit-animation: rotating 2s linear infinite;
    -moz-animation: rotating 2s linear infinite;
    -ms-animation: rotating 2s linear infinite;
    -o-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
  }

  #container {
    display: grid;
    width: 100%;
    height: 100%;
    text-align: center;
    align-items: center;
  }
  #img-cell {
    display: flex;
    grid-area: i;
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    align-self: center;
    justify-self: center;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  ha-icon#icon {
    height: 100%;
    width: 100%;
    max-height: 100%;
    position: absolute;
  }
  img#icon {
    display: block;
    height: auto;
    width: 100%;
    position: absolute;
  }
  #name {
    grid-area: n;
    max-width: 100%;
    align-self: center;
    justify-self: center;
    /* margin: auto; */
  }
  #state {
    grid-area: s;
    max-width: 100%;
    align-self: center;
    justify-self: center;
    /* margin: auto; */
  }

  #label {
    grid-area: l;
    max-width: 100%;
    align-self: center;
    justify-self: center;
  }

  #container.vertical {
    grid-template-areas: "i" "n" "s" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content min-content min-content;
  }
  /* Vertical No Icon */
  #container.vertical.no-icon {
    grid-template-areas: "n" "s" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content 1fr;
  }
  #container.vertical.no-icon #state {
    align-self: center;
  }
  #container.vertical.no-icon #name {
    align-self: end;
  }
  #container.vertical.no-icon #label {
    align-self: start;
  }

  /* Vertical No Icon No Name */
  #container.vertical.no-icon.no-name {
    grid-template-areas: "s" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.vertical.no-icon.no-name #state {
    align-self: end;
  }
  #container.vertical.no-icon.no-name #label {
    align-self: start;
  }

  /* Vertical No Icon No State */
  #container.vertical.no-icon.no-state {
    grid-template-areas: "n" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.vertical.no-icon.no-state #name {
    align-self: end;
  }
  #container.vertical.no-icon.no-state #label {
    align-self: start;
  }

  /* Vertical No Icon No Label */
  #container.vertical.no-icon.no-label {
    grid-template-areas: "n" "s";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.vertical.no-icon.no-label #name {
    align-self: end;
  }
  #container.vertical.no-icon.no-label #state {
    align-self: start;
  }

  /* Vertical No Icon No Label No Name */
  #container.vertical.no-icon.no-label.no-name {
    grid-template-areas: "s";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  #container.vertical.no-icon.no-label.no-name #state {
    align-self: center;
  }
  /* Vertical No Icon No Label No State */
  #container.vertical.no-icon.no-label.no-state {
    grid-template-areas: "n";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  #container.vertical.no-icon.no-label.no-state #name {
    align-self: center;
  }

  /* Vertical No Icon No Name No State */
  #container.vertical.no-icon.no-name.no-state {
    grid-template-areas: "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  #container.vertical.no-icon.no-name.no-state #label {
    align-self: center;
  }

  #container.icon_name_state {
    grid-template-areas: "i n" "l l";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content;
  }

  #container.icon_name {
    grid-template-areas: "i n" "s s" "l l";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content min-content;
  }

  #container.icon_state {
    grid-template-areas: "i s" "n n" "l l";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content min-content;
  }

  #container.name_state {
    grid-template-areas: "i" "n" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr min-content min-content;
  }
  #container.name_state.no-icon {
    grid-template-areas: "n" "l";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.name_state.no-icon #name {
    align-self: end
  }
  #container.name_state.no-icon #label {
    align-self: start
  }

  #container.name_state.no-icon.no-label {
    grid-template-areas: "n";
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
  #container.name_state.no-icon.no-label #name {
    align-self: center
  }

  /* icon_name_state2nd default */
  #container.icon_name_state2nd {
    grid-template-areas: "i n" "i s" "i l";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content 1fr;
  }
  #container.icon_name_state2nd #name {
    align-self: end;
  }
  #container.icon_name_state2nd #state {
    align-self: center;
  }
  #container.icon_name_state2nd #label {
    align-self: start;
  }

  /* icon_name_state2nd No Label */
  #container.icon_name_state2nd.no-label {
    grid-template-areas: "i n" "i s";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.icon_name_state2nd #name {
    align-self: end;
  }
  #container.icon_name_state2nd #state {
    align-self: start;
  }

  /* icon_state_name2nd Default */
  #container.icon_state_name2nd {
    grid-template-areas: "i s" "i n" "i l";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content 1fr;
  }
  #container.icon_state_name2nd #state {
    align-self: end;
  }
  #container.icon_state_name2nd #name {
    align-self: center;
  }
  #container.icon_state_name2nd #label {
    align-self: start;
  }

  /* icon_state_name2nd No Label */
  #container.icon_state_name2nd.no-label {
    grid-template-areas: "i s" "i n";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr 1fr;
  }
  #container.icon_state_name2nd #state {
    align-self: end;
  }
  #container.icon_state_name2nd #name {
    align-self: start;
  }

  #container.icon_label {
    grid-template-areas: "i l" "n n" "s s";
    grid-template-columns: 40% 1fr;
    grid-template-rows: 1fr min-content min-content;
  }

  [style*="--aspect-ratio"] > :first-child {
    width: 100%;
  }
  [style*="--aspect-ratio"] > img {
    height: auto;
  }
  @supports (--custom:property) {
    [style*="--aspect-ratio"] {
      position: relative;
    }
    [style*="--aspect-ratio"]::before {
      content: "";
      display: block;
      padding-bottom: calc(100% / (var(--aspect-ratio)));
    }
    [style*="--aspect-ratio"] > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
`;let fe = class extends ct {
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearInterval();
  }connectedCallback() {
    if (super.connectedCallback(), this.config && this.config.entity && "timer" === ce(this.config.entity)) {
      const t = this.hass.states[this.config.entity];this._startInterval(t);
    }
  }static get styles() {
    return pe;
  }render() {
    return this.config && this.hass ? this._cardHtml() : $``;
  }shouldUpdate(t) {
    const e = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          n = (this._getMatchingConfigState(e), !!(this._hasTemplate || this.config.state && this.config.state.find(t => "template" === t.operator) || t.has("_timeRemaining")));return function (t, e, n) {
      if (e.has("config") || n) return !0;if (t.config.entity) {
        const n = e.get("hass");return !n || n.states[t.config.entity] !== t.hass.states[t.config.entity];
      }return !1;
    }(this, t, n);
  }updated(t) {
    if (super.updated(t), this.config && this.config.entity && "timer" === ce(this.config.entity) && t.has("hass")) {
      const e = this.hass.states[this.config.entity],
            n = t.get("hass");(n ? n.states[this.config.entity] : void 0) !== e ? this._startInterval(e) : e || this._clearInterval();
    }
  }_clearInterval() {
    this._interval && (window.clearInterval(this._interval), this._interval = void 0);
  }_startInterval(t) {
    this._clearInterval(), this._calculateRemaining(t), "active" === t.state && (this._interval = window.setInterval(() => this._calculateRemaining(t), 1e3));
  }_calculateRemaining(t) {
    this._timeRemaining = function (t) {
      var e = Nt(t.attributes.remaining);if ("active" === t.state) {
        var n = new Date().getTime(),
            i = new Date(t.last_changed).getTime();e = Math.max(e - (n - i) / 1e3, 0);
      }return e;
    }(t);
  }_computeTimeDisplay(t) {
    if (t) return function (t) {
      var e = Math.floor(t / 3600),
          n = Math.floor(t % 3600 / 60),
          i = Math.floor(t % 3600 % 60);return e > 0 ? e + ":" + At(n) + ":" + At(i) : n > 0 ? n + ":" + At(i) : i > 0 ? "" + i : null;
    }(this._timeRemaining || Nt(t.attributes.duration));
  }_getMatchingConfigState(t) {
    if (!this.config.state) return;const e = this.config.state.find(t => "template" === t.operator);if (!t && !e) return;let n;const i = this.config.state.find(e => {
      if (!e.operator) return t && this._getTemplateOrString(t, e.value) == t.state;switch (e.operator) {case "==":
          return t && t.state == this._getTemplateOrString(t, e.value);case "<=":
          return t && t.state <= this._getTemplateOrString(t, e.value);case "<":
          return t && t.state < this._getTemplateOrString(t, e.value);case ">=":
          return t && t.state >= this._getTemplateOrString(t, e.value);case ">":
          return t && t.state > this._getTemplateOrString(t, e.value);case "!=":
          return t && t.state != this._getTemplateOrString(t, e.value);case "regex":
          return !(!t || !t.state.match(this._getTemplateOrString(t, e.value)));case "template":
          return this._getTemplateOrString(t, e.value);case "default":
          return n = e, !1;default:
          return !1;}
    });return !i && n ? n : i;
  }_evalTemplate(t, e) {
    return new Function("states", "entity", "user", "hass", `'use strict'; ${e}`).call(this, this.hass.states, t, this.hass.user, this.hass);
  }_getTemplateOrString(t, e) {
    if (!e) return;if ("number" == typeof e) return e;const n = e.trim();return "[[[" === n.substring(0, 3) && "]]]" === n.slice(-3) ? this._evalTemplate(t, n.slice(3, -3)) : e;
  }_getDefaultColorForState(t) {
    switch (t.state) {case "on":
        return this.config.color_on;case "off":
        return this.config.color_off;default:
        return this.config.default_color;}
  }_getColorForLightEntity(t, e) {
    let n = this.config.default_color;return t && (t.attributes.rgb_color ? (n = `rgb(${t.attributes.rgb_color.join(",")})`, t.attributes.brightness && (n = he(n, (t.attributes.brightness + 245) / 5))) : e && t.attributes.color_temp && t.attributes.min_mireds && t.attributes.max_mireds ? (n = function (t, e, n) {
      const i = new ae("rgb(255, 160, 0)"),
            s = new ae("rgb(166, 209, 255)"),
            r = new ae("white"),
            a = (t - e) / (n - e) * 100;return a < 50 ? oe(s).mix(r, 2 * a).toRgbString() : oe(r).mix(i, 2 * (a - 50)).toRgbString();
    }(t.attributes.color_temp, t.attributes.min_mireds, t.attributes.max_mireds), t.attributes.brightness && (n = he(n, (t.attributes.brightness + 245) / 5))) : n = t.attributes.brightness ? he(this._getDefaultColorForState(t), (t.attributes.brightness + 245) / 5) : this._getDefaultColorForState(t)), n;
  }_buildCssColorAttribute(t, e) {
    let n,
        i = "";return e && e.color ? i = e.color : "auto" !== this.config.color && t && "off" === t.state ? i = this.config.color_off : this.config.color && (i = this.config.color), n = "auto" == i || "auto-no-temperature" == i ? this._getColorForLightEntity(t, "auto-no-temperature" !== i) : i || (t ? this._getDefaultColorForState(t) : this.config.default_color);
  }_buildIcon(t, e) {
    if (!this.config.show_icon) return;let n;return e && e.icon ? n = e.icon : this.config.icon ? n = this.config.icon : t && t.attributes && (n = t.attributes.icon ? t.attributes.icon : function (t, e) {
      if (t in Ht) return Ht[t];switch (t) {case "alarm_control_panel":
          switch (e) {case "armed_home":
              return "hass:bell-plus";case "armed_night":
              return "hass:bell-sleep";case "disarmed":
              return "hass:bell-outline";case "triggered":
              return "hass:bell-ring";default:
              return "hass:bell";}case "binary_sensor":
          return e && "off" === e ? "hass:radiobox-blank" : "hass:checkbox-marked-circle";case "cover":
          return "closed" === e ? "hass:window-closed" : "hass:window-open";case "lock":
          return e && "unlocked" === e ? "hass:lock-open" : "hass:lock";case "media_player":
          return e && "off" !== e && "idle" !== e ? "hass:cast-connected" : "hass:cast";case "zwave":
          switch (e) {case "dead":
              return "hass:emoticon-dead";case "sleeping":
              return "hass:sleep";case "initializing":
              return "hass:timer-sand";default:
              return "hass:z-wave";}default:
          return console.warn("Unable to find icon for domain " + t + " (" + e + ")"), Ot;}
    }(ce(t.entity_id), t.state)), this._getTemplateOrString(t, n);
  }_buildEntityPicture(t, e) {
    if (!this.config.show_entity_picture || !t && !e && !this.config.entity_picture) return;let n;return e && e.entity_picture ? n = e.entity_picture : this.config.entity_picture ? n = this.config.entity_picture : t && (n = t.attributes && t.attributes.entity_picture ? t.attributes.entity_picture : void 0), this._getTemplateOrString(t, n);
  }_buildStyleGeneric(t, e, n) {
    let i = {};if (this.config.styles && this.config.styles[n] && (i = Object.assign(i, ...this.config.styles[n])), e && e.styles && e.styles[n]) {
      let t = {};t = Object.assign(t, ...e.styles[n]), i = Object.assign({}, i, t);
    }return Object.keys(i).forEach(e => {
      i[e] = this._getTemplateOrString(t, i[e]);
    }), i;
  }_buildCustomStyleGeneric(t, e, n) {
    let i = {};if (this.config.styles && this.config.styles.custom_fields && this.config.styles.custom_fields[n] && (i = Object.assign(i, ...this.config.styles.custom_fields[n])), e && e.styles && e.styles.custom_fields && e.styles.custom_fields[n]) {
      let t = {};t = Object.assign(t, ...e.styles.custom_fields[n]), i = Object.assign({}, i, t);
    }return Object.keys(i).forEach(e => {
      i[e] = this._getTemplateOrString(t, i[e]);
    }), i;
  }_buildName(t, e) {
    if (!1 === this.config.show_name) return;let n;var i;return e && e.name ? n = e.name : this.config.name ? n = this.config.name : t && (n = t.attributes && t.attributes.friendly_name ? t.attributes.friendly_name : (i = t.entity_id).substr(i.indexOf(".") + 1)), this._getTemplateOrString(t, n);
  }_buildStateString(t) {
    let e;if (this.config.show_state && t && t.state) {
      const n = ((t, e) => {
        let n;const i = ce(e.entity_id);return "binary_sensor" === i ? (e.attributes.device_class && (n = t(`state.${i}.${e.attributes.device_class}.${e.state}`)), n || (n = t(`state.${i}.default.${e.state}`))) : n = e.attributes.unit_of_measurement && !["unknown", "unavailable"].includes(e.state) ? e.state : "zwave" === i ? ["initializing", "dead"].includes(e.state) ? t(`state.zwave.query_stage.${e.state}`, "query_stage", e.attributes.query_stage) : t(`state.zwave.default.${e.state}`) : t(`state.${i}.${e.state}`), n || (n = t(`state.default.${e.state}`) || t(`component.${i}.state.${e.state}`) || e.state), n;
      })(this.hass.localize, t),
            i = this._buildUnits(t);i ? e = `${t.state} ${i}` : "timer" === ce(t.entity_id) ? "idle" === t.state || 0 === this._timeRemaining ? e = n : (e = this._computeTimeDisplay(t), "paused" === t.state && (e += ` (${n})`)) : e = n;
    }return e;
  }_buildUnits(t) {
    let e;return t && this.config.show_units && (e = t.attributes && t.attributes.unit_of_measurement && !this.config.units ? t.attributes.unit_of_measurement : this.config.units ? this.config.units : void 0), e;
  }_buildLastChanged(t, e) {
    return this.config.show_last_changed && t ? $`
        <ha-relative-time
          id="label"
          class="ellipsis"
          .hass="${this.hass}"
          .datetime="${t.last_changed}"
          style=${ht(e)}
        ></ha-relative-time>` : void 0;
  }_buildLabel(t, e) {
    if (!this.config.show_label) return;let n;return n = e && e.label ? e.label : this.config.label, this._getTemplateOrString(t, n);
  }_buildCustomFields(t, e) {
    let n = $``;const i = {};return this.config.custom_fields && Object.keys(this.config.custom_fields).forEach(e => {
      const n = this.config.custom_fields[e];i[e] = this._getTemplateOrString(t, n);
    }), e && e.custom_fields && Object.keys(e.custom_fields).forEach(n => {
      const s = e.custom_fields[n];i[n] = this._getTemplateOrString(t, s);
    }), Object.keys(i).forEach(s => {
      if (null != i[s]) {
        const r = Object.assign({}, this._buildCustomStyleGeneric(t, e, s), { "grid-area": s });n = $`${n}
        <div id=${s} class="ellipsis" style=${ht(r)}>${ut(i[s])}</div>`;
      }
    }), n;
  }_isClickable(t) {
    let e = !0;if ("toggle" === this.config.tap_action.action && "none" === this.config.hold_action.action && "none" === this.config.dbltap_action.action || "toggle" === this.config.hold_action.action && "none" === this.config.tap_action.action && "none" === this.config.dbltap_action.action || "toggle" === this.config.dbltap_action.action && "none" === this.config.tap_action.action && "none" === this.config.hold_action.action) {
      if (t) switch (ce(t.entity_id)) {case "sensor":case "binary_sensor":case "device_tracker":
          e = !1;break;default:
          e = !0;} else e = !1;
    } else e = "none" != this.config.tap_action.action || "none" != this.config.hold_action.action || "none" != this.config.dbltap_action.action;return e;
  }_rotate(t) {
    return !(!t || !t.spin);
  }_blankCardColoredHtml(t) {
    const e = Object.assign({ background: "none", "box-shadow": "none" }, t);return $`
      <ha-card class="disabled" style=${ht(e)}>
        <div></div>
      </ha-card>
      `;
  }_cardHtml() {
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          e = this._getMatchingConfigState(t),
          n = this._buildCssColorAttribute(t, e);let i = n,
        s = {},
        r = {};const a = {},
          o = this._buildStyleGeneric(t, e, "lock"),
          c = this._buildStyleGeneric(t, e, "card"),
          l = { "button-card-main": !0, disabled: !this._isClickable(t) };switch (c.width && (this.style.setProperty("flex", "0 0 auto"), this.style.setProperty("max-width", "fit-content")), this.config.color_type) {case "blank-card":
        return this._blankCardColoredHtml(c);case "card":case "label-card":
        {
          const t = function (t) {
            const e = new ae(le(t));return e.isValid && e.getLuminance() > .5 ? "rgb(62, 62, 62)" : "rgb(234, 234, 234)";
          }(n);s.color = t, r.color = t, s["background-color"] = n, s = Object.assign({}, s, c), i = "inherit";break;
        }default:
        s = c;}return this.config.aspect_ratio ? (a["--aspect-ratio"] = this.config.aspect_ratio, s.position = "absolute") : a.display = "inline", this.style.setProperty("--button-card-light-color", this._getColorForLightEntity(t, !0)), this.style.setProperty("--button-card-light-color-no-temperature", this._getColorForLightEntity(t, !1)), r = Object.assign({}, r, o), $`
      <div id="aspect-ratio" style=${ht(a)}>
        <ha-card
          id="card"
          class=${mt(l)}
          style=${ht(s)}
          @ha-click="${this._handleTap}"
          @ha-hold="${this._handleHold}"
          @ha-dblclick=${this._handleDblTap}
          .hasDblClick=${"none" !== this.config.dbltap_action.action}
          .repeat=${pt(this.config.hold_action.repeat)}
          .longpress=${Yt()}
          .config="${this.config}"
        >
          ${this._getLock(r)}
          ${this._buttonContent(t, e, i)}
          ${this.config.lock ? "" : $`<mwc-ripple id="ripple"></mwc-ripple>`}
        </ha-card>
      </div>
      `;
  }_getLock(t) {
    return this.config.lock ? $`
        <div id="overlay" style=${ht(t)} @click=${this._handleLock} @touchstart=${this._handleLock}>
          <ha-icon id="lock" icon="mdi:lock-outline"></ha-icon>
        </div>
      ` : $``;
  }_buttonContent(t, e, n) {
    const i = this._buildName(t, e),
          s = this._buildStateString(t),
          r = function (t, e) {
      if (!t && !e) return;let n;return n = e ? t ? `${t}: ${e}` : e : t;
    }(i, s);switch (this.config.layout) {case "icon_name_state":case "name_state":
        return this._gridHtml(t, e, this.config.layout, n, r, void 0);default:
        return this._gridHtml(t, e, this.config.layout, n, i, s);}
  }_gridHtml(t, e, n, i, s, r) {
    const a = this._getIconHtml(t, e, i),
          o = [n],
          c = this._buildLabel(t, e),
          l = this._buildStyleGeneric(t, e, "name"),
          h = this._buildStyleGeneric(t, e, "state"),
          d = this._buildStyleGeneric(t, e, "label"),
          u = this._buildLastChanged(t, d),
          p = this._buildStyleGeneric(t, e, "grid");return a || o.push("no-icon"), s || o.push("no-name"), r || o.push("no-state"), c || u || o.push("no-label"), $`
      <div id="container" class=${o.join(" ")} style=${ht(p)}>
        ${a || ""}
        ${s ? $`<div id="name" class="ellipsis" style=${ht(l)}>${ut(s)}</div>` : ""}
        ${r ? $`<div id="state" class="ellipsis" style=${ht(h)}>${r}</div>` : ""}
        ${c && !u ? $`<div id="label" class="ellipsis" style=${ht(d)}>${ut(c)}</div>` : ""}
        ${u || ""}
        ${this._buildCustomFields(t, e)}
      </div>
    `;
  }_getIconHtml(t, e, n) {
    const i = this._buildIcon(t, e),
          s = this._buildEntityPicture(t, e),
          r = this._buildStyleGeneric(t, e, "entity_picture"),
          a = this._buildStyleGeneric(t, e, "icon"),
          o = this._buildStyleGeneric(t, e, "img_cell"),
          c = this._buildStyleGeneric(t, e, "card"),
          l = Object.assign({ color: n, width: this.config.size, position: this.config.aspect_ratio || c.height ? "absolute" : "relative" }, a),
          h = Object.assign({}, l, r);return i || s ? $`
        <div id="img-cell" style=${ht(o)}>
          ${i && !s ? $`<ha-icon style=${ht(l)}
            .icon="${i}" id="icon" ?rotating=${this._rotate(e)}></ha-icon>` : ""}
          ${s ? $`<img src="${s}" style=${ht(h)}
            id="icon" ?rotating=${this._rotate(e)} />` : ""}
        </div>
      ` : void 0;
  }setConfig(t) {
    if (!t) throw new Error("Invalid configuration");const e = function () {
      var t = document.querySelector("home-assistant");if (t = (t = (t = (t = (t = (t = (t = (t = t && t.shadowRoot) && t.querySelector("home-assistant-main")) && t.shadowRoot) && t.querySelector("app-drawer-layout partial-panel-resolver")) && t.shadowRoot || t) && t.querySelector("ha-panel-lovelace")) && t.shadowRoot) && t.querySelector("hui-root")) {
        var e = t.lovelace;return e.current_view = t.___curView, e;
      }return null;
    }();let n = Object.assign({}, t),
        i = n.template,
        s = t.state;for (; i && e.config.button_card_templates && e.config.button_card_templates[i];) n = de(e.config.button_card_templates[i], n), s = ue(e.config.button_card_templates[i].state, s), i = e.config.button_card_templates[i].template;n.state = s, this.config = Object.assign({ tap_action: { action: "toggle" }, hold_action: { action: "none" }, dbltap_action: { action: "none" }, layout: "vertical", size: "40%", color_type: "icon", show_name: !0, show_state: !1, show_icon: !0, show_units: !0, show_label: !1, show_entity_picture: !1 }, n), this.config.default_color = "var(--primary-text-color)", "icon" !== this.config.color_type ? this.config.color_off = "var(--paper-card-background-color)" : this.config.color_off = "var(--paper-item-icon-color)", this.config.color_on = "var(--paper-item-icon-active-color)";const r = JSON.stringify(this.config),
          a = new RegExp("\\[\\[\\[.*\\]\\]\\]", "gm");this._hasTemplate = !!r.match(a);
  }getCardSize() {
    return 3;
  }_evalActions(t, e) {
    const n = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          i = JSON.parse(JSON.stringify(t));return Object.keys(i[e]).forEach(t => {
      "service_data" === t ? Object.keys(i[e].service_data).forEach(t => {
        i[e].service_data[t] = this._getTemplateOrString(n, i[e].service_data[t]);
      }) : i[e][t] = this._getTemplateOrString(n, i[e][t]);
    }), i;
  }_handleTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;jt(this, this.hass, this._evalActions(e, "tap_action"), !1, !1);
  }_handleHold(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;jt(this, this.hass, this._evalActions(e, "hold_action"), !0, !1);
  }_handleDblTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;jt(this, this.hass, this._evalActions(e, "dbltap_action"), !1, !0);
  }_handleLock(t) {
    if (t.stopPropagation(), this.config.unlock_users) {
      if (!this.hass.user.name) return;if (this.config.unlock_users.indexOf(this.hass.user.name) < 0) return;
    }const e = this.shadowRoot.getElementById("overlay"),
          n = this.shadowRoot.getElementById("card");e.style.setProperty("pointer-events", "none");const i = document.createElement("paper-ripple"),
          s = this.shadowRoot.getElementById("lock");if (s) {
      n.appendChild(i);const t = document.createAttribute("icon");t.value = "mdi:lock-open-outline", s.attributes.setNamedItem(t), s.classList.add("fadeOut");
    }window.setTimeout(() => {
      if (e.style.setProperty("pointer-events", ""), s) {
        s.classList.remove("fadeOut");const t = document.createAttribute("icon");t.value = "mdi:lock-outline", s.attributes.setNamedItem(t), n.removeChild(i);
      }
    }, 5e3);
  }
};t([it()], fe.prototype, "hass", void 0), t([it()], fe.prototype, "config", void 0), t([it()], fe.prototype, "_timeRemaining", void 0), t([it()], fe.prototype, "_hasTemplate", void 0), fe = t([(t => e => "function" == typeof e ? ((t, e) => (window.customElements.define(t, e), e))(t, e) : ((t, e) => {
  const { kind: n, elements: i } = e;return { kind: n, elements: i, finisher(e) {
      window.customElements.define(t, e);
    } };
})(t, e))("button-card")], fe);
