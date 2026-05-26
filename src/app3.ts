import express from "express";
import { Job, Queue, Worker } from "bullmq";
import axios from "axios";

type JobType = "uptime";

type UptimeJob = {
  url: string;
  type: JobType;
};

type Result = {
  status: number | "fail";
  latency?: number;
  error?: string;
};

const jobQueue = new Queue<UptimeJob>("jobs", {
  connection: { host: "localhost", port: 6379 },
});

const app = express();

app.use(express.json());

app.post("/job", async (req: { body: UptimeJob }, res) => {
  await jobQueue.add("job", req.body);
  res.json({ ok: true });
});

function validateUrl(url: string) {
  if (!url.startsWith("http")) throw new Error("Invalid URL");
}
new Worker<UptimeJob, Result>(
  "jobs",

  async (job: Job<UptimeJob>) => {
    validateUrl(job.data.url);

    const start = Date.now();

    try {
      const res = await axios.get(job.data.url, {
        timeout: 5000,
      });

      return {
        status: res.status,
        latency: Date.now() - start,
      };
    } catch (e: any) {
      return {
        status: "fail",
        error: e.message,
      };
    }
  },

  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

app.listen(3000, () => {
  console.log("running on 3000");
});
