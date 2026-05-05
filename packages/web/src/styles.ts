import { mix, rgba } from '@tolucode/core';

export interface StyleTokens {
  accent: string;
  accentHover: string;
  accentFocus: string;
  accentShadow: string;
  fontFamily: string;
}

export function buildTokens(accent: string, fontFamily: string): StyleTokens {
  return {
    accent,
    accentHover: mix(accent, -10),
    accentFocus: rgba(accent, 0.15),
    accentShadow: rgba(accent, 0.25),
    fontFamily,
  };
}

export function buildStyles(t: StyleTokens): string {
  return `
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
    .rc-submit-btn:hover:not(:disabled) { background: ${t.accentHover}; transform: translateY(-1px); box-shadow: 0 6px 18px ${rgba(t.accent, 0.35)}; }
    .rc-submit-btn:active:not(:disabled) { transform: translateY(0); }
    .rc-submit-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .rc-spinner-ring {
      width: 48px; height: 48px;
      border: 4px solid ${rgba(t.accent, 0.18)};
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
  `;
}
