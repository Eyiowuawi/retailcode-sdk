import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'html_template.dart';

/// Auto Topup subscription widget for Flutter.
///
/// Usage — bottom sheet (recommended):
/// ```dart
/// showModalBottomSheet(
///   context: context,
///   isScrollControlled: true,
///   useSafeArea: true,
///   builder: (_) => TopupWidget(
///     publicKey: 'pk_live_xxxx',
///     msisdn: '08012345678',
///     onClose: () => Navigator.pop(context),
///   ),
/// );
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
      ..setBackgroundColor(Colors.white)
      // Allow the WebView content to scroll — required for keyboard handling
      ..enableZoom(false)
      ..addJavaScriptChannel(
        'RetailcodeFlutter',
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
      );
  }

  void _onMessage(JavaScriptMessage message) {
    final data = json.decode(message.message) as Map<String, dynamic>;
    final action = data['action'] as String?;

    if (action == 'close') {
      // success flag tells us the subscription completed before closing
      final isSuccess = data['success'] == true;
      if (isSuccess) widget.onSuccess?.call();
      widget.onClose?.call();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Wrap in AnimatedPadding so the WebView shrinks up when the keyboard
    // appears — this keeps the focused input visible above the keyboard.
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOut,
      padding: EdgeInsets.only(bottom: bottomInset),
      child: Stack(
        children: [
          WebViewWidget(
            controller: _controller,
            // Allow the page to scroll when the keyboard is open
          ),
          if (_loading)
            const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}
