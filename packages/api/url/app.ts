import express from "express";
import { validateUserInputUrl } from "./validateUrl";
const app = express();
app.use(express.json());
app.post("/", async (req, res) => {
  try {
    const { inputUrl } = req.body;
    const url = await validateUserInputUrl(inputUrl);
    console.log(url);
    res.json({ url });
  } catch (error) {
    res.status(400).json({ message: "Invalid input" });
  }
});
app.listen(3000);
