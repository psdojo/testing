import WebPerformanceProvider from "./runTest";
import axios from "axios";
export default class PageSpeedInsightsProvider extends WebPerformanceProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
  }

  async getCoreMetrics(url) {
    const endpoint =
      this.PSI_API +
      `?url=${encodeURIComponent(url)}` +
      (this.apiKey ? `&key=${this.apiKey}` : "");
    try {
      console.log(endpoint);
      const res = await axios.get(endpoint);
      const results = res.data;
      const audits = results.lighthouseResult?.audits || {};
      const lcp = audits["largest-contentful-paint"]?.numericValue ?? null;
      const fcp = audits["first-contentful-paint"]?.numericValue ?? null;
      const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;
      const ttfb = audits["server-response-time"]?.numericValue ?? null;
      const inp =
        audits["experimental-interaction-to-next-paint"]?.numericValue ?? null;
      console.log(lcp, fcp, cls, ttfb, inp, url);
      return {
        lcp,
        fcp,
        cls,
        ttfb,
        inp,
        url,
        fetched_at: new Date().toISOString(),
      };
      console.log(endpoint);
    } catch (error) {
      throw error;
    }
  }
}
