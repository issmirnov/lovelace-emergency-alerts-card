/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,g=p.trustedTypes,f=g?g.emptyScript:"",_=p.reactiveElementPolyfillSupport,v=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},y=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i,this[i]=r.fromAttribute(e,t.type)??this._$Ej?.get(i)??null,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,r=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??y)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,_?.({ReactiveElement:w}),(p.reactiveElementVersions??=[]).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $=globalThis,x=$.trustedTypes,A=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+k,C=`<${E}>`,z=document,O=()=>z.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,T="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,M=/>/g,H=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,B=/"/g,j=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),F=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),q=new WeakMap,G=z.createTreeWalker(z,129);function W(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const V=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===R?"!--"===l[1]?n=I:void 0!==l[1]?n=M:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=H):void 0!==l[3]&&(n=H):n===H?">"===l[0]?(n=r??R,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?H:'"'===l[3]?B:N):n===B||n===N?n=H:n===I||n===M?n=R:(n=H,r=void 0);const h=n===H&&t[e+1].startsWith("/>")?" ":"";o+=n===R?s+C:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+k+h):s+k+(-2===c?e:h)}return[W(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,c]=V(t,e);if(this.el=Y.createElement(l,s),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[o++],s=i.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?X:"?"===n[1]?tt:"@"===n[1]?et:Q}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),G.nextNode(),a.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:r}),t+=k.length-1}r++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function J(t,e,s=t,i){if(e===F)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);G.currentNode=i;let r=G.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Z(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=G.nextNode(),o++)}return G.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),U(t)?t===L||null==t||""===t?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==L&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Y.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Y(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Z(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=L}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=J(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==F,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=J(this,i[s+n],e,n),a===F&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===L?t=L:t!==L&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==L)}}class et extends Q{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??L)===F)return;const s=this._$AH,i=t===L&&s!==L||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==L&&(s===L||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const it=$.litHtmlPolyfillSupport;it?.(Y,Z),($.litHtmlVersions??=[]).push("3.3.0");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Z(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const nt=rt.litElementPolyfillSupport;nt?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.0");const at=o`
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

  /* v2.0 Alert state classes with animations */
  .alert-acknowledged {
    opacity: 0.7;
    background: rgba(76, 175, 80, 0.1);
    transition:
      opacity 0.3s ease,
      background 0.3s ease;
  }

  .alert-snoozed {
    opacity: 0.6;
    background: rgba(255, 152, 0, 0.1);
    transition:
      opacity 0.3s ease,
      background 0.3s ease;
  }

  .alert-escalated {
    border-left-color: #f44336;
    background: rgba(244, 67, 54, 0.1);
    animation: pulse 2s ease-in-out infinite;
  }

  .alert-resolved {
    opacity: 0.5;
    background: rgba(33, 150, 243, 0.1);
    transition:
      opacity 0.5s ease,
      background 0.5s ease;
  }

  /* v2.0 State-based classes for additional styling */
  .state-snoozed {
    border-left-width: 6px;
  }

  .state-escalated {
    border-left-width: 6px;
  }

  .state-resolved {
    filter: grayscale(0.3);
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

  /* v2.0 Button styles - switch-based */
  .acknowledge-btn {
    background: var(--primary-color, #1976d2);
    color: white;
  }

  .snooze-btn {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .resolve-btn {
    background: var(--success-color, #4caf50);
    color: white;
  }

  /* v2.0 Active button states */
  .acknowledged-active {
    background: var(--success-color, #4caf50) !important;
    box-shadow: 0 0 0 2px var(--success-color, #4caf50);
  }

  .snoozed-active {
    background: var(--warning-color, #ff9800) !important;
    box-shadow: 0 0 0 2px var(--warning-color, #ff9800);
    animation: pulse-subtle 2s ease-in-out infinite;
  }

  .resolved-active {
    background: var(--info-color, #2196f3) !important;
    box-shadow: 0 0 0 2px var(--info-color, #2196f3);
    opacity: 0.8;
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

  /* v2.0 Status Badge Styles */
  .status-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.65em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 8px;
    animation: fadeIn 0.3s ease;
  }

  .status-badge.active {
    background: var(--error-color, #f44336);
    color: white;
  }

  .status-badge.acknowledged {
    background: var(--success-color, #4caf50);
    color: white;
  }

  .status-badge.snoozed {
    background: var(--warning-color, #ff9800);
    color: white;
  }

  .status-badge.escalated {
    background: var(--error-color, #f44336);
    color: white;
    animation: pulse-badge 1.5s ease-in-out infinite;
  }

  .status-badge.resolved {
    background: var(--info-color, #2196f3);
    color: white;
  }

  .status-badge.inactive {
    background: var(--disabled-text-color, #bdbdbd);
    color: white;
  }

  /* v2.0 Escalated Indicator */
  .escalated-indicator {
    font-size: 0.9em;
    margin-left: 6px;
    animation: wiggle 0.5s ease-in-out infinite;
  }

  /* v2.0 Animations */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }

  @keyframes pulse-subtle {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.9;
    }
  }

  @keyframes pulse-badge {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(244, 67, 54, 0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes wiggle {
    0%,
    100% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    75% {
      transform: rotate(5deg);
    }
  }
`;class lt{constructor(t,e){this.hass=t,this.onError=e}_convertToSwitchId(t,e){let s=t.replace("binary_sensor.","switch.");return s=s.replace("emergency_",""),s+`_${e}`}handleError(t,e,s){const i=`Failed to ${t}`;console.error(`[Emergency Alerts Card] ${i}:`,s),console.error(`Entity: ${e}`),this.onError&&this.onError({message:i,entity_id:e,error:s})}async acknowledge(t){try{const e=this._convertToSwitchId(t,"acknowledged");await this.hass.callService("switch","toggle",{entity_id:e})}catch(e){throw this.handleError("acknowledge alert",t,e),e}}async snooze(t){try{const e=this._convertToSwitchId(t,"snoozed");await this.hass.callService("switch","turn_on",{entity_id:e})}catch(e){throw this.handleError("snooze alert",t,e),e}}async resolve(t){try{const e=this._convertToSwitchId(t,"resolved");await this.hass.callService("switch","toggle",{entity_id:e})}catch(e){throw this.handleError("resolve alert",t,e),e}}updateHass(t){this.hass=t}setErrorCallback(t){this.onError=t}}function ct(t,e,s){return e.some(e=>{if(e.includes("*")){let i;return s&&s.has(e)?i=s.get(e):(i=new RegExp(e.replace(/\*/g,".*")),s&&s.set(e,i)),i.test(t)}return t===e})}const dt={critical:0,warning:1,info:2};const ht=["critical","warning","info"];function ut(t,e){switch(e.group_by){case"group":return function(t){const e={};for(const s of t){const t=s.group||"other";e[t]||(e[t]=[]),e[t].push(s)}return e}(t);case"status":return function(t){const e={active:[],acknowledged:[],snoozed:[],escalated:[],resolved:[]};for(const s of t)e[s.status].push(s);return e}(t);case"none":return function(t){return{all:t}}(t);default:return function(t){const e={};ht.forEach(t=>{e[t]=[]});for(const s of t)e[s.severity]||(e[s.severity]=[]),e[s.severity].push(s);return e}(t)}}function pt(t){const e=t.attributes;return e.resolved?"resolved":e.escalated?"escalated":e.snoozed?"snoozed":e.acknowledged?"acknowledged":"on"===t.state?"active":"inactive"}function gt(t){return!(!t.attributes||!t.attributes.severity&&!t.attributes.group)}function ft(t){const e=t.attributes;return{entity_id:t.entity_id,name:e.friendly_name||t.entity_id,state:t.state,severity:e.severity||"info",group:e.group||"other",acknowledged:!!e.acknowledged,escalated:!!e.escalated,snoozed:!!e.snoozed,resolved:!!e.resolved,first_triggered:e.first_triggered,last_cleared:e.last_cleared,snooze_until:e.snooze_until,status:pt(t)}}function _t(t,e,s){const i=[];for(const r of Object.values(t)){const t=ct(r.entity_id,e,s),o=gt(r);(t||o)&&i.push(r)}return i}class vt extends ot{constructor(){super(...arguments),this.alerts=[],this.grouped={},this.loadingActions=new Set,this.patternCache=new Map,this.lastStatesHash=""}static get properties(){return{hass:{attribute:!1},config:{attribute:!1},alerts:{type:Array,state:!0},grouped:{type:Object,state:!0},loadingActions:{type:Object,state:!0},currentError:{type:Object,state:!0}}}setConfig(t){if(!t)throw new Error("Invalid configuration");this.config={show_acknowledged:!0,show_snoozed:!0,show_resolved:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","snoozed","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,show_status_badge:!0,max_alerts_per_group:50,show_acknowledge_button:!0,show_snooze_button:!0,show_resolve_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30,...t},this._startAutoRefresh()}updated(t){super.updated(t),t.has("hass")&&this.hass&&(this.alertService?this.alertService.updateHass(this.hass):this.alertService=new lt(this.hass,this._handleError.bind(this)),this._hasRelevantChanges()&&this._updateAlerts())}_hasRelevantChanges(){if(!this.hass||!this.config)return!1;const t=this.config.entity_patterns||["binary_sensor.emergency_*"],e=_t(this.hass.states,t,this.patternCache),s=e.map(t=>`${t.entity_id}:${t.last_updated}`).sort().join("|");const i=s!==this.lastStatesHash;return i&&(this.lastStatesHash=s),i}_updateAlerts(){if(!this.hass||!this.config)return;const t=this.config.entity_patterns||["binary_sensor.emergency_*"],e=_t(this.hass.states,t,this.patternCache).map(ft).filter(t=>function(t,e){return!(e.severity_filter&&!e.severity_filter.includes(t.severity)||e.group_filter&&e.group_filter.length>0&&!e.group_filter.includes(t.group)||e.status_filter&&!e.status_filter.includes(t.status)||!e.show_acknowledged&&t.acknowledged||!e.show_snoozed&&t.snoozed||!e.show_resolved&&t.resolved||!e.show_escalated&&t.escalated)}(t,this.config));var s,i;s=e,i=this.config,s.sort((t,e)=>{switch(i.sort_by){case"first_triggered":{const s=t.first_triggered?new Date(t.first_triggered).getTime():0;return(e.first_triggered?new Date(e.first_triggered).getTime():0)-s}case"severity":return(void 0!==dt[t.severity]?dt[t.severity]:3)-(void 0!==dt[e.severity]?dt[e.severity]:3);case"name":return t.name.localeCompare(e.name);case"group":return t.group.localeCompare(e.group);default:return 0}}),this.alerts=e,this.grouped=ut(e,this.config)}_startAutoRefresh(){this.refreshInterval&&clearInterval(this.refreshInterval),this.config?.refresh_interval&&this.config.refresh_interval>0&&(this.refreshInterval=window.setInterval(()=>{this._updateAlerts()},1e3*this.config.refresh_interval))}disconnectedCallback(){super.disconnectedCallback(),this.refreshInterval&&clearInterval(this.refreshInterval)}_handleError(t){this.currentError=t,this.requestUpdate(),setTimeout(()=>{this.currentError===t&&(this.currentError=void 0,this.requestUpdate())},5e3)}_dismissError(){this.currentError=void 0}async _handleAcknowledge(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.acknowledge(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}async _handleResolve(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.resolve(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}async _handleSnooze(t){if(this.alertService){this.loadingActions.add(t),this.requestUpdate();try{await this.alertService.snooze(t)}finally{this.loadingActions.delete(t),this.requestUpdate()}}}_shouldShowActions(t){return!0}_formatSnoozeTime(t){if(!t)return"";return`until ${new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}`}_renderStatusBadge(t){return this.config?.show_status_badge?D`
      <span class="status-badge ${t.status}"> ${t.status.toUpperCase()} </span>
    `:""}render(){if(!this.hass)return D`<div class="card">Loading...</div>`;const t=this.alerts.filter(t=>"on"===t.state).length,e=this.config?.compact_mode?"compact":"";return D`
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
    `}_renderAlertGroup(t,e){if(0===e.length)return"";const s=function(t,e){return"status"===e?t.length:t.filter(t=>"on"===t.state).length}(e,this.config.group_by||"severity"),i=function(t,e){return"none"===e?"All Alerts":(s=t).charAt(0).toUpperCase()+s.slice(1);var s}(t,this.config.group_by||"severity"),r="severity"===this.config?.group_by?`alert-${t}`:"",o=this.config?.max_alerts_per_group||50,n=e.slice(0,o);return D`
      <div class="group-header ${r}">
        <span>${i} (${s})</span>
      </div>
      ${n.map(t=>this._renderAlert(t))}
    `}_renderAlert(t){const e=["alert-item",`alert-${t.severity}`,`state-${t.status}`,t.acknowledged?"alert-acknowledged":"",t.snoozed?"alert-snoozed":"",t.escalated?"alert-escalated":"",t.resolved?"alert-resolved":""].filter(Boolean).join(" ");return D`
      <div class=${e}>
        ${this._renderAlertIcon(t)} ${this._renderStatusBadge(t)}
        ${this._renderAlertContent(t)}
        ${this._shouldShowActions(t)?this._renderAlertActions(t):""}
      </div>
    `}_renderAlertIcon(t){return this.config?.show_severity_icons?D`
      <ha-icon
        class="alert-icon"
        icon="${function(t){switch(t){case"critical":return"mdi:alert-circle";case"warning":return"mdi:alert";case"info":return"mdi:information";default:return"mdi:help-circle"}}(t.severity)}"
        style="color: ${function(t){switch(t){case"critical":return"#f44336";case"warning":return"#ff9800";case"info":return"#2196f3";default:return"#9e9e9e"}}(t.severity)};"
      ></ha-icon>
    `:""}_renderAlertContent(t){return D`
      <div class="alert-content">
        <div class="alert-name">
          ${t.name} ${t.escalated?D`<span class="escalated-indicator">⚠️</span>`:""}
        </div>
        <div class="alert-meta">
          ${this.config?.show_group_labels?D`<span>${t.group}</span>`:""}
          ${this.config?.show_timestamps&&t.first_triggered?D`<span>• ${function(t){if(!t)return"";const e=new Date,s=new Date(t),i=e.getTime()-s.getTime(),r=Math.floor(i/6e4),o=Math.floor(r/60);return r<1?"just now":r<60?`${r}m ago`:`${o}h ago`}(t.first_triggered)}</span>`:""}
        </div>
      </div>
    `}_renderAlertActions(t){const e=this.loadingActions.has(t.entity_id);return D`
      <div class="action-buttons">
        ${this._renderAcknowledgeButton(t,e)}
        ${this._renderSnoozeButton(t,e)} ${this._renderResolveButton(t,e)}
      </div>
    `}_renderAcknowledgeButton(t,e){if(!this.config?.show_acknowledge_button)return"";const s=t.acknowledged,i=s?"icons_only"===this.config?.button_style?"✓":"✓ Acknowledged":"icons_only"===this.config?.button_style?"○":"Acknowledge";return D`
      <button
        class="action-btn acknowledge-btn ${e?"loading":""} ${s?"acknowledged-active":""}"
        ?disabled=${e}
        @click=${()=>this._handleAcknowledge(t.entity_id)}
        title="Mark as working on it (prevents auto-escalation). Turning this ON will turn other switches OFF."
      >
        ${e?"⏳":i}
      </button>
    `}_renderSnoozeButton(t,e){if(!this.config?.show_snooze_button)return"";const s=t.snoozed,i=s?"icons_only"===this.config?.button_style?"🔕":`🔕 Snoozed ${this._formatSnoozeTime(t.snooze_until)}`:"icons_only"===this.config?.button_style?"💤":"Snooze (5m)";return D`
      <button
        class="action-btn snooze-btn ${e?"loading":""} ${s?"snoozed-active":""}"
        ?disabled=${e}
        @click=${()=>this._handleSnooze(t.entity_id)}
        title="Silence for 5 minutes (auto-expires). Turning this ON will turn other switches OFF."
      >
        ${e?"⏳":i}
      </button>
    `}_renderResolveButton(t,e){if(!this.config?.show_resolve_button)return"";const s=t.resolved,i=s?"icons_only"===this.config?.button_style?"✓":"✓ Resolved":"icons_only"===this.config?.button_style?"×":"Resolve";return D`
      <button
        class="action-btn resolve-btn ${e?"loading":""} ${s?"resolved-active":""}"
        ?disabled=${e}
        @click=${()=>this._handleResolve(t.entity_id)}
        title="Mark as fixed (won't re-trigger until condition clears). Turning this ON will turn other switches OFF."
      >
        ${e?"⏳":i}
      </button>
    `}static getStubConfig(){return{type:"custom:emergency-alerts-card",summary_entity:"",show_acknowledged:!0,show_snoozed:!0,show_resolved:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","snoozed","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,show_status_badge:!0,max_alerts_per_group:10,show_acknowledge_button:!0,show_snooze_button:!0,show_resolve_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30}}static getConfigElement(){return document.createElement("emergency-alerts-card-editor")}}vt.styles=at;class mt extends ot{static get properties(){return{hass:{attribute:!1},config:{attribute:!1}}}setConfig(t){this.config=t}_valueChanged(t,e){if(!this.config)return;const s={...this.config,[t]:e};this.config=s,this._fireConfigChanged()}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0});this.dispatchEvent(t)}_updateStringArray(t,e){this._valueChanged(t,e)}_addArrayItem(t){const e=this.config?.[t]||[];this._updateStringArray(t,[...e,""])}_removeArrayItem(t,e){const s=(this.config?.[t]||[]).filter((t,s)=>s!==e);this._updateStringArray(t,s)}_updateArrayItem(t,e,s){const i=[...this.config?.[t]||[]];i[e]=s,this._updateStringArray(t,i)}_toggleFilterValue(t,e,s){const i=this.config?.[t]||[];let r;r=s?i.includes(e)?i:[...i,e]:i.filter(t=>t!==e),this._updateStringArray(t,r)}_getSummaryEntityOptions(){if(!this.hass)return[];const t=Object.values(this.hass.states).filter(t=>{const e=t.entity_id;return e.startsWith("sensor.emergency_alerts")&&(e.includes("summary")||e.includes("Summary"))}).sort((t,e)=>t.entity_id.localeCompare(e.entity_id));return t.map(t=>D`
        <mwc-list-item value="${t.entity_id}">
          ${t.attributes?.friendly_name||t.entity_id}
        </mwc-list-item>
      `)}_getSeverityOptions(){return[{value:"critical",label:"Critical"},{value:"warning",label:"Warning"},{value:"info",label:"Info"}]}_getStatusOptions(){return[{value:"active",label:"Active"},{value:"acknowledged",label:"Acknowledged"},{value:"snoozed",label:"Snoozed"},{value:"escalated",label:"Escalated"},{value:"resolved",label:"Resolved"}]}_getGroupOptions(){if(!this.hass)return[];const t=new Set;return Object.values(this.hass.states).forEach(e=>{const s=e.attributes?.group;"string"==typeof s&&t.add(s)}),Array.from(t).sort().map(t=>({value:t,label:t.charAt(0).toUpperCase()+t.slice(1)}))}_renderMultiSelectEditor(t,e,s,i){const r=this.config?.[t]||[];return D`
      <div class="field">
        <label>${e}</label>
        <div class="field-input">
          <div class="multi-select-container">
            ${s.map(e=>D`
                <div class="checkbox-item">
                  <ha-checkbox
                    .checked=${r.includes(e.value)}
                    @change=${s=>this._toggleFilterValue(t,e.value,s.target.checked)}
                  ></ha-checkbox>
                  <span class="checkbox-label">${e.label}</span>
                </div>
              `)}
          </div>
          ${i?D`<div class="help-text">${i}</div>`:""}
        </div>
      </div>
    `}_renderStringArrayEditor(t,e,s){const i=this.config?.[t]||[];return D`
      <div class="field">
        <label>${e}</label>
        <div class="field-input">
          <div class="array-input">
            ${i.map((e,s)=>D`
                <div class="array-item">
                  <ha-textfield
                    .value=${e}
                    @input=${e=>this._updateArrayItem(t,s,e.target.value)}
                    placeholder="Enter value..."
                  ></ha-textfield>
                  <mwc-button
                    class="remove-btn"
                    @click=${()=>this._removeArrayItem(t,s)}
                    outlined
                  >
                    Remove
                  </mwc-button>
                </div>
              `)}
            <mwc-button @click=${()=>this._addArrayItem(t)} outlined>
              Add ${e.replace(/s$/,"")}
            </mwc-button>
          </div>
          ${s?D`<div class="help-text">${s}</div>`:""}
        </div>
      </div>
    `}render(){return this.config?D`
      <div class="editor">
        <!-- Basic Configuration -->
        <div class="section">
          <div class="section-header">Basic Configuration</div>

          <div class="field">
            <label>Summary Entity</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.summary_entity||""}
                @change=${t=>this._valueChanged("summary_entity",t.target.value)}
              >
                <mwc-list-item value="">Auto-detect (recommended)</mwc-list-item>
                ${this._getSummaryEntityOptions()}
              </ha-select>
              <div class="help-text">Optional: Entity that provides summary information</div>
            </div>
          </div>

          <div class="field">
            <label>Group By</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.group_by||"severity"}
                @change=${t=>this._valueChanged("group_by",t.target.value)}
              >
                <mwc-list-item value="severity">Severity</mwc-list-item>
                <mwc-list-item value="group">Group</mwc-list-item>
                <mwc-list-item value="status">Status</mwc-list-item>
                <mwc-list-item value="none">None</mwc-list-item>
              </ha-select>
            </div>
          </div>

          <div class="field">
            <label>Sort By</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.sort_by||"first_triggered"}
                @change=${t=>this._valueChanged("sort_by",t.target.value)}
              >
                <mwc-list-item value="first_triggered">First Triggered</mwc-list-item>
                <mwc-list-item value="severity">Severity</mwc-list-item>
                <mwc-list-item value="name">Name</mwc-list-item>
                <mwc-list-item value="group">Group</mwc-list-item>
              </ha-select>
            </div>
          </div>
        </div>

        <!-- Display Options -->
        <div class="section">
          <div class="section-header">Display Options</div>

          <div class="field">
            <label>Show Acknowledged Alerts</label>
            <ha-switch
              .checked=${this.config.show_acknowledged??!0}
              @change=${t=>this._valueChanged("show_acknowledged",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Snoozed Alerts</label>
            <ha-switch
              .checked=${this.config.show_snoozed??!0}
              @change=${t=>this._valueChanged("show_snoozed",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Resolved Alerts</label>
            <ha-switch
              .checked=${this.config.show_resolved??!1}
              @change=${t=>this._valueChanged("show_resolved",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Escalated Alerts</label>
            <ha-switch
              .checked=${this.config.show_escalated??!0}
              @change=${t=>this._valueChanged("show_escalated",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Compact Mode</label>
            <ha-switch
              .checked=${this.config.compact_mode??!1}
              @change=${t=>this._valueChanged("compact_mode",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Timestamps</label>
            <ha-switch
              .checked=${this.config.show_timestamps??!0}
              @change=${t=>this._valueChanged("show_timestamps",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Group Labels</label>
            <ha-switch
              .checked=${this.config.show_group_labels??!0}
              @change=${t=>this._valueChanged("show_group_labels",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Severity Icons</label>
            <ha-switch
              .checked=${this.config.show_severity_icons??!0}
              @change=${t=>this._valueChanged("show_severity_icons",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Max Alerts Per Group</label>
            <div class="field-input">
              <ha-textfield
                type="number"
                .value=${String(this.config.max_alerts_per_group||10)}
                @input=${t=>this._valueChanged("max_alerts_per_group",parseInt(t.target.value)||10)}
                min="1"
                max="100"
              ></ha-textfield>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="section">
          <div class="section-header">Action Buttons</div>

          <div class="field">
            <label>Show Acknowledge Button</label>
            <ha-switch
              .checked=${this.config.show_acknowledge_button??!0}
              @change=${t=>this._valueChanged("show_acknowledge_button",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Snooze Button</label>
            <ha-switch
              .checked=${this.config.show_snooze_button??!0}
              @change=${t=>this._valueChanged("show_snooze_button",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Resolve Button</label>
            <ha-switch
              .checked=${this.config.show_resolve_button??!0}
              @change=${t=>this._valueChanged("show_resolve_button",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Button Style</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.button_style||"compact"}
                @change=${t=>this._valueChanged("button_style",t.target.value)}
              >
                <mwc-list-item value="compact">Compact</mwc-list-item>
                <mwc-list-item value="full">Full</mwc-list-item>
                <mwc-list-item value="icons_only">Icons Only</mwc-list-item>
              </ha-select>
            </div>
          </div>
        </div>

        <!-- Filtering -->
        <div class="section">
          <div class="section-header">Filtering</div>

          ${this._renderMultiSelectEditor("severity_filter","Severity Filter",this._getSeverityOptions(),"Select which severity levels to show (leave all unchecked to show all)")}
          ${this._renderMultiSelectEditor("group_filter","Group Filter",this._getGroupOptions(),"Select which alert groups to show (leave all unchecked to show all)")}
          ${this._renderMultiSelectEditor("status_filter","Status Filter",this._getStatusOptions(),"Select which statuses to show (leave all unchecked to show all)")}
        </div>

        <!-- Advanced Options -->
        <div class="section">
          <div class="section-header">Advanced Options</div>

          ${this._renderStringArrayEditor("entity_patterns","Entity Patterns","Patterns to match emergency alert entities (use * for wildcards)")}

          <div class="field">
            <label>Refresh Interval (seconds)</label>
            <div class="field-input">
              <ha-textfield
                type="number"
                .value=${String(this.config.refresh_interval||30)}
                @input=${t=>this._valueChanged("refresh_interval",parseInt(t.target.value)||30)}
                min="5"
                max="300"
              ></ha-textfield>
              <div class="help-text">How often to refresh alert data (5-300 seconds)</div>
            </div>
          </div>
        </div>
      </div>
    `:D``}}mt.styles=o`
    .editor {
      padding: 16px;
      background: var(--ha-card-background, white);
      border-radius: var(--ha-card-border-radius, 8px);
    }

    .section {
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
    }

    .section-header {
      font-size: 1.1em;
      font-weight: bold;
      margin-bottom: 12px;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding-bottom: 8px;
    }

    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 12px 0;
      min-height: 40px;
    }

    .field label {
      flex: 1;
      margin-right: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .field-input {
      flex: 1;
      max-width: 300px;
    }

    ha-textfield,
    ha-select {
      width: 100%;
    }

    ha-switch {
      margin-left: auto;
    }

    .multi-select-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      padding: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
    }

    .checkbox-label {
      font-size: 0.9em;
      color: var(--primary-text-color);
      cursor: pointer;
    }

    .checkbox-item:hover {
      background: var(--secondary-background-color, #f5f5f5);
      border-radius: 4px;
      padding: 4px 8px;
      margin: 0 -8px;
    }

    .checkbox-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .help-text {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 4px;
      font-style: italic;
    }

    .array-input {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .array-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .array-item ha-textfield {
      flex: 1;
    }

    .remove-btn {
      --mdc-theme-primary: var(--error-color, #f44336);
    }
  `,customElements.define("emergency-alerts-card",vt),customElements.define("emergency-alerts-card-editor",mt),(window.customCards=window.customCards||[]).push({type:"custom:emergency-alerts-card",name:"Emergency Alerts Card",description:"A card to display emergency alerts from the Emergency Alerts integration"});export{vt as EmergencyAlertsCard,mt as EmergencyAlertsCardEditor};
//# sourceMappingURL=emergency-alerts-card.js.map
