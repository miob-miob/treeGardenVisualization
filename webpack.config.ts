import path from 'path';
import webpack from 'webpack'


export default (env:Record<string, string>)=>{
  const buildMode = (env.WEBPACK_BUILD_MODE ?? "development") as "development" | "production";
  const isProduction = buildMode === "production";


  const babelConfig = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ],
    plugins: [
      [
        'babel-plugin-styled-components',
        {
          ssr: false,
          displayName: true
        }
      ],
    ] as (string|Array<string|object>)[]
  };

  if(!isProduction){
    babelConfig.plugins.push('babel-plugin-typescript-to-proptypes')
  }



  console.log(`Build mode:  ${buildMode}`)

  const webpackConfig: webpack.Configuration = {
    mode: buildMode,
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename:'index.js',
      library:{
        name:'tree-garden-visualization',
        type:'umd'
      }
    },
    externals:[
      "react",
      "react-dom",
      "styled-components",
      "tree-garden"
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {loader: 'babel-loader', options: babelConfig},
          ]

        }
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };

  return webpackConfig
}
