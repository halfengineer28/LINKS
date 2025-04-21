import { User } from "../models/user.models.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findById({ username: username }).select(
      "-password"
    );
    if (!user) {
      res.status(401).json({ success: false, error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in user profile controller" + error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You can't follow yourself" });
    }

    if (!userToModify || !currentUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { follower: req.user._id } });
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: id } });
      res
        .status(200)
        .json({ success: true, message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { follower: req.user._id } });
      await User.findByIdAndUpdate(req.user.id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user.id,
        to: userToModify._id,
      });
      await newNotification.save();
      res
        .status(200)
        .json({ success: true, message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in follow unfollow auth" + error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSuggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUser = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id)
    );
    const suggestedUser = filteredUser.slice(0, 4);
    suggestedUser.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUser);
  } catch (error) {
    console.log("Error in suggestedUser controller: " + error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const {username , fullName , email, currentPassword, newPassword, link, bio} = req.body;
  let {profileImage, backgroundImage} = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if(!user) {
      return res.status(400).json({message: "User not found"})
    }
    if ((!currentPassword && newPassword)|| (!newPassword && currentPassword)){
      return res.status(400).json({message : "Both password are required"})
    }
    if (currentPassword && newPassword){
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if(!isMatch){
        return res.status(400).json({message: "Incorrect user password!"})
      }
      if (newPassword.length < 6){
        return res.status(400).json({message:"Password must be 6 character"})
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImage){
      if(user.profileImage){
        await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
      }
      const updatedProfilepic = cloudinary.uploader.upload(profileImage);
      profileImage = (await updatedProfilepic).secure_url
    }

    if (backgroundImage){
      if (user.backgroundImage){
        await cloudinary.uploader.destroy(user.backgroundImage.split("/").pop().split(".")[0])
      }
      const updatedBackgroundImage = cloudinary.uploader.upload(backgroundImage);
      backgroundImage = (await updatedBackgroundImage).secure_url
    }
    user.fullName = fullName || user.fullName,
    user.username = username || user.username,
    user.email = email || user.email,
    user.bio = bio || user.bio,
    user.link = link || user.link,
    user.profileImage = profileImage || user.profileImage,
    user.backgroundImage = backgroundImage || user.backgroundImage

    user = await user.save();

    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in update controller "+ error.message )
    res.status(500).json({success: false, message:"Internal server error"})
  }
}
