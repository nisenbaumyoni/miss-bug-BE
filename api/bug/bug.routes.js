import express from "express";
import { bugController } from "./bug.controller.js";

const router = express.Router();

router.get("/", bugController.getBugs);
router.get("/export", bugController.exportPdf);
router.get("/:bugId", bugController.getBugById);
router.post("/", bugController.saveBug);
router.put("/", bugController.updateBug);
router.delete("/:bugId", bugController.deleteBug);

export const bugRoutes = router;
