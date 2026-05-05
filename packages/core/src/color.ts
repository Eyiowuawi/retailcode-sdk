export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function mix(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const target = amount > 0 ? 255 : 0;
  const t = Math.abs(amount) / 100;
  const toHex = (v: number) =>
    Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, '0');
  return (
    '#' +
    toHex(r + (target - r) * t) +
    toHex(g + (target - g) * t) +
    toHex(b + (target - b) * t)
  );
}

export function rgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function resolveAccent(raw: string | undefined): string {
  if (raw && !['null', 'undefined', ''].includes(String(raw))) return raw;
  return '#0057FF';
}
