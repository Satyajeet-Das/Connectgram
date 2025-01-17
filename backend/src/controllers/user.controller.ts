import { Request, Response } from "express";
import { generateCode } from "../utils/generateCode";
// import { validationResult } from "express-validator"
import User from "../models/user";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail";

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

    res
      .status(200)
      .json({ isError: false, message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, message: "Something Went Wrong" });
    return;
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //     res.status(400).json({message:  errors.array()});
  //     return;
  // }
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong" });
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
    const { email } = req.body;
    const user = await User.findOne({ email });
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
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
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
