import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User, { IUSER } from "../models/User";
import { response } from "../utils/responseHandler";

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}

export const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return response(res, 401, "User not authenticated");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayloadWithUserId;

    const user = (await User.findById(decoded.userId)) as IUSER | null;
    if (!user) return response(res, 401, "User not found");

    // Now TypeScript knows _id exists
    req.id = user._id.toString();
    req.user = user;

  
    next();
  } catch (error) {
    console.error(error);
    return response(res, 401, "Invalid or expired token");
  }
};
