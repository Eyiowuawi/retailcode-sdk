# Retailcode SDK

Auto Topup subscription widget for web, React Native, Flutter, and iOS.

| Package | Platform | Install |
|---|---|---|
| `@tolucode/core` | Shared | npm |
| `@tolucode/web` | Browser / any WebView | npm + CDN |
| `@tolucode/react-native` | React Native | npm |
| `tolucode_topup` | Flutter | git |
| `TolucodeTopup` | iOS (Swift) | Swift Package Manager |

---

## Deploying (publishing to npm)

### 1. Create an npm organisation

Go to [npmjs.com](https://www.npmjs.com) and log in. You already have the **`tolucode`** organisation — packages will publish under the `@tolucode/` scope automatically.

### 2. Log in from your terminal

```bash
npm login
```

### 3. Build all packages

```bash
# from the repo root
pnpm install
pnpm build
```

### 4. Publish

Publish `core` first because the other two depend on it.

```bash
pnpm --filter @tolucode/core publish --no-git-checks
pnpm --filter @tolucode/web publish --no-git-checks
pnpm --filter @tolucode/react-native publish --no-git-checks
```

### Releasing a new version

```bash
# bump all packages (choose patch / minor / major)
pnpm -r exec npm version patch

pnpm build
pnpm -r publish --no-git-checks
```

---

## Integration A — Plain HTML / CDN

No install needed. Once published, jsDelivr serves the IIFE automatically.

```html
<!-- pin to a version in production -->
<script src="https://cdn.jsdelivr.net/npm/@tolucode/web@0.1.0/dist/retailcode.iife.global.js"></script>

<div id="topup-widget"></div>

<script>
  RetailcodeSDK.RetailcodeTopup.create({
    publicKey:  'pk_live_xxxx',
    msisdn:     '08012345678',
    container:  '#topup-widget',
    theme:      { accent: '#0057FF' },
    onSuccess:  function(r) { console.log('subscribed', r); },
    onClose:    function(r) { window.location.href = '/'; },
  }).mount();
</script>
```

**How close works:** clicking ✕ or finishing the flow removes the widget from the DOM and fires `onClose`. Navigate wherever you like inside that callback.

---

## Integration B — React / Next.js / Vite

```bash
npm install @tolucode/web
```

```ts
import { RetailcodeTopup } from '@tolucode/web';

RetailcodeTopup.create({
  publicKey: 'pk_live_xxxx',
  msisdn:    user.phone,
  container: '#topup-widget',
  theme:     { accent: '#0057FF' },
  onSuccess: () => router.push('/success'),
  onClose:   () => router.push('/dashboard'),
}).mount();
```

**Next.js** — use `useState` + `useEffect` so the container div is in the DOM before `.mount()` runs, and the widget overlays the current page:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RetailcodeTopup } from '@tolucode/web';

export default function SomePage() {
  const router = useRouter();
  const [widgetOpen, setWidgetOpen] = useState(false);

  useEffect(() => {
    if (!widgetOpen) return;
    RetailcodeTopup.create({
      publicKey: 'pk_live_xxxx',
      msisdn:    '08012345678',
      container: '#topup-widget',
      onClose:   () => setWidgetOpen(false),
      onSuccess: () => setWidgetOpen(false),
    }).mount();
  }, [widgetOpen]);            // runs after the div is rendered

  return (
    <>
      <button onClick={() => setWidgetOpen(true)}>Open Topup</button>

      {/* Rendered into DOM first, then widget mounts into it */}
      {widgetOpen && (
        <div id="topup-widget" style={{ position: 'fixed', inset: 0, zIndex: 9999 }} />
      )}
    </>
  );
}
```

---

## Integration C — React Native

```bash
npm install @tolucode/react-native @tolucode/core
```

### Option 1 — Modal overlay (no navigation library needed)

The widget slides up over the current screen. Closing it returns the user to where they were.

```tsx
import { useState } from 'react';
import { Button, View } from 'react-native';
import { TopupWidget } from '@tolucode/react-native';

export default function HomeScreen() {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Top Up" onPress={() => setOpen(true)} />

      {open && (
        <TopupWidget
          modal
          publicKey="pk_live_xxxx"
          msisdn="08012345678"
          baseUrl="https://api.yourserver.com"
          theme={{ accent: '#0057FF' }}
          onSuccess={() => setOpen(false)}
          onClose={()  => setOpen(false)}
        />
      )}
    </View>
  );
}
```

### Option 2 — Dedicated screen (React Navigation)

```tsx
// In your Stack navigator
<Stack.Screen
  name="Topup"
  component={TopupScreen}
  options={{ headerShown: false }}
/>
```

```tsx
// TopupScreen.tsx
import { TopupWidget } from '@tolucode/react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export function TopupScreen({ navigation }: NativeStackScreenProps<any>) {
  return (
    <TopupWidget
      publicKey="pk_live_xxxx"
      msisdn="08012345678"
      baseUrl="https://api.yourserver.com"
      theme={{ accent: '#0057FF' }}
      onSuccess={() => navigation.goBack()}
      onClose={()  => navigation.goBack()}
    />
  );
}
```

Navigate to it from anywhere:

```ts
navigation.navigate('Topup');
```

The Android hardware back button is handled automatically — it fires `onClose`.

---

## Integration D — React Native WebView

Use this when your app opens a web page (hosted URL) that loads the web SDK inside a WebView.

```bash
npm install react-native-webview
```

```tsx
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export function TopupWebViewScreen({ navigation }: NativeStackScreenProps<any>) {
  return (
    <WebView
      source={{ uri: 'https://yoursite.com/topup?msisdn=08012345678&key=pk_live_xxxx' }}
      onMessage={(event) => {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.action === 'close') {
          navigation.goBack(); // widget's ✕ button triggers this
        }
      }}
    />
  );
}
```

The web SDK detects `window.ReactNativeWebView` automatically and posts `{ action: 'close' }` when the user closes the widget — no extra configuration needed.

---

## Integration E — Flutter

**Install** — add to your app's `pubspec.yaml`:

```yaml
dependencies:
  tolucode_topup:
    git:
      url: https://github.com/Eyiowuawi/retailcode-sdk.git
      path: packages/flutter
```

Then run:

```bash
flutter pub get
```

**Option 1 — Bottom sheet (recommended):**

```dart
import 'package:tolucode_topup/tolucode_topup.dart';

ElevatedButton(
  onPressed: () => showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    builder: (_) => TopupWidget(
      publicKey: 'pk_live_xxxx',
      msisdn:    '08012345678',
      baseUrl:   'https://corporatedevapi.retailcode.com.ng',
      accent:    '#0057FF',
      onSuccess: () => Navigator.pop(context),
      onClose:   () => Navigator.pop(context),
    ),
  ),
  child: const Text('Top Up'),
)
```

**Option 2 — Full screen / Navigator push:**

```dart
Navigator.push(context, MaterialPageRoute(
  builder: (_) => Scaffold(
    body: TopupWidget(
      publicKey: 'pk_live_xxxx',
      msisdn:    '08012345678',
      baseUrl:   'https://corporatedevapi.retailcode.com.ng',
      onSuccess: () => Navigator.pop(context),
      onClose:   () => Navigator.pop(context),
    ),
  ),
));
```

The widget loads the web SDK inside a `WebView` and listens for close/success events via a `JavascriptChannel` — no extra setup needed.

---

## Integration F — iOS (SwiftUI)

**Install via Swift Package Manager:**

In Xcode → **File → Add Package Dependencies** → paste this URL:

```
https://github.com/Eyiowuawi/retailcode-sdk
```

Select the **TolucodeTopup** product and add it to your target.

**Option 1 — Sheet:**

```swift
import TolucodeTopup

struct ContentView: View {
    @State private var showTopup = false

    var body: some View {
        Button("Top Up") { showTopup = true }
            .sheet(isPresented: $showTopup) {
                TopupView(
                    publicKey: "pk_live_xxxx",
                    msisdn:    "08012345678",
                    baseUrl:   "https://corporatedevapi.retailcode.com.ng",
                    accent:    "#0057FF",
                    onSuccess: { showTopup = false },
                    onClose:   { showTopup = false }
                )
            }
    }
}
```

**Option 2 — NavigationLink / full screen:**

```swift
NavigationLink("Top Up") {
    TopupView(
        publicKey: "pk_live_xxxx",
        msisdn:    "08012345678",
        baseUrl:   "https://corporatedevapi.retailcode.com.ng",
        onClose:   { /* navigation back is automatic */ }
    )
    .ignoresSafeArea()
}
```

The widget uses `WKWebView` with a `WKScriptMessageHandler` named `retailcode` — the same handler the web SDK already targets for iOS.

---

## Theme options

Both `@tolucode/web` and `@tolucode/react-native` accept a `theme` prop:

| Option | Type | Default | Description |
|---|---|---|---|
| `accent` | `string` (hex) | `#0057FF` | Primary colour — buttons, focus rings, account bar |
| `fontFamily` | `string` | `'DM Sans', system-ui` | Web only |

```ts
theme: { accent: '#7C3AED' }  // purple brand colour
```

---

## Local development

```bash
git clone https://github.com/Eyiowuawi/retailcode-sdk.git
cd retailcode-sdk

pnpm install
pnpm build

# Start the mock server (port 3000) and open http://localhost:3000
pnpm mock
```

The mock server responds to all API endpoints with fake data and serves the web example page at `http://localhost:3000`.
