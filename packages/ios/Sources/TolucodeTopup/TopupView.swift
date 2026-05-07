import SwiftUI
import WebKit

/// Auto Topup subscription widget for SwiftUI.
///
/// Usage — sheet (recommended):
/// ```swift
/// .sheet(isPresented: $showTopup) {
///     TopupView(
///         publicKey: "pk_live_xxxx",
///         msisdn: "08012345678",
///         baseUrl: "https://corporatedevapi.retailcode.com.ng",
///         onClose: { showTopup = false }
///     )
/// }
/// ```
///
/// Usage — NavigationLink / full screen:
/// ```swift
/// NavigationLink("Top Up") {
///     TopupView(
///         publicKey: "pk_live_xxxx",
///         msisdn: "08012345678",
///         baseUrl: "https://corporatedevapi.retailcode.com.ng",
///         onClose: { dismiss() }
///     )
///     .ignoresSafeArea()
/// }
/// ```
public struct TopupView: UIViewRepresentable {
    public let publicKey: String
    public let msisdn: String
    public var baseUrl: String
    public var accent: String = "#0057FF"
    public var onSuccess: (() -> Void)? = nil
    public var onClose: (() -> Void)? = nil

    public init(
        publicKey: String,
        msisdn: String,
        baseUrl: String = "https://corporatedevapi.retailcode.com.ng",
        accent: String = "#0057FF",
        onSuccess: (() -> Void)? = nil,
        onClose: (() -> Void)? = nil
    ) {
        self.publicKey = publicKey
        self.msisdn    = msisdn
        self.baseUrl   = baseUrl
        self.accent    = accent
        self.onSuccess = onSuccess
        self.onClose   = onClose
    }

    public func makeCoordinator() -> Coordinator {
        Coordinator(onSuccess: onSuccess, onClose: onClose)
    }

    public func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()

        // Register the 'retailcode' message handler — matches webkit.messageHandlers.retailcode
        config.userContentController.add(context.coordinator, name: "retailcode")

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.isScrollEnabled = true

        let html = buildWidgetHTML(
            publicKey: publicKey,
            msisdn:    msisdn,
            baseUrl:   baseUrl,
            accent:    accent
        )
        webView.loadHTMLString(html, baseURL: nil)
        return webView
    }

    public func updateUIView(_ webView: WKWebView, context: Context) {}

    // MARK: - Message handler

    public class Coordinator: NSObject, WKScriptMessageHandler {
        var onSuccess: (() -> Void)?
        var onClose: (() -> Void)?

        init(onSuccess: (() -> Void)?, onClose: (() -> Void)?) {
            self.onSuccess = onSuccess
            self.onClose   = onClose
        }

        public func userContentController(
            _ controller: WKUserContentController,
            didReceive message: WKScriptMessage
        ) {
            guard
                let body = message.body as? [String: Any],
                let action = body["action"] as? String
            else { return }

            DispatchQueue.main.async {
                if action == "close" {
                    // Mutually exclusive: only one callback fires so callers can
                    // safely call dismiss() in either without a double-dismiss crash.
                    let isSuccess = body["success"] as? Bool == true
                    if isSuccess {
                        self.onSuccess?()
                    } else {
                        self.onClose?()
                    }
                }
            }
        }
    }
}
