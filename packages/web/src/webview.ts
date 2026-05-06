// Bridges for closing the widget across all host environments.

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage(msg: string): void };
    webkit?: { messageHandlers?: { retailcode?: { postMessage(msg: unknown): void } } };
    Android?: { close?(): void };
    RetailcodeFlutter?: { postMessage(msg: string): void }; // Flutter JavascriptChannel
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
  success = false,
): void {
  const url = new URL(window.location.href);
  url.searchParams.set('isClose', 'true');
  window.history.replaceState({}, '', url);

  const isNative = !!(
    window.ReactNativeWebView ||
    window.RetailcodeFlutter ||
    window.webkit?.messageHandlers?.retailcode ||
    window.Android?.close
  );

  // In native WebView contexts the host app dismisses the whole view, so
  // clearing the DOM first causes a black-screen flash. Only unmount for
  // plain browser usage where there is no native dismiss.
  if (!isNative) unmount?.();

  onClose?.({ closed: true });

  // Include success flag so native apps know whether to fire onSuccess
  // before dismissing — this way the dialog is always fully visible first.
  const msg = JSON.stringify({ action: 'close', success });

  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(msg);
  } else if (window.RetailcodeFlutter) {
    window.RetailcodeFlutter.postMessage(msg);
  } else if (window.webkit?.messageHandlers?.retailcode) {
    window.webkit.messageHandlers.retailcode.postMessage({ action: 'close', success });
  } else if (window.Android?.close) {
    window.Android.close();
  }
}
