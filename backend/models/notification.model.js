import mongoose from "mongoose";

const notificationModel = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"],
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

const Notification = new mongoose.model("Notification", notificationModel);

export default Notification;
