const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  // externals: { bootstrap: 'bootstrap', jQuery: 'jQuery' },
  module: {
    // loaders: [
    //   { 
    //     test: /\.css$/, 
    //     loader: "style-loader!css-loader" 
    //   },
    //   { 
    //     test: /\.png$/, 
    //     loader: "url-loader?limit=100000" 
    //   },
    //   { 
    //     test: /\.jpg$/, 
    //     loader: "file-loader" 
    //   },
    //   {
    //     test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
    //     loader: 'url?limit=10000&mimetype=application/font-woff'
    //   },
    //   {
    //     test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
    //     loader: 'url?limit=10000&mimetype=application/octet-stream'
    //   },
    //   {
    //     test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
    //     loader: 'file'
    //   },
    //   {
    //     test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
    //     loader: 'url?limit=10000&mimetype=image/svg+xml'
    //   }
    // ],
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { 
            loader: 'css-loader', 
            options: { 
              importLoaders: 1 
            } 
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, 'postcss.config.js')
              }



              // plugins: function () { // post css plugins, can be exported to postcss.config.js
              //   return [
              //     require('precss'),
              //     require('autoprefixer')
              //   ];
              // }
            

              



            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
});