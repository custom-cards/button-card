function t(t, e, n, i) {
  var r,
      s = arguments.length,
      a = s < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, i);else for (var o = t.length - 1; o >= 0; o--) (r = t[o]) && (a = (s < 3 ? r(a) : s > 3 ? r(e, n, a) : r(e, n)) || a);return s > 3 && a && Object.defineProperty(e, n, a), a;
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
      r = void 0 !== window.customElements && void 0 !== window.customElements.polyfillWrapFlushCallback,
      s = (t, e, n = null) => {
  let i = e;for (; i !== n;) {
    const e = i.nextSibling;t.removeChild(i), i = e;
  }
},
      a = {},
      o = {},
      l = `{{lit-${String(Math.random()).slice(2)}}}`,
      c = `\x3c!--${l}--\x3e`,
      h = new RegExp(`${l}|${c}`),
      d = "$lit$";class u {
  constructor(t, e) {
    this.parts = [], this.element = e;let n = -1,
        i = 0;const r = [],
          s = e => {
      const a = e.content,
            o = document.createTreeWalker(a, 133, null, !1);let c = 0;for (; o.nextNode();) {
        n++;const e = o.currentNode;if (1 === e.nodeType) {
          if (e.hasAttributes()) {
            const r = e.attributes;let s = 0;for (let t = 0; t < r.length; t++) r[t].value.indexOf(l) >= 0 && s++;for (; s-- > 0;) {
              const r = t.strings[i],
                    s = m.exec(r)[2],
                    a = s.toLowerCase() + d,
                    o = e.getAttribute(a).split(h);this.parts.push({ type: "attribute", index: n, name: s, strings: o }), e.removeAttribute(a), i += o.length - 1;
            }
          }"TEMPLATE" === e.tagName && s(e);
        } else if (3 === e.nodeType) {
          const t = e.data;if (t.indexOf(l) >= 0) {
            const s = e.parentNode,
                  a = t.split(h),
                  o = a.length - 1;for (let t = 0; t < o; t++) s.insertBefore("" === a[t] ? f() : document.createTextNode(a[t]), e), this.parts.push({ type: "node", index: ++n });"" === a[o] ? (s.insertBefore(f(), e), r.push(e)) : e.data = a[o], i += o;
          }
        } else if (8 === e.nodeType) if (e.data === l) {
          const t = e.parentNode;null !== e.previousSibling && n !== c || (n++, t.insertBefore(f(), e)), c = n, this.parts.push({ type: "node", index: n }), null === e.nextSibling ? e.data = "" : (r.push(e), n--), i++;
        } else {
          let t = -1;for (; -1 !== (t = e.data.indexOf(l, t + 1));) this.parts.push({ type: "node", index: -1 });
        }
      }
    };s(e);for (const t of r) t.parentNode.removeChild(t);
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
  constructor(t, e, n) {
    this._parts = [], this.template = t, this.processor = e, this.options = n;
  }update(t) {
    let e = 0;for (const n of this._parts) void 0 !== n && n.setValue(t[e]), e++;for (const t of this._parts) void 0 !== t && t.commit();
  }_clone() {
    const t = r ? this.template.element.content.cloneNode(!0) : document.importNode(this.template.element.content, !0),
          e = this.template.parts;let n = 0,
        i = 0;const s = t => {
      const r = document.createTreeWalker(t, 133, null, !1);let a = r.nextNode();for (; n < e.length && null !== a;) {
        const t = e[n];if (p(t)) {
          if (i === t.index) {
            if ("node" === t.type) {
              const t = this.processor.handleTextExpression(this.options);t.insertAfterNode(a.previousSibling), this._parts.push(t);
            } else this._parts.push(...this.processor.handleAttributeExpressions(a, t.name, t.strings, this.options));n++;
          } else i++, "TEMPLATE" === a.nodeName && s(a.content), a = r.nextNode();
        } else this._parts.push(void 0), n++;
      }
    };return s(t), r && (document.adoptNode(t), customElements.upgrade(t)), t;
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
  constructor(t, e, n, i) {
    this.strings = t, this.values = e, this.type = n, this.processor = i;
  }getHTML() {
    const t = this.strings.length - 1;let e = "";for (let n = 0; n < t; n++) {
      const t = this.strings[n],
            i = m.exec(t);e += i ? t.substr(0, i.index) + i[1] + i[2] + d + i[3] + l : t + c;
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
 */const y = t => null === t || !("object" == typeof t || "function" == typeof t);class v {
  constructor(t, e, n) {
    this.dirty = !0, this.element = t, this.name = e, this.strings = n, this.parts = [];for (let t = 0; t < n.length - 1; t++) this.parts[t] = this._createPart();
  }_createPart() {
    return new _(this);
  }_getValue() {
    const t = this.strings,
          e = t.length - 1;let n = "";for (let i = 0; i < e; i++) {
      n += t[i];const e = this.parts[i];if (void 0 !== e) {
        const t = e.value;if (null != t && (Array.isArray(t) || "string" != typeof t && t[Symbol.iterator])) for (const e of t) n += "string" == typeof e ? e : String(e);else n += "string" == typeof t ? t : String(t);
      }
    }return n += t[e];
  }commit() {
    this.dirty && (this.dirty = !1, this.element.setAttribute(this.name, this._getValue()));
  }
}class _ {
  constructor(t) {
    this.value = void 0, this.committer = t;
  }setValue(t) {
    t === a || y(t) && t === this.value || (this.value = t, i(t) || (this.committer.dirty = !0));
  }commit() {
    for (; i(this.value);) {
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
    for (; i(this._pendingValue);) {
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
      const n = new g(e, t.processor, this.options),
            i = n._clone();n.update(t.values), this._commitNode(i), this.value = n;
    }
  }_commitIterable(t) {
    Array.isArray(this.value) || (this.value = [], this.clear());const e = this.value;let n,
        i = 0;for (const r of t) void 0 === (n = e[i]) && (n = new w(this.options), e.push(n), 0 === i ? n.appendIntoPart(this) : n.insertAfterPart(e[i - 1])), n.setValue(r), n.commit(), i++;i < e.length && (e.length = i, this.clear(n && n.endNode));
  }clear(t = this.startNode) {
    s(this.startNode.parentNode, t.nextSibling, this.endNode);
  }
}class S {
  constructor(t, e, n) {
    if (this.value = void 0, this._pendingValue = void 0, 2 !== n.length || "" !== n[0] || "" !== n[1]) throw new Error("Boolean attributes can only contain a single expression");this.element = t, this.name = e, this.strings = n;
  }setValue(t) {
    this._pendingValue = t;
  }commit() {
    for (; i(this._pendingValue);) {
      const t = this._pendingValue;this._pendingValue = a, t(this);
    }if (this._pendingValue === a) return;const t = !!this._pendingValue;this.value !== t && (t ? this.element.setAttribute(this.name, "") : this.element.removeAttribute(this.name)), this.value = t, this._pendingValue = a;
  }
}class x extends v {
  constructor(t, e, n) {
    super(t, e, n), this.single = 2 === n.length && "" === n[0] && "" === n[1];
  }_createPart() {
    return new k(this);
  }_getValue() {
    return this.single ? this.parts[0].value : super._getValue();
  }commit() {
    this.dirty && (this.dirty = !1, this.element[this.name] = this._getValue());
  }
}class k extends _ {}let M = !1;try {
  const t = { get capture() {
      return M = !0, !1;
    } };window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}class C {
  constructor(t, e, n) {
    this.value = void 0, this._pendingValue = void 0, this.element = t, this.eventName = e, this.eventContext = n, this._boundHandleEvent = t => this.handleEvent(t);
  }setValue(t) {
    this._pendingValue = t;
  }commit() {
    for (; i(this._pendingValue);) {
      const t = this._pendingValue;this._pendingValue = a, t(this);
    }if (this._pendingValue === a) return;const t = this._pendingValue,
          e = this.value,
          n = null == t || null != e && (t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive),
          r = null != t && (null == e || n);n && this.element.removeEventListener(this.eventName, this._boundHandleEvent, this._options), r && (this._options = E(t), this.element.addEventListener(this.eventName, this._boundHandleEvent, this._options)), this.value = t, this._pendingValue = a;
  }handleEvent(t) {
    "function" == typeof this.value ? this.value.call(this.eventContext || this.element, t) : this.value.handleEvent(t);
  }
}const E = t => t && (M ? { capture: t.capture, passive: t.passive, once: t.once } : t.capture);
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
 */const P = new class {
  handleAttributeExpressions(t, e, n, i) {
    const r = e[0];return "." === r ? new x(t, e.slice(1), n).parts : "@" === r ? [new C(t, e.slice(1), i.eventContext)] : "?" === r ? [new S(t, e.slice(1), n)] : new v(t, e, n).parts;
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
 */function A(t) {
  let e = T.get(t.type);void 0 === e && (e = { stringsArray: new WeakMap(), keyString: new Map() }, T.set(t.type, e));let n = e.stringsArray.get(t.strings);if (void 0 !== n) return n;const i = t.strings.join(l);return void 0 === (n = e.keyString.get(i)) && (n = new u(t, t.getTemplateElement()), e.keyString.set(i, n)), e.stringsArray.set(t.strings, n), n;
}const T = new Map(),
      N = new WeakMap();
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
(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");const R = (t, ...e) => new b(t, e, "html", P),
      $ = 133;
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
 */function H(t, e) {
  const { element: { content: n }, parts: i } = t,
        r = document.createTreeWalker(n, $, null, !1);let s = O(i),
      a = i[s],
      o = -1,
      l = 0;const c = [];let h = null;for (; r.nextNode();) {
    o++;const t = r.currentNode;for (t.previousSibling === h && (h = null), e.has(t) && (c.push(t), null === h && (h = t)), null !== h && l++; void 0 !== a && a.index === o;) a.index = null !== h ? -1 : a.index - l, a = i[s = O(i, s)];
  }c.forEach(t => t.parentNode.removeChild(t));
}const D = t => {
  let e = 11 === t.nodeType ? 0 : 1;const n = document.createTreeWalker(t, $, null, !1);for (; n.nextNode();) e++;return e;
},
      O = (t, e = -1) => {
  for (let n = e + 1; n < t.length; n++) {
    const e = t[n];if (p(e)) return n;
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
const L = (t, e) => `${t}--${e}`;let V = !0;void 0 === window.ShadyCSS ? V = !1 : void 0 === window.ShadyCSS.prepareTemplateDom && (console.warn("Incompatible ShadyCSS version detected.Please update to at least @webcomponents/webcomponentsjs@2.0.2 and@webcomponents/shadycss@1.3.1."), V = !1);const j = t => e => {
  const n = L(e.type, t);let i = T.get(n);void 0 === i && (i = { stringsArray: new WeakMap(), keyString: new Map() }, T.set(n, i));let r = i.stringsArray.get(e.strings);if (void 0 !== r) return r;const s = e.strings.join(l);if (void 0 === (r = i.keyString.get(s))) {
    const n = e.getTemplateElement();V && window.ShadyCSS.prepareTemplateDom(n, t), r = new u(e, n), i.keyString.set(s, r);
  }return i.stringsArray.set(e.strings, r), r;
},
      I = ["html", "svg"],
      F = new Set(),
      Y = (t, e, n) => {
  F.add(n);const i = t.querySelectorAll("style");if (0 === i.length) return void window.ShadyCSS.prepareTemplateStyles(e.element, n);const r = document.createElement("style");for (let t = 0; t < i.length; t++) {
    const e = i[t];e.parentNode.removeChild(e), r.textContent += e.textContent;
  }if ((t => {
    I.forEach(e => {
      const n = T.get(L(e, t));void 0 !== n && n.keyString.forEach(t => {
        const { element: { content: e } } = t,
              n = new Set();Array.from(e.querySelectorAll("style")).forEach(t => {
          n.add(t);
        }), H(t, n);
      });
    });
  })(n), function (t, e, n = null) {
    const { element: { content: i }, parts: r } = t;if (null == n) return void i.appendChild(e);const s = document.createTreeWalker(i, $, null, !1);let a = O(r),
        o = 0,
        l = -1;for (; s.nextNode();) for (l++, s.currentNode === n && (o = D(e), n.parentNode.insertBefore(e, n)); -1 !== a && r[a].index === l;) {
      if (o > 0) {
        for (; -1 !== a;) r[a].index += o, a = O(r, a);return;
      }a = O(r, a);
    }
  }(e, r, e.element.content.firstChild), window.ShadyCSS.prepareTemplateStyles(e.element, n), window.ShadyCSS.nativeShadow) {
    const n = e.element.content.querySelector("style");t.insertBefore(n.cloneNode(!0), t.firstChild);
  } else {
    e.element.content.insertBefore(r, e.element.content.firstChild);const t = new Set();t.add(r), H(e, t);
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
window.JSCompiler_renameProperty = (t, e) => t;const z = { toAttribute(t, e) {
    switch (e) {case Boolean:
        return t ? "" : null;case Object:case Array:
        return null == t ? t : JSON.stringify(t);}return t;
  }, fromAttribute(t, e) {
    switch (e) {case Boolean:
        return null !== t;case Number:
        return null === t ? null : Number(t);case Object:case Array:
        return JSON.parse(t);}return t;
  } },
      q = (t, e) => e !== t && (e == e || t == t),
      U = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: q },
      B = Promise.resolve(!0),
      W = 1,
      G = 4,
      J = 8,
      Z = 16,
      X = 32;class K extends HTMLElement {
  constructor() {
    super(), this._updateState = 0, this._instanceProperties = void 0, this._updatePromise = B, this._hasConnectedResolver = void 0, this._changedProperties = new Map(), this._reflectingProperties = void 0, this.initialize();
  }static get observedAttributes() {
    this.finalize();const t = [];return this._classProperties.forEach((e, n) => {
      const i = this._attributeNameForProperty(n, e);void 0 !== i && (this._attributeToPropertyMap.set(i, n), t.push(i));
    }), t;
  }static _ensureClassProperties() {
    if (!this.hasOwnProperty(JSCompiler_renameProperty("_classProperties", this))) {
      this._classProperties = new Map();const t = Object.getPrototypeOf(this)._classProperties;void 0 !== t && t.forEach((t, e) => this._classProperties.set(e, t));
    }
  }static createProperty(t, e = U) {
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
  }static _valueHasChanged(t, e, n = q) {
    return n(t, e);
  }static _propertyValueFromAttribute(t, e) {
    const n = e.type,
          i = e.converter || z,
          r = "function" == typeof i ? i : i.fromAttribute;return r ? r(t, n) : t;
  }static _propertyValueToAttribute(t, e) {
    if (void 0 === e.reflect) return;const n = e.type,
          i = e.converter;return (i && i.toAttribute || z.toAttribute)(t, n);
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
    this._updateState = this._updateState | X, this._hasConnectedResolver && (this._hasConnectedResolver(), this._hasConnectedResolver = void 0);
  }disconnectedCallback() {}attributeChangedCallback(t, e, n) {
    e !== n && this._attributeToProperty(t, n);
  }_propertyToAttribute(t, e, n = U) {
    const i = this.constructor,
          r = i._attributeNameForProperty(t, n);if (void 0 !== r) {
      const t = i._propertyValueToAttribute(e, n);if (void 0 === t) return;this._updateState = this._updateState | J, null == t ? this.removeAttribute(r) : this.setAttribute(r, t), this._updateState = this._updateState & ~J;
    }
  }_attributeToProperty(t, e) {
    if (this._updateState & J) return;const n = this.constructor,
          i = n._attributeToPropertyMap.get(t);if (void 0 !== i) {
      const t = n._classProperties.get(i) || U;this._updateState = this._updateState | Z, this[i] = n._propertyValueFromAttribute(e, t), this._updateState = this._updateState & ~Z;
    }
  }_requestUpdate(t, e) {
    let n = !0;if (void 0 !== t) {
      const i = this.constructor,
            r = i._classProperties.get(t) || U;i._valueHasChanged(this[t], e, r.hasChanged) ? (this._changedProperties.has(t) || this._changedProperties.set(t, e), !0 !== r.reflect || this._updateState & Z || (void 0 === this._reflectingProperties && (this._reflectingProperties = new Map()), this._reflectingProperties.set(t, r))) : n = !1;
    }!this._hasRequestedUpdate && n && this._enqueueUpdate();
  }requestUpdate(t, e) {
    return this._requestUpdate(t, e), this.updateComplete;
  }async _enqueueUpdate() {
    let t, e;this._updateState = this._updateState | G;const n = this._updatePromise;this._updatePromise = new Promise((n, i) => {
      t = n, e = i;
    });try {
      await n;
    } catch (t) {}this._hasConnected || (await new Promise(t => this._hasConnectedResolver = t));try {
      const t = this.performUpdate();null != t && (await t);
    } catch (t) {
      e(t);
    }t(!this._hasRequestedUpdate);
  }get _hasConnected() {
    return this._updateState & X;
  }get _hasRequestedUpdate() {
    return this._updateState & G;
  }get hasUpdated() {
    return this._updateState & W;
  }performUpdate() {
    this._instanceProperties && this._applyInstanceProperties();let t = !1;const e = this._changedProperties;try {
      (t = this.shouldUpdate(e)) && this.update(e);
    } catch (e) {
      throw t = !1, e;
    } finally {
      this._markUpdated();
    }t && (this._updateState & W || (this._updateState = this._updateState | W, this.firstUpdated(e)), this.updated(e));
  }_markUpdated() {
    this._changedProperties = new Map(), this._updateState = this._updateState & ~G;
  }get updateComplete() {
    return this._updatePromise;
  }shouldUpdate(t) {
    return !0;
  }update(t) {
    void 0 !== this._reflectingProperties && this._reflectingProperties.size > 0 && (this._reflectingProperties.forEach((t, e) => this._propertyToAttribute(e, this[e], t)), this._reflectingProperties = void 0);
  }updated(t) {}firstUpdated(t) {}
}K.finalized = !0;
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
const Q = (t, e) => "method" !== e.kind || !e.descriptor || "value" in e.descriptor ? { kind: "field", key: Symbol(), placement: "own", descriptor: {}, initializer() {
    "function" == typeof e.initializer && (this[e.key] = e.initializer.call(this));
  }, finisher(n) {
    n.createProperty(e.key, t);
  } } : Object.assign({}, e, { finisher(n) {
    n.createProperty(e.key, t);
  } }),
      tt = (t, e, n) => {
  e.constructor.createProperty(n, t);
};function et(t) {
  return (e, n) => void 0 !== n ? tt(t, e, n) : Q(t, e);
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
*/const nt = "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
      it = Symbol();class rt {
  constructor(t, e) {
    if (e !== it) throw new Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText = t;
  }get styleSheet() {
    return void 0 === this._styleSheet && (nt ? (this._styleSheet = new CSSStyleSheet(), this._styleSheet.replaceSync(this.cssText)) : this._styleSheet = null), this._styleSheet;
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
(window.litElementVersions || (window.litElementVersions = [])).push("2.0.1");const st = t => t.flat ? t.flat(1 / 0) : function t(e, n = []) {
  for (let i = 0, r = e.length; i < r; i++) {
    const r = e[i];Array.isArray(r) ? t(r, n) : n.push(r);
  }return n;
}(t);class at extends K {
  static finalize() {
    super.finalize(), this._styles = this.hasOwnProperty(JSCompiler_renameProperty("styles", this)) ? this._getUniqueStyles() : this._styles || [];
  }static _getUniqueStyles() {
    const t = this.styles,
          e = [];if (Array.isArray(t)) {
      st(t).reduceRight((t, e) => (t.add(e), t), new Set()).forEach(t => e.unshift(t));
    } else t && e.push(t);return e;
  }initialize() {
    super.initialize(), this.renderRoot = this.createRenderRoot(), window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot && this.adoptStyles();
  }createRenderRoot() {
    return this.attachShadow({ mode: "open" });
  }adoptStyles() {
    const t = this.constructor._styles;0 !== t.length && (void 0 === window.ShadyCSS || window.ShadyCSS.nativeShadow ? nt ? this.renderRoot.adoptedStyleSheets = t.map(t => t.styleSheet) : this._needsShimAdoptedStyleSheets = !0 : window.ShadyCSS.ScopingShim.prepareAdoptedCssText(t.map(t => t.cssText), this.localName));
  }connectedCallback() {
    super.connectedCallback(), this.hasUpdated && void 0 !== window.ShadyCSS && window.ShadyCSS.styleElement(this);
  }update(t) {
    super.update(t);const e = this.render();e instanceof b && this.constructor.render(e, this.renderRoot, { scopeName: this.localName, eventContext: this }), this._needsShimAdoptedStyleSheets && (this._needsShimAdoptedStyleSheets = !1, this.constructor._styles.forEach(t => {
      const e = document.createElement("style");e.textContent = t.cssText, this.renderRoot.appendChild(e);
    }));
  }render() {}
}at.finalized = !0, at.render = (t, e, n) => {
  const i = n.scopeName,
        r = N.has(e),
        a = e instanceof ShadowRoot && V && t instanceof b,
        o = a && !F.has(i),
        l = o ? document.createDocumentFragment() : e;if (((t, e, n) => {
    let i = N.get(e);void 0 === i && (s(e, e.firstChild), N.set(e, i = new w(Object.assign({ templateFactory: A }, n))), i.appendInto(e)), i.setValue(t), i.commit();
  })(t, l, Object.assign({ templateFactory: j(i) }, n)), o) {
    const t = N.get(l);N.delete(l), t.value instanceof g && Y(l, t.value.template, i), s(e, e.firstChild), e.appendChild(l), N.set(e, t);
  }!r && a && window.ShadyCSS.styleElement(e.host);
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
      ct = n(t => e => {
  if (!(e instanceof _) || e instanceof k || "style" !== e.committer.name || e.committer.parts.length > 1) throw new Error("The `styleMap` directive must be used in the style attribute and must be the only part in the attribute.");lt.has(e) || (e.committer.element.style.cssText = e.committer.strings.join(" "), lt.set(e, !0));const n = e.committer.element.style,
        i = ot.get(e);for (const e in i) e in t || (-1 === e.indexOf("-") ? n[e] = null : n.removeProperty(e));for (const e in t) -1 === e.indexOf("-") ? n[e] = t[e] : n.setProperty(e, t[e]);ot.set(e, t);
}),
      ht = new WeakMap(),
      dt = n(t => e => {
  if (!(e instanceof w)) throw new Error("unsafeHTML can only be used in text bindings");const n = ht.get(e);if (void 0 !== n && y(t) && t === n.value && e.value === n.fragment) return;const i = document.createElement("template");i.innerHTML = t;const r = document.importNode(i.content, !0);e.setValue(r), ht.set(e, { value: t, fragment: r });
}),
      ut = n(t => e => {
  if (void 0 === t && e instanceof _) {
    if (t !== e.value) {
      const t = e.committer.name;e.committer.element.removeAttribute(t);
    }
  } else e.setValue(t);
});
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
window.navigator.userAgent.match("Trident") && (DOMTokenList.prototype.toggle = function (t, e) {
  return void 0 === e || e ? this.add(t) : this.remove(t), void 0 === e || e;
});const pt = new WeakMap(),
      ft = new WeakMap(),
      mt = n(t => e => {
  if (!(e instanceof _) || e instanceof k || "class" !== e.committer.name || e.committer.parts.length > 1) throw new Error("The `classMap` directive must be used in the `class` attribute and must be the only part in the attribute.");ft.has(e) || (e.committer.element.className = e.committer.strings.join(" "), ft.set(e, !0));const n = pt.get(e);for (const i in n) i in t || e.committer.element.classList.remove(i);for (const i in t) n && n[i] === t[i] || e.committer.element.classList.toggle(i, Boolean(t[i]));pt.set(e, t);
});var gt = {},
    bt = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
    yt = "[^\\s]+",
    vt = /\[([^]*?)\]/gm,
    _t = function () {};function wt(t, e) {
  for (var n = [], i = 0, r = t.length; i < r; i++) n.push(t[i].substr(0, e));return n;
}function St(t) {
  return function (e, n, i) {
    var r = i[t].indexOf(n.charAt(0).toUpperCase() + n.substr(1).toLowerCase());~r && (e.month = r);
  };
}function xt(t, e) {
  for (t = String(t), e = e || 2; t.length < e;) t = "0" + t;return t;
}var kt = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    Mt = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    Ct = wt(Mt, 3),
    Et = wt(kt, 3);gt.i18n = { dayNamesShort: Et, dayNames: kt, monthNamesShort: Ct, monthNames: Mt, amPm: ["am", "pm"], DoFn: function (t) {
    return t + ["th", "st", "nd", "rd"][t % 10 > 3 ? 0 : (t - t % 10 != 10) * t % 10];
  } };var Pt = { D: function (t) {
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
    At = { D: ["\\d\\d?", function (t, e) {
    t.day = e;
  }], Do: ["\\d\\d?" + yt, function (t, e) {
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
  }], d: ["\\d\\d?", _t], ddd: [yt, _t], MMM: [yt, St("monthNamesShort")], MMMM: [yt, St("monthNames")], a: [yt, function (t, e, n) {
    var i = e.toLowerCase();i === n.amPm[0] ? t.isPm = !1 : i === n.amPm[1] && (t.isPm = !0);
  }], ZZ: ["[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z", function (t, e) {
    var n,
        i = (e + "").match(/([+-]|\d\d)/gi);i && (n = 60 * i[1] + parseInt(i[2], 10), t.timezoneOffset = "+" === i[0] ? n : -n);
  }] };function Tt(t) {
  var e = t.split(":").map(Number);return 3600 * e[0] + 60 * e[1] + e[2];
}At.dd = At.d, At.dddd = At.ddd, At.DD = At.D, At.mm = At.m, At.hh = At.H = At.HH = At.h, At.MM = At.M, At.ss = At.s, At.A = At.a, gt.masks = { default: "ddd MMM DD YYYY HH:mm:ss", shortDate: "M/D/YY", mediumDate: "MMM D, YYYY", longDate: "MMMM D, YYYY", fullDate: "dddd, MMMM D, YYYY", shortTime: "HH:mm", mediumTime: "HH:mm:ss", longTime: "HH:mm:ss.SSS" }, gt.format = function (t, e, n) {
  var i = n || gt.i18n;if ("number" == typeof t && (t = new Date(t)), "[object Date]" !== Object.prototype.toString.call(t) || isNaN(t.getTime())) throw new Error("Invalid Date in fecha.format");e = gt.masks[e] || e || gt.masks.default;var r = [];return (e = (e = e.replace(vt, function (t, e) {
    return r.push(e), "@@@";
  })).replace(bt, function (e) {
    return e in Pt ? Pt[e](t, i) : e.slice(1, e.length - 1);
  })).replace(/@@@/g, function () {
    return r.shift();
  });
}, gt.parse = function (t, e, n) {
  var i = n || gt.i18n;if ("string" != typeof e) throw new Error("Invalid format in fecha.parse");if (e = gt.masks[e] || e, t.length > 1e3) return null;var r = {},
      s = [],
      a = [];e = e.replace(vt, function (t, e) {
    return a.push(e), "@@@";
  });var o,
      l = (o = e, o.replace(/[|\\{()[^$+*?.-]/g, "\\$&")).replace(bt, function (t) {
    if (At[t]) {
      var e = At[t];return s.push(e[1]), "(" + e[0] + ")";
    }return t;
  });l = l.replace(/@@@/g, function () {
    return a.shift();
  });var c = t.match(new RegExp(l, "i"));if (!c) return null;for (var h = 1; h < c.length; h++) s[h - 1](r, c[h], i);var d,
      u = new Date();return !0 === r.isPm && null != r.hour && 12 != +r.hour ? r.hour = +r.hour + 12 : !1 === r.isPm && 12 == +r.hour && (r.hour = 0), null != r.timezoneOffset ? (r.minute = +(r.minute || 0) - +r.timezoneOffset, d = new Date(Date.UTC(r.year || u.getFullYear(), r.month || 0, r.day || 1, r.hour || 0, r.minute || 0, r.second || 0, r.millisecond || 0))) : d = new Date(r.year || u.getFullYear(), r.month || 0, r.day || 1, r.hour || 0, r.minute || 0, r.second || 0, r.millisecond || 0), d;
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
}();var Nt = function (t) {
  return t < 10 ? "0" + t : t;
};var Rt = "hass:bookmark",
    $t = ["closed", "locked", "off"],
    Ht = function (t, e, n, i) {
  i = i || {}, n = null == n ? {} : n;var r = new Event(e, { bubbles: void 0 === i.bubbles || i.bubbles, cancelable: Boolean(i.cancelable), composed: void 0 === i.composed || i.composed });return r.detail = n, t.dispatchEvent(r), r;
},
    Dt = { alert: "hass:alert", automation: "hass:playlist-play", calendar: "hass:calendar", camera: "hass:video", climate: "hass:thermostat", configurator: "hass:settings", conversation: "hass:text-to-speech", device_tracker: "hass:account", fan: "hass:fan", group: "hass:google-circles-communities", history_graph: "hass:chart-line", homeassistant: "hass:home-assistant", homekit: "hass:home-automation", image_processing: "hass:image-filter-frames", input_boolean: "hass:drawing", input_datetime: "hass:calendar-clock", input_number: "hass:ray-vertex", input_select: "hass:format-list-bulleted", input_text: "hass:textbox", light: "hass:lightbulb", mailbox: "hass:mailbox", notify: "hass:comment-alert", person: "hass:account", plant: "hass:flower", proximity: "hass:apple-safari", remote: "hass:remote", scene: "hass:google-pages", script: "hass:file-document", sensor: "hass:eye", simple_alarm: "hass:bell", sun: "hass:white-balance-sunny", switch: "hass:flash", timer: "hass:timer", updater: "hass:cloud-upload", vacuum: "hass:robot-vacuum", water_heater: "hass:thermometer", weblink: "hass:open-in-new" };var Ot = function (t, e) {
  Ht(t, "haptic", e);
},
    Lt = function (t, e, n, i, r) {
  var s;switch (r && n.dbltap_action ? s = n.dbltap_action : i && n.hold_action ? s = n.hold_action : !i && n.tap_action && (s = n.tap_action), s || (s = { action: "more-info" }), s.action) {case "more-info":
      (n.entity || n.camera_image) && (Ht(t, "hass-more-info", { entityId: s.entity ? s.entity : n.entity ? n.entity : n.camera_image }), s.haptic && Ot(t, s.haptic));break;case "navigate":
      s.navigation_path && (function (t, e, n) {
        void 0 === n && (n = !1), n ? history.replaceState(null, "", e) : history.pushState(null, "", e), Ht(window, "location-changed", { replace: n });
      }(0, s.navigation_path), s.haptic && Ot(t, s.haptic));break;case "url":
      s.url && window.open(s.url), s.haptic && Ot(t, s.haptic);break;case "toggle":
      n.entity && (function (t, e) {
        (function (t, e, n) {
          void 0 === n && (n = !0);var i,
              r = function (t) {
            return t.substr(0, t.indexOf("."));
          }(e),
              s = "group" === r ? "homeassistant" : r;switch (r) {case "lock":
              i = n ? "unlock" : "lock";break;case "cover":
              i = n ? "open_cover" : "close_cover";break;default:
              i = n ? "turn_on" : "turn_off";}t.callService(s, i, { entity_id: e });
        })(t, e, $t.includes(t.states[e].state));
      }(e, n.entity), s.haptic && Ot(t, s.haptic));break;case "call-service":
      if (!s.service) return;var a = s.service.split(".", 2),
          o = a[0],
          l = a[1],
          c = Object.assign({}, s.service_data);"entity" === c.entity_id && (c.entity_id = n.entity), e.callService(o, l, c), s.haptic && Ot(t, s.haptic);}
};String(Math.random()).slice(2);try {
  const t = { get capture() {
      return !1;
    } };window.addEventListener("test", t, t), window.removeEventListener("test", t, t);
} catch (t) {}(window.litHtmlVersions || (window.litHtmlVersions = [])).push("1.0.0");var Vt = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0,
    jt = function (t) {
  function e() {
    t.call(this), this.holdTime = 500, this.ripple = document.createElement("paper-ripple"), this.timer = void 0, this.held = !1, this.cooldownStart = !1, this.cooldownEnd = !1, this.nbClicks = 0;
  }return t && (e.__proto__ = t), (e.prototype = Object.create(t && t.prototype)).constructor = e, e.prototype.connectedCallback = function () {
    var t = this;Object.assign(this.style, { borderRadius: "50%", position: "absolute", width: Vt ? "100px" : "50px", height: Vt ? "100px" : "50px", transform: "translate(-50%, -50%)", pointerEvents: "none" }), this.appendChild(this.ripple), this.ripple.style.color = "#03a9f4", this.ripple.style.color = "var(--primary-color)", ["touchcancel", "mouseout", "mouseup", "touchmove", "mousewheel", "wheel", "scroll"].forEach(function (e) {
      document.addEventListener(e, function () {
        clearTimeout(t.timer), t.stopAnimation(), t.timer = void 0;
      }, { passive: !0 });
    });
  }, e.prototype.bind = function (t) {
    var e = this;if (!t.longPress) {
      t.longPress = !0, t.addEventListener("contextmenu", function (t) {
        var e = t || window.event;return e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, !1;
      });var n = function (n) {
        var i, r;e.cooldownStart || (e.held = !1, n.touches ? (i = n.touches[0].pageX, r = n.touches[0].pageY) : (i = n.pageX, r = n.pageY), e.timer = window.setTimeout(function () {
          e.startAnimation(i, r), e.held = !0, t.repeat && !t.isRepeating && (t.isRepeating = !0, e.repeatTimeout = setInterval(function () {
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
}(HTMLElement);customElements.get("long-press-custom-card-helpers") || customElements.define("long-press-custom-card-helpers", jt);const It = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;customElements.define("long-press-button-card", class extends HTMLElement {
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
      if (this.cooldownStart) return;let n, i;this.held = !1, e.touches ? (n = e.touches[0].pageX, i = e.touches[0].pageY) : (n = e.pageX, i = e.pageY), this.timer = window.setTimeout(() => {
        this.startAnimation(n, i), this.held = !0, t.repeat && !t.isRepeating && (t.isRepeating = !0, this.repeatTimeout = setInterval(() => {
          t.dispatchEvent(new Event("ha-hold"));
        }, t.repeat));
      }, this.holdTime), this.cooldownStart = !0, window.setTimeout(() => this.cooldownStart = !1, 100);
    },
          n = e => {
      this.cooldownEnd || ["touchend", "touchcancel"].includes(e.type) && void 0 === this.timer ? t.isRepeating && this.repeatTimeout && (clearInterval(this.repeatTimeout), t.isRepeating = !1) : (clearTimeout(this.timer), t.isRepeating && this.repeatTimeout && clearInterval(this.repeatTimeout), t.isRepeating = !1, this.stopAnimation(), this.timer = void 0, this.held ? t.repeat || t.dispatchEvent(new Event("ha-hold")) : t.hasDblClick ? 0 === this.nbClicks ? (this.nbClicks += 1, this.dblClickTimeout = window.setTimeout(() => {
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
    return "string" == typeof t && -1 !== t.indexOf(".") && 1 === parseFloat(t);
  })(t) && (t = "100%");var n = function (t) {
    return "string" == typeof t && -1 !== t.indexOf("%");
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
      r = Math.min(t, e, n),
      s = 0,
      a = 0,
      o = (i + r) / 2;if (i === r) a = 0, s = 0;else {
    var l = i - r;switch (a = o > .5 ? l / (2 - i - r) : l / (i + r), i) {case t:
        s = (e - n) / l + (e < n ? 6 : 0);break;case e:
        s = (n - t) / l + 2;break;case n:
        s = (t - e) / l + 4;}s /= 6;
  }return { h: s, s: a, l: o };
}function Jt(t, e, n) {
  t = zt(t, 255), e = zt(e, 255), n = zt(n, 255);var i = Math.max(t, e, n),
      r = Math.min(t, e, n),
      s = 0,
      a = i,
      o = i - r,
      l = 0 === i ? 0 : o / i;if (i === r) s = 0;else {
    switch (i) {case t:
        s = (e - n) / o + (e < n ? 6 : 0);break;case e:
        s = (n - t) / o + 2;break;case n:
        s = (t - e) / o + 4;}s /= 6;
  }return { h: s, s: l, v: a };
}function Zt(t, e, n, i) {
  var r = [Wt(Math.round(t).toString(16)), Wt(Math.round(e).toString(16)), Wt(Math.round(n).toString(16))];return i && r[0].charAt(0) === r[0].charAt(1) && r[1].charAt(0) === r[1].charAt(1) && r[2].charAt(0) === r[2].charAt(1) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("");
}function Xt(t) {
  return Kt(t) / 255;
}function Kt(t) {
  return parseInt(t, 16);
}var Qt = { aliceblue: "#f0f8ff", antiquewhite: "#faebd7", aqua: "#00ffff", aquamarine: "#7fffd4", azure: "#f0ffff", beige: "#f5f5dc", bisque: "#ffe4c4", black: "#000000", blanchedalmond: "#ffebcd", blue: "#0000ff", blueviolet: "#8a2be2", brown: "#a52a2a", burlywood: "#deb887", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", cornflowerblue: "#6495ed", cornsilk: "#fff8dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", darkkhaki: "#bdb76b", darkmagenta: "#8b008b", darkolivegreen: "#556b2f", darkorange: "#ff8c00", darkorchid: "#9932cc", darkred: "#8b0000", darksalmon: "#e9967a", darkseagreen: "#8fbc8f", darkslateblue: "#483d8b", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", darkturquoise: "#00ced1", darkviolet: "#9400d3", deeppink: "#ff1493", deepskyblue: "#00bfff", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1e90ff", firebrick: "#b22222", floralwhite: "#fffaf0", forestgreen: "#228b22", fuchsia: "#ff00ff", gainsboro: "#dcdcdc", ghostwhite: "#f8f8ff", gold: "#ffd700", goldenrod: "#daa520", gray: "#808080", green: "#008000", greenyellow: "#adff2f", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", indianred: "#cd5c5c", indigo: "#4b0082", ivory: "#fffff0", khaki: "#f0e68c", lavender: "#e6e6fa", lavenderblush: "#fff0f5", lawngreen: "#7cfc00", lemonchiffon: "#fffacd", lightblue: "#add8e6", lightcoral: "#f08080", lightcyan: "#e0ffff", lightgoldenrodyellow: "#fafad2", lightgray: "#d3d3d3", lightgreen: "#90ee90", lightgrey: "#d3d3d3", lightpink: "#ffb6c1", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", lightskyblue: "#87cefa", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#b0c4de", lightyellow: "#ffffe0", lime: "#00ff00", limegreen: "#32cd32", linen: "#faf0e6", magenta: "#ff00ff", maroon: "#800000", mediumaquamarine: "#66cdaa", mediumblue: "#0000cd", mediumorchid: "#ba55d3", mediumpurple: "#9370db", mediumseagreen: "#3cb371", mediumslateblue: "#7b68ee", mediumspringgreen: "#00fa9a", mediumturquoise: "#48d1cc", mediumvioletred: "#c71585", midnightblue: "#191970", mintcream: "#f5fffa", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", navajowhite: "#ffdead", navy: "#000080", oldlace: "#fdf5e6", olive: "#808000", olivedrab: "#6b8e23", orange: "#ffa500", orangered: "#ff4500", orchid: "#da70d6", palegoldenrod: "#eee8aa", palegreen: "#98fb98", paleturquoise: "#afeeee", palevioletred: "#db7093", papayawhip: "#ffefd5", peachpuff: "#ffdab9", peru: "#cd853f", pink: "#ffc0cb", plum: "#dda0dd", powderblue: "#b0e0e6", purple: "#800080", rebeccapurple: "#663399", red: "#ff0000", rosybrown: "#bc8f8f", royalblue: "#4169e1", saddlebrown: "#8b4513", salmon: "#fa8072", sandybrown: "#f4a460", seagreen: "#2e8b57", seashell: "#fff5ee", sienna: "#a0522d", silver: "#c0c0c0", skyblue: "#87ceeb", slateblue: "#6a5acd", slategray: "#708090", slategrey: "#708090", snow: "#fffafa", springgreen: "#00ff7f", steelblue: "#4682b4", tan: "#d2b48c", teal: "#008080", thistle: "#d8bfd8", tomato: "#ff6347", turquoise: "#40e0d0", violet: "#ee82ee", wheat: "#f5deb3", white: "#ffffff", whitesmoke: "#f5f5f5", yellow: "#ffff00", yellowgreen: "#9acd32" };function te(t) {
  var e,
      n,
      i,
      r = { r: 0, g: 0, b: 0 },
      s = 1,
      a = null,
      o = null,
      l = null,
      c = !1,
      h = !1;return "string" == typeof t && (t = function (t) {
    if (0 === (t = t.trim().toLowerCase()).length) return !1;var e = !1;if (Qt[t]) t = Qt[t], e = !0;else if ("transparent" === t) return { r: 0, g: 0, b: 0, a: 0, format: "name" };var n = re.rgb.exec(t);if (n) return { r: n[1], g: n[2], b: n[3] };if (n = re.rgba.exec(t)) return { r: n[1], g: n[2], b: n[3], a: n[4] };if (n = re.hsl.exec(t)) return { h: n[1], s: n[2], l: n[3] };if (n = re.hsla.exec(t)) return { h: n[1], s: n[2], l: n[3], a: n[4] };if (n = re.hsv.exec(t)) return { h: n[1], s: n[2], v: n[3] };if (n = re.hsva.exec(t)) return { h: n[1], s: n[2], v: n[3], a: n[4] };if (n = re.hex8.exec(t)) return { r: Kt(n[1]), g: Kt(n[2]), b: Kt(n[3]), a: Xt(n[4]), format: e ? "name" : "hex8" };if (n = re.hex6.exec(t)) return { r: Kt(n[1]), g: Kt(n[2]), b: Kt(n[3]), format: e ? "name" : "hex" };if (n = re.hex4.exec(t)) return { r: Kt(n[1] + n[1]), g: Kt(n[2] + n[2]), b: Kt(n[3] + n[3]), a: Xt(n[4] + n[4]), format: e ? "name" : "hex8" };if (n = re.hex3.exec(t)) return { r: Kt(n[1] + n[1]), g: Kt(n[2] + n[2]), b: Kt(n[3] + n[3]), format: e ? "name" : "hex" };return !1;
  }(t)), "object" == typeof t && (se(t.r) && se(t.g) && se(t.b) ? (e = t.r, n = t.g, i = t.b, r = { r: 255 * zt(e, 255), g: 255 * zt(n, 255), b: 255 * zt(i, 255) }, c = !0, h = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : se(t.h) && se(t.s) && se(t.v) ? (a = Bt(t.s), o = Bt(t.v), r = function (t, e, n) {
    t = 6 * zt(t, 360), e = zt(e, 100), n = zt(n, 100);var i = Math.floor(t),
        r = t - i,
        s = n * (1 - e),
        a = n * (1 - r * e),
        o = n * (1 - (1 - r) * e),
        l = i % 6;return { r: 255 * [n, a, s, s, o, n][l], g: 255 * [o, n, n, a, s, s][l], b: 255 * [s, s, o, n, n, a][l] };
  }(t.h, a, o), c = !0, h = "hsv") : se(t.h) && se(t.s) && se(t.l) && (a = Bt(t.s), l = Bt(t.l), r = function (t, e, n) {
    var i, r, s;function a(t, e, n) {
      return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + 6 * n * (e - t) : n < .5 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
    }if (t = zt(t, 360), e = zt(e, 100), n = zt(n, 100), 0 === e) r = n, s = n, i = n;else {
      var o = n < .5 ? n * (1 + e) : n + e - n * e,
          l = 2 * n - o;i = a(l, o, t + 1 / 3), r = a(l, o, t), s = a(l, o, t - 1 / 3);
    }return { r: 255 * i, g: 255 * r, b: 255 * s };
  }(t.h, a, l), c = !0, h = "hsl"), Object.prototype.hasOwnProperty.call(t, "a") && (s = t.a)), s = Ut(s), { ok: c, format: t.format || h, r: Math.min(255, Math.max(r.r, 0)), g: Math.min(255, Math.max(r.g, 0)), b: Math.min(255, Math.max(r.b, 0)), a: s };
}var ee = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",
    ne = "[\\s|\\(]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")\\s*\\)?",
    ie = "[\\s|\\(]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")[,|\\s]+(" + ee + ")\\s*\\)?",
    re = { CSS_UNIT: new RegExp(ee), rgb: new RegExp("rgb" + ne), rgba: new RegExp("rgba" + ie), hsl: new RegExp("hsl" + ne), hsla: new RegExp("hsla" + ie), hsv: new RegExp("hsv" + ne), hsva: new RegExp("hsva" + ie), hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/, hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/, hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/ };function se(t) {
  return Boolean(re.CSS_UNIT.exec(String(t)));
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
    return void 0 === t && (t = !1), function (t, e, n, i, r) {
      var s,
          a = [Wt(Math.round(t).toString(16)), Wt(Math.round(e).toString(16)), Wt(Math.round(n).toString(16)), Wt((s = i, Math.round(255 * parseFloat(s)).toString(16)))];return r && a[0].charAt(0) === a[0].charAt(1) && a[1].charAt(0) === a[1].charAt(1) && a[2].charAt(0) === a[2].charAt(1) && a[3].charAt(0) === a[3].charAt(1) ? a[0].charAt(0) + a[1].charAt(0) + a[2].charAt(0) + a[3].charAt(0) : a.join("");
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
        r = new t(e).toRgb(),
        s = n / 100;return new t({ r: (r.r - i.r) * s + i.r, g: (r.g - i.g) * s + i.g, b: (r.b - i.b) * s + i.b, a: (r.a - i.a) * s + i.a });
  }, t.prototype.analogous = function (e, n) {
    void 0 === e && (e = 6), void 0 === n && (n = 30);var i = this.toHsl(),
        r = 360 / n,
        s = [this];for (i.h = (i.h - (r * e >> 1) + 720) % 360; --e;) i.h = (i.h + r) % 360, s.push(new t(i));return s;
  }, t.prototype.complement = function () {
    var e = this.toHsl();return e.h = (e.h + 180) % 360, new t(e);
  }, t.prototype.monochromatic = function (e) {
    void 0 === e && (e = 6);for (var n = this.toHsv(), i = n.h, r = n.s, s = n.v, a = [], o = 1 / e; e--;) a.push(new t({ h: i, s: r, v: s })), s = (s + o) % 1;return a;
  }, t.prototype.splitcomplement = function () {
    var e = this.toHsl(),
        n = e.h;return [this, new t({ h: (n + 72) % 360, s: e.s, l: e.l }), new t({ h: (n + 216) % 360, s: e.s, l: e.l })];
  }, t.prototype.triad = function () {
    return this.polyad(3);
  }, t.prototype.tetrad = function () {
    return this.polyad(4);
  }, t.prototype.polyad = function (e) {
    for (var n = this.toHsl(), i = n.h, r = [this], s = 360 / e, a = 1; a < e; a++) r.push(new t({ h: (i + a * s) % 360, s: n.s, l: n.l }));return r;
  }, t.prototype.equals = function (e) {
    return this.toRgbString() === new t(e).toRgbString();
  }, t;
}();function oe(t, e) {
  return void 0 === t && (t = ""), void 0 === e && (e = {}), new ae(t, e);
}function le(t) {
  return t.substr(0, t.indexOf("."));
}function ce(t) {
  return "var" === t.substring(0, 3) ? window.getComputedStyle(document.documentElement).getPropertyValue(t.substring(4).slice(0, -1)).trim() : t;
}function he(t, e) {
  const n = new ae(ce(t));if (n.isValid) {
    const t = n.mix("black", 100 - e).toString();if (t) return t;
  }return t;
}function de(...t) {
  const e = t => t && "object" == typeof t;return t.reduce((t, n) => (Object.keys(n).forEach(i => {
    const r = t[i],
          s = n[i];Array.isArray(r) && Array.isArray(s) ? t[i] = r.concat(...s) : e(r) && e(s) ? t[i] = de(r, s) : t[i] = s;
  }), t), {});
}function ue(t, e) {
  let n = [];return t && t.forEach(t => {
    let i = t;e && e.forEach(e => {
      e.id && t.id && e.id == t.id && (i = de(i, e));
    }), n.push(i);
  }), e && (n = n.concat(e.filter(e => !t || !t.find(t => !(!t.id || !e.id) && t.id == e.id)))), n;
}const pe = ((t, ...e) => {
  const n = e.reduce((e, n, i) => e + (t => {
    if (t instanceof rt) return t.cssText;throw new Error(`Value passed to 'css' function must be a 'css' function result: ${t}. Use 'unsafeCSS' to pass non-literal values, but\n            take care to ensure page security.`);
  })(n) + t[i + 1], t[0]);return new rt(n, it);
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
`;let fe = class extends at {
  disconnectedCallback() {
    super.disconnectedCallback(), this._clearInterval();
  }connectedCallback() {
    if (super.connectedCallback(), this.config && this.config.entity && "timer" === le(this.config.entity)) {
      const t = this.hass.states[this.config.entity];this._startInterval(t);
    }
  }static get styles() {
    return pe;
  }render() {
    return this.config && this.hass ? this._cardHtml() : R``;
  }shouldUpdate(t) {
    const e = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          n = this._getMatchingConfigState(e),
          i = !!(n && (this.config.show_label && n.label_template || this.config.show_entity_picture && n.entity_picture_template || this.config.show_name && n.name_template) || this.config.show_label && this.config.label_template || this.config.show_name && this.config.name_template || this.config.show_entity_picture && this.config.entity_picture_template || this.config.state && this.config.state.find(t => "template" === t.operator) || t.has("_timeRemaining"));return function (t, e, n) {
      if (e.has("config") || n) return !0;if (t.config.entity) {
        const n = e.get("hass");return !n || n.states[t.config.entity] !== t.hass.states[t.config.entity];
      }return !1;
    }(this, t, i);
  }updated(t) {
    if (super.updated(t), this.config && this.config.entity && "timer" === le(this.config.entity) && t.has("hass")) {
      const e = this.hass.states[this.config.entity],
            n = t.get("hass");(n ? n.states[this.config.entity] : void 0) !== e ? this._startInterval(e) : e || this._clearInterval();
    }
  }_clearInterval() {
    this._interval && (window.clearInterval(this._interval), this._interval = void 0);
  }_startInterval(t) {
    this._clearInterval(), this._calculateRemaining(t), "active" === t.state && (this._interval = window.setInterval(() => this._calculateRemaining(t), 1e3));
  }_calculateRemaining(t) {
    this._timeRemaining = function (t) {
      var e = Tt(t.attributes.remaining);if ("active" === t.state) {
        var n = new Date().getTime(),
            i = new Date(t.last_changed).getTime();e = Math.max(e - (n - i) / 1e3, 0);
      }return e;
    }(t);
  }_computeTimeDisplay(t) {
    if (t) return function (t) {
      var e = Math.floor(t / 3600),
          n = Math.floor(t % 3600 / 60),
          i = Math.floor(t % 3600 % 60);return e > 0 ? e + ":" + Nt(n) + ":" + Nt(i) : n > 0 ? n + ":" + Nt(i) : i > 0 ? "" + i : null;
    }(this._timeRemaining || Tt(t.attributes.duration));
  }_getMatchingConfigState(t) {
    if (!this.config.state) return;const e = this.config.state.find(t => "template" === t.operator);if (!t && !e) return;let n;const i = this.config.state.find(e => {
      if (!e.operator) return t && e.value == t.state;switch (e.operator) {case "==":
          return t && t.state == e.value;case "<=":
          return t && t.state <= e.value;case "<":
          return t && t.state < e.value;case ">=":
          return t && t.state >= e.value;case ">":
          return t && t.state > e.value;case "!=":
          return t && t.state != e.value;case "regex":
          return !(!t || !t.state.match(e.value));case "template":
          return this._evalTemplate(t, e.value);case "default":
          return n = e, !1;default:
          return !1;}
    });return !i && n ? n : i;
  }_evalTemplate(t, e) {
    return new Function("states", "entity", "user", "hass", `'use strict'; ${e}`).call(this, this.hass.states, t, this.hass.user, this.hass);
  }_getDefaultColorForState(t) {
    switch (t.state) {case "on":
        return this.config.color_on;case "off":
        return this.config.color_off;default:
        return this.config.default_color;}
  }_getColorForLightEntity(t, e) {
    let n = this.config.default_color;return t && (t.attributes.rgb_color ? (n = `rgb(${t.attributes.rgb_color.join(",")})`, t.attributes.brightness && (n = he(n, (t.attributes.brightness + 245) / 5))) : e && t.attributes.color_temp && t.attributes.min_mireds && t.attributes.max_mireds ? (n = function (t, e, n) {
      const i = new ae("rgb(255, 160, 0)"),
            r = new ae("rgb(166, 209, 255)"),
            s = new ae("white"),
            a = (t - e) / (n - e) * 100;return a < 50 ? oe(r).mix(s, 2 * a).toRgbString() : oe(s).mix(i, 2 * (a - 50)).toRgbString();
    }(t.attributes.color_temp, t.attributes.min_mireds, t.attributes.max_mireds), t.attributes.brightness && (n = he(n, (t.attributes.brightness + 245) / 5))) : n = t.attributes.brightness ? he(this._getDefaultColorForState(t), (t.attributes.brightness + 245) / 5) : this._getDefaultColorForState(t)), n;
  }_buildCssColorAttribute(t, e) {
    let n,
        i = "";return e && e.color ? i = e.color : "auto" !== this.config.color && t && "off" === t.state ? i = this.config.color_off : this.config.color && (i = this.config.color), n = "auto" == i || "auto-no-temperature" == i ? this._getColorForLightEntity(t, "auto-no-temperature" !== i) : i || (t ? this._getDefaultColorForState(t) : this.config.default_color);
  }_buildIcon(t, e) {
    if (!this.config.show_icon) return;let n;return e && e.icon ? n = e.icon : this.config.icon ? n = this.config.icon : t && t.attributes && (n = t.attributes.icon ? t.attributes.icon : function (t, e) {
      if (t in Dt) return Dt[t];switch (t) {case "alarm_control_panel":
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
          return console.warn("Unable to find icon for domain " + t + " (" + e + ")"), Rt;}
    }(le(t.entity_id), t.state)), n;
  }_buildEntityPicture(t, e) {
    if (!this.config.show_entity_picture || !t && !e && !this.config.entity_picture) return;let n, i;return (i = e && e.entity_picture_template ? e.entity_picture_template : this.config.entity_picture_template) ? this._evalTemplate(t, i) : (e && e.entity_picture ? n = e.entity_picture : this.config.entity_picture ? n = this.config.entity_picture : t && (n = t.attributes && t.attributes.entity_picture ? t.attributes.entity_picture : void 0), n);
  }_buildStyleGeneric(t, e) {
    let n = {};if (this.config.styles && this.config.styles[e] && (n = Object.assign(n, ...this.config.styles[e])), t && t.styles && t.styles[e]) {
      let i = {};i = Object.assign(i, ...t.styles[e]), n = Object.assign({}, n, i);
    }return n;
  }_buildName(t, e) {
    if (!1 === this.config.show_name) return;let n, i;return (i = e && e.name_template ? e.name_template : this.config.name_template) ? this._evalTemplate(t, i) : (e && e.name ? n = e.name : this.config.name ? n = this.config.name : t && (n = t.attributes && t.attributes.friendly_name ? t.attributes.friendly_name : (r = t.entity_id).substr(r.indexOf(".") + 1)), n);var r;
  }_buildStateString(t) {
    let e;if (this.config.show_state && t && t.state) {
      const n = ((t, e) => {
        let n;const i = le(e.entity_id);return "binary_sensor" === i ? (e.attributes.device_class && (n = t(`state.${i}.${e.attributes.device_class}.${e.state}`)), n || (n = t(`state.${i}.default.${e.state}`))) : n = e.attributes.unit_of_measurement && !["unknown", "unavailable"].includes(e.state) ? e.state : "zwave" === i ? ["initializing", "dead"].includes(e.state) ? t(`state.zwave.query_stage.${e.state}`, "query_stage", e.attributes.query_stage) : t(`state.zwave.default.${e.state}`) : t(`state.${i}.${e.state}`), n || (n = t(`state.default.${e.state}`) || t(`component.${i}.state.${e.state}`) || e.state), n;
      })(this.hass.localize, t),
            i = this._buildUnits(t);i ? e = `${t.state} ${i}` : "timer" === le(t.entity_id) ? "idle" === t.state || 0 === this._timeRemaining ? e = n : (e = this._computeTimeDisplay(t), "paused" === t.state && (e += ` (${n})`)) : e = n;
    }return e;
  }_buildUnits(t) {
    let e;return t && this.config.show_units && (e = t.attributes && t.attributes.unit_of_measurement && !this.config.units ? t.attributes.unit_of_measurement : this.config.units ? this.config.units : void 0), e;
  }_buildLastChanged(t, e) {
    return this.config.show_last_changed && t ? R`
        <ha-relative-time
          id="label"
          class="ellipsis"
          .hass="${this.hass}"
          .datetime="${t.last_changed}"
          style=${ct(e)}
        ></ha-relative-time>` : void 0;
  }_buildLabel(t, e) {
    if (!this.config.show_label) return;let n, i;return (i = e && e.label_template ? e.label_template : this.config.label_template) ? this._evalTemplate(t, i) : n = e && e.label ? e.label : this.config.label;
  }_isClickable(t) {
    let e = !0;if ("toggle" === this.config.tap_action.action && "none" === this.config.hold_action.action && "none" === this.config.dbltap_action.action || "toggle" === this.config.hold_action.action && "none" === this.config.tap_action.action && "none" === this.config.dbltap_action.action || "toggle" === this.config.dbltap_action.action && "none" === this.config.tap_action.action && "none" === this.config.hold_action.action) {
      if (t) switch (le(t.entity_id)) {case "sensor":case "binary_sensor":case "device_tracker":
          e = !1;break;default:
          e = !0;} else e = !1;
    } else e = "none" != this.config.tap_action.action || "none" != this.config.hold_action.action || "none" != this.config.dbltap_action.action;return e;
  }_rotate(t) {
    return !(!t || !t.spin);
  }_blankCardColoredHtml(t) {
    const e = Object.assign({ background: "none", "box-shadow": "none" }, t);return R`
      <ha-card class="disabled" style=${ct(e)}>
        <div></div>
      </ha-card>
      `;
  }_cardHtml() {
    const t = this.config.entity ? this.hass.states[this.config.entity] : void 0,
          e = this._getMatchingConfigState(t),
          n = this._buildCssColorAttribute(t, e);let i = n,
        r = {},
        s = {},
        a = {};const o = this._buildStyleGeneric(e, "lock"),
          l = this._buildStyleGeneric(e, "card"),
          c = { "button-card-main": !0, disabled: !this._isClickable(t) };switch (l.width && (this.style.setProperty("flex", "0 0 auto"), this.style.setProperty("max-width", "fit-content")), this.config.color_type) {case "blank-card":
        return this._blankCardColoredHtml(l);case "card":case "label-card":
        {
          const t = function (t) {
            const e = new ae(ce(t));return e.isValid && e.getLuminance() > .5 ? "rgb(62, 62, 62)" : "rgb(234, 234, 234)";
          }(n);r.color = t, s.color = t, r["background-color"] = n, r = Object.assign({}, r, l), i = "inherit";break;
        }default:
        r = l;}return this.config.aspect_ratio ? (a["--aspect-ratio"] = this.config.aspect_ratio, r.position = "absolute") : a.display = "inline", this.style.setProperty("--button-card-light-color", this._getColorForLightEntity(t, !0)), this.style.setProperty("--button-card-light-color-no-temperature", this._getColorForLightEntity(t, !1)), s = Object.assign({}, s, o), R`
      <div id="aspect-ratio" style=${ct(a)}>
        <ha-card
          id="card"
          class=${mt(c)}
          style=${ct(r)}
          @ha-click="${this._handleTap}"
          @ha-hold="${this._handleHold}"
          @ha-dblclick=${this._handleDblTap}
          .hasDblClick=${"none" !== this.config.dbltap_action.action}
          .repeat=${ut(this.config.hold_action.repeat)}
          .longpress=${Yt()}
          .config="${this.config}"
        >
          ${this._getLock(s)}
          ${this._buttonContent(t, e, i)}
          ${this.config.lock ? "" : R`<mwc-ripple id="ripple"></mwc-ripple>`}
        </ha-card>
      </div>
      `;
  }_getLock(t) {
    return this.config.lock ? R`
        <div id="overlay" style=${ct(t)} @click=${this._handleLock} @touchstart=${this._handleLock}>
          <ha-icon id="lock" icon="mdi:lock-outline"></ha-icon>
        </div>
      ` : R``;
  }_buttonContent(t, e, n) {
    const i = this._buildName(t, e),
          r = this._buildStateString(t),
          s = function (t, e) {
      if (!t && !e) return;let n;return n = e ? t ? `${t}: ${e}` : e : t;
    }(i, r);switch (this.config.layout) {case "icon_name_state":case "name_state":
        return this._gridHtml(t, e, this.config.layout, n, s, void 0);default:
        return this._gridHtml(t, e, this.config.layout, n, i, r);}
  }_gridHtml(t, e, n, i, r, s) {
    const a = this._getIconHtml(t, e, i),
          o = [n],
          l = this._buildLabel(t, e),
          c = this._buildStyleGeneric(e, "name"),
          h = this._buildStyleGeneric(e, "state"),
          d = this._buildStyleGeneric(e, "label"),
          u = this._buildLastChanged(t, d),
          p = this._buildStyleGeneric(e, "grid");return a || o.push("no-icon"), r || o.push("no-name"), s || o.push("no-state"), l || u || o.push("no-label"), R`
      <div id="container" class=${o.join(" ")} style=${ct(p)}>
        ${a || ""}
        ${r ? R`<div id="name" class="ellipsis" style=${ct(c)}>${dt(r)}</div>` : ""}
        ${s ? R`<div id="state" class="ellipsis" style=${ct(h)}>${s}</div>` : ""}
        ${l && !u ? R`<div id="label" class="ellipsis" style=${ct(d)}>${dt(l)}</div>` : ""}
        ${u || ""}
      </div>
    `;
  }_getIconHtml(t, e, n) {
    const i = this._buildIcon(t, e),
          r = this._buildEntityPicture(t, e),
          s = this._buildStyleGeneric(e, "entity_picture"),
          a = this._buildStyleGeneric(e, "icon"),
          o = this._buildStyleGeneric(e, "img_cell"),
          l = this._buildStyleGeneric(e, "card"),
          c = Object.assign({ color: n, width: this.config.size, position: this.config.aspect_ratio || l.height ? "absolute" : "relative" }, a),
          h = Object.assign({}, c, s);return i || r ? R`
        <div id="img-cell" style=${ct(o)}>
          ${i && !r ? R`<ha-icon style=${ct(c)}
            .icon="${i}" id="icon" ?rotating=${this._rotate(e)}></ha-icon>` : ""}
          ${r ? R`<img src="${r}" style=${ct(h)}
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
        r = t.state;for (; i && e.config.button_card_templates && e.config.button_card_templates[i];) n = de(e.config.button_card_templates[i], n), r = ue(e.config.button_card_templates[i].state, r), i = e.config.button_card_templates[i].template;n.state = r, this.config = Object.assign({ tap_action: { action: "toggle" }, hold_action: { action: "none" }, dbltap_action: { action: "none" }, layout: "vertical", size: "40%", color_type: "icon", show_name: !0, show_state: !1, show_icon: !0, show_units: !0, show_label: !1, show_entity_picture: !1 }, n), this.config.default_color = "var(--primary-text-color)", "icon" !== this.config.color_type ? this.config.color_off = "var(--paper-card-background-color)" : this.config.color_off = "var(--paper-item-icon-color)", this.config.color_on = "var(--paper-item-icon-active-color)";
  }getCardSize() {
    return 3;
  }_handleTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;Lt(this, this.hass, e, !1, !1);
  }_handleHold(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;Lt(this, this.hass, e, !0, !1);
  }_handleDblTap(t) {
    if (this.config.confirmation && !window.confirm(this.config.confirmation)) return;const e = t.target.config;Lt(this, this.hass, e, !1, !0);
  }_handleLock(t) {
    if (t.stopPropagation(), this.config.unlock_users) {
      if (!this.hass.user.name) return;if (this.config.unlock_users.indexOf(this.hass.user.name) < 0) return;
    }const e = this.shadowRoot.getElementById("overlay"),
          n = this.shadowRoot.getElementById("card");e.style.setProperty("pointer-events", "none");const i = document.createElement("paper-ripple"),
          r = this.shadowRoot.getElementById("lock");if (r) {
      n.appendChild(i);const t = document.createAttribute("icon");t.value = "mdi:lock-open-outline", r.attributes.setNamedItem(t), r.classList.add("fadeOut");
    }window.setTimeout(() => {
      if (e.style.setProperty("pointer-events", ""), r) {
        r.classList.remove("fadeOut");const t = document.createAttribute("icon");t.value = "mdi:lock-outline", r.attributes.setNamedItem(t), n.removeChild(i);
      }
    }, 5e3);
  }
};t([et()], fe.prototype, "hass", void 0), t([et()], fe.prototype, "config", void 0), t([et()], fe.prototype, "_timeRemaining", void 0), fe = t([(t => e => "function" == typeof e ? ((t, e) => (window.customElements.define(t, e), e))(t, e) : ((t, e) => {
  const { kind: n, elements: i } = e;return { kind: n, elements: i, finisher(e) {
      window.customElements.define(t, e);
    } };
})(t, e))("button-card")], fe);
