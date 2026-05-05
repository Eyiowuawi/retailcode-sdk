export interface Theme {
  accent?: string;
  fontFamily?: string;
}

export interface TopupCallbacks {
  onSuccess?: (result: { success: true }) => void;
  onClose?: (result: { closed: true }) => void;
}

export interface TopupConfig extends TopupCallbacks {
  publicKey: string;
  msisdn: string;
  baseUrl?: string; // defaults to https://corporatedevapi.retailcode.com.ng
  theme?: Theme;
}

// ── API shapes ──────────────────────────────────────────────────────────────

export interface TopupApiConfig {
  name: string;
  subscribedAirtime: boolean;
  subscribedData: boolean;
  airtimethresholds: Record<string, string>;
  airtimeMin: number;
  airtimeMax: number;
  dataThresholds: Record<string, string>;
  dataPlans: Array<{ productId: string; allowance: string; price: number }>;
  terms: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type SubscriptionMode = 'airtime' | 'data' | 'both';

export interface AirtimeSubscribePayload {
  network: string;
  msisdn: string;
  name: string;
  airtimeThresholdId: string;
  airtimeTopupValue: string;
  customerMsisdn?: string;
  monthlyMaximum?: string;
}

export interface DataSubscribePayload {
  network: string;
  msisdn: string;
  name: string;
  dataThresholdId: string;
  dataTopupValue: string;
  customerMsisdn?: string;
  monthlyMaximum?: string;
}
