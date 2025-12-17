import mongoose from "mongoose";

import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICart, ICartItem } from "../models/CartItems";

import Cart from "../models/CartItems";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    const product = await Products.findById(productId);
    if (!product) {
      return response(res, 400, "Product not found");
    }

    // if (product.seller.toString() === userId) {
    //   return response(res, 400, "You cannot add your product to cart");
    // }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      // existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity: quantity,
      } as any); // or cast to ICartItem
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product"
    );

    return response(res, 200, "Item Added to cart successfully", {
      cartId: cart._id,
    }); // ✅ Only send the ID if needed
  } catch (error) {
    return response(res, 500, "Internal Server Error, Please try again later");
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    let cart = await CartItems.findOne({ user: userId });
    if (!cart) {
      return response(res, 404, "Cart not found for this user");
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    return response(res, 200, "Item removed from cart successfully");
  } catch (error) {
    return response(res, 500, "Internal Server Error, Please try again later");
  }
};

export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id; // ✅ from token
    let cart = await CartItems.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart) {
      return response(res, 404, "Cart is empty", { items: [] });
    }
    await cart.save();
    return response(res, 200, "User cart get successfully", cart);
  } catch (error) {
    return response(res, 500, "Internal Server Error, Please try again later");
  }
};
