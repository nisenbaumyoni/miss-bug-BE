import express from "express";
import { bugController } from "./bug.controller.js";
import { requireUser} from "../../middlewares/requireAuth.middleware.js"

const router = express.Router();

router.get("/", requireUser , bugController.getBugs);
router.get("/export", requireUser , bugController.exportPdf);
router.get("/:bugId", requireUser , bugController.getBugById);
router.delete("/:bugId", requireUser , bugController.deleteBug);
router.post("/", requireUser , bugController.saveBug);
router.put("/", requireUser , bugController.updateBug);

export const bugRoutes = router;
