import { Request, Response } from "express";
import User from "../models/User";
import { response } from "../utils/responseHandler";
import crypto from "crypto";
import {
  sendResetPasswordLinktoEmail,
  sendVerificationToEmail,
} from "../config/EmailConfig";
import { generateToken } from "../utils/generateToken";
import { compare } from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, agreeTerms } = req.body;
    if (!name || !email || !password) {
      return response(res, 400, "All fields are required");
    }
    if (!agreeTerms) {
      return response(res, 400, "You must agree to the terms & conditions");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 409, "User already exists");
    }
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const user = new User({
      name,
      email,
      password,
      agreeTerms,
      verificationToken,
    });
    await user.save();
    sendVerificationToEmail(user.email, verificationToken);

    return response(
      res,
      201,
      "User registered successfully. Please verify your email."
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "Internal Server Error, Please try again later");
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return response(res, 400, "Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    await user.save();

    return response(res, 200, "Email verified successfully!");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return response(res, 400, "Invalid email or password");
    }

    if (!user.isVerified) {
      return response(res, 400, "Please verify your email before logging in");
    }

    const accessToken = generateToken(user);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return response(res, 200, "Logged in Successfully!", {
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return response(res, 400, "No Account found with this email Id");
    }

    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    await sendResetPasswordLinktoEmail(
      user.email,
      resetPasswordToken,
      user.name
    );

    return response(
      res,
      200,
      "Passsword Reset Link has been sent to your registered email Successfully!"
    );
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body; // <--- req.body must exist here

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return response(res, 200, "Logout Successfully!");
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const checkUserAuth = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(
        res,
        401,
        "User unauthenticated. Please login to access your account"
      );
    }

    const user = await User.findById(userId).select(
      "-password -resetPasswordToken -verificationToken -resetPasswordExpires"
    );

    if (!user) {
      return response(res, 404, "User not found");
    }

    return response(res, 200, "User retrieved successfully", user);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};
