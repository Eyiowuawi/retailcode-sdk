import {
  RetailcodeApiClient,
  RetailcodeApiError,
  TopupApiConfig,
  TopupCallbacks,
  resolveAccent,
  formatPhone,
  isValidMsisdn,
  isValidAmount,
} from '@tolucode/core';
import { loadSwal, swal } from './dialog.js';
import { closeWebview, updateUrlStatus } from './webview.js';
import { buildTokens, buildStyles } from './styles.js';

interface WidgetOptions extends TopupCallbacks {
  publicKey: string;
  msisdn: string;
  container: string;
  baseUrl?: string;
  theme?: { accent?: string; fontFamily?: string };
}

export class TopupWidget {
  private readonly client: RetailcodeApiClient;
  private readonly opts: WidgetOptions;

  constructor(opts: WidgetOptions) {
    this.opts = opts;
    this.client = new RetailcodeApiClient(opts.publicKey, opts.baseUrl);
  }

  async mount(): Promise<void> {
    const { msisdn, container, onClose, theme = {} } = this.opts;

    const target = document.querySelector(container);
    if (!target) return;

    const accent = resolveAccent(theme.accent);
    const fontFamily = theme.fontFamily ?? "'DM Sans', system-ui, sans-serif";
    const tokens = buildTokens(accent, fontFamily);

    let shadow: ShadowRoot | null = null;

    const showInitError = (message: string) => {
      const html = `
        <div style="font-family:${fontFamily};padding:24px;border:1.5px solid #FCA5A5;background:#FEF2F2;border-radius:8px;color:#991B1B;text-align:center;max-width:440px;margin:40px auto;">
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">SDK failed to initialize</div>
          <div style="font-size:13px;opacity:0.8;">${message}</div>
        </div>`;
      if (shadow) shadow.innerHTML = html;
      else (target as HTMLElement).innerHTML = html;
    };

    if (!isValidMsisdn(msisdn)) {
      showInitError('Subscriber phone number is not valid.');
      return;
    }

    shadow = target.attachShadow({ mode: 'open' });
    this.renderSpinner(shadow, tokens);

    let cfg: TopupApiConfig;
    try {
      cfg = await this.client.fetchConfig(msisdn);
    } catch (e) {
      const msg =
        e instanceof RetailcodeApiError ? e.message : 'Could not connect to the activation server.';
      showInitError(msg);
      return;
    }

    shadow.innerHTML = '';
    await loadSwal();

    const {
      name: prefilledName = '',
      subscribedAirtime = false,
      subscribedData = false,
      airtimethresholds = {},
      airtimeMin = 0,
      airtimeMax = 10000,
      dataThresholds = {},
      dataPlans = [],
      terms = null,
    } = cfg;

    const isFullSubscriber = subscribedAirtime && subscribedData;
    const isPartialSubscriber = (subscribedAirtime || subscribedData) && !isFullSubscriber;
    const isBrandNew = !subscribedAirtime && !subscribedData;

    // Terms gate for brand-new users
    if (isBrandNew && terms) {
      const result = await swal({
        title: 'Terms & Conditions',
        html: `
          <div style="text-align:left;font-size:13px;line-height:1.65;color:#374151;max-height:340px;overflow-y:auto;padding-right:4px;font-family:${fontFamily};">
            ${typeof terms === 'string' ? terms.replace(/\n/g, '<br>') : ''}
          </div>`,
        confirmButtonText: 'I Agree & Continue',
        confirmButtonColor: accent,
        showCancelButton: true,
        cancelButtonText: 'Decline',
        cancelButtonColor: '#9CA3AF',
        allowOutsideClick: false,
        allowEscapeKey: false,
        reverseButtons: true,
      });
      if (!result.isConfirmed) {
        closeWebview(onClose);
        return;
      }
    }

    // Build option HTML strings
    const airtimeOptions = Object.entries(airtimethresholds)
      .map(([k, id]) => `<option value="${id}">Below ₦${k}</option>`)
      .join('');
    const dataOptions = Object.entries(dataThresholds)
      .map(([k, id]) => `<option value="${id}">Below ${k}</option>`)
      .join('');
    const dataPlanOptions = dataPlans
      .map(p => `<option value="${p.productId}">${p.allowance} — ₦${p.price}</option>`)
      .join('');

    const modal = document.createElement('div');
    modal.className = 'rc-modal';
    modal.innerHTML = this.buildModalHtml({
      tokens,
      msisdn,
      prefilledName,
      airtimeMin,
      airtimeMax,
      airtimeOptions,
      dataOptions,
      dataPlanOptions,
    });

    shadow.appendChild(modal);

    // ── Refs ────────────────────────────────────────────────────────────────
    const $ = <T extends Element = HTMLElement>(id: string) =>
      shadow!.getElementById(id) as T | null;

    const typeSelect      = $<HTMLSelectElement>('rc-type-select')!;
    const airtimeSec      = $('section-airtime')!;
    const dataSec         = $('section-data')!;
    const titleText       = $('rc-main-title')!;
    const descText        = $('rc-desc')!;
    const submitBtn       = $<HTMLButtonElement>('rc-submit')!;
    const msisdnField     = $('field-msisdn')!;
    const depLinkWrap     = $('rc-dependent-link-wrap')!;
    const depControls     = $('section-dependent-controls')!;
    const typeSelectorGrp = $('group-type-selector')!;
    const beneficiaryRow  = $('row-beneficiary')!;
    const spendingRow     = $('row-spending')!;
    const airtimeMaxField = $('field-airtime-max')!;
    const dataMaxField    = $('field-data-max')!;

    let forceDependentView = false;

    const refreshUI = () => {
      const isDep = isFullSubscriber || forceDependentView;
      const mode = typeSelect.value;

      if (isDep) {
        titleText.innerText = 'Add Dependent';
        descText.innerText  = 'Configure subscription for someone else';
        msisdnField.classList.remove('hidden');
        beneficiaryRow.style.gridTemplateColumns = '1fr 1fr';
        typeSelectorGrp.classList.remove('hidden');
        depLinkWrap.classList.add('hidden');
        depControls.classList.remove('hidden');
        airtimeSec.classList.toggle('hidden', mode === 'data');
        dataSec.classList.toggle('hidden',    mode === 'airtime');
        airtimeMaxField.classList.toggle('hidden', mode === 'data');
        dataMaxField.classList.toggle('hidden',    mode === 'airtime');
        spendingRow.style.gridTemplateColumns = mode === 'both' ? '1fr 1fr' : '1fr';
      } else if (isPartialSubscriber) {
        titleText.innerText = 'Complete Profile';
        descText.innerText  = 'Finish your Auto Topup subscription';
        msisdnField.classList.add('hidden');
        beneficiaryRow.style.gridTemplateColumns = '1fr';
        typeSelectorGrp.classList.add('hidden');
        depLinkWrap.classList.remove('hidden');
        depControls.classList.add('hidden');
        airtimeSec.classList.toggle('hidden', subscribedAirtime);
        dataSec.classList.toggle('hidden',    subscribedData);
      } else {
        titleText.innerText = 'Auto Topup Subscription';
        descText.innerText  = 'Automate your airtime & data recharge';
        msisdnField.classList.add('hidden');
        beneficiaryRow.style.gridTemplateColumns = '1fr';
        typeSelectorGrp.classList.remove('hidden');
        depLinkWrap.classList.add('hidden');
        depControls.classList.add('hidden');
        airtimeSec.classList.toggle('hidden', mode === 'data');
        dataSec.classList.toggle('hidden',    mode === 'airtime');
      }
    };

    refreshUI();

    // ── Event wiring ────────────────────────────────────────────────────────
    const unmount = () => { shadow!.innerHTML = ''; };

    typeSelect.addEventListener('change', refreshUI);
    $('rc-close')!.addEventListener('click', () => closeWebview(onClose, unmount));

    $('rc-switch-to-dep')!.addEventListener('click', (e) => {
      e.preventDefault();
      forceDependentView = true;
      ($<HTMLInputElement>('rc-name'))!.value = '';
      refreshUI();
    });

    $<HTMLInputElement>('rc-name')!.addEventListener('input', e => {
      const el = e.target as HTMLInputElement;
      el.value = el.value.replace(/[^a-zA-Z\s]/g, '');
    });

    ['rc-msisdn-input', 'airtimeTopupValue', 'rc-airtime-max', 'rc-data-max'].forEach(id => {
      $<HTMLInputElement>(id)?.addEventListener('input', e => {
        const el = e.target as HTMLInputElement;
        el.value = el.value.replace(/\D/g, '');
      });
    });

    shadow.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.rc-field input, .rc-field select')
      .forEach(el => {
        const sync = () => el.closest('.rc-field')!.classList.toggle('has-val', el.value !== '');
        el.addEventListener('input', sync);
        el.addEventListener('change', sync);
        sync();
      });

    // ── Submit ──────────────────────────────────────────────────────────────
    submitBtn.addEventListener('click', async () => {
      const getVal = (id: string) =>
        ($<HTMLInputElement>(id))?.value.trim() ?? '';

      const isDep       = isFullSubscriber || forceDependentView;
      const beneficiary = isDep ? getVal('rc-msisdn-input') : msisdn;

      if (!airtimeSec.classList.contains('hidden')) {
        if (!isValidAmount(getVal('airtimeTopupValue'), airtimeMin, airtimeMax)) {
          swal({ icon: 'warning', title: 'Invalid Amount', text: `Enter ₦${airtimeMin} – ₦${airtimeMax}.`, confirmButtonColor: accent });
          return;
        }
      }
      if (isDep && !beneficiary) {
        swal({ icon: 'warning', title: 'Wait!', text: 'Enter the dependent phone number.', confirmButtonColor: accent });
        return;
      }

      submitBtn.disabled   = true;
      submitBtn.innerText  = 'Processing…';

      const common = { network: 'MTN', msisdn: beneficiary, name: getVal('rc-name') };

      try {
        if (!airtimeSec.classList.contains('hidden')) {
          await this.client.subscribeAirtime({
            ...common,
            airtimeThresholdId: getVal('airtimeThresholdId'),
            airtimeTopupValue:  getVal('airtimeTopupValue'),
            ...(isDep && { customerMsisdn: msisdn, monthlyMaximum: getVal('rc-airtime-max') }),
          });
        }
        if (!dataSec.classList.contains('hidden')) {
          await this.client.subscribeData({
            ...common,
            dataThresholdId: getVal('dataThresholdId'),
            dataTopupValue:  getVal('dataTopupValue'),
            ...(isDep && { customerMsisdn: msisdn, monthlyMaximum: getVal('rc-data-max') }),
          });
        }

        updateUrlStatus('successful');
        this.opts.onSuccess?.({ success: true });
        // Use didClose so we notify the native host AFTER SweetAlert2 finishes
        // its close animation — prevents the black-screen flash that occurs when
        // Flutter/iOS dismisses the sheet while the backdrop is still fading out.
        swal({
          icon: 'success',
          title: 'Subscription Active!',
          text: 'Your auto top-up is now enabled.',
          confirmButtonColor: accent,
          didClose: () => closeWebview(onClose, unmount, true),
        });
      } catch (err) {
        updateUrlStatus('failed');
        swal({ icon: 'error', title: 'Oops!', text: (err as Error).message, confirmButtonColor: accent });
        submitBtn.disabled  = false;
        submitBtn.innerText = 'Activate Subscription';
      }
    });
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private renderSpinner(shadow: ShadowRoot, tokens: ReturnType<typeof buildTokens>): void {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>
        :host { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#fff; }
        @media (min-width:560px) { :host { background:rgba(0,0,0,.50); } }
        ${buildStyles(tokens).match(/\.rc-spinner-ring[\s\S]*?@keyframes rc-spin[\s\S]*?}/)?.[0] ?? ''}
      </style>
      <div class="rc-spinner-ring"></div>`;
    shadow.appendChild(el);
  }

  private buildModalHtml(p: {
    tokens: ReturnType<typeof buildTokens>;
    msisdn: string;
    prefilledName: string;
    airtimeMin: number;
    airtimeMax: number;
    airtimeOptions: string;
    dataOptions: string;
    dataPlanOptions: string;
  }): string {
    return `
      <style>${buildStyles(p.tokens)}</style>

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
            <span class="rc-acc-no">${formatPhone(p.msisdn)}</span>
          </div>
        </div>
      </div>

      <div class="rc-content">
        <div class="rc-group">
          <p class="rc-group-title">Registration Details</p>
          <div class="rc-row" id="row-beneficiary">
            <div class="rc-field" id="field-name">
              <input type="text" id="rc-name" placeholder=" " value="${p.prefilledName}" autocomplete="name">
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
              <select id="airtimeThresholdId">${p.airtimeOptions || '<option value="">Loading…</option>'}</select>
              <label>Recharge when</label>
            </div>
            <div class="rc-field">
              <input type="tel" id="airtimeTopupValue" placeholder=" ">
              <label>Amount (₦)</label>
              <small>₦${p.airtimeMin} – ₦${p.airtimeMax}</small>
            </div>
          </div>
        </div>

        <div id="section-data" class="hidden section-animate">
          <p class="rc-group-title">Data Setup</p>
          <div class="rc-row" style="grid-template-columns:1fr 1fr">
            <div class="rc-field has-val">
              <select id="dataThresholdId">${p.dataOptions || '<option value="">Loading…</option>'}</select>
              <label>Recharge when</label>
            </div>
            <div class="rc-field has-val">
              <select id="dataTopupValue">${p.dataPlanOptions || '<option value="">Loading…</option>'}</select>
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
              <label>Airtime Limit (₦)</label>
            </div>
            <div class="rc-field" id="field-data-max">
              <input type="tel" id="rc-data-max" placeholder=" ">
              <label>Data Limit (₦)</label>
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
    `;
  }
}
