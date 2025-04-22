import mongoose from "mongoose";

const userScehma = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    follower: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "",
        default: [],
      },
    ],
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    },
    likedPosts : [{
      
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        default:[]
      
    }]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userScehma);