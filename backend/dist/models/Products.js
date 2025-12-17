"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    shortDescription: { type: String },
    sku: { type: String, unique: true },
    slug: { type: String, unique: true },
    price: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    stock: { type: Number, required: true, default: 1 },
    stockStatus: {
        type: String,
        enum: ["in-stock", "out-of-stock", "preorder"],
        default: "in-stock",
    },
    backorder: { type: Boolean, default: false },
    // sizes: [{ type: String }],
    sizes: [
        {
            size: { type: String, required: true },
            stock: { type: Number, required: true, default: 0 },
        },
    ],
    colors: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Color",
        required: true,
    },
    images: [{ type: String, required: true }],
    video: { type: String },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    tags: [{ type: String }],
    brand: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Brand" },
    collections: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Collection" }],
    ratings: { type: Number, default: 0 },
    reviews: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Review" }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    material: { type: String },
    careInstructions: { type: String },
    gender: { type: String, enum: ["Men", "Women", "Unisex", "Boys", "Girls"] },
    season: { type: String },
    shippingCharges: { type: String, default: "free" },
    seller: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
productSchema.pre("save", function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
    next();
});
const Product = mongoose_1.default.models.Product || mongoose_1.default.model("Product", productSchema);
exports.default = Product;
