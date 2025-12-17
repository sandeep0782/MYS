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
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../models/Category"));
const responseHandler_1 = require("../utils/responseHandler");
// Create a new category
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, slug, image } = req.body;
        if (!name) {
            return (0, responseHandler_1.response)(res, 400, "Category name is required");
        }
        // Check if category already exists
        const existingCategory = yield Category_1.default.findOne({ name });
        if (existingCategory) {
            return (0, responseHandler_1.response)(res, 409, "Category with this name already exists");
        }
        // Optional: auto-generate slug if not provided
        const categorySlug = slug
            ? slug
            : name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        const newCategory = yield Category_1.default.create({
            name,
            description,
            slug: categorySlug,
            image,
        });
        return (0, responseHandler_1.response)(res, 201, "Category created successfully", newCategory);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createCategory = createCategory;
// Get all categories
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find().sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Categories fetched successfully", categories);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllCategories = getAllCategories;
// Get category by ID
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findById(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Category fetched successfully", category);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getCategoryById = getCategoryById;
// Update category
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, slug, image } = req.body;
        const category = yield Category_1.default.findById(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        if (name)
            category.name = name;
        if (description)
            category.description = description;
        if (slug)
            category.slug = slug;
        if (image)
            category.image = image;
        const updatedCategory = yield category.save();
        return (0, responseHandler_1.response)(res, 200, "Category updated successfully", updatedCategory);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.updateCategory = updateCategory;
// Delete category
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findByIdAndDelete(req.params.id);
        if (!category) {
            return (0, responseHandler_1.response)(res, 404, "Category not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Category deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteCategory = deleteCategory;
