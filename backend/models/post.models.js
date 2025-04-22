import { text } from "express";
import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
    },
    image: {
      type: String,
    },

    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        text: {
          type: String,
          required: true,
        },
      
      
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          request: true,
        },
      },
    ],
  },
  { timestamp: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
