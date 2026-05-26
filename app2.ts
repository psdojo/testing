import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

type RedirectStep = {
  url: string;
  status: number;
  time: number;
};

async function checkRedirect(url: string): Promise<RedirectStep[]> {
  const chain: RedirectStep[] = [];

  let current = url;
  let count = 0;

  while (count < 10) {
    const start = Date.now();

    const res = await fetch(current, {
      redirect: "manual",
      headers: {
        "User-Agent": "RedirectCheckerBot/1.0",
      },
    });

    const duration = Date.now() - start;

    chain.push({
      url: current,
      status: res.status,
      time: duration,
    });

    const location = res.headers.get("location");

    const isRedirect = [301, 302, 303, 307, 308].includes(
      res.status,
    );

    if (!isRedirect || !location) {
      break;
    }

    current = new URL(location, current).href;

    count++;
  }

  return chain;
}

app.post(
  "/check",
  async (req: Request, res: Response) => {
    try {
      const { url } = req.body as {
        url?: string;
      };

      if (!url) {
        return res.status(400).json({
          error: "URL is required",
        });
      }

      const result = await checkRedirect(url);

      res.json(result);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  },
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
