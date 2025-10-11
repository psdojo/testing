export default class WebPerformanceProvider {
  constructor() {
    if (this.constructor === WebPerformanceProvider) {
      throw new Error(
        "WebPerformanceProvider is an abstract class and cannot be instantiated directly",
      );
    }
  }
  async runTest(url) {
    throw new Error("runTest() must be implemented by subclasses");
  }
}
