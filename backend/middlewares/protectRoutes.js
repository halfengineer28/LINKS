import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: No token provided " });
    }

    const decoded = jwt.verify(token, process.env.JWT_SCERECT);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protected Routes:" + error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
