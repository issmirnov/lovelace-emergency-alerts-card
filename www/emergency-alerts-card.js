/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:o,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,g=p.trustedTypes,_=g?g.emptyScript:"",f=p.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!o(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s,this[s]=r.fromAttribute(e,t.type)??this._$Ej?.get(s)??null,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,r=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??y)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[m("elementProperties")]=new Map,$[m("finalized")]=new Map,f?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.1.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=w.trustedTypes,x=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+E,C=`<${k}>`,O=document,P=()=>O.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,M="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,H=/>/g,N=RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,j=/"/g,z=/^(?:script|style|textarea|title)$/i,D=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),L=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),F=new WeakMap,W=O.createTreeWalker(O,129);function V(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const q=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",n=I;for(let e=0;e<i;e++){const i=t[e];let o,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===I?"!--"===l[1]?n=R:void 0!==l[1]?n=H:void 0!==l[2]?(z.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=r??I,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?N:'"'===l[3]?j:B):n===j||n===B?n=N:n===R||n===H?n=I:(n=N,r=void 0);const d=n===N&&t[e+1].startsWith("/>")?" ":"";a+=n===I?i+C:c>=0?(s.push(o),i.slice(0,c)+S+i.slice(c)+E+d):i+E+(-2===c?e:d)}return[V(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const n=t.length-1,o=this.parts,[l,c]=q(t,e);if(this.el=K.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=W.nextNode())&&o.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=c[a++],i=s.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);o.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?X:"?"===n[1]?tt:"@"===n[1]?et:Q}),s.removeAttribute(t)}else t.startsWith(E)&&(o.push({type:6,index:r}),s.removeAttribute(t));if(z.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),W.nextNode(),o.push({type:2,index:++r});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===k)o.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)o.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===L)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=U(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=J(t,r._$AS(t,e.values),r,s)),e}class Y{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);W.currentNode=s;let r=W.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let e;2===o.type?e=new Z(r,r.nextSibling,this,t):1===o.type?e=new o.ctor(r,o.name,o.strings,this,t):6===o.type&&(e=new it(r,this,t)),this._$AV.push(e),o=i[++n]}a!==o?.index&&(r=W.nextNode(),a++)}return W.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),U(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Y(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new Z(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=J(this,t,e,0),a=!U(t)||t!==this._$AH&&t!==L,a&&(this._$AH=t);else{const s=t;let n,o;for(t=r[0],n=0;n<r.length-1;n++)o=J(this,s[i+n],e,n),o===L&&(o=this._$AH[n]),a||=!U(o)||o!==this._$AH[n],o===G?t=G:t!==G&&(t+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!s&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class et extends Q{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??G)===L)return;const i=this._$AH,s=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(K,Z),(w.litHtmlVersions??=[]).push("3.3.0");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class at extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new Z(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const nt=rt.litElementPolyfillSupport;nt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.0");class ot extends at{constructor(){super(...arguments),this.alerts=[],this.grouped={},this.groupOrder=[],this.severityOrder=["critical","warning","info"]}static get properties(){return{hass:{attribute:!1},config:{attribute:!1},alerts:{type:Array,state:!0},grouped:{type:Object,state:!0}}}setConfig(t){if(!t||!t.type)throw new Error("Invalid configuration");this.config={show_acknowledged:!0,show_cleared:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,max_alerts_per_group:50,show_acknowledge_button:!0,show_clear_button:!0,show_escalate_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30,...t},this._startAutoRefresh()}updated(t){super.updated(t),t.has("hass")&&this._updateAlerts()}_startAutoRefresh(){this.refreshInterval&&clearInterval(this.refreshInterval),this.config?.refresh_interval&&this.config.refresh_interval>0&&(this.refreshInterval=window.setInterval(()=>{this._updateAlerts()},1e3*this.config.refresh_interval))}disconnectedCallback(){super.disconnectedCallback(),this.refreshInterval&&clearInterval(this.refreshInterval)}_groupAlertsBySeverity(t){const e={};this.severityOrder.forEach(t=>e[t]=[]);for(const i of t)e[i.severity]=e[i.severity]||[],e[i.severity].push(i);return e}_groupAlertsByGroup(t){const e={};for(const i of t){const t=i.group||"other";e[t]=e[t]||[],e[t].push(i)}return e}_groupAlertsByStatus(t){const e={active:[],acknowledged:[],escalated:[],cleared:[]};for(const i of t)e[i.status].push(i);return e}_updateAlerts(){if(!this.hass||!this.config)return;const t=[],e=this.config.entity_patterns||["binary_sensor.emergency_*"];Object.values(this.hass.states).forEach(i=>{const s=e.some(t=>{if(t.includes("*")){return new RegExp(t.replace(/\*/g,".*")).test(i.entity_id)}return i.entity_id===t}),r=i.attributes&&(i.attributes.severity||i.attributes.group);if(s||r){const e={entity_id:i.entity_id,name:i.attributes.friendly_name||i.entity_id,state:i.state,severity:i.attributes.severity||"info",group:i.attributes.group||"other",acknowledged:!!i.attributes.acknowledged,escalated:!!i.attributes.escalated,cleared:!!i.attributes.cleared,first_triggered:i.attributes.first_triggered,last_cleared:i.attributes.last_cleared,status:this._getAlertStatus(i)};this._shouldShowAlert(e)&&t.push(e)}}),this._sortAlerts(t),this.alerts=t,this.grouped=this._groupAlerts(t)}_getAlertStatus(t){return t.attributes.cleared?"cleared":t.attributes.acknowledged?"acknowledged":t.attributes.escalated?"escalated":"on"===t.state?"active":"inactive"}_shouldShowAlert(t){return!this.config||!(this.config.severity_filter&&!this.config.severity_filter.includes(t.severity))&&(!(this.config.group_filter&&this.config.group_filter.length>0&&!this.config.group_filter.includes(t.group))&&(!(this.config.status_filter&&!this.config.status_filter.includes(t.status))&&(!(!this.config.show_acknowledged&&t.acknowledged)&&(!(!this.config.show_cleared&&t.cleared)&&!(!this.config.show_escalated&&t.escalated)))))}_sortAlerts(t){this.config&&t.sort((t,e)=>{switch(this.config.sort_by){case"first_triggered":{const i=t.first_triggered?new Date(t.first_triggered).getTime():0;return(e.first_triggered?new Date(e.first_triggered).getTime():0)-i}case"severity":{const i={critical:0,warning:1,info:2};return(i[t.severity]||3)-(i[e.severity]||3)}case"name":return t.name.localeCompare(e.name);case"group":return t.group.localeCompare(e.group);default:return 0}})}_groupAlerts(t){if(!this.config)return{};switch(this.config.group_by){case"group":return this._groupAlertsByGroup(t);case"status":return this._groupAlertsByStatus(t);case"none":return{all:t};default:return this._groupAlertsBySeverity(t)}}async _handleAcknowledge(t){this.hass&&await this.hass.callService("emergency_alerts","acknowledge",{entity_id:t})}async _handleClear(t){this.hass&&await this.hass.callService("emergency_alerts","clear",{entity_id:t})}async _handleEscalate(t){this.hass&&await this.hass.callService("emergency_alerts","escalate",{entity_id:t})}async _handleDeEscalate(t){this.hass&&await this.hass.callService("emergency_alerts","acknowledge",{entity_id:t})}_formatTimeAgo(t){if(!t)return"";const e=new Date,i=new Date(t),s=e.getTime()-i.getTime(),r=Math.floor(s/6e4),a=Math.floor(r/60);return r<1?"just now":r<60?`${r}m ago`:`${a}h ago`}_getSeverityIcon(t){switch(t){case"critical":return"mdi:alert-circle";case"warning":return"mdi:alert";case"info":return"mdi:information";default:return"mdi:help-circle"}}_getSeverityColor(t){switch(t){case"critical":return"#f44336";case"warning":return"#ff9800";case"info":return"#2196f3";default:return"#9e9e9e"}}_getGroupTitle(t){if(!this.config)return t;switch(this.config.group_by){case"group":case"status":case"severity":return t.charAt(0).toUpperCase()+t.slice(1);default:return"All Alerts"}}_getGroupCount(t){return this.config?"status"===this.config.group_by?t.length:t.filter(t=>"on"===t.state).length:t.length}render(){if(!this.hass)return D`<div class="card">Loading...</div>`;const t=this.alerts.filter(t=>"on"===t.state).length,e=this.config?.compact_mode?"compact":"";return 0===this.alerts.length?D`
        <div class="card">
          <div class="summary-header">Emergency Alerts (0 active)</div>
          <div class="no-alerts">No alerts to display</div>
        </div>
      `:D`
      <div class="card ${e}">
        <div class="summary-header">Emergency Alerts (${t} active)</div>

        ${Object.entries(this.grouped).map(([t,e])=>{if(0===e.length)return"";const i=this._getGroupCount(e),s=this._getGroupTitle(t),r="severity"===this.config?.group_by?`alert-${t}`:"";return D`
            <div class="group-header ${r}">
              <span>${s} (${i})</span>
            </div>
            ${e.slice(0,this.config?.max_alerts_per_group||50).map(t=>D`
                <div
                  class="alert-item alert-${t.severity} ${t.acknowledged?"alert-acknowledged":""} ${t.escalated?"alert-escalated":""} ${t.cleared?"alert-cleared":""}"
                >
                  ${this.config?.show_severity_icons?D`
                        <ha-icon
                          class="alert-icon"
                          icon="${this._getSeverityIcon(t.severity)}"
                          style="color: ${this._getSeverityColor(t.severity)};"
                        ></ha-icon>
                      `:""}

                  <div class="alert-content">
                    <div class="alert-name">${t.name}</div>
                    <div class="alert-meta">
                      ${this.config?.show_group_labels?D` <span>${t.group}</span> `:""}
                      ${this.config?.show_timestamps&&t.first_triggered?D` <span>• ${this._formatTimeAgo(t.first_triggered)}</span> `:""}
                    </div>
                  </div>

                  ${"on"===t.state&&this._shouldShowActions(t)?D`
                        <div class="action-buttons">
                          ${!this.config?.show_acknowledge_button||t.acknowledged||t.escalated?"":D`
                                <button
                                  class="action-btn acknowledge-btn"
                                  @click="${()=>this._handleAcknowledge(t.entity_id)}"
                                >
                                  ${"icons_only"===this.config?.button_style?"✓":"ACK"}
                                </button>
                              `}
                          ${this.config?.show_escalate_button&&!t.cleared?t.escalated?D`
                                  <button
                                    class="action-btn de-escalate-btn"
                                    @click="${()=>this._handleDeEscalate(t.entity_id)}"
                                  >
                                    ${"icons_only"===this.config?.button_style?"↓":"DE-ESC"}
                                  </button>
                                `:t.acknowledged||t.escalated?"":D`
                                    <button
                                      class="action-btn escalate-btn"
                                      @click="${()=>this._handleEscalate(t.entity_id)}"
                                    >
                                      ${"icons_only"===this.config?.button_style?"↑":"ESC"}
                                    </button>
                                  `:""}
                          ${this.config?.show_clear_button?D`
                                <button
                                  class="action-btn clear-btn"
                                  @click="${()=>this._handleClear(t.entity_id)}"
                                >
                                  ${"icons_only"===this.config?.button_style?"×":"CLR"}
                                </button>
                              `:""}
                        </div>
                      `:""}
                </div>
              `)}
          `})}
      </div>
    `}_shouldShowActions(t){return!t.cleared}static getConfigElement(){return document.createElement("emergency-alerts-card-editor")}static getStubConfig(){return{type:"custom:emergency-alerts-card",summary_entity:"",show_acknowledged:!0,show_cleared:!1,show_escalated:!0,group_by:"severity",sort_by:"first_triggered",severity_filter:["critical","warning","info"],group_filter:[],status_filter:["active","acknowledged","escalated"],compact_mode:!1,show_timestamps:!0,show_group_labels:!0,show_severity_icons:!0,max_alerts_per_group:10,show_acknowledge_button:!0,show_clear_button:!0,show_escalate_button:!0,button_style:"compact",entity_patterns:["binary_sensor.emergency_*"],refresh_interval:30}}}ot.styles=a`
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

    .action-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .action-btn:active {
      transform: translateY(0);
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
  `;class lt extends at{static get properties(){return{hass:{attribute:!1},config:{attribute:!1}}}setConfig(t){this.config=t}_valueChanged(t,e){if(this.config)try{const i={...this.config};if(t.includes(".")){const[s,r]=t.split("."),a=s,n=i[a];i[a]=n&&"object"==typeof n?{...n,[r]:e}:{[r]:e}}else switch(t){case"button_style":if(!["compact","full","icons_only"].includes(e))return void console.warn(`Invalid button_style value: ${e}`);i[t]=e;break;case"group_by":if(!["severity","group","status","none"].includes(e))return void console.warn(`Invalid group_by value: ${e}`);i[t]=e;break;case"sort_by":if(!["first_triggered","severity","name","group"].includes(e))return void console.warn(`Invalid sort_by value: ${e}`);i[t]=e;break;default:i[t]=e}this.config=i,this._fireConfigChanged()}catch(e){console.error(`Error updating field ${t}:`,e)}}_fireConfigChanged(){const t=new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0});this.dispatchEvent(t)}_updateStringArray(t,e){this._valueChanged(t,e)}_addArrayItem(t){const e=this.config?.[t]||[];this._updateStringArray(t,[...e,""])}_removeArrayItem(t,e){const i=(this.config?.[t]||[]).filter((t,i)=>i!==e);this._updateStringArray(t,i)}_updateArrayItem(t,e,i){const s=[...this.config?.[t]||[]];s[e]=i,this._updateStringArray(t,s)}_toggleFilterValue(t,e,i){const s=this.config?.[t]||[];let r;r=i?s.includes(e)?s:[...s,e]:s.filter(t=>t!==e),this._updateStringArray(t,r)}_getSummaryEntityOptions(){if(!this.hass)return[];const t=Object.values(this.hass.states).filter(t=>{const e=t.entity_id;return e.startsWith("sensor.emergency_alerts")&&(e.includes("summary")||e.includes("Summary"))}).sort((t,e)=>t.entity_id.localeCompare(e.entity_id));return t.map(t=>D`
        <mwc-list-item value="${t.entity_id}">
          ${t.attributes?.friendly_name||t.entity_id}
        </mwc-list-item>
      `)}_getSeverityOptions(){return[{value:"critical",label:"Critical"},{value:"warning",label:"Warning"},{value:"info",label:"Info"}]}_getStatusOptions(){return[{value:"active",label:"Active"},{value:"acknowledged",label:"Acknowledged"},{value:"escalated",label:"Escalated"},{value:"cleared",label:"Cleared"}]}_getGroupOptions(){if(!this.hass)return[];const t=new Set;return Object.values(this.hass.states).forEach(e=>{e.attributes?.group&&t.add(e.attributes.group)}),Array.from(t).sort().map(t=>({value:t,label:t.charAt(0).toUpperCase()+t.slice(1)}))}_renderMultiSelectEditor(t,e,i,s){const r=this.config?.[t]||[];return D`
      <div class="field">
        <label>${e}</label>
        <div class="field-input">
          <div class="multi-select-container">
            ${i.map(e=>D`
                <div class="checkbox-item">
                  <ha-checkbox
                    .checked=${r.includes(e.value)}
                    @change=${i=>this._toggleFilterValue(t,e.value,i.target.checked)}
                  ></ha-checkbox>
                  <span class="checkbox-label">${e.label}</span>
                </div>
              `)}
          </div>
          ${s?D`<div class="help-text">${s}</div>`:""}
        </div>
      </div>
    `}_renderStringArrayEditor(t,e,i){const s=this.config?.[t]||[];return D`
      <div class="field">
        <label>${e}</label>
        <div class="field-input">
          <div class="array-input">
            ${s.map((e,i)=>D`
                <div class="array-item">
                  <ha-textfield
                    .value=${e}
                    @input=${e=>this._updateArrayItem(t,i,e.target.value)}
                    placeholder="Enter value..."
                  ></ha-textfield>
                  <mwc-button
                    class="remove-btn"
                    @click=${()=>this._removeArrayItem(t,i)}
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
          ${i?D`<div class="help-text">${i}</div>`:""}
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
                @change=${t=>{const e=t.target;this._valueChanged("summary_entity",e.value)}}
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
                @change=${t=>{const e=t.target;this._valueChanged("group_by",e.value)}}
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
                @change=${t=>{const e=t.target;this._valueChanged("sort_by",e.value)}}
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
            <label>Show Cleared Alerts</label>
            <ha-switch
              .checked=${this.config.show_cleared??!1}
              @change=${t=>this._valueChanged("show_cleared",t.target.checked)}
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
            <label>Show Clear Button</label>
            <ha-switch
              .checked=${this.config.show_clear_button??!0}
              @change=${t=>this._valueChanged("show_clear_button",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Show Escalate Button</label>
            <ha-switch
              .checked=${this.config.show_escalate_button??!0}
              @change=${t=>this._valueChanged("show_escalate_button",t.target.checked)}
            ></ha-switch>
          </div>

          <div class="field">
            <label>Button Style</label>
            <div class="field-input">
              <ha-select
                .value=${this.config.button_style||"compact"}
                @change=${t=>{const e=t.target;this._valueChanged("button_style",e.value)}}
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
    `:D``}}lt.styles=a`
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

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .help-text {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 4px;
      font-style: italic;
    }

    .entity-patterns {
      width: 100%;
      min-height: 100px;
      font-family: monospace;
      resize: vertical;
    }

    mwc-button {
      margin: 4px;
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
  `,customElements.define("emergency-alerts-card",ot),customElements.define("emergency-alerts-card-editor",lt),(window.customCards=window.customCards||[]).push({type:"emergency-alerts-card",name:"Emergency Alerts Card",description:"A card to display emergency alerts from the Emergency Alerts integration"});export{ot as EmergencyAlertsCard,lt as EmergencyAlertsCardEditor};
