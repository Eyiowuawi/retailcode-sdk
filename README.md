# Retailcode SDK

Auto Topup subscription widget for web and React Native.

| Package | Description |
|---|---|
| `@tolucode/core` | Shared API client, types, validation — no platform code |
| `@tolucode/web` | Browser widget via Shadow DOM. Ships a CDN-ready IIFE bundle |
| `@tolucode/react-native` | Native React Native component |

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

**Next.js** — call `.mount()` inside `useEffect` so it runs client-side only:

```tsx
import { useEffect } from 'react';
import { RetailcodeTopup } from '@tolucode/web';

export default function TopupPage() {
  useEffect(() => {
    RetailcodeTopup.create({
      publicKey: 'pk_live_xxxx',
      msisdn:    '08012345678',
      container: '#topup-widget',
      onClose:   () => router.push('/'),
    }).mount();
  }, []);

  return <div id="topup-widget" />;
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
