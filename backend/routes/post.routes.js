import express from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import { commentPost, createPost, deletePost, getAllPost, getFollowingPost, getLikedPost, getPostByUsername, likeUnlikePost } from "../controller/post.controller.js";

const router = express.Router();


router.post("/create", protectRoutes, createPost)
router.post("/like/:id", protectRoutes, likeUnlikePost),
router.post("/comment/:id", protectRoutes, commentPost),
router.delete("/:id", protectRoutes, deletePost)
router.get("/all", protectRoutes, getAllPost)
router.get("/likedpost/:id", protectRoutes, getLikedPost)
router.get("/followingpost", protectRoutes , getFollowingPost)
router.get("/user/:username", protectRoutes, getPostByUsername)


export default router;