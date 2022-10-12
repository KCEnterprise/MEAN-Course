const express = require("express");
const PostController = require("../controllers/posts");


const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post("", checkAuth, PostController.createposts);

router.put("/:id", checkAuth,PostController.updatePost )

router.get("", PostController.getPosts);

router.get("/:id", PostController.getSinglePost );

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
