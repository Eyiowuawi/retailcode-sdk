/// Generates a self-contained HTML page that loads the widget from CDN
/// and wires up the Flutter JavascriptChannel bridge.
String buildWidgetHtml({
  required String publicKey,
  required String msisdn,
  required String baseUrl,
  required String accent,
  String version = '0.2.1',
}) {
  return '''
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; }

    /* Scrollable body so the keyboard doesn't cover inputs */
    body {
      background: transparent;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* Widget fills the screen but can grow taller than the viewport,
       which lets the browser scroll to show inputs above the keyboard */
    #widget {
      min-height: 100vh;
      min-height: 100dvh; /* dynamic viewport — shrinks when keyboard opens */
    }
  </style>
</head>
<body>
  <div id="widget"></div>

  <script src="https://cdn.jsdelivr.net/npm/\@tolucode/web@$version/dist/retailcode.iife.global.js"></script>
  <script>
    RetailcodeSDK.RetailcodeTopup.create({
      publicKey: ${_jsStr(publicKey)},
      msisdn:    ${_jsStr(msisdn)},
      baseUrl:   ${_jsStr(baseUrl)},
      container: '#widget',
      theme:     { accent: ${_jsStr(accent)} },
      onSuccess: function() { /* handled by onClose with success:true flag */ },
      onClose:   function() { /* handled by onClose with success:true flag */ },
    }).mount();
  </script>
</body>
</html>
''';
}

/// Wraps a value in a JS string literal, escaping single quotes.
String _jsStr(String value) => "'${value.replaceAll("'", r"\'")}'";
