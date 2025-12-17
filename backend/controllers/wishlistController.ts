import { Request, Response } from "express";
import Product from "../models/Products";
import { response } from "../utils/responseHandler";
import { Wishlist } from "../models/Wishlist";

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    if (!userId) {
      return response(res, 401, "Unauthorized");
    }
    const { productId, quantity } = req.body;

    if (!productId) {
      return response(res, 400, "Product ID and quantity are required");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return response(res, 404, "Product Not Found");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    return response(res, 200, "Product added to Wishlist", wishlist);
  } catch (error: any) {
    console.error(error);
    return response(res, 500, "Server Error", error.message);
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return response(res, 404, "Cart not found for this user");
    }
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();
    return response(res, 200, "Product Removed from Wishlist");
  } catch (error: any) {
    console.error(error);
    return response(res, 500, "Server Error", error.message);
  }
};

export const getWishlistByUser = async (req: Request, res: Response) => {
  try {
    const userId = req?.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products"
    );

    if (!wishlist) {
      return response(res, 404, "wishlist is empty", { products: [] });
    }

    return response(res, 200, "wishlist fetched successfully", wishlist);
  } catch (error: any) {
    console.error(error);
    return response(res, 500, "Server Error", error.message);
  }
};
