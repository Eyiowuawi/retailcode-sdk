// Lazy-loads SweetAlert2 from CDN on first call.
// The Swal reference is typed loosely so we don't need @types/sweetalert2.

declare global {
  interface Window {
    Swal: SwalStatic;
  }
}

interface SwalStatic {
  fire(opts: Record<string, unknown>): Promise<{ isConfirmed: boolean }>;
}

let loadPromise: Promise<void> | null = null;

export function loadSwal(): Promise<void> {
  if (window.Swal) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function swal(opts: Record<string, unknown>): Promise<{ isConfirmed: boolean }> {
  return window.Swal.fire(opts);
}
