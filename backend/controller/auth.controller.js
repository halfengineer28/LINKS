import { User } from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    if (!username || !fullName || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRejex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRejex.test(email)) {
      res
        .status(400)
        .json({ success: false, message: "Please enter valid email" });
    }

    const exsitingUser = await User.findOne({ username: username });
    if (exsitingUser) {
      res
        .status(400)
        .json({ success: false, message: "Username already exits" });
    }
    const exsitingEmail = await User.findOne({ email: email });
    if (exsitingEmail) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({
          success: false,
          message: "Password must be greater than 6 character",
        });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      fullName,
      email,
    });
    if (newUser) {
      generateTokenAndCookie(newUser._id, res);
      await newUser.save();
      res.json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        following: newUser.following,
        follower: newUser.follower,
        profileImage: newUser.profileImage,
        backgroundImage: newUser.backgroundImage,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data " });
    }
  } catch (error) {
    console.log("Error in user controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const exsitingUser = await User.findOne({username:username})
        const isPassword = await bcryptjs.compare(password , exsitingUser?.password || "")
        if(!exsitingUser || !isPassword){
            res.status(400).json({success:false, message:"Inputs are in correct!"})
        }
        generateTokenAndCookie(exsitingUser._id, res);

        res.json({
            id:exsitingUser._id,
            username:exsitingUser.username,
            fullName:exsitingUser.fullName,
            email:exsitingUser.email,
            follower:exsitingUser.email,
            following: exsitingUser.following,
            profileImage: exsitingUser.profileImage,
            backgroundImage: exsitingUser.backgroundImage


        })
    } catch (error) {
        console.log("Error is login controller:" + error.message)
        res.status(500).json({success:false, message:"Internal server error "})
        
    }
};

export const logout = (req,res) => {
    try {
        res.clearCookie("jwt", "",{ maxAge:0})
        res.status(200).json({
            success: true,
            message:"Logout Successfully"
        })
    } catch (error) {
        console.log("Error in logout controller"+ error.message)
        res.status(500).json({success:false, message:"Internal server error"})
        
    }
};
