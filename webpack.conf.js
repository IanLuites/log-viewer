// module.exports = {
//   cache: true,
//   context: __dirname + '/src',
//   entry: './index.js',
//   output: {
//     path: __dirname + '/dist',
//     filename: 'log-viewer.js',
//     libraryTarget: 'umd',
//     library: 'LogViewer'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.m?js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader'
//         }
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['', '.js', '.es6', '.json']
//   }
// }

module.exports = {
  cache: true,
  context: __dirname + '/src',
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'LogViewer'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
    ]
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    },
    'react-virtualized': {
      commonjs: 'react-virtualized',
      commonjs2: 'react-virtualized'
    },
    '@material-ui/core': {
      commonjs: '@material-ui/core',
      commonjs2: '@material-ui/core'
    },
    '@material-ui/core/Input': {
      commonjs: '@material-ui/core/Input',
      commonjs2: '@material-ui/core/Input'
    },
    '@material-ui/core/InputLabel': {
      commonjs: '@material-ui/core/InputLabel',
      commonjs2: '@material-ui/core/InputLabel'
    },
    '@material-ui/core/MenuItem': {
      commonjs: '@material-ui/core/MenuItem',
      commonjs2: '@material-ui/core/MenuItem'
    },
    '@material-ui/core/FormControl': {
      commonjs: '@material-ui/core/FormControl',
      commonjs2: '@material-ui/core/FormControl'
    },
    '@material-ui/core/Select': {
      commonjs: '@material-ui/core/Select',
      commonjs2: '@material-ui/core/Select'
    },
    '@material-ui/core/ListItemText': {
      commonjs: '@material-ui/core/ListItemText',
      commonjs2: '@material-ui/core/ListItemText'
    },
    '@material-ui/core/Checkbox': {
      commonjs: '@material-ui/core/Checkbox',
      commonjs2: '@material-ui/core/Checkbox'
    }
  }
}
