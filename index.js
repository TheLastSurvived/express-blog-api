import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import {
  registerValidation,
  loginValidation,
  articleCreateValidation,
} from "./validations.js";
import * as ArticleController from "./controllers/ArticleController.js";
import * as UserController from "./controllers/UserController.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect("mongodb://localhost:27017/blog")
  .then(() => console.log("Подключено к базе данных"))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/articles/:id", ArticleController.getArticle);
app.get("/articles", ArticleController.getArticles);
app.post("/articles", articleCreateValidation, ArticleController.addArticle);
app.get("/tags", ArticleController.getLastTags);
app.delete("/articles/:id", checkAuth, ArticleController.remove);
app.patch(
  "/articles/:id",
  checkAuth,
  articleCreateValidation,
  handleValidationErrors,
  ArticleController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Запуск сервера: 4444");
});
