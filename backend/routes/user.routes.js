import express from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUserProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoutes, getUserProfile)

router.get("/suggested", protectRoutes , getSuggestedUser)
router.post("/follow/:id", protectRoutes, followUnfollowUser)
router.post("/update", protectRoutes, updateUserProfile)
export default router;