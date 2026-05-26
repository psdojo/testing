import express from "express";
import { Queue, Worker } from "bullmq";
import axios from "axios";
const jobQueue = new Queue("jobs", {
    connection: { host: "localhost", port: 6379 },
});
const app = express();
app.use(express.json());
app.post("/job", async (req, res) => {
    await jobQueue.add("job", req.body);
    res.json({ ok: true });
});
function validateUrl(url) {
    if (!url.startsWith("http"))
        throw new Error("Invalid URL");
}
new Worker("jobs", async (job) => {
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
    }
    catch (e) {
        return {
            status: "fail",
            error: e.message,
        };
    }
}, {
    connection: {
        host: "localhost",
        port: 6379,
    },
});
app.listen(3000, () => {
    console.log("running on 3000");
});
