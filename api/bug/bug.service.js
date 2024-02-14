import fs from "fs";
import PDFDocument from "pdfkit";
import { loggerService } from "../../services/logger.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
  generatePDF,
};

const PAGE_SIZE = 10;
var bugs = _readJsonFile("./data/bug.json");

async function query(filterBy) {
  try {
    let bugsToReturn = [...bugs];

    if (filterBy) {
      var { title, severity, dateSort, pageIndex } = filterBy;
      title = title || "";
      severity = +severity;
      pageIndex = pageIndex || 1;

      bugsToReturn = bugsToReturn.filter(
        (bug) =>
          bug.title.toLowerCase().includes(title.toLowerCase()) &&
          (severity === 0 || severity === bug.severity)
      );

      dateSort === "asc"
        ? bugsToReturn.sort((a, b) => a.createdAt - b.createdAt)
        : bugsToReturn.sort((a, b) => b.createdAt - a.createdAt);

      const startIndex = (pageIndex - 1) * PAGE_SIZE;
      bugsToReturn = bugsToReturn.slice(startIndex, startIndex + PAGE_SIZE);
    }
    return bugsToReturn;
  } catch (err) {
    loggerService.error(`Had problems getting bugs...`);
    throw err;
  }
}

async function generatePDF() {
  // Create a PDF document and pipe it to a file

  const bugsForPdf = await bugService.query();

  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream("./data/bug.pdf"));

  // Create an object where the index is the key and bug data is the value
  const bugsObject = {};
  bugsForPdf.forEach((bug, index) => {
    bugsObject[index] = {
      id: bug._id,
      title: bug.title,
      severity: bug.severity,
      createdAt: new Date(bug.createdAt).getFullYear(),
    };
  });

  // Add JSON representation of bugsObject to PDF
  pdfDoc.text(JSON.stringify(bugsObject, null, 2));
  //Finalize the pdf
  pdfDoc.end();

  return pdfDoc;
}

async function getById(bugId) {
  try {
    const bug = bugs.find((bug) => bug._id === bugId);
    return bug;
  } catch (err) {
    loggerService.error(`Had problems getting bug ${bugId}...`);
    throw err;
  }
}

async function remove(bugId) {
  const idx = bugs.findIndex((bug) => bug._id === bugId);
  bugs.splice(idx, 1);

  try {
    _saveBugsToFile("./data/bug.json");
  } catch (err) {
    loggerService.error(`Had problems removing bug ${bugId}...`);
    throw err;
  }

  return `Ok`;
}

async function save(bugToSave) {
  try {
    if (bugToSave._id) {
      const idx = bugs.findIndex((bug) => bug._id === bugToSave._id);
      if (idx === -1) throw "Bad Id";
      bugs.splice(idx, 1, bugToSave);
    } else {
      bugToSave._id = _makeId();
      bugs.push(bugToSave);
    }
    _saveBugsToFile("./data/bug.json");
  } catch (err) {
    loggerService.error(`Had problems saving bug ${bugToSave._id}...`);
    throw err;
  }
  return bugToSave;
}

function _makeId(length = 6) {
  var txt = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return txt;
}

function _readJsonFile(path) {
  const str = fs.readFileSync(path, "utf8");
  const json = JSON.parse(str);
  return json;
}

function _saveBugsToFile(path) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2);
    fs.writeFile(path, data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
