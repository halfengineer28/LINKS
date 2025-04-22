import Notification from "../models/notification.model.js";
import Post from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { image } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!image && !text) {
      return res.status(400).json({ message: "Image and text required" });
    }
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      image = uploadedImage.secure_url;
    }

    const newPost = new Post({
      user: userId,
      image: image,
      text: text,
    });
    await newPost.save();

    res.status(200).json({ message: "New post created" });
  } catch (error) {
    console.log("Error in create post : " + error.message);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "Post not found " });
    }

    const userLikedPost = post.like.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { like: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      post.like.push(userId);

      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

      await post.save();
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      res.status(200).json({
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    console.log("Error in liked controller : " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const postId = req.params.id;
    if (!text) {
      return res.status(400).json({ message: " text is not present!" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post is not present!" });
    }
    const newComment = { text, user: userId };

    post.comments.push(newComment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Error in comment controller:" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user._id.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ message: "You are not authoriesed to delete post" });
    }

    if (post.image) {
      const deleteImage = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(deleteImage);
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    console.log("Error in delete post controller: " + error.message);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in posts controller :" + error.message);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const getLikedPost = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: " User Not found" });
    }

    const userLikedPost = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(userLikedPost);
  } catch (error) {
    console.log("Error in getting liked Post:" + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowingPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not available" });
    }
    const following = user.following;
    const feedPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPost);
  } catch (error) {
    console.log("Error in get following post: " + error.message);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getPostByUsername = async (req, res) => {
  try {
    const username = req.params;
    const user = await User.findOne(username);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const userPost = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

      res.status(200).json(userPost)
  } catch (error) {
    console.log("Error in user like controller : "+ error.message)
    res.status(500).json({message :"Internal Server Error"})
  }
};
