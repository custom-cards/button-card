function t(t, e, i, n) {
  var s,
      r = arguments.length,
      a = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, i) : n;if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, i, n);else for (var o = t.length - 1; o >= 0; o--) (s = t[o]) && (a = (r < 3 ? s(a) : r > 3 ? s(e, i, a) : s(e, i)) || a);return r > 3 && a && Object.defineProperty(e, i, a), a;
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
      i = t => (...i) => {
  const n = t(...i);return e.set(n, !0), n;
},
      n = t => "function" == typeof t && e.has(t),
      s = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
      r = (t, e, i = null) => {
  let n = e;for (; n !== i;) {
    const e = n.nextSibling;t.removeChild(n), n = e;
  }
},
      a = {},
      o = {},
      l = `{{lit-${String(Math.random()).slice(2)}}}`,
      c = `\x3c!--${l}--\x3e`,
      h = new RegExp(`${l}|${c}`),
      d = "$lit$";class u {
  constructor(t, e) {
    this.parts = [], this.element = e;let i = -1,
        n = 0;const s = [],
          r = e => {
      const a = e.content,
            o = document.createTreeWalker(a, 133, null, !1);let c = 0;for (; o.nextNode();) {
        i++;const e = o.currentNode;if (1 === e.nodeType) {
          if (e.hasAttributes()) {
            const s = e.attributes;let r = 0;for (let t = 0; t < s.length; t++) s[t].value.indexOf(l) >= 0 && r++;for (; r-- > 0;) {
              const s = t.strings[n],
                    r = m.exec(s)[2],
                    a = r.toLowerCase() + d,
                    o = e.getAttribute(a).split(h);this.parts.push({ type: "attribute", index: i, name: r, strings: o }), e.removeAttribute(a), n += o.length - 1;
            }
          }"TEMPLATE" === e.tagName && r(e);
        } else if (3 === e.nodeType) {
          const t = e.data;if (t.indexOf(l) >= 0) {
            const r = e.parentNode,
                  a = t.split(h),
                  o = a.length - 1;for (let t = 0; t < o; t++) r.insertBefore("" === a[t] ? f() : document.createTextNode(a[t]), e), this.parts.push({ type: "node", index: ++i });"" === a[o] ? (r.insertBefore(f(), e), s.push(e)) : e.data = a[o], n += o;
          }
        } else if (8 === e.nodeType) if (e.data === l) {
          const t = e.parentNode;null !== e.previousSibling && i !== c || (i++, t.insertBefore(f(), e)), c = i, this.parts.push({ type: "node", index: i }), null === e.nextSibling ? e.data = "" : (s.push(e), i--), n++;
        } else {
          let t = -1;for (; -1 !== (t = e.data.indexOf(l, t + 1));) this.parts.push({ type: "node", index: -1 });
        }
      }
    };r(e);for (const t of s) t.parentNode.removeChild(t);
  }
}const p = t => -1 !== t.index,
      f = () => document.createComment(""),
      m = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
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
class g {
  constructor(t, e, i) {
    this._parts = [], this.template = t, this.processor = e, this.options = i;
  }update(t) {
    let e = 0;for (const i of this._parts) void 0 !== i && i.setValue(t[e]), e++;for (const t of this._parts) void 0 !== t && t.commit();
  }_clone() {
    const t = s ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
          e = this.template.parts;let i = 0,
        n = 0;const r = t => {
      const s = document.createTreeWalker(t, 133, null, !1);let a = s.nextNode();for (; i < e.length && null !== a;) {
        const t = e[i];if (p(t)) {
          if (n === t.index) {
            if ("node" === t.type) {
              const t = this.processor.handleTextExpression(this.options);t.insertAfterNode(a.previousSibling), this._parts.push(t);
            } else this._parts.push(...this.processor.handleAttributeExpressions(a, t.name, t.strings, this.options));i++;
          } else n++, "TEMPLATE" === a.nodeName && r(a.content), a = s.nextNode();
        } else this._parts.push(void 0), i++;
      }
    };return r(t), s && (document.adoptNode(t), customElements.upgrade(t)), t;
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
 */class b {
  constructor(t, e, i, n) {
    this.strings = t, this.values = e, this.type = i, this.processor = n;
  }getHTML() {
    const t = this.strings.length - 1;let e = "";for (let i = 0; i < t; i++) {
      const t = this.strings[i],
            n = m.exec(t);e += n ? t.substr(0, n.index) + n[1] + n[2] + d + n[3] + l : t + c;
    }return e + this.strings[t];
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
 */const y = t => null === t || !("object" == typeof t || "function" == typeof t);class _ {
  constructor(t, e, i) {
    this.dirty = !0, this.element = t, this.name = e, this.strings = i, this.parts = [];for (let t = 0; t < i.length - 1; t++) this.parts[t] = this._createPart();
  }_createPart() {
    return new v(this);
  }_getValue() {
    const t = this.strings,
          e = t.length - 1;let i = "";for (let n = 0; n < e; n++) {
      i += t[n];const e = this.parts[n];if (void 0 !== e) {
        const t = e.value;if (null != t && (Array.isArray(t) || "string" != typeof t && t[Symbol.iterator])) for (const e of t) i += "string" == typeof e ? e : String(e);else i += "string" == typeof t ? t : String(t);
      }
    }return i += t[e];
  }commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }
}class v {
  constructor(t) {
    this.value = void 0, this.committer = t;
  }setValue(t) {
    t === a || y(t) && t === this.value || (this.value = t, n(t) || (this.committer.dirty = !0));
  }commit() {
    for (; n(this.value);) {
      const t = this.value;this.value = a, t(this);
    }this.value !== a && this.committer.commit();
  }
}class w {
  constructor(t) {
    this.value = void 0, this._pendingValue = void 0, this.options = t;
  }appendInto(t) {
    this.startNode = t.appendChild(f()), this.endNode = t.appendChild(f());
  }insertAfterNode(t) {
    this.startNode = t, this.endNode = t.nextSibling;
  }appendIntoPart(t) {
    t._insert(this.startNode = f()), t._insert(this.endNode = f());
  }insertAfterPart(t) {
    t._insert(this.startNode = f()), this.endNode = t.endNode, t.endNode = this.startNode;
  }setValue(t) {
    this._pendingValue = t;
  }commit() {
    for (; n(this._pendingValue);) {
      const t = this._pendingValue;this._pendingValue = a, t(this);
    }const t = this._pendingValue;t !== a && (y(t) ? t !== this.value && this._commitText(t) : t instanceof b ? this._commitTemplateResult(t) : t instanceof Node ? this._commitNode(t) : Array.isArray(t) || t[Symbol.iterator] ? this._commitIterable(t) : t === o ? (this.value = o, this.clear()) : this._commitText(t));
  }_insert(t) {
    this.endNode.parentNode.insertBefore(t, this.endNode);
  }_commitNode(t) {
    this.value !== t && (this.clear(), this._insert(t), this.value = t);
  }_commitText(t) {
    const e = this.startNode.nextSibling;t = null == t ? "" : t, e === this.endNode.previousSibling && 3 === e.nodeType ? e.data = t : this._commitNode(document.createTextNode("string" == typeof t ? t : String(t))), this.value = t;
  }_commitTemplateResult(t) {
    const e = this.options.templateFactory(t);if (this.value instanceof g && this.value.template === e) this.value.update(t.values);else {
      const i = new g(e, t.processor, this.options),
            n = i._clone();i.update(t.values), this._commitNode(n), this.value = i;
    }
  }_commitIterable(t) {
    Array.isArray(this.value) || (this.value = [], this.clear());const e = this.value;let i,
        n = 0;for (const s of t) void 0 === (i = e[n]) && (i = new w(this.options), e.push(i), 0 === n ? i.appendIntoPart(this) : i.insertAfterPart(e[n - 1])), i.setValue(s), i.commit(), n++;n < e.length && (e.length = n, this.clear(i && i.endNode));
  }clear(t = this.startNode) {
    r(this.startNode.parentNode, t.nextSibling, this.endNode);
  }
}class S {
  constructor(t, e, i) {
    if (this.value = void 0, this._pendingValue = void 0, 2 !== i.length || "" !== i[0] || "" !== i[1]) throw new Error("Boolean attributes can only contain a single expression");this.element = t, this.name = e, this.strings = i;
  }setValue(t) {
    this._pendingValue = t;
  }commit() {
    for (; n(this._pendingValue);) {
      const t = this._pendingValue;this._pendingValue = a, t(this);
    }if (this._pendingValue === a) return;const t = !!this._pendingValue;this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name)), this.value = t, this._pendingValue = a;
  }
}class x extends _ {
  constructor(t, e, i) {
    super(t, e, i), this.single = 2 === i.length && "" === i[0] && "" === i[1];
  }_createPart() {
    return new k(this);
  }_getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }
}class k extends v {}let C = !1;try {
  const t = { get capture() {
      return C = !0, !1;
    } };window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}class A {
  constructor(t, e, i) {
    this.value = void 0, this._pendingValue = void 0, this.element = t, this.eventName = e, this.eventContext = i, this._boundHandleEvent = t => this.handleEvent(t);
  }setValue(t) {
    this._pendingValue = t;
  }commit() {
    for (; n(this._pendingValue);) {
      const t = this._pendingValue;this._pendingValue = a, t(this);
    }if (this._pendingValue === a) return;const t = this._pendingValue,
          e = this.value,
          i = null == t || null != e && (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive),
          s = null != t && (null == e || i);i && this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options), s && (this._options = P(t), this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options)), this.value = t, this._pendingValue = a;
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
 */const E = new class {
  handleAttributeExpressions(t, e, i, n) {
    const s = e[0];return "." === s ? new x(t, e.slice(1), i).parts : "@" === s ? [new A(t, e.slice(1), n.eventContext)] : "?" === s ? [new S(t, e.slice(1), i)] : new _(t, e, i).parts;
  }handleTextExpression(t) {
    return new w(t);
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
 */function N(t) {
  let e = M.get(t.type);void 0 === e && (e = { stringsArray: new WeakMap(), keyString: new Map() }, M.set(t.type, e));let i = e.stringsArray.get(t.strings);if (void 0 !== i) return i;const n = t.strings.join(l);return void 0 === (i = e.keyString.get(n)) && (i = new u(t, t.getTemplateElement()), e.keyString.set(n, i)), e.stringsArray.set(t.strings, i), i;
}const M = new Map(),
      T = new WeakMap();
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
(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");const $ = (t, ...e) => new b(t, e, "html", E),
      R = 133;
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
 */function O(t, e) {
  const { element: { content: i }, parts: n } = t,
        s = document.createTreeWalker(i, R, null, !1);let r = H(n),
      a = n[r],
      o = -1,
      l = 0;const c = [];let h = null;for (; s.nextNode();) {
    o++;const t = s.currentNode;for (t.previousSibling === h && (h = null), e.has(t) && (c.push(t), null === h && (h = t)), null !== h && l++; void 0 !== a && a.index === o;) a.index = null !== h ? -1 : a.index - l, a = n[r = H(n, r)];
  }c.forEach(t => t.parentNode.removeChild(t));
}const V = t => {
  let e = 11 === t.nodeType ? 0 : 1;const i = document.createTreeWalker(t, R, null, !1);for (; i.nextNode();) e++;return e;
},
      H = (t, e = -1) => {
  for (let i = e + 1; i < t.length; i++) {
    const e = t[i];if (p(e)) return i;
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
const j = (t, e) => `${t}--${e}`;let L = !0;void 0 === window.ShadyCSS ? L = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."), L = !1);const F = t => e => {
  const i = j(e.type, t);let n = M.get(i);void 0 === n && (n = { stringsArray: new WeakMap(), keyString: new Map() }, M.set(i, n));let s = n.stringsArray.get(e.strings);if (void 0 !== s) return s;const r = e.strings.join(l);if (void 0 === (s = n.keyString.get(r))) {
    const i = e.getTemplateElement();L && window.ShadyCSS.prepareTemplateDom(i, t), s = new u(e, i), n.keyString.set(r, s);
  }return n.stringsArray.set(e.strings, s), s;
},
      z = ["html", "svg"],
      I = new Set(),
      q = (t, e, i) => {
  I.add(i);const n = t.querySelectorAll("style");if (0 === n.length) return void window.ShadyCSS.prepareTemplateStyles(e.element, i);const s = document.createElement("style");for (let t = 0; t < n.length; t++) {
    const e = n[t];e.parentNode.removeChild(e), s.textContent += e.textContent;
  }if ((t => {
    z.forEach(e => {
      const i = M.get(j(e, t));void 0 !== i && i.keyString.forEach(t => {
        const { element: { content: e } } = t,
              i = new Set();Array.from(e.querySelectorAll("style")).forEach(t => {
          i.add(t);
        }), O(t, i);
      });
    });
  })(i), function (t, e, i = null) {
    const { element: { content: n }, parts: s } = t;if (null == i) return void n.appendChild(e);const r = document.createTreeWalker(n, R, null, !1);let a = H(s),
        o = 0,
        l = -1;for (; r.nextNode();) for (l++, r.currentNode === i && (o = V(e), i.parentNode.insertBefore(e, i)); -1 !== a && s[a].index === l;) {
      if (o > 0) {
        for (; -1 !== a;) s[a].index += o, a = H(s, a);return;
      }a = H(s, a);
    }
  }(e, s, e.element.content.firstChild), window.ShadyCSS.prepareTemplateStyles(e.element, i), window.ShadyCSS.nativeShadow) {
    const i = e.element.content.querySelector("style");t.insertBefore(i.cloneNode(!0), t.firstChild);
  } else {
    e.element.content.insertBefore(s, e.element.content.firstChild);const t = new Set();t.add(s), O(e, t);
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
      D = (t, e) => e !== t && (e == e || t == t),
      B = { attribute: !0, type: String, converter: U, reflect: !1, hasChanged: D },
      W = Promise.resolve(!0),
      G = 1,
      J = 4,
      X = 8,
      Y = 16,
      K = 32;class Q extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = W, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
  }static get observedAttributes() {
    this.finalize();const t = [];return this._classProperties.forEach((e, i) => {
      const n = this._attributeNameForProperty(i, e);void 0 !== n && (this._attributeToPropertyMap.set(n, i), t.push(n));
    }), t;
  }static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = new Map();const t = Object.getPrototypeOf(this)._classProperties;void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
    }
  }static createProperty(t, e = B) {
    if (this._ensureClassProperties(), this._classProperties.set(t, e), e.noAccessor || this.prototype.hasOwnProperty(t)) return;const i = "symbol" == typeof t ? Symbol() : `__${t}`;Object.defineProperty(this.prototype, t, { get() {
        return this[i];
      }, set(e) {
        const n = this[t];this[i] = e, this._requestUpdate(t, n);
      }, configurable: !0, enumerable: !0 });
  }static finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty("finalized", this)) && this.finalized) return;const t = Object.getPrototypeOf(this);if ("function" == typeof t.finalize && t.finalize(), this.finalized = !0, this._ensureClassProperties(), this._attributeToPropertyMap = new Map(), this.hasOwnProperty(JSCompiler_renameProperty("properties", this))) {
      const t = this.properties,
            e = [...Object.getOwnPropertyNames(t), ...("function" == typeof Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(t) : [])];for (const i of e) this.createProperty(i, t[i]);
    }
  }static _attributeNameForProperty(t, e) {
    const i = e.attribute;return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
  }static _valueHasChanged(t, e, i = D) {
    return i(t, e);
  }static _propertyValueFromAttribute(t, e) {
    const i = e.type,
          n = e.converter || U,
          s = "function" == typeof n ? n : n.fromAttribute;return s ? s(t, i) : t;
  }static _propertyValueToAttribute(t, e) {
    if (void 0 === e.reflect) return;const i = e.type,
          n = e.converter;return (n && n.toAttribute || U.toAttribute)(t, i);
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
    this._updateState = this._updateState | K, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
  }disconnectedCallback() {}attributeChangedCallback(t, e, i) {
    e !== i && this._attributeToProperty(t, i);
  }_propertyToAttribute(t, e, i = B) {
    const n = this.constructor,
          s = n._attributeNameForProperty(t, i);if (void 0 !== s) {
      const t = n._propertyValueToAttribute(e, i);if (void 0 === t) return;this._updateState = this._updateState | X, null == t ? this.removeAttribute(s) : this.setAttribute(s, t), this._updateState = this._updateState & ~X;
    }
  }_attributeToProperty(t, e) {
    if (this._updateState & X) return;const i = this.constructor,
          n = i._attributeToPropertyMap.get(t);if (void 0 !== n) {
      const t = i._classProperties.get(n) || B;this._updateState = this._updateState | Y, this[n] = i._propertyValueFromAttribute(e, t), this._updateState = this._updateState & ~Y;
    }
  }_requestUpdate(t, e) {
    let i = !0;if (void 0 !== t) {
      const n = this.constructor,
            s = n._classProperties.get(t) || B;n._valueHasChanged(this[t], e, s.hasChanged) ? (this._changedProperties.has(t) || this._changedProperties.set(t, e), !0 !== s.reflect || this._updateState & Y || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(t, s))) : i = !1;
    }!this._hasRequestedUpdate && i && this._enqueueUpdate();
  }requestUpdate(t, e) {
    return this._requestUpdate(t, e), this.updateComplete;
  }async _enqueueUpdate() {
    let t, e;this._updateState = this._updateState | J;const i = this._updatePromise;this._updatePromise = new Promise((i, n) => {
      t = i, e = n;
    });try {
      await i;
    } catch (t) {}this._hasConnected || (await new Promise(t => this._hasConnectedResolver = t));try {
      const t = this.performUpdate();null != t && (await t);
    } catch (t) {
      e(t);
    }t(!this._hasRequestedUpdate);
  }get _hasConnected() {
    return this._updateState & K;
  }get _hasRequestedUpdate() {
    return this._updateState & J;
  }get hasUpdated() {
    return this._updateState & G;
  }performUpdate() {
    this._instanceProperties && this._applyInstanceProperties();let t = !1;const e = this._changedProperties;try {
      (t = this.shouldUpdate(e)) && this.update(e);
    } catch (e) {
      throw t = !1, e;
    } finally {
      this._markUpdated();
    }t && (this._updateState & G || (this._updateState = this._updateState | G, this.firstUpdated(e)), this.updated(e));
  }_markUpdated() {
    this._changedProperties = new Map(), this._updateState = this._updateState & ~J;
  }get updateComplete() {
    return this._updatePromise;
  }shouldUpdate(t) {
    return !0;
  }update(t) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)), this._reflectingProperties = void 0);
  }updated(t) {}firstUpdated(t) {}
}Q.finalized = !0;
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
const Z = (t, e) => "method" !== e.kind || !e.descriptor || "value" in e.descriptor ? { kind: "field", key: Symbol(), placement: "own", descriptor: {}, initializer() {
    "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
  }, finisher(i) {
    i.createProperty(e.key, t);
  } } : Object.assign({}, e, { finisher(i) {
    i.createProperty(e.key, t);
  } }),
      tt = (t, e, i) => {
  e.constructor.createProperty(i, t);
};function et(t) {
  return (e, i) => void 0 !== i ? tt(t, e, i) : Z(t, e);
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
*/const it = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      nt = Symbol();class st {
  constructor(t, e) {
    if (e !== nt) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText = t;
  }get styleSheet() {
    return void 0 === this._styleSheet && (it ? (this._styleSheet = new CSSStyleSheet(), this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
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
(window.litElementVersions || (window.litElementVersions = [])).push("2.0.1");const rt = t => t.flat ? t.flat(1 / 0) : function t(e, i = []) {
  for (let n = 0, s = e.length; n < s; n++) {
    const s = e[n];Array.isArray(s) ? t(s, i) : i.push(s);
  }return i;
}(t);class at extends Q {
  static finalize() {
    super.finalize(), this._styles = this.hasOwnProperty(JSCompiler_renameProperty("styles", this)) ? this._getUniqueStyles() : this._styles || [];
  }static _getUniqueStyles() {
    const t = this.styles,
          e = [];if (Array.isArray(t)) {
      rt(t).reduceRight((t, e) => (t.add(e), t), new Set()).forEach(t => e.unshift(t));
    } else t && e.push(t);return e;
  }initialize() {
    super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }createRenderRoot() {
    return this.attachShadow({ mode: "open" });
  }adoptStyles() {
    const t = this.constructor._styles;0 !== t.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? it ? this.renderRoot.adoptedStyleSheets = t.map(t => t.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t => t.cssText), this.localName));
  }connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }update(t) {
    super.update(t);const e = this.render();e instanceof b && this.constructor.render(e, this.renderRoot, { scopeName: this.localName, eventContext: this }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(t => {
      const e = document.createElement("style");e.textContent = t.cssText, this.renderRoot.appendChild(e);
    }));
  }render() {}
}at.finalized = !0, at.render = (t, e, i) => {
  const n = i.scopeName,
        s = T.has(e),
        a = e instanceof ShadowRoot && L && t instanceof b,
        o = a && !I.has(n),
        l = o ? document.createDocumentFragment() : e;if (((t, e, i) => {
    let n = T.get(e);void 0 === n && (r(e, e.firstChild), T.set(e, n = new w(Object.assign({ templateFactory: N }, i))), n.appendInto(e)), n.setValue(t), n.commit();
  })(t, l, Object.assign({ templateFactory: F(n) }, i)), o) {
    const t = T.get(l);T.delete(l), t.value instanceof g && q(l, t.value.template, n), r(e, e.firstChild), e.appendChild(l), T.set(e, t);
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
const ot = new WeakMap(),
      lt = new WeakMap(),
      ct = i(t => e => {
  if (!(e instanceof v) || e instanceof k || "style" !== e.committer.name || e.committer.parts.length > 1) throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");lt.has(e) || (e.committer.element.style.cssText = e.committer.strings.join(" "), lt.set(e, !0));const i = e.committer.element.style,
        n = ot.get(e);for (const e in n) e in t || (-1 === e.indexOf("-") ? i[e] = null : i.removeProperty(e));for (const e in t) -1 === e.indexOf("-") ? i[e] = t[e] : i.setProperty(e, t[e]);ot.set(e, t);
}),
      ht = new WeakMap(),
      dt = i(t => e => {
  if (!(e instanceof w)) throw new Error("unsafeHTML can only be used in text bindings");const i = ht.get(e);if (void 0 !== i && y(t) && t === i.value && e.value === i.fragment) return;const n = document.createElement("template");n.innerHTML = t;const s = document.importNode(n.content, !0);e.setValue(s), ht.set(e, { value: t, fragment: s });
}),
      ut = i(t => e => {
  if (void 0 === t && e instanceof v) {
    if (t !== e.value) {
      const t = e.committer.name;e.committer.element.removeAttribute(t);
    }
  } else e.setValue(t);
}),
      pt = "hass:bookmark",
      ft = ["closed", "locked", "off"],
      mt = { alert: "hass:alert", automation: "hass:playlist-play", calendar: "hass:calendar", camera: "hass:video", climate: "hass:thermostat", configurator: "hass:settings", conversation: "hass:text-to-speech", device_tracker: "hass:account", fan: "hass:fan", group: "hass:google-circles-communities", history_graph: "hass:chart-line", homeassistant: "hass:home-assistant", homekit: "hass:home-automation", image_processing: "hass:image-filter-frames", input_boolean: "hass:drawing", input_datetime: "hass:calendar-clock", input_number: "hass:ray-vertex", input_select: "hass:format-list-bulleted", input_text: "hass:textbox", light: "hass:lightbulb", mailbox: "hass:mailbox", notify: "hass:comment-alert", person: "hass:account", plant: "hass:flower", proximity: "hass:apple-safari", remote: "hass:remote", scene: "hass:google-pages", script: "hass:file-document", sensor: "hass:eye", simple_alarm: "hass:bell", sun: "hass:white-balance-sunny", switch: "hass:flash", timer: "hass:timer", updater: "hass:cloud-upload", vacuum: "hass:robot-vacuum", water_heater: "hass:thermometer", weblink: "hass:open-in-new" };function gt(t, e) {
  (function (t) {
    return "string" == typeof t && -1 !== t.indexOf(".") && 1 === parseFloat(t);
  })(t) && (t = "100%");var i = function (t) {
    return "string" == typeof t && -1 !== t.indexOf("%");
  }(t);return t = 360 === e ? t : Math.min(e, Math.max(0, parseFloat(t))), i && (t = parseInt(String(t * e), 10) / 100), Math.abs(t - e) < 1e-6 ? 1 : t = 360 === e ? (t < 0 ? t % e + e : t % e) / parseFloat(String(e)) : t % e / parseFloat(String(e));
}function bt(t) {
  return Math.min(1, Math.max(0, t));
}function yt(t) {
  return t = parseFloat(t), (isNaN(t) || t < 0 || t > 1) && (t = 1), t;
}function _t(t) {
  return t <= 1 ? 100 * Number(t) + "%" : t;
}function vt(t) {
  return 1 === t.length ? "0" + t : String(t);
}function wt(t, e, i) {
  t = gt(t, 255), e = gt(e, 255), i = gt(i, 255);var n = Math.max(t, e, i),
      s = Math.min(t, e, i),
      r = 0,
      a = 0,
      o = (n + s) / 2;if (n === s) a = 0, r = 0;else {
    var l = n - s;switch (a = o > .5 ? l / (2 - n - s) : l / (n + s), n) {case t:
        r = (e - i) / l + (e < i ? 6 : 0);break;case e:
        r = (i - t) / l + 2;break;case i:
        r = (t - e) / l + 4;}r /= 6;
  }return { h: r, s: a, l: o };
}function St(t, e, i) {
  t = gt(t, 255), e = gt(e, 255), i = gt(i, 255);var n = Math.max(t, e, i),
      s = Math.min(t, e, i),
      r = 0,
      a = n,
      o = n - s,
      l = 0 === n ? 0 : o / n;if (n === s) r = 0;else {
    switch (n) {case t:
        r = (e - i) / o + (e < i ? 6 : 0);break;case e:
        r = (i - t) / o + 2;break;case i:
        r = (t - e) / o + 4;}r /= 6;
  }return { h: r, s: l, v: a };
}function xt(t, e, i, n) {
  var s = [vt(Math.round(t).toString(16)), vt(Math.round(e).toString(16)), vt(Math.round(i).toString(16))];return n && s[0].charAt(0) === s[0].charAt(1) && s[1].charAt(0) === s[1].charAt(1) && s[2].charAt(0) === s[2].charAt(1) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("");
}function kt(t) {
  return Ct(t) / 255;
}function Ct(t) {
  return parseInt(t, 16);
}var At = { aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", rebeccapurple: "#663399", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32" };function Pt(t) {
  var e,
      i,
      n,
      s = { r: 0, g: 0, b: 0 },
      r = 1,
      a = null,
      o = null,
      l = null,
      c = !1,
      h = !1;return "string" == typeof t && (t = function (t) {
    if (0 === (t = t.trim().toLowerCase()).length) return !1;var e = !1;if (At[t]) t = At[t], e = !0;else if ("transparent" === t) return { r: 0, g: 0, b: 0, a: 0, format: "name" };var i = Tt.rgb.exec(t);if (i) return { r: i[1], g: i[2], b: i[3] };if (i = Tt.rgba.exec(t)) return { r: i[1], g: i[2], b: i[3], a: i[4] };if (i = Tt.hsl.exec(t)) return { h: i[1], s: i[2], l: i[3] };if (i = Tt.hsla.exec(t)) return { h: i[1], s: i[2], l: i[3], a: i[4] };if (i = Tt.hsv.exec(t)) return { h: i[1], s: i[2], v: i[3] };if (i = Tt.hsva.exec(t)) return { h: i[1], s: i[2], v: i[3], a: i[4] };if (i = Tt.hex8.exec(t)) return { r: Ct(i[1]), g: Ct(i[2]), b: Ct(i[3]), a: kt(i[4]), format: e ? "name" : "hex8" };if (i = Tt.hex6.exec(t)) return { r: Ct(i[1]), g: Ct(i[2]), b: Ct(i[3]), format: e ? "name" : "hex" };if (i = Tt.hex4.exec(t)) return { r: Ct(i[1] + i[1]), g: Ct(i[2] + i[2]), b: Ct(i[3] + i[3]), a: kt(i[4] + i[4]), format: e ? "name" : "hex8" };if (i = Tt.hex3.exec(t)) return { r: Ct(i[1] + i[1]), g: Ct(i[2] + i[2]), b: Ct(i[3] + i[3]), format: e ? "name" : "hex" };return !1;
  }(t)), "object" == typeof t && ($t(t.r) && $t(t.g) && $t(t.b) ? (e = t.r, i = t.g, n = t.b, s = { r: 255 * gt(e, 255), g: 255 * gt(i, 255), b: 255 * gt(n, 255) }, c = !0, h = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : $t(t.h) && $t(t.s) && $t(t.v) ? (a = _t(t.s), o = _t(t.v), s = function (t, e, i) {
    t = 6 * gt(t, 360), e = gt(e, 100), i = gt(i, 100);var n = Math.floor(t),
        s = t - n,
        r = i * (1 - e),
        a = i * (1 - s * e),
        o = i * (1 - (1 - s) * e),
        l = n % 6;return { r: 255 * [i, a, r, r, o, i][l], g: 255 * [o, i, i, a, r, r][l], b: 255 * [r, r, o, i, i, a][l] };
  }(t.h, a, o), c = !0, h = "hsv") : $t(t.h) && $t(t.s) && $t(t.l) && (a = _t(t.s), l = _t(t.l), s = function (t, e, i) {
    var n, s, r;function a(t, e, i) {
      return i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6 ? t + 6 * i * (e - t) : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t;
    }if (t = gt(t, 360), e = gt(e, 100), i = gt(i, 100), 0 === e) s = i, r = i, n = i;else {
      var o = i < .5 ? i * (1 + e) : i + e - i * e,
          l = 2 * i - o;n = a(l, o, t + 1 / 3), s = a(l, o, t), r = a(l, o, t - 1 / 3);
    }return { r: 255 * n, g: 255 * s, b: 255 * r };
  }(t.h, a, l), c = !0, h = "hsl"), Object.prototype.hasOwnProperty.call(t, "a") && (r = t.a)), r = yt(r), { ok: c, format: t.format || h, r: Math.min(255, Math.max(s.r, 0)), g: Math.min(255, Math.max(s.g, 0)), b: Math.min(255, Math.max(s.b, 0)), a: r };
}var Et = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",
    Nt = "[\\s|\\(]+(" + Et + ")[,|\\s]+(" + Et + ")[,|\\s]+(" + Et + ")\\s*\\)?",
    Mt = "[\\s|\\(]+(" + Et + ")[,|\\s]+(" + Et + ")[,|\\s]+(" + Et + ")[,|\\s]+(" + Et + ")\\s*\\)?",
    Tt = { CSS_UNIT: new RegExp(Et), rgb: new RegExp("rgb" + Nt), rgba: new RegExp("rgba" + Mt), hsl: new RegExp("hsl" + Nt), hsla: new RegExp("hsla" + Mt), hsv: new RegExp("hsv" + Nt), hsva: new RegExp("hsva" + Mt), hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ };function $t(t) {
  return Boolean(Tt.CSS_UNIT.exec(String(t)));
}var Rt = function () {
  function t(e, i) {
    if (void 0 === e && (e = ""), void 0 === i && (i = {}), e instanceof t) return e;this.originalInput = e;var n = Pt(e);this.originalInput = e, this.r = n.r, this.g = n.g, this.b = n.b, this.a = n.a, this.roundA = Math.round(100 * this.a) / 100, this.format = i.format || n.format, this.gradientType = i.gradientType, this.r < 1 && (this.r = Math.round(this.r)), this.g < 1 && (this.g = Math.round(this.g)), this.b < 1 && (this.b = Math.round(this.b)), this.isValid = n.ok;
  }return t.prototype.isDark = function () {
    return this.getBrightness() < 128;
  }, t.prototype.isLight = function () {
    return !this.isDark();
  }, t.prototype.getBrightness = function () {
    var t = this.toRgb();return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3;
  }, t.prototype.getLuminance = function () {
    var t = this.toRgb(),
        e = t.r / 255,
        i = t.g / 255,
        n = t.b / 255;return .2126 * (e <= .03928 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4)) + .7152 * (i <= .03928 ? i / 12.92 : Math.pow((i + .055) / 1.055, 2.4)) + .0722 * (n <= .03928 ? n / 12.92 : Math.pow((n + .055) / 1.055, 2.4));
  }, t.prototype.getAlpha = function () {
    return this.a;
  }, t.prototype.setAlpha = function (t) {
    return this.a = yt(t), this.roundA = Math.round(100 * this.a) / 100, this;
  }, t.prototype.toHsv = function () {
    var t = St(this.r, this.g, this.b);return { h: 360 * t.h, s: t.s, v: t.v, a: this.a };
  }, t.prototype.toHsvString = function () {
    var t = St(this.r, this.g, this.b),
        e = Math.round(360 * t.h),
        i = Math.round(100 * t.s),
        n = Math.round(100 * t.v);return 1 === this.a ? "hsv(" + e + ", " + i + "%, " + n + "%)" : "hsva(" + e + ", " + i + "%, " + n + "%, " + this.roundA + ")";
  }, t.prototype.toHsl = function () {
    var t = wt(this.r, this.g, this.b);return { h: 360 * t.h, s: t.s, l: t.l, a: this.a };
  }, t.prototype.toHslString = function () {
    var t = wt(this.r, this.g, this.b),
        e = Math.round(360 * t.h),
        i = Math.round(100 * t.s),
        n = Math.round(100 * t.l);return 1 === this.a ? "hsl(" + e + ", " + i + "%, " + n + "%)" : "hsla(" + e + ", " + i + "%, " + n + "%, " + this.roundA + ")";
  }, t.prototype.toHex = function (t) {
    return void 0 === t && (t = !1), xt(this.r, this.g, this.b, t);
  }, t.prototype.toHexString = function (t) {
    return void 0 === t && (t = !1), "#" + this.toHex(t);
  }, t.prototype.toHex8 = function (t) {
    return void 0 === t && (t = !1), function (t, e, i, n, s) {
      var r,
          a = [vt(Math.round(t).toString(16)), vt(Math.round(e).toString(16)), vt(Math.round(i).toString(16)), vt((r = n, Math.round(255 * parseFloat(r)).toString(16)))];return s && a[0].charAt(0) === a[0].charAt(1) && a[1].charAt(0) === a[1].charAt(1) && a[2].charAt(0) === a[2].charAt(1) && a[3].charAt(0) === a[3].charAt(1) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0) : a.join("");
    }(this.r, this.g, this.b, this.a, t);
  }, t.prototype.toHex8String = function (t) {
    return void 0 === t && (t = !1), "#" + this.toHex8(t);
  }, t.prototype.toRgb = function () {
    return { r: Math.round(this.r), g: Math.round(this.g), b: Math.round(this.b), a: this.a };
  }, t.prototype.toRgbString = function () {
    var t = Math.round(this.r),
        e = Math.round(this.g),
        i = Math.round(this.b);return 1 === this.a ? "rgb(" + t + ", " + e + ", " + i + ")" : "rgba(" + t + ", " + e + ", " + i + ", " + this.roundA + ")";
  }, t.prototype.toPercentageRgb = function () {
    var t = function (t) {
      return Math.round(100 * gt(t, 255)) + "%";
    };return { r: t(this.r), g: t(this.g), b: t(this.b), a: this.a };
  }, t.prototype.toPercentageRgbString = function () {
    var t = function (t) {
      return Math.round(100 * gt(t, 255));
    };return 1 === this.a ? "rgb(" + t(this.r) + "%, " + t(this.g) + "%, " + t(this.b) + "%)" : "rgba(" + t(this.r) + "%, " + t(this.g) + "%, " + t(this.b) + "%, " + this.roundA + ")";
  }, t.prototype.toName = function () {
    if (0 === this.a) return "transparent";if (this.a < 1) return !1;for (var t = "#" + xt(this.r, this.g, this.b, !1), e = 0, i = Object.keys(At); e < i.length; e++) {
      var n = i[e];if (At[n] === t) return n;
    }return !1;
  }, t.prototype.toString = function (t) {
    var e = Boolean(t);t = t || this.format;var i = !1,
        n = this.a < 1 && this.a >= 0;return e || !n || !t.startsWith("hex") && "name" !== t ? ("rgb" === t && (i = this.toRgbString()), "prgb" === t && (i = this.toPercentageRgbString()), "hex" !== t && "hex6" !== t || (i = this.toHexString()), "hex3" === t && (i = this.toHexString(!0)), "hex4" === t && (i = this.toHex8String(!0)), "hex8" === t && (i = this.toHex8String()), "name" === t && (i = this.toName()), "hsl" === t && (i = this.toHslString()), "hsv" === t && (i = this.toHsvString()), i || this.toHexString()) : "name" === t && 0 === this.a ? this.toName() : this.toRgbString();
  }, t.prototype.clone = function () {
    return new t(this.toString());
  }, t.prototype.lighten = function (e) {
    void 0 === e && (e = 10);var i = this.toHsl();return i.l += e / 100, i.l = bt(i.l), new t(i);
  }, t.prototype.brighten = function (e) {
    void 0 === e && (e = 10);var i = this.toRgb();return i.r = Math.max(0, Math.min(255, i.r - Math.round(-e / 100 * 255))), i.g = Math.max(0, Math.min(255, i.g - Math.round(-e / 100 * 255))), i.b = Math.max(0, Math.min(255, i.b - Math.round(-e / 100 * 255))), new t(i);
  }, t.prototype.darken = function (e) {
    void 0 === e && (e = 10);var i = this.toHsl();return i.l -= e / 100, i.l = bt(i.l), new t(i);
  }, t.prototype.tint = function (t) {
    return void 0 === t && (t = 10), this.mix("white", t);
  }, t.prototype.shade = function (t) {
    return void 0 === t && (t = 10), this.mix("black", t);
  }, t.prototype.desaturate = function (e) {
    void 0 === e && (e = 10);var i = this.toHsl();return i.s -= e / 100, i.s = bt(i.s), new t(i);
  }, t.prototype.saturate = function (e) {
    void 0 === e && (e = 10);var i = this.toHsl();return i.s += e / 100, i.s = bt(i.s), new t(i);
  }, t.prototype.greyscale = function () {
    return this.desaturate(100);
  }, t.prototype.spin = function (e) {
    var i = this.toHsl(),
        n = (i.h + e) % 360;return i.h = n < 0 ? 360 + n : n, new t(i);
  }, t.prototype.mix = function (e, i) {
    void 0 === i && (i = 50);var n = this.toRgb(),
        s = new t(e).toRgb(),
        r = i / 100;return new t({ r: (s.r - n.r) * r + n.r, g: (s.g - n.g) * r + n.g, b: (s.b - n.b) * r + n.b, a: (s.a - n.a) * r + n.a });
  }, t.prototype.analogous = function (e, i) {
    void 0 === e && (e = 6), void 0 === i && (i = 30);var n = this.toHsl(),
        s = 360 / i,
        r = [this];for (n.h = (n.h - (s * e >> 1) + 720) % 360; --e;) n.h = (n.h + s) % 360, r.push(new t(n));return r;
  }, t.prototype.complement = function () {
    var e = this.toHsl();return e.h = (e.h + 180) % 360, new t(e);
  }, t.prototype.monochromatic = function (e) {
    void 0 === e && (e = 6);for (var i = this.toHsv(), n = i.h, s = i.s, r = i.v, a = [], o = 1 / e; e--;) a.push(new t({ h: n, s: s, v: r })), r = (r + o) % 1;return a;
  }, t.prototype.splitcomplement = function () {
    var e = this.toHsl(),
        i = e.h;return [this, new t({ h: (i + 72) % 360, s: e.s, l: e.l }), new t({ h: (i + 216) % 360, s: e.s, l: e.l })];
  }, t.prototype.triad = function () {
    return this.polyad(3);
  }, t.prototype.tetrad = function () {
    return this.polyad(4);
  }, t.prototype.polyad = function (e) {
    for (var i = this.toHsl(), n = i.h, s = [this], r = 360 / e, a = 1; a < e; a++) s.push(new t({ h: (n + a * r) % 360, s: i.s, l: i.l }));return s;
  }, t.prototype.equals = function (e) {
    return this.toRgbString() === new t(e).toRgbString();
  }, t;
}();function Ot(t, e) {
  return void 0 === t && (t = ""), void 0 === e && (e = {}), new Rt(t, e);
}function Vt(t) {
  return t.substr(0, t.indexOf("."));
}function Ht(t) {
  return "var" === t.substring(0, 3) ? window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0, -1)).trim() : t;
}function jt(t, e) {
  const i = new Rt(Ht(t));if (i.isValid) {
    const t = i.mix("black", 100 - e).toString();if (t) return t;
  }return t;
}function Lt(...t) {
  const e = t => t && "object" == typeof t;return t.reduce((t, i) => (Object.keys(i).forEach(n => {
    const s = t[n],
          r = i[n];Array.isArray(s) && Array.isArray(r) ? t[n] = s.concat(...r) : e(s) && e(r) ? t[n] = Lt(s, r) : t[n] = r;
  }), t), {});
}const Ft = (t, e, i, n) => {
  n = n || {}, i = null == i ? {} : i;const s = new Event(e, { bubbles: void 0 === n.bubbles || n.bubbles, cancelable: Boolean(n.cancelable), composed: void 0 === n.composed || n.composed });return s.detail = i, t.dispatchEvent(s), s;
},
      zt = (t, e) => {
  return ((t, e, i = !0) => {
    const n = Vt(e),
          s = "group" === n ? "homeassistant" : n;let r;switch (n) {case "lock":
        r = i ? "unlock" : "lock";break;case "cover":
        r = i ? "open_cover" : "close_cover";break;default:
        r = i ? "turn_on" : "turn_off";}return t.callService(s, r, { entity_id: e });
  })(t, e, ft.includes(t.states[e].state));
},
      It = (t, e) => {
  Ft(t, "haptic", e);
},
      qt = (t, e, i, n, s) => {
  let r;switch (s && i.dbltap_action ? r = i.dbltap_action : n && i.hold_action ? r = i.hold_action : !n && i.tap_action && (r = i.tap_action), r || (r = { action: "toggle" }), r.action) {case "more-info":
      (i.entity || i.camera_image) && (Ft(t, "hass-more-info", { entityId: i.entity ? i.entity : i.camera_image }), r.haptic && It(t, r.haptic));break;case "navigate":
      r.navigation_path && (((t, e, i = !1) => {
        i ? history.replaceState(null, "", e) : history.pushState(null, "", e), Ft(window, "location-changed", { replace: i });
      })(0, r.navigation_path), r.haptic && It(t, r.haptic));break;case "url":
      r.url && window.open(r.url), r.haptic && It(t, r.haptic);break;case "toggle":
      i.entity && (zt(e, i.entity), r.haptic && It(t, r.haptic));break;case "call-service":
      {
        if (!r.service) return;const [n, s] = r.service.split(".", 2),
              a = Object.assign({}, r);r.service_data && "entity" === r.service_data.entity_id && (a.service_data.entity_id = i.entity), e.callService(n, s, a.service_data), r.haptic && It(t, r.haptic);
      }}
},
      Ut = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;customElements.define("long-press-button-card", class extends HTMLElement {
  constructor() {
    super(), this.holdTime = 500, this.ripple = document.createElement("paper-ripple"), this.timer = void 0, this.held = !1, this.cooldownStart = !1, this.cooldownEnd = !1, this.nbClicks = 0;
  }connectedCallback() {
    Object.assign(this.style, { borderRadius: "50%", position: "absolute", width: Ut ? "100px" : "50px", height: Ut ? "100px" : "50px", transform: "translate(-50%, -50%)", pointerEvents: "none" }), this.appendChild(this.ripple), this.ripple.style.color = "#03a9f4", this.ripple.style.color = "var(--primary-color)", ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(t => {
      document.addEventListener(t, () => {
        clearTimeout(this.timer), this.stopAnimation(), this.timer = void 0;
      }, { passive: !0 });
    });
  }bind(t) {
    if (t.longPress) return;t.longPress = !0, t.addEventListener("contextmenu", t => {
      const e = t || window.event;return e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, !1;
    });const e = e => {
      if (this.cooldownStart) return;let i, n;this.held = !1, e.touches ? (i = e.touches[0].pageX, n = e.touches[0].pageY) : (i = e.pageX, n = e.pageY), this.timer = window.setTimeout(() => {
        this.startAnimation(i, n), this.held = !0, t.repeat && !t.isRepeating && (t.isRepeating = !0, this.repeatTimeout = setInterval(() => {
          t.dispatchEvent(new Event("ha-hold"));
        }, t.repeat));
      }, this.holdTime), this.cooldownStart = !0, window.setTimeout(() => this.cooldownStart = !1, 100);
    },
          i = e => {
      this.cooldownEnd || ["touchend", "touchcancel"].includes(e.type) && void 0 === this.timer ? t.isRepeating && this.repeatTimeout && (clearInterval(this.repeatTimeout), t.isRepeating = !1) : (clearTimeout(this.timer), t.isRepeating && this.repeatTimeout && clearInterval(this.repeatTimeout), t.isRepeating = !1, this.stopAnimation(), this.timer = void 0, this.held ? t.repeat || t.dispatchEvent(new Event("ha-hold")) : t.hasDblClick ? 0 === this.nbClicks ? (this.nbClicks += 1, this.dblClickTimeout = window.setTimeout(() => {
        1 === this.nbClicks && (this.nbClicks = 0, t.dispatchEvent(new Event("ha-click")));
      }, 250)) : (this.nbClicks = 0, clearTimeout(this.dblClickTimeout), t.dispatchEvent(new Event("ha-dblclick"))) : t.dispatchEvent(new Event("ha-click")), this.cooldownEnd = !0, window.setTimeout(() => this.cooldownEnd = !1, 100));
    };t.addEventListener("touchstart", e, { passive: !0 }), t.addEventListener("touchend", i), t.addEventListener("touchcancel", i), t.addEventListener("mousedown", e, { passive: !0 }), t.addEventListener("click", i);
  }startAnimation(t, e) {
    Object.assign(this.style, { left: `${t}px`, top: `${e}px`, display: null }), this.ripple.holdDown = !0, this.ripple.simulatedRipple();
  }stopAnimation() {
    this.ripple.holdDown = !1, this.style.display = "none";
  }
});const Dt = t => {
  const e = (() => {
    const t = document.body;if (t.querySelector("long-press-button-card")) return t.querySelector("long-press-button-card");const e = document.createElement("long-press-button-card");return t.appendChild(e), e;
  })();e && e.bind(t);
},
      Bt = i(() => t => {
  Dt(t.committer.element);
}),
      Wt = ((t, ...e) => {
  const i = e.reduce((e, i, n) => e + (t => {
    if (t instanceof st) return t.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(i) + t[n + 1], t[0]);return new st(i, nt);
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
    max-height: 100%;
    text-align: center;
    height: 100%;
    align-items: center;
  }
  #img-cell {
    /* display: flex; */
    grid-area: i;
    width: 100%;
    max-width: 100%;
    align-self: center;
  }

  ha-icon#icon, img#icon {
    height: 100%;
    max-width: 100%;
    object-fit: contain;
    overflow: hidden;
    vertical-align: middle;
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

  #container {
    width: 100%;
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
`;let Gt = class extends at {
  static get styles() {
    return Wt;
  }render() {
    return this.config && this.hass ? this._cardHtml() : $``;
  }shouldUpdate(t) {
    const e = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          i = this._getMatchingConfigState(e);return function (t, e, i) {
      if (e.has("config") || i) return !0;if (t.config.entity) {
        const i = e.get("hass");return !i || i.states[t.config.entity] !== t.hass.states[t.config.entity];
      }return !1;
    }(this, t, !!(this.config.show_label && (i && i.label_template || this.config.label_template) || this.config.state && this.config.state.find(t => "template" === t.operator)));
  }_getMatchingConfigState(t) {
    if (!this.config.state) return;const e = this.config.state.find(t => "template" === t.operator);if (!t && !e) return;let i;const n = this.config.state.find(e => {
      if (!e.operator) return t && e.value == t.state;switch (e.operator) {case "==":
          return t && t.state == e.value;case "<=":
          return t && t.state <= e.value;case "<":
          return t && t.state < e.value;case ">=":
          return t && t.state >= e.value;case ">":
          return t && t.state > e.value;case "!=":
          return t && t.state != e.value;case "regex":
          return !(!t || !t.state.match(e.value));case "template":
          return new Function("states", "entity", "user", "hass", `'use strict'; ${e.value}`).call(this, this.hass.states, t, this.hass.user, this.hass);case "default":
          return i = e, !1;default:
          return !1;}
    });return !n && i ? i : n;
  }_getDefaultColorForState(t) {
    switch (t.state) {case "on":
        return this.config.color_on;case "off":
        return this.config.color_off;default:
        return this.config.default_color;}
  }_getColorForLightEntity(t) {
    let e = this.config.default_color;return t && (t.attributes.rgb_color ? (e = `rgb(${t.attributes.rgb_color.join(",")})`, t.attributes.brightness && (e = jt(e, (t.attributes.brightness + 245) / 5))) : t.attributes.color_temp && t.attributes.min_mireds && t.attributes.max_mireds ? (e = function (t, e, i) {
      const n = new Rt("rgb(255, 160, 0)"),
            s = new Rt("rgb(166, 209, 255)"),
            r = new Rt("white"),
            a = (t - e) / (i - e) * 100;return a < 50 ? Ot(s).mix(r, 2 * a).toRgbString() : Ot(r).mix(n, 2 * (a - 50)).toRgbString();
    }(t.attributes.color_temp, t.attributes.min_mireds, t.attributes.max_mireds), t.attributes.brightness && (e = jt(e, (t.attributes.brightness + 245) / 5))) : e = t.attributes.brightness ? jt(this._getDefaultColorForState(t), (t.attributes.brightness + 245) / 5) : this._getDefaultColorForState(t)), e;
  }_buildCssColorAttribute(t, e) {
    let i,
        n = "";return e && e.color ? n = e.color : "auto" !== this.config.color && t && "off" === t.state ? n = this.config.color_off : this.config.color && (n = this.config.color), i = "auto" == n ? this._getColorForLightEntity(t) : n || (t ? this._getDefaultColorForState(t) : this.config.default_color);
  }_buildIcon(t, e) {
    if (!this.config.show_icon) return;let i;return e && e.icon ? i = e.icon : this.config.icon ? i = this.config.icon : t && t.attributes && (i = t.attributes.icon ? t.attributes.icon : function (t, e) {
      if (t in mt) return mt[t];switch (t) {case "alarm_control_panel":
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
          return console.warn("Unable to find icon for domain " + t + " (" + e + ")"), pt;}
    }(Vt(t.entity_id), t.state)), i;
  }_buildEntityPicture(t, e) {
    if (!this.config.show_entity_picture || !t && !e && !this.config.entity_picture) return;let i;return i = e && e.entity_picture ? e.entity_picture : this.config.entity_picture ? this.config.entity_picture : t && t.attributes && t.attributes.entity_picture ? t.attributes.entity_picture : void 0;
  }_buildStyleGeneric(t, e) {
    let i = {};if (this.config.styles[e] && (i = Object.assign(i, ...this.config.styles[e])), t && t.styles[e]) {
      let n = {};n = Object.assign(n, ...t.styles[e]), i = Object.assign({}, i, n);
    }return i;
  }_buildName(t, e) {
    if (!1 === this.config.show_name) return;let i;var n;return e && e.name ? i = e.name : this.config.name ? i = this.config.name : t && (i = t.attributes && t.attributes.friendly_name ? t.attributes.friendly_name : (n = t.entity_id).substr(n.indexOf(".") + 1)), i;
  }_buildStateString(t) {
    let e;if (this.config.show_state && t && t.state) {
      const i = ((t, e) => {
        let i;const n = Vt(e.entity_id);return "binary_sensor" === n ? (e.attributes.device_class && (i = t(`state.${n}.${e.attributes.device_class}.${e.state}`)), i || (i = t(`state.${n}.default.${e.state}`))) : i = e.attributes.unit_of_measurement && !["unknown", "unavailable"].includes(e.state) ? e.state : "zwave" === n ? ["initializing", "dead"].includes(e.state) ? t(`state.zwave.query_stage.${e.state}`, "query_stage", e.attributes.query_stage) : t(`state.zwave.default.${e.state}`) : t(`state.${n}.${e.state}`), i || (i = t(`state.default.${e.state}`) || t(`component.${n}.state.${e.state}`) || e.state), i;
      })(this.hass.localize, t),
            n = this._buildUnits(t);e = n ? `${t.state} ${n}` : i;
    }return e;
  }_buildUnits(t) {
    let e;return t && this.config.show_units && (e = t.attributes && t.attributes.unit_of_measurement && !this.config.units ? t.attributes.unit_of_measurement : this.config.units ? this.config.units : void 0), e;
  }_buildLastChanged(t, e) {
    return this.config.show_last_changed && t ? $`<ha-relative-time id="label" class="ellipsis" .hass="${this.hass}" .datetime="${t.last_changed}" style=${ct(e)}></ha-relative-time>` : void 0;
  }_buildLabel(t, e) {
    if (!this.config.show_label) return;let i, n;return (n = e && e.label_template ? e.label_template : this.config.label_template) ? new Function("states", "entity", "user", "hass", `'use strict'; ${n}`).call(this, this.hass.states, t, this.hass.user, this.hass) : i = e && e.label ? e.label : this.config.label;
  }_isClickable(t) {
    let e = !0;if ("toggle" === this.config.tap_action.action && "none" === this.config.hold_action.action || "toggle" === this.config.hold_action.action && "none" === this.config.tap_action.action) {
      if (t) switch (Vt(t.entity_id)) {case "sensor":case "binary_sensor":case "device_tracker":
          e = !1;break;default:
          e = !0;} else e = !1;
    } else e = "none" != this.config.tap_action.action || "none" != this.config.hold_action.action;return e;
  }_rotate(t) {
    return !(!t || !t.spin);
  }_blankCardColoredHtml(t) {
    const e = Object.assign({ background: "none", "box-shadow": "none" }, t);return $`
      <ha-card class="disabled" style=${ct(e)}>
        <div></div>
      </ha-card>
      `;
  }_cardHtml() {
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          e = this._getMatchingConfigState(t),
          i = this._buildCssColorAttribute(t, e);let n = i,
        s = {},
        r = {};const a = this._buildStyleGeneric(e, "lock"),
          o = this._buildStyleGeneric(e, "card");switch (o.width && (this.style.setProperty("flex", "0 0 auto"), this.style.setProperty("max-width", "fit-content")), this.config.color_type) {case "blank-card":
        return this._blankCardColoredHtml(o);case "card":case "label-card":
        {
          const t = function (t) {
            const e = new Rt(Ht(t));return e.isValid && e.getLuminance() > .5 ? "rgb(62, 62, 62)" : "rgb(234, 234, 234)";
          }(i);s.color = t, r.color = t, s["background-color"] = i, s = Object.assign({}, s, o), n = "inherit";break;
        }default:
        s = o;}return this.style.setProperty("--button-card-light-color", this._getColorForLightEntity(t)), r = Object.assign({}, r, a), $`
      <ha-card class="button-card-main ${this._isClickable(t) ? "" : "disabled"}" style=${ct(s)} @ha-click="${this._handleTap}" @ha-hold="${this._handleHold}" @ha-dblclick=${this._handleDblTap} .hasDblClick=${"none" !== this.config.dbltap_action.action} .repeat=${ut(this.config.hold_action.repeat)} .longpress="${Bt()}" .config="${this.config}">
        ${this._getLock(r)}
        ${this._buttonContent(t, e, n)}
        ${this.config.lock ? "" : $`<mwc-ripple id="ripple"></mwc-ripple>`}
      </ha-card>
      `;
  }_getLock(t) {
    return this.config.lock ? $`
        <div id="overlay" style=${ct(t)} @click=${this._handleLock} @touchstart=${this._handleLock}>
          <ha-icon id="lock" icon="mdi:lock-outline"></iron-icon>
        </div>
      ` : $``;
  }_buttonContent(t, e, i) {
    const n = this._buildName(t, e),
          s = this._buildStateString(t),
          r = function (t, e) {
      if (!t && !e) return;let i;return i = e ? t ? `${t}: ${e}` : e : t;
    }(n, s);switch (this.config.layout) {case "icon_name_state":case "name_state":
        return this._gridHtml(t, e, this.config.layout, i, r, void 0);default:
        return this._gridHtml(t, e, this.config.layout, i, n, s);}
  }_gridHtml(t, e, i, n, s, r) {
    const a = this._getIconHtml(t, e, n),
          o = [i],
          l = this._buildLabel(t, e),
          c = this._buildStyleGeneric(e, "name"),
          h = this._buildStyleGeneric(e, "state"),
          d = this._buildStyleGeneric(e, "label"),
          u = this._buildLastChanged(t, d),
          p = this._buildStyleGeneric(e, "grid");return a || o.push("no-icon"), s || o.push("no-name"), r || o.push("no-state"), l || u || o.push("no-label"), $`
      <div id="container" class=${o.join(" ")} style=${ct(p)}>
        ${a || ""}
        ${s ? $`<div id="name" class="ellipsis" style=${ct(c)}>${s}</div>` : ""}
        ${r ? $`<div id="state" class="ellipsis" style=${ct(h)}>${r}</div>` : ""}
        ${l && !u ? $`<div id="label" class="ellipsis" style=${ct(d)}>${dt(l)}</div>` : ""}
        ${u || ""}
      </div>
    `;
  }_getIconHtml(t, e, i) {
    const n = this._buildIcon(t, e),
          s = this._buildEntityPicture(t, e),
          r = this._buildStyleGeneric(e, "entity_picture"),
          a = this._buildStyleGeneric(e, "icon"),
          o = this._buildStyleGeneric(e, "img_cell"),
          l = Object.assign({ color: i, width: this.config.size }, a),
          c = Object.assign({}, l, r);return n || s ? $`
        <div id="img-cell" style=${ct(o)}>
          ${n && !s ? $`<ha-icon style=${ct(l)}
            .icon="${n}" id="icon" ?rotating=${this._rotate(e)}></ha-icon>` : ""}
          ${s ? $`<img src="${s}" style=${ct(c)}
            id="icon" ?rotating=${this._rotate(e)} />` : ""}
        </div>
      ` : void 0;
  }setConfig(t) {
    if (!t) throw new Error("Invalid configuration");const e = function () {
      let t = document.querySelector("home-assistant");if (t = (t = (t = (t = (t = (t = (t = (t = t && t.shadowRoot) && t.querySelector("home-assistant-main")) && t.shadowRoot) && t.querySelector("app-drawer-layout partial-panel-resolver")) && t.shadowRoot || t) && t.querySelector("ha-panel-lovelace")) && t.shadowRoot) && t.querySelector("hui-root")) {
        const e = t.lovelace;return e.current_view = t.___curView, e;
      }return null;
    }();let i = Object.assign({}, t),
        n = i.template;for (; n && e.config.button_card_templates && e.config.button_card_templates[n];) i = Lt(e.config.button_card_templates[n], i), n = e.config.button_card_templates[n].template;this.config = Object.assign({ tap_action: { action: "toggle" }, hold_action: { action: "none" }, dbltap_action: { action: "none" }, layout: "vertical", size: "40%", color_type: "icon", show_name: !0, show_state: !1, show_icon: !0, show_units: !0, show_label: !1, show_entity_picture: !1 }, i), this.config.default_color = "var(--primary-text-color)", "icon" !== this.config.color_type ? this.config.color_off = "var(--paper-card-background-color)" : this.config.color_off = "var(--paper-item-icon-color)", this.config.color_on = "var(--paper-item-icon-active-color)", this.config.styles || (this.config.styles = {}), this.config.style && !this.config.styles.card && (this.config.styles.card = this.config.style), this.config.entity_picture_style && !this.config.styles.entity_picture && (this.config.styles.entity_picture = this.config.entity_picture_style), this.config.state && this.config.state.forEach(t => {
      t.styles || (t.styles = {}), t.entity_picture_style && !t.styles.entity_picture && (t.styles.entity_picture = t.entity_picture_style), t.style && !t.styles.card && (t.styles.card = t.style);
    });
  }getCardSize() {
    return 3;
  }_handleTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;qt(this, this.hass, e, !1, !1);
  }_handleHold(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;qt(this, this.hass, e, !0, !1);
  }_handleDblTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;qt(this, this.hass, e, !1, !0);
  }_handleLock(t) {
    t.stopPropagation();const e = this.shadowRoot.getElementById("overlay"),
          i = this.shadowRoot.firstElementChild;e.style.setProperty("pointer-events", "none");const n = document.createElement("paper-ripple"),
          s = this.shadowRoot.getElementById("lock");if (s) {
      i.appendChild(n);const t = document.createAttribute("icon");t.value = "mdi:lock-open-outline", s.attributes.setNamedItem(t), s.classList.add("fadeOut");
    }window.setTimeout(() => {
      if (e.style.setProperty("pointer-events", ""), s) {
        s.classList.remove("fadeOut");const t = document.createAttribute("icon");t.value = "mdi:lock-outline", s.attributes.setNamedItem(t), i.removeChild(n);
      }
    }, 5e3);
  }
};t([et()], Gt.prototype, "hass", void 0), t([et()], Gt.prototype, "config", void 0), Gt = t([(t => e => "function" == typeof e ? ((t, e) => (window.customElements.define(t, e), e))(t, e) : ((t, e) => {
  const { kind: i, elements: n } = e;return { kind: i, elements: n, finisher(e) {
      window.customElements.define(t, e);
    } };
})(t, e))("button-card")], Gt);
