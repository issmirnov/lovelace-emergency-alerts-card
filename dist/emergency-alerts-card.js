/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;let i=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const r=this.t;if(e&&void 0===t){const e=void 0!==r&&1===r.length;e&&(t=s.get(r)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(r,t))}return t}toString(){return this.cssText}};const n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const r of t.cssRules)e+=r.cssText;return(t=>new i("string"==typeof t?t:t+"",void 0,r))(e)})(t):t,{is:o,defineProperty:a,getOwnPropertyDescriptor:c,getOwnPropertyNames:l,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,u=globalThis,p=u.trustedTypes,g=p?p.emptyScript:"",_=u.reactiveElementPolyfillSupport,f=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=null!==t;break;case Number:r=null===t?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch(t){r=null}}return r}},y=(t,e)=>!o(t,e),$={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const r=Symbol(),s=this.getPropertyDescriptor(t,r,e);void 0!==s&&a(this.prototype,t,s)}}static getPropertyDescriptor(t,e,r){const{get:s,set:i}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);i?.call(this,e),this.requestUpdate(t,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...l(t),...h(t)];for(const r of e)this.createProperty(r,t[r])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const r=this._$Eu(t,e);void 0!==r&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const r=new Set(t.flat(1/0).reverse());for(const t of r)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const r=e.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,s)=>{if(e)r.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),i=t.litNonce;void 0!==i&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){const r=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,r);if(void 0!==s&&!0===r.reflect){const i=(void 0!==r.converter?.toAttribute?r.converter:m).toAttribute(e,r.type);this._$Em=t,null==i?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(t,e){const r=this.constructor,s=r._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=r.getPropertyOptions(s),i="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=s,this[s]=i.fromAttribute(e,t.type)??this._$Ej?.get(s)??null,this._$Em=null}}requestUpdate(t,e,r){if(void 0!==t){const s=this.constructor,i=this[t];if(r??=s.getPropertyOptions(t),!((r.hasChanged??y)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:s,wrapped:i},n){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==i||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,r]of t){const{wrapped:t}=r,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,r,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[f("elementProperties")]=new Map,b[f("finalized")]=new Map,_?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const v=globalThis,w=v.trustedTypes,A=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,S="?"+x,C=`<${S}>`,k=document,U=()=>k.createComment(""),P=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,H="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,M=/>/g,N=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,I=/"/g,z=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...r)=>({_$litType$:t,strings:e,values:r}))(1),B=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),q=new WeakMap,W=k.createTreeWalker(k,129);function V(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const r=t.length-1,s=[];let i,n=2===e?"<svg>":3===e?"<math>":"",o=T;for(let e=0;e<r;e++){const r=t[e];let a,c,l=-1,h=0;for(;h<r.length&&(o.lastIndex=h,c=o.exec(r),null!==c);)h=o.lastIndex,o===T?"!--"===c[1]?o=R:void 0!==c[1]?o=M:void 0!==c[2]?(z.test(c[2])&&(i=RegExp("</"+c[2],"g")),o=N):void 0!==c[3]&&(o=N):o===N?">"===c[0]?(o=i??T,l=-1):void 0===c[1]?l=-2:(l=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?N:'"'===c[3]?I:j):o===I||o===j?o=N:o===R||o===M?o=T:(o=N,i=void 0);const d=o===N&&t[e+1].startsWith("/>")?" ":"";n+=o===T?r+C:l>=0?(s.push(a),r.slice(0,l)+E+r.slice(l)+x+d):r+x+(-2===l?e:d)}return[V(t,n+(t[r]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class F{constructor({strings:t,_$litType$:e},r){let s;this.parts=[];let i=0,n=0;const o=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=F.createElement(c,r),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[n++],r=s.getAttribute(t).split(x),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:i,name:o[2],strings:r,ctor:"."===o[1]?Q:"?"===o[1]?X:"@"===o[1]?tt:Z}),s.removeAttribute(t)}else t.startsWith(x)&&(a.push({type:6,index:i}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(x),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let r=0;r<e;r++)s.append(t[r],U()),W.nextNode(),a.push({type:2,index:++i});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===S)a.push({type:2,index:i});else{let t=-1;for(;-1!==(t=s.data.indexOf(x,t+1));)a.push({type:7,index:i}),t+=x.length-1}i++}}static createElement(t,e){const r=k.createElement("template");return r.innerHTML=t,r}}function K(t,e,r=t,s){if(e===B)return e;let i=void 0!==s?r._$Co?.[s]:r._$Cl;const n=P(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),void 0===n?i=void 0:(i=new n(t),i._$AT(t,r,s)),void 0!==s?(r._$Co??=[])[s]=i:r._$Cl=i),void 0!==i&&(e=K(t,i._$AS(t,e.values),i,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:r}=this._$AD,s=(t?.creationScope??k).importNode(e,!0);W.currentNode=s;let i=W.nextNode(),n=0,o=0,a=r[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new J(i,i.nextSibling,this,t):1===a.type?e=new a.ctor(i,a.name,a.strings,this,t):6===a.type&&(e=new et(i,this,t)),this._$AV.push(e),a=r[++o]}n!==a?.index&&(i=W.nextNode(),n++)}return W.currentNode=k,s}p(t){let e=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,s){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),P(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==B&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==L&&P(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:r}=t,s="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=F.createElement(V(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),r=t.u(this.options);t.p(e),this.T(r),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new F(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let r,s=0;for(const i of t)s===e.length?e.push(r=new J(this.O(U()),this.O(U()),this,this.options)):r=e[s],r._$AI(i),s++;s<e.length&&(this._$AR(r&&r._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Z{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,s,i){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=i,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=L}_$AI(t,e=this,r,s){const i=this.strings;let n=!1;if(void 0===i)t=K(this,t,e,0),n=!P(t)||t!==this._$AH&&t!==B,n&&(this._$AH=t);else{const s=t;let o,a;for(t=i[0],o=0;o<i.length-1;o++)a=K(this,s[r+o],e,o),a===B&&(a=this._$AH[o]),n||=!P(a)||a!==this._$AH[o],a===L?t=L:t!==L&&(t+=(a??"")+i[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Q extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}class X extends Z{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==L)}}class tt extends Z{constructor(t,e,r,s,i){super(t,e,r,s,i),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??L)===B)return;const r=this._$AH,s=t===L&&r!==L||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==L&&(r===L||s);s&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class et{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=v.litHtmlPolyfillSupport;rt?.(F,J),(v.litHtmlVersions??=[]).push("3.3.0");const st=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class it extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,r)=>{const s=r?.renderBefore??e;let i=s._$litPart$;if(void 0===i){const t=r?.renderBefore??null;s._$litPart$=i=new J(e.insertBefore(U(),t),t,void 0,r??{})}return i._$AI(t),i})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return B}}it._$litElement$=!0,it.finalized=!0,st.litElementHydrateSupport?.({LitElement:it});const nt=st.litElementPolyfillSupport;nt?.({LitElement:it}),(st.litElementVersions??=[]).push("4.2.0");const ot=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,r,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+t[s+1],t[0]);return new i(s,t,r)})`
  .card {
    padding: 16px;
    background: var(--ha-card-background, white);
    border-radius: var(--ha-card-border-radius, 8px);
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .summary-header {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
    color: var(--primary-text-color);
  }

  .alert-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 6px 0;
    border-radius: 8px;
    background: var(--secondary-background-color, #f5f5f5);
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
  }

  .alert-item:hover {
    background: var(--secondary-background-color-hover, #e8e8e8);
  }

  .alert-critical {
    border-left-color: #f44336;
  }

  .alert-warning {
    border-left-color: #ff9800;
  }

  .alert-info {
    border-left-color: #2196f3;
  }

  .alert-acknowledged {
    opacity: 0.7;
    background: var(--disabled-text-color, #bdbdbd);
  }

  .alert-escalated {
    border-left-color: #9c27b0;
    background: rgba(156, 39, 176, 0.1);
  }

  .alert-cleared {
    opacity: 0.5;
    background: var(--disabled-text-color, #e0e0e0);
  }

  .group-header {
    font-weight: bold;
    margin: 20px 0 12px 0;
    padding: 8px 12px;
    border-radius: 6px;
    background: var(--primary-color, #1976d2);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .group-header.alert-critical {
    background: #f44336;
  }

  .group-header.alert-warning {
    background: #ff9800;
  }

  .group-header.alert-info {
    background: #2196f3;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    margin-left: auto;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  /* Responsive design for narrow columns */
  @media (max-width: 600px) {
    .action-buttons {
      flex-direction: column;
      gap: 4px;
      margin-left: 0;
      margin-top: 8px;
      width: 100%;
    }

    .action-btn {
      width: 100%;
      justify-content: center;
    }

    .alert-item {
      flex-direction: column;
      align-items: stretch;
    }

    .alert-content {
      margin-right: 0;
      margin-bottom: 8px;
    }
  }

  /* For very narrow columns (mobile) */
  @media (max-width: 400px) {
    .action-buttons {
      gap: 3px;
    }

    .action-btn {
      padding: 5px 8px;
      font-size: 0.75em;
    }
  }

  .action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8em;
    font-weight: 500;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .action-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .action-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-btn.loading {
    opacity: 0.6;
    position: relative;
  }

  .acknowledge-btn {
    background: var(--primary-color, #1976d2);
    color: white;
  }

  .clear-btn {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .escalate-btn {
    background: var(--error-color, #f44336);
    color: white;
  }

  .de-escalate-btn {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .alert-content {
    flex: 1;
    margin-right: 12px;
  }

  .alert-name {
    font-weight: 500;
    color: var(--primary-text-color);
    margin-bottom: 4px;
  }

  .alert-meta {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .alert-icon {
    margin-right: 12px;
    font-size: 1.2em;
  }

  .compact .alert-item {
    padding: 8px;
    margin: 3px 0;
  }

  .compact .action-btn {
    padding: 4px 8px;
    font-size: 0.7em;
  }

  /* Compact mode responsive adjustments */
  @media (max-width: 600px) {
    .compact .action-buttons {
      gap: 3px;
    }

    .compact .action-btn {
      padding: 3px 6px;
      font-size: 0.65em;
    }
  }

  .no-alerts {
    text-align: center;
    padding: 32px;
    color: var(--secondary-text-color);
    font-style: italic;
  }

  .error-notification {
    background: var(--error-color, #f44336);
    color: white;
    padding: 12px;
    margin: 8px 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .error-notification .error-icon {
    font-size: 1.2em;
  }

  .error-notification .error-message {
    flex: 1;
  }

  .error-notification .error-dismiss {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1.2em;
    padding: 4px;
    opacity: 0.8;
  }

  .error-notification .error-dismiss:hover {
    opacity: 1;
  }
`;class at{constructor(t,e){this.hass=t,this.onError=e}handleError(t,e,r){const s=`Failed to ${t}`;console.error(`[Emergency Alerts Card] ${s}:`,r),console.error(`Entity: ${e}`),this.onError&&this.onError({message:s,entity_id:e,error:r})}async acknowledge(t){try{await this.hass.callService("emergency_alerts","acknowledge",{entity_id:t})}catch(e){throw this.handleError("acknowledge alert",t,e),e}}async clear(t){try{await this.hass.callService("emergency_alerts","clear",{entity_id:t})}catch(e){throw this.handleError("clear alert",t,e),e}}async escalate(t){try{await this.hass.callService("emergency_alerts","escalate",{entity_id:t})}catch(e){throw this.handleError("escalate alert",t,e),e}}async deEscalate(t){try{await this.hass.callService("emergency_alerts","acknowledge",{entity_id:t})}catch(e){throw this.handleError("de-escalate alert",t,e),e}}updateHass(t){this.hass=t}setErrorCallback(t){this.onError=t}}function ct(t,e,r){return e.some(e=>{if(e.includes("*")){let s;return r&&r.has(e)?s=r.get(e):(s=new RegExp(e.replace(/\*/g,".*")),r&&r.set(e,s)),s.test(t)}return t===e})}const lt={critical:0,warning:1,info:2};const ht=["critical","warning","info"];function dt(t,e){switch(e.group_by){case"group":return function(t){const e={};for(const r of t){const t=r.group||"other";e[t]||(e[t]=[]),e[t].push(r)}return e}(t);case"status":return function(t){const e={active:[],acknowledged:[],escalated:[],cleared:[]};for(const r of t)e[r.status].push(r);return e}(t);case"none":return function(t){return{all:t}}(t);default:return function(t){const e={};ht.forEach(t=>{e[t]=[]});for(const r of t)e[r.severity]||(e[r.severity]=[]),e[r.severity].push(r);return e}(t)}}function ut(t){const e=t.attributes;return e.cleared?"cleared":e.acknowledged?"acknowledged":e.escalated?"escalated":"on"===t.state?"active":"inactive"}function pt(t){return!(!t.attributes||!t.attributes.severity&&!t.attributes.group)}function gt(t){const e=t.attributes;return{entity_id:t.entity_id,name:e.friendly_name||t.entity_id,state:t.state,severity:e.severity||"info",group:e.group||"other",acknowledged:!!e.acknowledged,escalated:!!e.escalated,cleared:!!e.cleared,first_triggered:e.first_triggered,last_cleared:e.last_cleared,status:ut(t)}}function _t(t,e,r){const s=[];for(const i of Object.values(t)){const t=ct(i.entity_id,e,r),n=pt(i);(t||n)&&s.push(i)}return s}class ft extends it{constructor(){super(...arguments),this.alerts=[],this.grouped={},this.loadingActions=new Set,this.patternCache=new Map,this.lastStatesHash=""}static get properties(){return{hass:{attribute:!1},config:{attribute:!1},alerts:{type:Array,state:!0},grouped:{type:Object,state:!0},loadingActions:{type:Object,state:!0},currentError:{type:Object,state:!0}}}setConfig(t){if(!t||!t.type)throw new Error("Invalid configuration");this.config={show_acknowledged:!0,show_cleared:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,max_alerts_per_group:50,show_acknowledge_button:!0,show_clear_button:!0,show_escalate_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30,...t},this._startAutoRefresh()}updated(t){super.updated(t),t.has("hass")&&this.hass&&(this.alertService?this.alertService.updateHass(this.hass):this.alertService=new at(this.hass,this._handleError.bind(this)),this._hasRelevantChanges()&&this._updateAlerts())}_hasRelevantChanges(){if(!this.hass||!this.config)return!1;const t=this.config.entity_patterns||["binary_sensor.emergency_*"],e=_t(this.hass.states,t,this.patternCache),r=e.map(t=>`${t.entity_id}:${t.last_updated}`).sort().join("|");const s=r!==this.lastStatesHash;return s&&(this.lastStatesHash=r),s}_updateAlerts(){if(!this.hass||!this.config)return;const t=this.config.entity_patterns||["binary_sensor.emergency_*"],e=_t(this.hass.states,t,this.patternCache).map(gt).filter(t=>function(t,e){return!(e.severity_filter&&!e.severity_filter.includes(t.severity)||e.group_filter&&e.group_filter.length>0&&!e.group_filter.includes(t.group)||e.status_filter&&!e.status_filter.includes(t.status)||!e.show_acknowledged&&t.acknowledged||!e.show_cleared&&t.cleared||!e.show_escalated&&t.escalated)}(t,this.config));var r,s;r=e,s=this.config,r.sort((t,e)=>{switch(s.sort_by){case"first_triggered":{const r=t.first_triggered?new Date(t.first_triggered).getTime():0;return(e.first_triggered?new Date(e.first_triggered).getTime():0)-r}case"severity":return(lt[t.severity]||3)-(lt[e.severity]||3);case"name":return t.name.localeCompare(e.name);case"group":return t.group.localeCompare(e.group);default:return 0}}),this.alerts=e,this.grouped=dt(e,this.config)}_startAutoRefresh(){this.refreshInterval&&clearInterval(this.refreshInterval),this.config?.refresh_interval&&this.config.refresh_interval>0&&(this.refreshInterval=window.setInterval(()=>{this._updateAlerts()},1e3*this.config.refresh_interval))}disconnectedCallback(){super.disconnectedCallback(),this.refreshInterval&&clearInterval(this.refreshInterval)}_handleError(t){this.currentError=t,this.requestUpdate(),setTimeout(()=>{this.currentError===t&&(this.currentError=void 0,this.requestUpdate())},5e3)}_dismissError(){this.currentError=void 0}async _handleAcknowledge(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.acknowledge(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}async _handleClear(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.clear(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}async _handleEscalate(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.escalate(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}async _handleDeEscalate(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.deEscalate(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}_shouldShowActions(t){return!t.cleared}render(){if(!this.hass)return D`<div class="card">Loading...</div>`;const t=this.alerts.filter(t=>"on"===t.state).length,e=this.config?.compact_mode?"compact":"";return D`
      <div class="card ${e}">
        <div class="summary-header">Emergency Alerts (${t} active)</div>

        ${this._renderErrorNotification()} ${this._renderAlerts()}
      </div>
    `}_renderErrorNotification(){return this.currentError?D`
      <div class="error-notification">
        <span class="error-icon">⚠️</span>
        <span class="error-message">${this.currentError.message}</span>
        <button class="error-dismiss" @click=${this._dismissError}>×</button>
      </div>
    `:""}_renderAlerts(){return 0===this.alerts.length?D`<div class="no-alerts">No alerts to display</div>`:D`
      ${Object.entries(this.grouped).map(([t,e])=>this._renderAlertGroup(t,e))}
    `}_renderAlertGroup(t,e){if(0===e.length)return"";const r=function(t,e){return"status"===e?t.length:t.filter(t=>"on"===t.state).length}(e,this.config.group_by||"severity"),s=function(t,e){return"none"===e?"All Alerts":(r=t).charAt(0).toUpperCase()+r.slice(1);var r}(t,this.config.group_by||"severity"),i="severity"===this.config?.group_by?`alert-${t}`:"",n=this.config?.max_alerts_per_group||50,o=e.slice(0,n);return D`
      <div class="group-header ${i}">
        <span>${s} (${r})</span>
      </div>
      ${o.map(t=>this._renderAlert(t))}
    `}_renderAlert(t){const e=["alert-item",`alert-${t.severity}`,t.acknowledged?"alert-acknowledged":"",t.escalated?"alert-escalated":"",t.cleared?"alert-cleared":""].filter(Boolean).join(" ");return D`
      <div class=${e}>
        ${this._renderAlertIcon(t)} ${this._renderAlertContent(t)}
        ${"on"===t.state&&this._shouldShowActions(t)?this._renderAlertActions(t):""}
      </div>
    `}_renderAlertIcon(t){return this.config?.show_severity_icons?D`
      <ha-icon
        class="alert-icon"
        icon="${function(t){switch(t){case"critical":return"mdi:alert-circle";case"warning":return"mdi:alert";case"info":return"mdi:information";default:return"mdi:help-circle"}}(t.severity)}"
        style="color: ${function(t){switch(t){case"critical":return"#f44336";case"warning":return"#ff9800";case"info":return"#2196f3";default:return"#9e9e9e"}}(t.severity)};"
      ></ha-icon>
    `:""}_renderAlertContent(t){return D`
      <div class="alert-content">
        <div class="alert-name">${t.name}</div>
        <div class="alert-meta">
          ${this.config?.show_group_labels?D`<span>${t.group}</span>`:""}
          ${this.config?.show_timestamps&&t.first_triggered?D`<span>• ${function(t){if(!t)return"";const e=new Date,r=new Date(t),s=e.getTime()-r.getTime(),i=Math.floor(s/6e4),n=Math.floor(i/60);return i<1?"just now":i<60?`${i}m ago`:`${n}h ago`}(t.first_triggered)}</span>`:""}
        </div>
      </div>
    `}_renderAlertActions(t){const e=this.loadingActions.has(t.entity_id);return D`
      <div class="action-buttons">
        ${this._renderAcknowledgeButton(t,e)}
        ${this._renderEscalateButton(t,e)}
        ${this._renderClearButton(t,e)}
      </div>
    `}_renderAcknowledgeButton(t,e){if(!this.config?.show_acknowledge_button||t.acknowledged||t.escalated)return"";const r="icons_only"===this.config?.button_style?"✓":"ACK";return D`
      <button
        class="action-btn acknowledge-btn ${e?"loading":""}"
        ?disabled=${e}
        @click=${()=>this._handleAcknowledge(t.entity_id)}
      >
        ${e?"⏳":r}
      </button>
    `}_renderEscalateButton(t,e){if(!this.config?.show_escalate_button||t.cleared)return"";if(t.escalated){const r="icons_only"===this.config?.button_style?"↓":"DE-ESC";return D`
        <button
          class="action-btn de-escalate-btn ${e?"loading":""}"
          ?disabled=${e}
          @click=${()=>this._handleDeEscalate(t.entity_id)}
        >
          ${e?"⏳":r}
        </button>
      `}if(!t.acknowledged&&!t.escalated){const r="icons_only"===this.config?.button_style?"↑":"ESC";return D`
        <button
          class="action-btn escalate-btn ${e?"loading":""}"
          ?disabled=${e}
          @click=${()=>this._handleEscalate(t.entity_id)}
        >
          ${e?"⏳":r}
        </button>
      `}return""}_renderClearButton(t,e){if(!this.config?.show_clear_button)return"";const r="icons_only"===this.config?.button_style?"×":"CLR";return D`
      <button
        class="action-btn clear-btn ${e?"loading":""}"
        ?disabled=${e}
        @click=${()=>this._handleClear(t.entity_id)}
      >
        ${e?"⏳":r}
      </button>
    `}static getStubConfig(){return{type:"custom:emergency-alerts-card",summary_entity:"",show_acknowledged:!0,show_cleared:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,max_alerts_per_group:10,show_acknowledge_button:!0,show_clear_button:!0,show_escalate_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30}}static getConfigElement(){return document.createElement("emergency-alerts-card-editor")}}ft.styles=ot,customElements.define("emergency-alerts-card",ft),(window.customCards=window.customCards||[]).push({type:"emergency-alerts-card",name:"Emergency Alerts Card",description:"A card to display emergency alerts from the Emergency Alerts integration"});export{ft as EmergencyAlertsCard};
//# sourceMappingURL=emergency-alerts-card.js.map
