import path from 'path';
import webpack from 'webpack'
import HtmlWebpackPlugin from "html-webpack-plugin"
import {Configuration  as DevServerConfig} from 'webpack-dev-server'


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



  const devServerSetting ={
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9001,
  }
  console.log('build mode:',buildMode)

  const webpackConfig: webpack.Configuration & {devServer:DevServerConfig} = {
    mode: buildMode,

    devServer: devServerSetting,
    devtool: (!isProduction)?'inline-source-map':false,
    entry: {
      shared: ['react', 'react-dom','styled-components'],
      index: {
        import: './src/index.ts',
        dependOn: 'shared',
      },
      playground: {
        import: './src/playground.ts',
        dependOn: ['shared','index'],
      },
    },
    plugins:[
      new HtmlWebpackPlugin({title:'Miob`s Tree Garden Playground'})
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
    output: {
      filename: '[name]_[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true
    },
  };

  return webpackConfig
}
