const express = require("express");
const router = express.Router();
const {browsePosts, addPost, editPost, deletePost} = require("../controllers/post");
const {requireAuth} = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const ROLE = require("../permission/rolesEnum")

router.get("/", browsePosts);
router.post("/add", requireAuth, addPost);
router.post("/edit/:id", requireAuth, editPost);
router.post("/delete/:id", requireAuth, requireRole([ROLE.ADMIN]), deletePost);

module.exports = router;