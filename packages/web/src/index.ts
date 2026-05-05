import { resolveAccent } from '@retailcode/core';
import { TopupWidget } from './widget.js';
import type { TopupCallbacks } from '@retailcode/core';

export type { TopupCallbacks };
export { TopupWidget };

// ── Detect script origin for the default baseUrl ──────────────────────────
function detectBaseUrl(): string {
  if (typeof document !== 'undefined' && document.currentScript) {
    return new URL((document.currentScript as HTMLScriptElement).src).origin;
  }
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

// ── Public fluent API — mirrors the original RetailcodeTopup.create() ─────
export interface CreateConfig extends TopupCallbacks {
  publicKey: string;
  msisdn: string;
  container: string;
  baseUrl?: string;
  theme?: { accent?: string; fontFamily?: string };
}

export const RetailcodeTopup = {
  create(config: CreateConfig) {
    const baseUrl = config.baseUrl ?? detectBaseUrl();
    const widget = new TopupWidget({
      ...config,
      baseUrl,
      theme: {
        ...config.theme,
        accent: resolveAccent(config.theme?.accent),
      },
    });
    return {
      mount: () => widget.mount(),
    };
  },
};
