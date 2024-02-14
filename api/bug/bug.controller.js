import { bugService } from "./bug.service.js";

async function getBugs(req, res) {
  try {
    const filterBy = {
      title: req.query.title || "",
      severity: req.query.severity,
      dateSort: req.query.dateSort,
      pageIndex: req.query.pageIndex,
    };
    const bugs = await bugService.query(filterBy);
    res.send(bugs);
  } catch (err) {
    res.status(400).send(`Couldn't get bugs`);
  }
}

async function getBugById(req, res) {
  var { bugId } = req.params;
  try {
    const bug = await bugService.getById(bugId);

    if (bug) {
      var { visitedBugs = "" } = req.cookies;
      visitedBugs = bugId + "," + visitedBugs;
      const visitedBugsArray = visitedBugs.split(",");
      if (
        visitedBugsArray.length > 0 &&
        visitedBugsArray[visitedBugsArray.length - 1] === ""
      ) {
        visitedBugsArray.pop();
      }

      if (visitedBugsArray.length > 3) throw "Wait for a bit";
      res.cookie("visitedBugs", visitedBugs, { maxAge: 5 * 1000 });
      res.send(bug);
    } else {
      res.status(404).send({ error: "Bug not found" });
    }
  } catch (err) {
    if (err === "Wait for a bit") {
      console.error(err);
      res.status(401).send(err);
    } else {
      console.error(err);
      res.status(500).send({ error: "Internal server error" });
    }
  }
}


async function exportPdf(req, res) {
  try {
    const pdfDoc = await bugService.generatePDF();
    // res.send(pdfDoc);

    // Set the appropriate headers to indicate it's a PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=bug.pdf");

    // Pipe the PDF document to the response
    pdfDoc.pipe(res);
  } catch (err) {
    res.status(400).send(`Couldn't export pdf`, err);
  }
}

async function saveBug (req, res) {
  const { _id, title, severity, createdAt } = req.body;
  const bugToSave = {
    _id: _id,
    title: title,
    severity: +severity,
    createdAt: +createdAt,
  };

  try {
    const result = await bugService.save(bugToSave);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

async function updateBug (req, res) {
  const { _id, title, severity, createdAt } = req.body;
  const bugToSave = {
    _id: _id,
    title: title,
    severity: +severity,
    createdAt: +createdAt,
  };

  try {
    const result = await bugService.save(bugToSave);
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

async function deleteBug (req, res) {
  var { bugId } = req.params;

  try {
    const result = bugService.remove(bugId);
    res.send(`Bug ${bugId} was removed`);
  } catch (err) {
    console.log(err);
  }
};

export const bugController = {
  getBugs,
  getBugById,
  exportPdf,
  saveBug,
  updateBug,
  deleteBug
};