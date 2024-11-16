import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user (currently empty function)
const loginUser = async (req, res) => {
    const { password, email } = req.body;
    try{
        const user=await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true,token})
    }catch(error){
        console.log(error)
        res.json({success:false,message:"Error"})
    }
};
// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // Check if user with the email already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Ensure password is at least 8 characters long
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Validate password strength (configure rules as needed)
    const isStrongEnough = validator.isStrongPassword(password, {
      minLength: 8,          // Minimum length 8 characters
      minLowercase: 1,       // At least 1 lowercase letter
      minUppercase: 0,       // Do not require uppercase letters
      minNumbers: 0,         // Do not require numbers
      minSymbols: 0          // Do not require special characters
    });

    if (!isStrongEnough) {
      return res.json({ success: false, message: "Password must contain at least one lowercase letter" });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // Save the new user
    const user = await newUser.save();

    // Create JWT token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error occurred during registration" });
  }
};

export { loginUser, registerUser };
