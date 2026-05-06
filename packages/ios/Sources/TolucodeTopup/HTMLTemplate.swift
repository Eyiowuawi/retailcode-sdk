import Foundation

/// Generates a self-contained HTML page with the SDK bundle inlined —
/// no CDN request, so the widget opens instantly.
func buildWidgetHTML(
    publicKey: String,
    msisdn: String,
    baseUrl: String,
    accent: String
) -> String {
    // Escape single quotes so values are safe inside JS string literals
    func js(_ s: String) -> String { "'\(s.replacingOccurrences(of: "'", with: "\\'"))'" }

    return """
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          background: transparent;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        #widget {
          min-height: 100vh;
          min-height: 100dvh;
        }
      </style>
    </head>
    <body>
      <div id="widget"></div>
      <script>\(kRetailcodeSdkBundle)</script>
      <script>
        RetailcodeSDK.RetailcodeTopup.create({
          publicKey: \(js(publicKey)),
          msisdn:    \(js(msisdn)),
          baseUrl:   \(js(baseUrl)),
          container: '#widget',
          theme:     { accent: \(js(accent)) },
          onSuccess: function() { /* success flag is carried inside the close message */ },
          onClose:   function() { /* handled via webkit.messageHandlers in closeWebview */ },
        }).mount();
      </script>
    </body>
    </html>
    """
}
