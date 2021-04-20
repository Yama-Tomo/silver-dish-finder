const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const entry = ['content_scripts', 'popup'].reduce(
  (result, name) => ({ ...result, [name]: path.join(__dirname, 'src', name) }),
  {}
);

module.exports = {
  entry,
  output: { path: path.join(__dirname, 'dist'), filename: '[name].js' },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.mjs', '.wasm'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  plugins: [new CopyWebpackPlugin({ patterns: [{ from: 'assets', to: '.' }] })],
};
