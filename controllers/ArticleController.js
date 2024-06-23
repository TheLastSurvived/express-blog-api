import { validationResult } from "express-validator";
import Article from "../models/Article.js";

export const getArticle = async (req, res) => {
  try {
    const postId = req.params.id;

    Article.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Cтатья не найдена!",
        });
      }

      res.json(post);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      messgae: "не удалось получить статью",
    });
  }
};

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const addArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const doc = new Article({
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      userId: req.userId,
    });

    const article = await doc.save();

    res.json(article);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await Article.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тэги",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    Article.findOneAndDelete({
      _id: postId,
    }).then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Cтатья не найдена!",
        });
      }

      res.json(post);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Article.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(","),
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
