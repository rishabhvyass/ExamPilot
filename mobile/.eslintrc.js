module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Styles follow the design spec inline per element; shared pieces live in components/ui.tsx.
    'react-native/no-inline-styles': 'off',
  },
};
