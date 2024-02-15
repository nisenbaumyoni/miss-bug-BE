import express from "express";
import { bugController } from "./bug.controller.js";

const router = express.Router();

router.get("/", bugController.getBugs);
router.get("/export", bugController.exportPdf);
router.get("/:bugId", bugController.getBugById);
router.delete("/:bugId", bugController.deleteBug);
router.post("/", bugController.saveBug);
router.put("/", bugController.updateBug);

export const bugRoutes = router;
