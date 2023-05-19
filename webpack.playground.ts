import defaultWebpackConf from './webpack.config'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from "path";

export default (env:Record<string, string>)=>{
  const webpackConfig = defaultWebpackConf(env)
  webpackConfig.plugins = webpackConfig.plugins??[]

  webpackConfig.plugins.push(new HtmlWebpackPlugin({
    meta: {
      charset:"UTF-8"
    },
    templateContent:'<body><div id="root"/></body>'
  }))
  webpackConfig.entry = './playground.tsx'

  webpackConfig.output ={
    path: path.resolve(__dirname, 'dist'),
  }

  webpackConfig.externals =[]
  return webpackConfig
}