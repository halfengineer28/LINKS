import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username , profileImage",
    });
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in notification controller" + error.message);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: "Notification Deleted successfully" });
  } catch (error) {
    console.log("Error in delete controller: " + error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};
