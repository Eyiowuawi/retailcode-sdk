import type {
  ApiResponse,
  AirtimeSubscribePayload,
  DataSubscribePayload,
  TopupApiConfig,
} from './types.js';

export class RetailcodeApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'RetailcodeApiError';
  }
}

export const DEFAULT_BASE_URL = 'https://corporatedevapi.retailcode.com.ng';

export class RetailcodeApiClient {
  private readonly baseUrl: string;

  constructor(
    private readonly publicKey: string,
    baseUrl?: string,
  ) {
    this.baseUrl = baseUrl ?? DEFAULT_BASE_URL;
  }

  private get authHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.publicKey}`,
      Accept: 'application/json',
    };
  }

  async fetchConfig(msisdn: string): Promise<TopupApiConfig> {
    const resp = await fetch(
      `${this.baseUrl}/api/v1/auto-topup/public/config/${msisdn}`,
      { headers: this.authHeaders },
    );

    if (!resp.ok) {
      throw new RetailcodeApiError('Public API key is invalid or expired.', resp.status);
    }

    const result: ApiResponse<TopupApiConfig> = await resp.json();
    if (!result.success) {
      throw new RetailcodeApiError(result.message ?? 'Public API key is invalid or expired.');
    }

    return result.data;
  }

  async subscribeAirtime(payload: AirtimeSubscribePayload): Promise<void> {
    const r = await fetch(`${this.baseUrl}/api/v1/auto-topup/public/subscribe/airtime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeaders },
      body: JSON.stringify(payload),
    });
    const res: ApiResponse<unknown> = await r.json();
    if (!res.success) throw new RetailcodeApiError(res.message ?? 'Subscription failed');
  }

  async subscribeData(payload: DataSubscribePayload): Promise<void> {
    const r = await fetch(`${this.baseUrl}/api/v1/auto-topup/public/subscribe/data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.authHeaders },
      body: JSON.stringify(payload),
    });
    const res: ApiResponse<unknown> = await r.json();
    if (!res.success) throw new RetailcodeApiError(res.message ?? 'Subscription failed');
  }
}
