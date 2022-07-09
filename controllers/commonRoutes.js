const express = require("express");
const router = express.Router();

const postController = require("./postController");
const authorController = require("./authorController");

// POST CONTROLLERS

router.get("/posts", postController.getPosts);
router.post("/post", postController.savePost);
router.get("/post/:id", postController.getPost);
router.put("/post", postController.updatePost);
router.delete("/post", postController.deletePost);

// AUTHOR CONTROLLERS

router.post("/author", authorController.saveAuthor);
router.get("/author/:id",authorController.getAuthor)
router.get("/author",authorController.getAllAuthors)

module.exports =router
