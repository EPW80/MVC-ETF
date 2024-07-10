import express from "express";
import bodyParser from "body-parser";
import { DataController } from "./controllers/DataController";
import path from "path";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/data", DataController.getHistoricalData);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
