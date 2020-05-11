const {version, name} = require("./package.json")

module.exports = {
  "presets": [
    "sui"
  ],
  "plugins": [
    "@babel/plugin-transform-modules-commonjs",
    [
      "transform-define",
      {
        "__PACKAGE_NAME__": name,
        "__PACKAGE_MINOR_VERSION__": version.split('.')[1]
      }
    ]
  ]
}
