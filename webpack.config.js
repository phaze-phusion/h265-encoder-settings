/* global __dirname */

const path = require('path');
const pathRoot = __dirname;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const npmPackage = require(path.resolve(pathRoot, './package.json'));
const packageName = npmPackage.name;

/**
 * @param {null} env
 * @param {{ mode: 'none' | 'development' | 'production' }} argv
 */
module.exports = (env, argv) => {
  const indexPackageName = argv.mode === 'development' ? 'index' : `${packageName}`;

  // Common configurations
  // ------------------------------------------------------
  const config = {
    name: packageName,
    mode: argv.mode,
    entry: './src/index.js',
    // https://webpack.js.org/configuration/output/
    output: {
      // filename: `js/${indexPackageName}.js`,
      filename: `[name].js`,
    },
    target: 'browserslist',
    resolve: {extensions: ['.js']},
    stats: {
      // errorDetails: true,
      children: true,
    },
    module: {
      rules: [
        {
          test: /\.(s?css)$/,
          use: [
            argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            'postcss-loader', // options loaded from postcss.config.js
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  outputStyle: 'expanded',
                  includePaths: [
                    './src/scss/'
                  ],
                },
              },
            },
          ],
        },
        // {
        //   // This loader is the one that auto-refreshes the browsers after an edit
        //   test: /\.html$/,
        //   use: [{
        //     loader: 'html-loader',
        //     options: {
        //       minimize: argv.mode === 'development',
        //     },
        //   }],
        // },
        {
          test: /\.(svg|jpg|png|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]',
          },
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|coverage|tests)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env'],
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    regenerator: true
                  }
                ]
              ]
            },
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: argv.mode === 'development' ? '[name].css' : `${packageName}.min.css`,
        chunkFilename: '[id].css',
      }),
      new HtmlWebpackPlugin({
        favicon: './src/favicon.ico',
        filename: `${indexPackageName}.html`,
        template: './src/index.html',
        inject: true,
        hash: false,
        minify: argv.mode !== 'development',
      }),
    ],
  }; // Common configurations

  // Development build
  // ------------------------------------------------------
  if (argv.mode === 'development') {
    config.watchOptions = {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: ['node_modules'],
    };

    // https://webpack.js.org/configuration/dev-server/
    config.devServer = {
      hot: true,
      watchFiles: ['src/**/*'],
      host: 'localhost',
      port: 4600,
      devMiddleware: {
        stats: 'errors-warnings', // 'minimal,  'errors-only', // 'normal'
      },
    };

    config.performance = false;
    config.devtool = 'source-map';
  } // IF mode === 'development'

  // Production build
  // ------------------------------------------------------
  if (argv.mode === 'production') {
    config.output = {
      filename: `${packageName}.min.js`,
      path: path.resolve(__dirname, './dist/'),
    };

    // https://webpack.js.org/configuration/performance/
    config.performance = {
      // values are in bytes, Default = 250000 (250KB or 244KiB)
      // KiB = KB * 0.976563
      maxEntrypointSize: (2.5e5), // 244 KiB
      maxAssetSize: (2.5e5),      // 244 KiB
    };

    config.optimization = {
      minimize: true,
      minimizer: [
        // https://webpack.js.org/plugins/terser-webpack-plugin/
        new TerserPlugin({
          test: /\.js$/i,
          exclude: /\.\/(tests|coverage|dist)/,
          parallel: true,
          extractComments: false,
          minify: TerserPlugin.esbuildMinify,
          terserOptions: {
            // https://esbuild.github.io/api/#keep-names
            ecma: 2018,
            minify: true,
            treeShaking: true,
            keepNames: false,
            mangleProps: /^_/
          },
        }),
        new CssMinimizerPlugin({
          include: /\.css$/g,
          minimizerOptions: {
            sourcemap: false,
            preset: ['default', {discardComments: {removeAll: true}}],
          },
          parallel: true,
        }),
      ],
    };

    config.plugins = [
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ['./**/*'], // clean out dist directory
      }),
      new StyleLintPlugin({
        context: './src/scss/',
        extensions: ['scss'],
        files: ['**/*.scss'],
      }),
      new ESLintPlugin({
        extensions: ['.js'],
        exclude: 'node_modules'
      }),
      ...(config.plugins),
    ];

  } // IF mode === 'production'

  return config;
};
