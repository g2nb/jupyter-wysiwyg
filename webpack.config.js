const path = require('path');
const webpack = require('webpack');
const version = require('./package.json').version;

// Custom webpack rules
const rules = [
  { test: /\.ts$/, loader: 'ts-loader' },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
  { test: /\.(png|svg|jpg)$/i, use: ['file-loader'] }
];

// Packages that shouldn't be bundled but loaded at runtime
const externals = [];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: [".webpack.js", ".web.js", ".ts", ".js", ".css"]
};

module.exports = [
  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    target: 'web',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "@g2nb/jupyter-wysiwyg",
      libraryTarget: 'amd',
      // TODO: Replace after release to unpkg.org
      publicPath: '' // 'https://unpkg.com/@g2nb/jupyter-wysiwyg@' + version + '/dist/'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
  }

];
