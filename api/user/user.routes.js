import express from "express";
import { getUsers } from "./user.controller.js";

const router = express.Router();

// router.get("/api/user", userController.getUsers);
// router.get("/api/bug/:bugId", bugController.getBugById);

router.get("/", getUsers);

export const userRoutes = router;
