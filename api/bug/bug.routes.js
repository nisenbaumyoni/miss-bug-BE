import express from "express";
import { getBugs } from "./bug.controller.js";

const router = express.Router();

router.get("/api/bug", getBugs);

export const bugRoutes = router;
