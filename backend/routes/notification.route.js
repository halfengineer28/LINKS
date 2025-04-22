import express from "express";
import { protectRoutes } from "../middlewares/protectRoutes.js";
import {
  deleteNotification,
  getNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protectRoutes, getNotification);

router.delete("/", protectRoutes, deleteNotification);
export default router;
