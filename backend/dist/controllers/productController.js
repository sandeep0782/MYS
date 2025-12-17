"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySellerId = exports.deleteProduct = exports.getProductBySlug = exports.getAllProducts = exports.createProduct = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const Products_1 = __importDefault(require("../models/Products"));
const cloudinaryConfig_1 = require("../config/cloudinaryConfig");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, shortDescription, sku, slug, price, finalPrice, currency, stock, stockStatus, backorder, sizes, colors, variants, thumbnail, video, category, tags, brand, collections, ratings, reviews, metaTitle, metaDescription, metaKeywords, isFeatured, isActive, isDeleted, material, careInstructions, gender, season, } = req.body;
        // Parse sizes if it is a string
        let parsedSizes = sizes;
        if (sizes && typeof sizes === "string") {
            try {
                parsedSizes = JSON.parse(sizes); // convert string -> array of objects
            }
            catch (err) {
                return (0, responseHandler_1.response)(res, 400, "Invalid sizes format");
            }
        }
        const images = req.files;
        if (!images || images.length === 0) {
            return (0, responseHandler_1.response)(res, 400, "Images are required");
        }
        const uploadPromise = images.map((file) => (0, cloudinaryConfig_1.uploadToCloudinary)(file));
        const uploadImages = yield Promise.all(uploadPromise);
        const imageUrl = uploadImages.map((image) => image.secure_url);
        const newProduct = yield Products_1.default.create({
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
        return (0, responseHandler_1.response)(res, 201, "Product created successfully", newProduct);
    }
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0]; // e.g. 'sku'
            return (0, responseHandler_1.response)(res, 400, `Duplicate value for "${field}": "${error.keyValue[field]}". Please use a unique value.`);
        }
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createProduct = createProduct;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Products_1.default.find()
            .sort({ createdAt: -1 })
            .populate("colors", "name hexCode") // match the schema field
            .populate("seller", "name email")
            .populate("brand", "name");
        return (0, responseHandler_1.response)(res, 200, "Products fetched successfully", products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllProducts = getAllProducts;
const getProductBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params; // get slug from URL
        const product = yield Products_1.default.findOne({ slug })
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
            return (0, responseHandler_1.response)(res, 404, "Product not found for this slug");
        }
        return (0, responseHandler_1.response)(res, 200, "Product fetched by slug successfully", product);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getProductBySlug = getProductBySlug;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Products_1.default.findByIdAndDelete(req.params.productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Products Not Found for this Id");
        }
        return (0, responseHandler_1.response)(res, 200, "Product deleted successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteProduct = deleteProduct;
const getProductBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return (0, responseHandler_1.response)(res, 404, "Seller not found");
        }
        const product = yield Products_1.default.find({ seller: sellerId })
            .sort({ createdAt: -1 })
            .populate("seller name email profilePicture phoneNumber addresses");
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Products not found for this seller");
        }
        return (0, responseHandler_1.response)(res, 200, "Product fetched by id successfully", product);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getProductBySellerId = getProductBySellerId;
