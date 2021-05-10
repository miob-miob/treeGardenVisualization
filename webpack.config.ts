import path from 'path';
import webpack from 'webpack'

const buildMode = (process.env.WEBPACK_BUILD_MODE ?? "development") as "development" | "production";
const webpackConfig: webpack.Configuration = {
  mode: buildMode,
  entry: './src/index.ts',
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
    filename: 'kunda.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

export default webpackConfig;
