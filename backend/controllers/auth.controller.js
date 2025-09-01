// auth.controller.js
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
const signup = async (req, res) => {
    try{
    const {username, email,password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({success: false, message: "All fields are required"})
    }
    const existingUserByEmail = await User.findOne({email})

    if(existingUserByEmail){
        return res.status(400).json({success:false,message: "Email Already Exists"})
    }
    const existingUserByUsername = await User.findOne({username})

    if(existingUserByEmail){
        return res.status(400).json({success:false,message: "Username Already Exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"]
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]
    console.log(image);
    
    const newUser =new User({
        email,
        password : hashedPassword,
        username,
        image
    });

         generateTokenAndSetCookie(newUser._id, res)
         await newUser.save()
            return res.status(201).json({success :true , user :{
            ...newUser._doc,
            password: ""
        }})
 


    }
    catch(error){
        console.log(error);
        
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const logout = async (req, res) => {
    try {
        res.clearCookie("jwt-netflix")
        res.status(200).json({success :true, mesesage: 'Logged Out'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"})

    }
};

export  {
  signup,
  login,
  logout,
};
