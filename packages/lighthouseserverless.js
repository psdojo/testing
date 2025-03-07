const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

// Vercel serverless function handler
module.exports = async (req, res) => {
  try {
    // Get URL from query parameter (e.g., /api/check-title?url=https://example.com)
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Please provide a 'url' query parameter" });
    }

    // Optional: Disable WebGL for performance
    chromium.setGraphicsMode = false;

    // Launch headless Chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    // Open a new page and navigate to the URL
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

    // Get the page title
    const pageTitle = await page.title();

    // Close the browser
    await browser.close();

    // Send response
    res.status(200).json({
      url,
      title: pageTitle,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle errors (e.g., timeout, invalid URL)
    res.status(500).json({
      error: "Failed to process the request",
      details: error.message,
    });
  }
};
