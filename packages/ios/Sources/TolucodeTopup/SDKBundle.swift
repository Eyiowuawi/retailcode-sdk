// AUTO-GENERATED — do not edit. Run pnpm build in packages/web to regenerate.
// swiftlint:disable all
let kRetailcodeSdkBundle = #"""
"use strict";var RetailcodeSDK=(()=>{var A=Object.defineProperty,Ee=Object.defineProperties,Ce=Object.getOwnPropertyDescriptor,Me=Object.getOwnPropertyDescriptors,$e=Object.getOwnPropertyNames,ie=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,Pe=Object.prototype.propertyIsEnumerable;var ne=(t,e,i)=>e in t?A(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,u=(t,e)=>{for(var i in e||(e={}))re.call(e,i)&&ne(t,i,e[i]);if(ie)for(var i of ie(e))Pe.call(e,i)&&ne(t,i,e[i]);return t},f=(t,e)=>Ee(t,Me(e));var He=(t,e)=>{for(var i in e)A(t,i,{get:e[i],enumerable:!0})},Oe=(t,e,i,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of $e(e))!re.call(t,a)&&a!==i&&A(t,a,{get:()=>e[a],enumerable:!(r=Ce(e,a))||r.enumerable});return t};var Re=t=>Oe(A({},"__esModule",{value:!0}),t);var ze={};He(ze,{RetailcodeTopup:()=>he});var Be=Object.defineProperty,oe=Object.getOwnPropertySymbols,Ie=Object.prototype.hasOwnProperty,je=Object.prototype.propertyIsEnumerable,ae=(t,e,i)=>e in t?Be(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i,se=(t,e)=>{for(var i in e||(e={}))Ie.call(e,i)&&ae(t,i,e[i]);if(oe)for(var i of oe(e))je.call(e,i)&&ae(t,i,e[i]);return t},g=class extends Error{constructor(t,e){super(t),this.status=e,this.name="RetailcodeApiError"}},De="https://corporatedevapi.retailcode.com.ng",le=class{constructor(t,e){this.publicKey=t,this.baseUrl=e!=null?e:De}get authHeaders(){return{Authorization:`Bearer ${this.publicKey}`,Accept:"application/json"}}async fetchConfig(t){var e;let i=await fetch(`${this.baseUrl}/api/v1/auto-topup/public/config/${t}`,{headers:this.authHeaders});if(!i.ok)throw new g("Public API key is invalid or expired.",i.status);let r=await i.json();if(!r.success)throw new g((e=r.message)!=null?e:"Public API key is invalid or expired.");return r.data}async subscribeAirtime(t){var e;let r=await(await fetch(`${this.baseUrl}/api/v1/auto-topup/public/subscribe/airtime`,{method:"POST",headers:se({"Content-Type":"application/json"},this.authHeaders),body:JSON.stringify(t)})).json();if(!r.success)throw new g((e=r.message)!=null?e:"Subscription failed")}async subscribeData(t){var e;let r=await(await fetch(`${this.baseUrl}/api/v1/auto-topup/public/subscribe/data`,{method:"POST",headers:se({"Content-Type":"application/json"},this.authHeaders),body:JSON.stringify(t)})).json();if(!r.success)throw new g((e=r.message)!=null?e:"Subscription failed")}};function ce(t){let e=t.replace("#",""),i=e.length===3?e.split("").map(a=>a+a).join(""):e,r=parseInt(i,16);return{r:r>>16&255,g:r>>8&255,b:r&255}}function de(t,e){let{r:i,g:r,b:a}=ce(t),l=e>0?255:0,c=Math.abs(e)/100,p=m=>Math.min(255,Math.max(0,Math.round(m))).toString(16).padStart(2,"0");return"#"+p(i+(l-i)*c)+p(r+(l-r)*c)+p(a+(l-a)*c)}function T(t,e){let{r:i,g:r,b:a}=ce(t);return`rgba(${i},${r},${a},${e})`}function E(t){return t&&!["null","undefined",""].includes(String(t))?t:"#0057FF"}var Ne=/^(234[789][01]\d{8}|0[789][01]\d{8})$/;function pe(t){return Ne.test(t)}function ue(t){let e=t.replace(/\D/g,"");return e.length===11?e.replace(/(\d{4})(\d{3})(\d{4})/,"$1 $2 $3"):t}function me(t,e,i){let r=parseFloat(t);return!isNaN(r)&&r>=e&&r<=i}var C=null;function fe(){return window.Swal?Promise.resolve():C||(C=new Promise(t=>{let e=document.createElement("link");e.rel="stylesheet",e.href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css",document.head.appendChild(e);let i=document.createElement("script");i.src="https://cdn.jsdelivr.net/npm/sweetalert2@11",i.onload=()=>t(),document.head.appendChild(i)}),C)}function h(t){return window.Swal.fire(t)}function Y(t){let e=new URL(window.location.href);e.searchParams.set("status",t),window.history.replaceState({},"",e)}function M(t,e,i=!1){var c,p,m,d,b,v;let r=new URL(window.location.href);r.searchParams.set("isClose","true"),window.history.replaceState({},"",r),window.ReactNativeWebView||window.RetailcodeFlutter||(p=(c=window.webkit)==null?void 0:c.messageHandlers)!=null&&p.retailcode||(m=window.Android)!=null&&m.close||e==null||e(),t==null||t({closed:!0});let l=JSON.stringify({action:"close",success:i});window.ReactNativeWebView?window.ReactNativeWebView.postMessage(l):window.RetailcodeFlutter?window.RetailcodeFlutter.postMessage(l):(b=(d=window.webkit)==null?void 0:d.messageHandlers)!=null&&b.retailcode?window.webkit.messageHandlers.retailcode.postMessage({action:"close",success:i}):(v=window.Android)!=null&&v.close&&window.Android.close()}function ge(t,e){return{accent:t,accentHover:de(t,-10),accentFocus:T(t,.15),accentShadow:T(t,.25),fontFamily:e}}function J(t){return`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      display: flex;
      justify-content: center;
      min-height: 100vh;
      font-family: ${t.fontFamily};
      background: #FFFFFF;
    }
    @media (min-width: 560px) {
      :host { background: rgba(0,0,0,.50); align-items: center; padding: 20px; }
    }

    .rc-modal {
      width: 100%; max-width: 440px; background: #FFFFFF; overflow: hidden;
      animation: modalSlide .35s cubic-bezier(.22,1,.36,1) both;
      border-radius: 0; box-shadow: none;
    }
    @media (min-width: 560px) {
      .rc-modal {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.12), 0 32px 64px rgba(0,0,0,.08);
      }
    }
    @keyframes modalSlide { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }

    .rc-header { padding: 24px 20px 14px; }
    .rc-header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .rc-title h2 { font-size: 19px; font-weight: 700; color: #111827; letter-spacing: -.3px; }
    .rc-title p  { font-size: 13px; color: #6B7280; margin-top: 3px; line-height: 1.4; }

    .rc-close-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; background: #F3F4F6; border: none;
      border-radius: 6px; color: #6B7280; cursor: pointer; transition: background .15s; flex-shrink: 0;
    }
    .rc-close-btn:hover { background: #E5E7EB; }

    .rc-account-bar {
      display: flex; align-items: center; background: ${t.accent};
      padding: 10px 14px; border-radius: 6px; color: #fff;
    }
    .rc-dot { width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 0 2px rgba(74,222,128,.3); flex-shrink: 0; }
    .rc-acc-label { font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; opacity: .65; display: block; margin-bottom: 1px; }
    .rc-acc-no    { font-size: 14px; font-weight: 700; letter-spacing: .03em; }

    .rc-content { padding: 20px 20px 16px; }
    .rc-group { margin-bottom: 14px; }
    .rc-group-title { font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: .09em; margin-bottom: 10px; }

    .rc-field { position: relative; margin-bottom: 10px; }
    .rc-field:last-child { margin-bottom: 0; }
    .rc-field label { position: absolute; left: 12px; top: 16px; font-size: 13.5px; color: #9CA3AF; transition: all .16s cubic-bezier(.4,0,.2,1); pointer-events: none; transform-origin: left top; }
    .rc-field input, .rc-field select {
      width: 100%; height: 52px; padding: 20px 12px 6px;
      background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 6px;
      font-family: inherit; font-size: 14px; font-weight: 500; color: #111827;
      outline: none; transition: border-color .18s, box-shadow .18s, background .18s;
      appearance: none; -webkit-appearance: none;
    }
    .rc-field select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px; cursor: pointer;
    }
    .rc-field input:focus, .rc-field select:focus {
      border-color: ${t.accent}; background: #FFFFFF; box-shadow: 0 0 0 3px ${t.accentFocus};
    }
    .rc-field.has-val label, .rc-field input:focus ~ label, .rc-field select:focus ~ label {
      top: 7px; font-size: 10.5px; font-weight: 700; color: ${t.accent};
    }
    .rc-field small { display: block; margin-top: 4px; font-size: 11px; color: #9CA3AF; }

    .rc-row { display: grid; gap: 10px; margin-bottom: 10px; }
    .rc-row .rc-field { margin-bottom: 0; }
    .rc-divider { height: 1px; background: #F3F4F6; margin: 16px 0; border: none; }
    .section-animate { animation: fadeIn .25s ease-out; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:none; } }

    .rc-link-wrap { margin-top: 12px; text-align: center; font-size: 13px; color: #9CA3AF; }
    .rc-link-wrap a { color: ${t.accent}; text-decoration: none; font-weight: 600; cursor: pointer; }
    .rc-link-wrap a:hover { text-decoration: underline; }

    .rc-submit-btn {
      width: 100%; height: 52px; background: ${t.accent}; color: #FFFFFF; border: none;
      border-radius: 6px; font-family: inherit; font-size: 15px; font-weight: 700;
      cursor: pointer; letter-spacing: .01em; margin-top: 6px;
      box-shadow: 0 4px 12px ${t.accentShadow};
      transition: background .18s, transform .1s, box-shadow .18s;
    }
    .rc-submit-btn:hover:not(:disabled) { background: ${t.accentHover}; transform: translateY(-1px); box-shadow: 0 6px 18px ${T(t.accent,.35)}; }
    .rc-submit-btn:active:not(:disabled) { transform: translateY(0); }
    .rc-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .rc-spinner-ring {
      width: 48px; height: 48px;
      border: 4px solid ${T(t.accent,.18)};
      border-top-color: ${t.accent};
      border-radius: 50%;
      animation: rc-spin .75s linear infinite;
    }
    @keyframes rc-spin { to { transform: rotate(360deg); } }

    .rc-footer {
      text-align: center; padding: 0 20px 18px; font-size: 11px; color: #D1D5DB;
      display: flex; align-items: center; justify-content: center; gap: 5px;
    }
    .rc-footer svg { opacity: .5; }
    .hidden { display: none !important; }
  `}var $=class{constructor(e){this.opts=e,this.client=new le(e.publicKey,e.baseUrl)}async mount(){var X;let{msisdn:e,container:i,onClose:r,theme:a={}}=this.opts,l=document.querySelector(i);if(!l)return;let c=E(a.accent),p=(X=a.fontFamily)!=null?X:"'DM Sans', system-ui, sans-serif",m=ge(c,p),d=null,b=n=>{let o=`
        <div style="font-family:${p};padding:24px;border:1.5px solid #FCA5A5;background:#FEF2F2;border-radius:8px;color:#991B1B;text-align:center;max-width:440px;margin:40px auto;">
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">SDK failed to initialize</div>
          <div style="font-size:13px;opacity:0.8;">${n}</div>
        </div>`;d?d.innerHTML=o:l.innerHTML=o};if(!pe(e)){b("Subscriber phone number is not valid.");return}d=l.attachShadow({mode:"open"}),this.renderSpinner(d,m);let v;try{v=await this.client.fetchConfig(e)}catch(n){let o=n instanceof g?n.message:"Could not connect to the activation server.";b(o);return}d.innerHTML="",await fe();let{name:be="",subscribedAirtime:k=!1,subscribedData:S=!1,airtimethresholds:ve={},airtimeMin:P=0,airtimeMax:H=1e4,dataThresholds:xe={},dataPlans:we=[],terms:O=null}=v,R=k&&S,ye=(k||S)&&!R;if(!k&&!S&&O&&!(await h({title:"Terms & Conditions",html:`
          <div style="text-align:left;font-size:13px;line-height:1.65;color:#374151;max-height:340px;overflow-y:auto;padding-right:4px;font-family:${p};">
            ${typeof O=="string"?O.replace(/\n/g,"<br>"):""}
          </div>`,confirmButtonText:"I Agree & Continue",confirmButtonColor:c,showCancelButton:!0,cancelButtonText:"Decline",cancelButtonColor:"#9CA3AF",allowOutsideClick:!1,allowEscapeKey:!1,reverseButtons:!0})).isConfirmed){M(r);return}let Te=Object.entries(ve).map(([n,o])=>`<option value="${o}">Below \u20A6${n}</option>`).join(""),ke=Object.entries(xe).map(([n,o])=>`<option value="${o}">Below ${n}</option>`).join(""),Se=we.map(n=>`<option value="${n.productId}">${n.allowance} \u2014 \u20A6${n.price}</option>`).join(""),B=document.createElement("div");B.className="rc-modal",B.innerHTML=this.buildModalHtml({tokens:m,msisdn:e,prefilledName:be,airtimeMin:P,airtimeMax:H,airtimeOptions:Te,dataOptions:ke,dataPlanOptions:Se}),d.appendChild(B);let s=n=>d.getElementById(n),q=s("rc-type-select"),x=s("section-airtime"),F=s("section-data"),I=s("rc-main-title"),j=s("rc-desc"),w=s("rc-submit"),D=s("field-msisdn"),N=s("rc-dependent-link-wrap"),z=s("section-dependent-controls"),V=s("group-type-selector"),_=s("row-beneficiary"),Fe=s("row-spending"),Le=s("field-airtime-max"),Ae=s("field-data-max"),U=!1,W=()=>{let n=R||U,o=q.value;n?(I.innerText="Add Dependent",j.innerText="Configure subscription for someone else",D.classList.remove("hidden"),_.style.gridTemplateColumns="1fr 1fr",V.classList.remove("hidden"),N.classList.add("hidden"),z.classList.remove("hidden"),x.classList.toggle("hidden",o==="data"),F.classList.toggle("hidden",o==="airtime"),Le.classList.toggle("hidden",o==="data"),Ae.classList.toggle("hidden",o==="airtime"),Fe.style.gridTemplateColumns=o==="both"?"1fr 1fr":"1fr"):ye?(I.innerText="Complete Profile",j.innerText="Finish your Auto Topup subscription",D.classList.add("hidden"),_.style.gridTemplateColumns="1fr",V.classList.add("hidden"),N.classList.remove("hidden"),z.classList.add("hidden"),x.classList.toggle("hidden",k),F.classList.toggle("hidden",S)):(I.innerText="Auto Topup Subscription",j.innerText="Automate your airtime & data recharge",D.classList.add("hidden"),_.style.gridTemplateColumns="1fr",V.classList.remove("hidden"),N.classList.add("hidden"),z.classList.add("hidden"),x.classList.toggle("hidden",o==="data"),F.classList.toggle("hidden",o==="airtime"))};W();let G=()=>{d.innerHTML=""};q.addEventListener("change",W),s("rc-close").addEventListener("click",()=>M(r,G)),s("rc-switch-to-dep").addEventListener("click",n=>{n.preventDefault(),U=!0,s("rc-name").value="",W()}),s("rc-name").addEventListener("input",n=>{let o=n.target;o.value=o.value.replace(/[^a-zA-Z\s]/g,"")}),["rc-msisdn-input","airtimeTopupValue","rc-airtime-max","rc-data-max"].forEach(n=>{var o;(o=s(n))==null||o.addEventListener("input",L=>{let y=L.target;y.value=y.value.replace(/\D/g,"")})}),d.querySelectorAll(".rc-field input, .rc-field select").forEach(n=>{let o=()=>n.closest(".rc-field").classList.toggle("has-val",n.value!=="");n.addEventListener("input",o),n.addEventListener("change",o),o()}),w.addEventListener("click",async()=>{var Z,Q;let n=K=>{var ee,te;return(te=(ee=s(K))==null?void 0:ee.value.trim())!=null?te:""},o=R||U,L=o?n("rc-msisdn-input"):e;if(!x.classList.contains("hidden")&&!me(n("airtimeTopupValue"),P,H)){h({icon:"warning",title:"Invalid Amount",text:`Enter \u20A6${P} \u2013 \u20A6${H}.`,confirmButtonColor:c});return}if(o&&!L){h({icon:"warning",title:"Wait!",text:"Enter the dependent phone number.",confirmButtonColor:c});return}w.disabled=!0,w.innerText="Processing\u2026";let y={network:"MTN",msisdn:L,name:n("rc-name")};try{x.classList.contains("hidden")||await this.client.subscribeAirtime(u(f(u({},y),{airtimeThresholdId:n("airtimeThresholdId"),airtimeTopupValue:n("airtimeTopupValue")}),o&&{customerMsisdn:e,monthlyMaximum:n("rc-airtime-max")})),F.classList.contains("hidden")||await this.client.subscribeData(u(f(u({},y),{dataThresholdId:n("dataThresholdId"),dataTopupValue:n("dataTopupValue")}),o&&{customerMsisdn:e,monthlyMaximum:n("rc-data-max")})),Y("successful"),(Q=(Z=this.opts).onSuccess)==null||Q.call(Z,{success:!0}),await h({icon:"success",title:"Subscription Active!",text:"Your auto top-up is now enabled.",confirmButtonColor:c}),M(r,G,!0)}catch(K){Y("failed"),h({icon:"error",title:"Oops!",text:K.message,confirmButtonColor:c}),w.disabled=!1,w.innerText="Activate Subscription"}})}renderSpinner(e,i){var a,l;let r=document.createElement("div");r.innerHTML=`
      <style>
        :host { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#fff; }
        @media (min-width:560px) { :host { background:rgba(0,0,0,.50); } }
        ${(l=(a=J(i).match(/\.rc-spinner-ring[\s\S]*?@keyframes rc-spin[\s\S]*?}/))==null?void 0:a[0])!=null?l:""}
      </style>
      <div class="rc-spinner-ring"></div>`,e.appendChild(r)}buildModalHtml(e){return`
      <style>${J(e.tokens)}</style>

      <div class="rc-header">
        <div class="rc-header-top">
          <div class="rc-title">
            <h2 id="rc-main-title">Auto Topup Subscription</h2>
            <p id="rc-desc">Automate your airtime &amp; data recharge</p>
          </div>
          <button class="rc-close-btn" id="rc-close" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="rc-account-bar">
          <div class="rc-dot"></div>
          <div>
            <span class="rc-acc-label">Your Phone Number</span>
            <span class="rc-acc-no">${ue(e.msisdn)}</span>
          </div>
        </div>
      </div>

      <div class="rc-content">
        <div class="rc-group">
          <p class="rc-group-title">Registration Details</p>
          <div class="rc-row" id="row-beneficiary">
            <div class="rc-field" id="field-name">
              <input type="text" id="rc-name" placeholder=" " value="${e.prefilledName}" autocomplete="name">
              <label>Full Name</label>
            </div>
            <div class="rc-field hidden" id="field-msisdn">
              <input type="tel" id="rc-msisdn-input" placeholder=" " autocomplete="tel">
              <label>Phone Number</label>
            </div>
          </div>
        </div>

        <div class="rc-group" id="group-type-selector">
          <p class="rc-group-title">Subscription Type</p>
          <div class="rc-field has-val">
            <select id="rc-type-select">
              <option value="airtime">Airtime Only</option>
              <option value="data">Data Only</option>
              <option value="both">Both Airtime &amp; Data</option>
            </select>
            <label>Automation Mode</label>
          </div>
        </div>

        <hr class="rc-divider">

        <div id="section-airtime" class="section-animate">
          <p class="rc-group-title">Airtime Setup</p>
          <div class="rc-row" style="grid-template-columns:1fr 1fr">
            <div class="rc-field has-val">
              <select id="airtimeThresholdId">${e.airtimeOptions||'<option value="">Loading\u2026</option>'}</select>
              <label>Recharge when</label>
            </div>
            <div class="rc-field">
              <input type="tel" id="airtimeTopupValue" placeholder=" ">
              <label>Amount (\u20A6)</label>
              <small>\u20A6${e.airtimeMin} \u2013 \u20A6${e.airtimeMax}</small>
            </div>
          </div>
        </div>

        <div id="section-data" class="hidden section-animate">
          <p class="rc-group-title">Data Setup</p>
          <div class="rc-row" style="grid-template-columns:1fr 1fr">
            <div class="rc-field has-val">
              <select id="dataThresholdId">${e.dataOptions||'<option value="">Loading\u2026</option>'}</select>
              <label>Recharge when</label>
            </div>
            <div class="rc-field has-val">
              <select id="dataTopupValue">${e.dataPlanOptions||'<option value="">Loading\u2026</option>'}</select>
              <label>Select Plan</label>
            </div>
          </div>
        </div>

        <div id="section-dependent-controls" class="hidden">
          <hr class="rc-divider">
          <p class="rc-group-title">Spending Controls</p>
          <div class="rc-row" id="row-spending">
            <div class="rc-field" id="field-airtime-max">
              <input type="tel" id="rc-airtime-max" placeholder=" ">
              <label>Airtime Limit (\u20A6)</label>
            </div>
            <div class="rc-field" id="field-data-max">
              <input type="tel" id="rc-data-max" placeholder=" ">
              <label>Data Limit (\u20A6)</label>
            </div>
          </div>
        </div>

        <button class="rc-submit-btn" id="rc-submit">Activate Subscription</button>

        <div id="rc-dependent-link-wrap" class="rc-link-wrap hidden">
          Or <a id="rc-switch-to-dep">add a dependent instead</a>
        </div>
      </div>

      <div class="rc-footer">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Secured by <strong>&nbsp;Retailcode</strong>
      </div>
    `}};var he={create(t){var i;let e=new $(f(u({},t),{theme:f(u({},t.theme),{accent:E((i=t.theme)==null?void 0:i.accent)})}));return{mount:()=>e.mount()}}};return Re(ze);})();
"""#
