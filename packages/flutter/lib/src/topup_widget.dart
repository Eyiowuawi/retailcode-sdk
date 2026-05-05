import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'html_template.dart';

/// Auto Topup subscription widget for Flutter.
///
/// Usage — modal overlay (recommended):
/// ```dart
/// showModalBottomSheet(
///   context: context,
///   isScrollControlled: true,
///   builder: (_) => TopupWidget(
///     publicKey: 'pk_live_xxxx',
///     msisdn: '08012345678',
///     baseUrl: 'https://corporatedevapi.retailcode.com.ng',
///     onClose: () => Navigator.pop(context),
///   ),
/// );
/// ```
///
/// Usage — dedicated screen:
/// ```dart
/// Navigator.push(context, MaterialPageRoute(
///   builder: (_) => TopupWidget(
///     publicKey: 'pk_live_xxxx',
///     msisdn: '08012345678',
///     baseUrl: 'https://corporatedevapi.retailcode.com.ng',
///     onClose: () => Navigator.pop(context),
///   ),
/// ));
/// ```
class TopupWidget extends StatefulWidget {
  const TopupWidget({
    super.key,
    required this.publicKey,
    required this.msisdn,
    this.baseUrl = 'https://corporatedevapi.retailcode.com.ng',
    this.accent = '#0057FF',
    this.onSuccess,
    this.onClose,
  });

  final String publicKey;
  final String msisdn;
  final String baseUrl;

  /// Primary accent colour (hex string, e.g. '#0057FF').
  final String accent;

  final VoidCallback? onSuccess;
  final VoidCallback? onClose;

  @override
  State<TopupWidget> createState() => _TopupWidgetState();
}

class _TopupWidgetState extends State<TopupWidget> {
  late final WebViewController _controller;
  bool _loading = true;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..addJavaScriptChannel(
        'RetailcodeFlutter',  // must match window.RetailcodeFlutter in the SDK
        onMessageReceived: _onMessage,
      )
      ..setNavigationDelegate(NavigationDelegate(
        onPageFinished: (_) => setState(() => _loading = false),
      ))
      ..loadHtmlString(
        buildWidgetHtml(
          publicKey: widget.publicKey,
          msisdn:    widget.msisdn,
          baseUrl:   widget.baseUrl,
          accent:    widget.accent,
        ),
        baseUrl: widget.baseUrl,
      );
  }

  void _onMessage(JavaScriptMessage message) {
    final data = json.decode(message.message) as Map<String, dynamic>;
    final action = data['action'] as String?;
    if (action == 'success') widget.onSuccess?.call();
    if (action == 'close')   widget.onClose?.call();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        WebViewWidget(controller: _controller),
        if (_loading)
          const Center(child: CircularProgressIndicator()),
      ],
    );
  }
}
