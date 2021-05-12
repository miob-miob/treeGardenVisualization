import path from 'path';
import webpack from 'webpack'
import HtmlWebpackPlugin from "html-webpack-plugin"
import {Configuration  as DevServerConfig} from 'webpack-dev-server'


export default (env:Record<string, string>)=>{
  const buildMode = (env.WEBPACK_BUILD_MODE ?? "development") as "development" | "production";

  const devServerSetting ={
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9001,
  }
  console.log('build mode:',buildMode)

  const webpackConfig: webpack.Configuration & {devServer:DevServerConfig} = {
    mode: buildMode,

    devServer: devServerSetting,
    devtool: 'inline-source-map',
    entry: {
      shared: ['react', 'react-dom'],
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
          use: 'ts-loader',
          exclude: /node_modules/,
        },
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
