const PHONE_REGEX = /^(234[789][01]\d{8}|0[789][01]\d{8})$/;

export function isValidMsisdn(msisdn: string): boolean {
  return PHONE_REGEX.test(msisdn);
}

export function formatPhone(msisdn: string): string {
  const d = msisdn.replace(/\D/g, '');
  if (d.length === 11) return d.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  return msisdn;
}

export function isValidAmount(value: string, min: number, max: number): boolean {
  const n = parseFloat(value);
  return !isNaN(n) && n >= min && n <= max;
}
