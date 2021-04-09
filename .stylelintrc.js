const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.stylelint,
  rules: {
    'no-invalid-double-slash-comments': null,
    'function-name-case': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
  },
};
