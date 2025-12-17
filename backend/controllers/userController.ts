import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return response(res, 400, "User id is required ");
    }
    const { name, email, phoneNumber } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phoneNumber,
      },  
      { new: true, runValidators: true }
    ).select(
      "-password -resetPasswordToken -verificationToken -resetPasswordExpires"
    );
    if (updateUser) {
      return response(res, 404, "User not found");
    }
    return response(res, 201, "User profile updated successfully", updateUser);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};

export const getAddressByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(res, 400, "User not found");
    }
    const address = await User.findById(userId).populate("addresses");
    if (!address) {
      return response(res, 404, "User address not found");
    }
    return response(res, 201, "User address get sucessfully", address);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
