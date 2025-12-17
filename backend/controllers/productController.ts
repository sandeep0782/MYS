import { Request, Response } from "express";
import { response } from "../utils/responseHandler";
import Products from "../models/Products";
import { uploadToCloudinary } from "../config/cloudinaryConfig";
import { model } from "mongoose";
import Address from "../models/Address";
import Brand from "../models/Brands";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      shortDescription,
      sku,
      slug,
      price,
      finalPrice,
      currency,
      stock,
      stockStatus,
      backorder,
      sizes,
      colors,
      variants,
      thumbnail,
      video,
      category,
      tags,
      brand,
      collections,
      ratings,
      reviews,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      isActive,
      isDeleted,
      material,
      careInstructions,
      gender,
      season,
    } = req.body;

    // Parse sizes if it is a string
    let parsedSizes = sizes;
    if (sizes && typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes); // convert string -> array of objects
      } catch (err) {
        return response(res, 400, "Invalid sizes format");
      }
    }

    const images = req.files as Express.Multer.File[];
    if (!images || images.length === 0) {
      return response(res, 400, "Images are required");
    }

    const uploadPromise = images.map((file) => uploadToCloudinary(file as any));
    const uploadImages = await Promise.all(uploadPromise);
    const imageUrl = uploadImages.map((image) => image.secure_url);

    const newProduct = await Products.create({
      name,
      description,
      shortDescription,
      sku,
      slug,
      price,
      finalPrice,
      currency,
      stock,
      stockStatus,
      backorder,
      sizes: parsedSizes, // <-- use parsed sizes here
      colors,
      variants,
      thumbnail,
      video,
      category,
      tags,
      brand,
      collections,
      ratings,
      reviews,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      isActive,
      isDeleted,
      material,
      careInstructions,
      gender,
      season,
      // seller: sellerId,
      images: imageUrl,
    });

    return response(res, 201, "Product created successfully", newProduct);
  } catch (error: any) {
    console.error(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // e.g. 'sku'
      return response(
        res,
        400,
        `Duplicate value for "${field}": "${error.keyValue[field]}". Please use a unique value.`
      );
    }

    return response(res, 500, "Internal Server Error");
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .populate("colors", "name hexCode") // match the schema field
      .populate("seller", "name email")
      .populate("brand", "name");

    return response(res, 200, "Products fetched successfully", products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return response(res, 500, "Internal Server Error");
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params; // get slug from URL

    const product = await Products.findOne({ slug })
      .populate({
        path: "seller",
        select: "name email profilePicture phoneNumber addresses",
        populate: { path: "addresses", model: "Address" },
      })
      .populate({
        path: "brand",
        select: "name",
      })
      .populate({
        path: "category",
        select: "name",
      });

    if (!product) {
      return response(res, 404, "Product not found for this slug");
    }

    return response(res, 200, "Product fetched by slug successfully", product);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Products.findByIdAndDelete(req.params.productId);
    if (!product) {
      return response(res, 404, "Products Not Found for this Id");
    }
    return response(res, 200, "Product deleted successfully");
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
export const getProductBySellerId = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    if (!sellerId) {
      return response(res, 404, "Seller not found");
    }
    const product = await Products.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate("seller name email profilePicture phoneNumber addresses");
    if (!product) {
      return response(res, 404, "Products not found for this seller");
    }
    return response(res, 200, "Product fetched by id successfully", product);
  } catch (error) {
    return response(res, 500, "Internal Server Error");
  }
};
