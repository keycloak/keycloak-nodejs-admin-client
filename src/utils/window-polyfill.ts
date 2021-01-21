const globalObject = typeof global !== "undefined" ? global as any : {};
if (!globalObject.window) {
  globalObject.window = {};
}
