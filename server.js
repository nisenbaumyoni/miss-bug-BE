import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { bugRoutes } from "./api/bug/bug.routes.js";
import { userRoutes } from "./api/user/user.routes.js";

const app = express();

const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/bug", bugRoutes);

const port = 3030;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
