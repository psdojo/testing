const port = process.env.PORT || 3000;
import CDP from "chrome-remote-interface";
import dns from "dns/promises";
import ipaddr from "ipaddr.js";
import { fileURLToPath } from "url";
import express, { Request, Response } from "express";
import cors from "cors";
import LighthouseService from "./modules/LighthouseService.ts";
import PageSpeedInsightsProvider from "./modules/PageSpeedInsights.js";
import * as ChromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

interface LighthouseRequest {
  url: string
}
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://testing-frontend-iota.vercel.app",
      "http://localhost:5173",
    ],
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Allow necessary methods
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "traceparent",
      "tracestate",
      "b3",
      "x-b3-traceid",
      "x-b3-spanid",
      "x-b3-parentspanid",
      "x-b3-sampled",
      "x-b3-flags",
      "x-ot-span-context",
    ],
    credentials: true, // Allow cookies if needed
  }),
);
let chrome: any;
let client: any;
let Target: any;
let targetId: any;

let lighthouseService: any;
try {
  chrome = await ChromeLauncher.launch({
    chromeFlags: ["--headless"],
    chromePath: "/opt/chrome/linux-131.0.6778.85/chrome-linux64/chrome",
  });
  client = await CDP({ port: chrome.port });
  console.log("chrome and cdp connected!");
  // lighthouseService = new LighthouseService(client);
} catch (error) {
  console.log("Failed to launch chrome or connect CDP:", error);
  process.exit(1);
}

export const processUrl = (
  inputUrl: string,
): string | "LOCAL_IP" | "INVALID_URL" => {
  //1. Garbage check
  if (!inputUrl || typeof inputUrl !== "string" || !inputUrl.trim()) {
    return "INVALID_URL";
  }

  let sanitizedInputUrl = inputUrl.trim();

  //Protocol check

  const lower = sanitizedInputUrl.toLowerCase();

  if (
    lower.includes("://") &&
    !lower.startsWith("http://") &&
    !lower.startsWith("https://")
  ) {
    return "INVALID_URL";
  }

  if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
    sanitizedInputUrl = `https://${sanitizedInputUrl}`;
  }

  try {
    const url = new URL(sanitizedInputUrl);
    url.protocol = "https:";
    const hostname = url.hostname;

    if (
      hostname === "localhost" ||
      hostname === "::1" ||
      /^127\./.test(hostname) ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return "LOCAL_IP";
    }

    if (ipaddr.isValid(hostname)) {
      const ip = ipaddr.parse(hostname);

      if (ip.range() !== "unicast") {
        return "LOCAL_IP";
      }
    }
    return url.href;
  } catch {
    return "INVALID_URL";
  }
};

app.post(
  "/",
  async (
    req: Request<{}, {}, LighthouseRequest>,
    res: Response,
  ): Promise<void> => {
    const { inputUrl } = req.body;
    const url = processUrl(inputUrl);
    try {
      ({ targetId } = await client.Target.createTarget({
        url: "about:blank",
      }));
      const targetClient = await CDP({ target: targetId, port: chrome.port });

      const scopedService = new LighthouseService(targetClient);
      const report = await scopedService.runTest(url);
      res.status(200).json(report.report);

      await client.Target.closeTarget({ targetId });
    } catch (err) {
      console.error("Lighthouse error:", err);
      res.status(500).json({ error: "Failed to run Lighthouse" });
    } finally {
      if (targetId) {
        await client.Target.closeTarget({ targetId });
        console.log(`Closed tab ${targetId}`);
      }
    }
  },
);
//    //1. Garbage check
//
//    const { url } = req.body;
//
//    console.log(url);
//    let address: string;
//
//  },
//);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "something went wrong",
  });
});
app.listen(port, () => {
  console.log("server is running");
});
