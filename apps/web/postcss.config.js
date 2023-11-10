const path = require('path');

const globalVars = require(path.join(
  __dirname,
  'src',
  'styles',
  'global-vars.js'
));

module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ],
    ['postcss-simple-vars', { variables: globalVars }],
    [
      'postcss-mixins',
      {
        mixinsDir: path.join(__dirname, 'src', 'styles', 'mixins')
      }
    ]
  ]
};
