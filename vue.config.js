const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: (config) => {
    // ...
    config.plugins.push(new MonacoEditorPlugin({ languages: ['sql', 'json'] }));
  },
  outputDir: '../web-api/dist/client',
  productionSourceMap: false,
};
