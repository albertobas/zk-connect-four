/** @type {import('next').NextConfig} */
const CopyPlugin = require('copy-webpack-plugin');
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  webpack(config, options) {
    if (!options.isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.readline = false;
    }
    config.resolve.extensions.push('.ts', '.tsx');
    config.plugins.push(
      // new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm.wasm',
            to: 'static/chunks/pages'
          },
          {
            from: './node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
            to: 'static/chunks/pages'
          },
          {
            from: './model/exports/policies/ConnectFourNet_2023_10_29_T_20_28_55.onnx',
            to: 'static/chunks/pages'
            // from: './model/exports/policies/ConnectFourNet_2023_10_29_T_20_28_55.onnx',
            // to: './model'
          }
        ]
      })
    );
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  }
};

module.exports = nextConfig;
