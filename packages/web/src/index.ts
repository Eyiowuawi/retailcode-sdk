import { resolveAccent } from '@tolucode/core';
import { TopupWidget } from './widget.js';
import type { TopupCallbacks } from '@tolucode/core';

export type { TopupCallbacks };
export { TopupWidget };

export interface CreateConfig extends TopupCallbacks {
  publicKey: string;
  msisdn: string;
  container: string;
  /** Defaults to https://corporatedevapi.retailcode.com.ng — only set this for testing */
  baseUrl?: string;
  theme?: { accent?: string; fontFamily?: string };
}

export const RetailcodeTopup = {
  create(config: CreateConfig) {
    const widget = new TopupWidget({
      ...config,
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
