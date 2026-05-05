// Bridges for closing the widget across all host environments.

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage(msg: string): void };
    webkit?: { messageHandlers?: { retailcode?: { postMessage(msg: unknown): void } } };
    Android?: { close?(): void };
  }
}

export function updateUrlStatus(status: 'successful' | 'failed'): void {
  const url = new URL(window.location.href);
  url.searchParams.set('status', status);
  window.history.replaceState({}, '', url);
}

export function closeWebview(
  onClose?: (r: { closed: true }) => void,
  unmount?: () => void,
): void {
  const url = new URL(window.location.href);
  url.searchParams.set('isClose', 'true');
  window.history.replaceState({}, '', url);

  // Always remove the widget from the DOM first
  unmount?.();

  onClose?.({ closed: true });

  if (window.ReactNativeWebView) {
    // Widget is running inside a React Native WebView — tell the host to close
    window.ReactNativeWebView.postMessage(JSON.stringify({ action: 'close' }));
  } else if (window.webkit?.messageHandlers?.retailcode) {
    // Widget is running inside a WKWebView on iOS
    window.webkit.messageHandlers.retailcode.postMessage({ action: 'close' });
  } else if (window.Android?.close) {
    // Widget is running inside an Android WebView
    window.Android.close();
  }
  // Pure-browser embedded use: unmount() already removed the widget;
  // navigation is the consumer's responsibility via onClose.
}
