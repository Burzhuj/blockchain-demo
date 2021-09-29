const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["babel-polyfill", "./src/index.jsx"],
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(js)$/,
        include: /node_modules/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  externals: {
    Config: JSON.stringify(process.env.NODE_ENV === "production" ? {
      api: {
        url: "http://localhost:3000",
        endpoint: {
          blockchain: {
            get: "/api/blockchain",
            mine: "/api/mine",
          },
        },
      },
    } : {
      api: {
        url: "http://localhost:3000",
        endpoint: {
          blockchain: {
            get: "/api/blockchain",
            mine: "/api/mine",
          },
        },
      },
    }),
  },
};
