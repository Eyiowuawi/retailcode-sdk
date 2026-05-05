import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM + CJS for bundler consumers
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  // Self-contained IIFE for CDN / <script> tag usage
  {
    entry: { 'retailcode.iife': 'src/iife.ts' },
    format: ['iife'],
    globalName: 'RetailcodeSDK',
    minify: true,
    sourcemap: false,
    outDir: 'dist',
    noExternal: ['@retailcode/core'],
  },
]);
