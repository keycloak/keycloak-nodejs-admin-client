const globalObject = global as any;
if (!globalObject.window) {
  globalObject.window = {};
}
