import { Request, Response } from "express";
import { generateCode } from "../utils/generateCode";
// import { validationResult } from "express-validator"
import User from "../models/user";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail";
import "dotenv/config";
import { JwtPayloadWithUserId } from "../types/payload";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     res.status(400).json({message: errors.array()});
  //     return
  // }

  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    let username = await User.findOne({
      email: req.body.username,
    });

    if (user) {
      res.status(400).json({
        isError: true,
        message: "User with this email already exists",
      });
      return;
    }

    if (username) {
      res.status(400).json({
        isError: true,
        message: "User with this username already exists",
      });
      return;
    }

    user = new User(req.body);
    await user.save();

    res.status(200).json({
      isError: false,
      message: "User Registered Successfully",
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: "Something Went Wrong" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ isError: true, message: "Invalid Credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ isError: true, message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.SECRET_KEY as string,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400000,
    });

    res.status(200).json({ isError: false, token: token, name: user.name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: false, message: "Something Went Wrong" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("authToken");
  res.status(200).json({ isError: false, message: "Logout successful" });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
      return;
    }

    const resetCode = generateCode();
    const resetExpiry = new Date(Date.now() + 600000); //10 min expiry

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpiry = resetExpiry;
    await user.save();

    await sendMail(
      user.email,
      "Password Recovery Code",
      `Your Reset Code for Social Media App is ${resetCode}. This code is valid for 10mins only.`
    );

    res.status(200).json({ isError: false, message: "Reset Code Sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: "Something Went Wrong" });
  }
};

export const verifyAndResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ isError: true, message: "User Not Found" });
      return;
    }

    if (!user.resetPasswordCode || user.resetPasswordCode != code) {
      res.status(400).json({ isError: true, message: "Invalid Code" });
      return;
    }

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      res.status(400).json({ isError: true, message: "Code Expired" });
      return;
    }

    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({ isError: false, message: "Password Reset Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: "Something Went Wrong" });
  }
};

export const checkOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ isError: true, message: "User Not Found" });
      return;
    }

    if (!user.resetPasswordCode || user.resetPasswordCode != otp) {
      res.status(400).json({ isError: true, message: "Invalid OTP" });
      return;
    }

    if (!user.resetPasswordExpiry || user.resetPasswordExpiry < new Date()) {
      res.status(400).json({ isError: true, message: "OTP Expired" });
      return;
    }

    res.status(200).json({ isError: false, message: "OTP Verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: "Something Went Wrong" });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.user as JwtPayloadWithUserId;
    const user = await User.findById(userId).select('_id name username');
    if (!user) {
      res.status(400).json({ isAuthenticated: false, message: "User Not Found" });
      return;
    }
    res.status(200).json({ isAuthenticated: true, user: user, message: "Token Verified" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ isAuthenticated: false, message: "Unauthorized" });
  }
};
