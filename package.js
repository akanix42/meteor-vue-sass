Package.describe({
  name: 'nathantreid:vue-sass',
  version: '0.0.1-alpha.2',
  // Brief, one-line summary of the package.
  summary: 'Sass support for vue components',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/nathantreid/meteor-vue-sass',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.registerBuildPlugin({
  name: "vue-component-sass",
  use: [
    'ecmascript@0.5.8',
  ],
  sources: [
    'main.js',
  ],
  npmDependencies: {
    // 'meteor-scss-processor': 'file:///C:\\projects\\npm\\meteor-scss-processor'
    'babel-runtime': '6.20.0',
    'meteor-scss-processor': '0.0.1-alpha.15',
    'meteor-project-path': '0.0.3',
  }
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.4.1');
  api.use('isobuild:compiler-plugin@1.0.0');
});
