const path = require("path");

module.exports = {
  entry: ["./src/index.js", "./src/language.js"],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  mode: "development",
  allowedHosts: ["all"],
};
