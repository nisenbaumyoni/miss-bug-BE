import express from "express";
import cors from "cors";

import { bugService } from "./services/bug.service.js";

const app = express();

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json())


//export
app.get("/api/bug/export", async (req, res) => {
  try {
    const pdfDoc = await bugService.generatePDF();
    // res.send(pdfDoc);

    // Set the appropriate headers to indicate it's a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=bug.pdf");

    // Pipe the PDF document to the response
    pdfDoc.pipe(res);

  } catch (err) {
    res.status(400).send(`Couldn't get bugs `, err);
  }
});

//CRUDL

app.get("/api/bug", async (req, res) => {
  try {
    const bugs = await bugService.query();
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs`);
  }
});

app.get("/api/bug/:bugId", async (req, res) => {
  var { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);

    if (bug) {
      res.send(bug);
    } else {
      res.status(404).send({ error: "Bug not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.post("/api/bug", async (req, res) => {
  const { _id, title, severity, createdAt } = req.body;
  const bugToSave = {
    _id: _id,
    title: title,
    severity: +severity,
    createdAt: +createdAt,
  };
  console.log(bugToSave);

  try {
    const result = await bugService.save(bugToSave);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/bug", async (req, res) => {
  const { _id, title, severity, createdAt } = req.body;
  const bugToSave = {
    _id: _id,
    title: title,
    severity: +severity,
    createdAt: +createdAt,
  };
  console.log(bugToSave);

  try {
    const result = await bugService.save(bugToSave);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/bug/:bugId", async (req, res) => {
  var { bugId } = req.params;

  try {
    const result = bugService.remove(bugId);
    res.send(`Bug ${bugId} was removed`);
  } catch (err) {
    console.log(err);
  }
});

const port = 3030;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
