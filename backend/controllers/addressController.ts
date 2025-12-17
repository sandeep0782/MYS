import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Address from "../models/Address";
import User from "../models/User";

export const createorUpdateAddressById = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.id;
    const {
      addressLine1,
      addressLine2,
      phoneNumber,
      city,
      state,
      pin,
      addressId,
    } = req.body;

    if (!userId) {
      return response(res, 400, "User not Found");
    }

    if (!addressLine1 || !phoneNumber || !city || !state || !pin) {
      return response(
        res,
        400,
        "Please enter all values to create a new address"
      );
    }

    if (addressId) {
      const existingAddress = await Address.findById(addressId);

      if (!existingAddress) {
        return response(res, 400, "Address not found");
      }

      existingAddress.addressLine1 = addressLine1;
      existingAddress.addressLine2 = addressLine2;
      existingAddress.phoneNumber = phoneNumber;
      existingAddress.city = city;
      existingAddress.state = state;
      existingAddress.pin = pin;

      await existingAddress.save();

      return response(
        res,
        200,
        "Address updated successfully",
        existingAddress
      );
    } else {
      const newAddress = new Address({
        user: userId,
        addressLine1,
        addressLine2,
        phoneNumber,
        city,
        state,
        pin,
      });
      await newAddress.save();
      await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: newAddress._id } },
        { new: true }
      );

      return response(
        res,
        201,
        "AUSer ddress created successfully",
        newAddress
      );
    }
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
