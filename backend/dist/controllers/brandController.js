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
exports.deleteBrand = exports.updateBrand = exports.getBrandById = exports.getAllBrands = exports.createBrand = void 0;
const Brands_1 = __importDefault(require("../models/Brands"));
const responseHandler_1 = require("../utils/responseHandler");
// Create a new brand
const createBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, logo } = req.body;
        if (!name) {
            return (0, responseHandler_1.response)(res, 400, "Brand name is required");
        }
        const existingBrand = yield Brands_1.default.findOne({ name });
        if (existingBrand) {
            return (0, responseHandler_1.response)(res, 409, "Brand with this name already exists");
        }
        const newBrand = yield Brands_1.default.create({ name, description, logo });
        return (0, responseHandler_1.response)(res, 201, "Brand created successfully", newBrand);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.createBrand = createBrand;
// Get all brands
const getAllBrands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield Brands_1.default.find().sort({ createdAt: -1 });
        return (0, responseHandler_1.response)(res, 200, "Brands fetched successfully", brands);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getAllBrands = getAllBrands;
// Get brand by ID
const getBrandById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield Brands_1.default.findById(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Brand fetched successfully", brand);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getBrandById = getBrandById;
// Update brand
const updateBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, logo } = req.body;
        const brand = yield Brands_1.default.findById(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        if (name)
            brand.name = name;
        if (description)
            brand.description = description;
        if (logo)
            brand.logo = logo;
        const updatedBrand = yield brand.save();
        return (0, responseHandler_1.response)(res, 200, "Brand updated successfully", updatedBrand);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.updateBrand = updateBrand;
// Delete brand
const deleteBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brand = yield Brands_1.default.findByIdAndDelete(req.params.id);
        if (!brand) {
            return (0, responseHandler_1.response)(res, 404, "Brand not found");
        }
        return (0, responseHandler_1.response)(res, 200, "Brand deleted successfully");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.deleteBrand = deleteBrand;
