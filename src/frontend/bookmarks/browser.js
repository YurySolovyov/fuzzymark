export default () => (
  typeof globalThis.chrome !== 'undefined' && typeof browser !== 'undefined'
    ? 'firefox'
    : 'chrome'
);
