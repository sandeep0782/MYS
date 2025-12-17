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
exports.deleteColor = exports.updateColor = exports.createColor = exports.getColorById = exports.getColors = void 0;
const Color_1 = __importDefault(require("../models/Color"));
// Get all colors
const getColors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const colors = yield Color_1.default.find();
        res.status(200).json({ success: true, data: colors });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch colors", error });
    }
});
exports.getColors = getColors;
// Get a single color by ID
const getColorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield Color_1.default.findById(req.params.id);
        if (!color)
            return res
                .status(404)
                .json({ success: false, message: "Color not found" });
        res.status(200).json({ success: true, data: color });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch color", error });
    }
});
exports.getColorById = getColorById;
// Create a new color
const createColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hexCode } = req.body;
        const color = new Color_1.default({ name, hexCode });
        yield color.save();
        res.status(201).json({ success: true, data: color });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to create color", error });
    }
});
exports.createColor = createColor;
// Update a color
const updateColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, hexCode } = req.body;
        const color = yield Color_1.default.findByIdAndUpdate(req.params.id, { name, hexCode }, { new: true });
        if (!color)
            return res
                .status(404)
                .json({ success: false, message: "Color not found" });
        res.status(200).json({ success: true, data: color });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to update color", error });
    }
});
exports.updateColor = updateColor;
// Delete a color
const deleteColor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const color = yield Color_1.default.findByIdAndDelete(req.params.id);
        if (!color)
            return res
                .status(404)
                .json({ success: false, message: "Color not found" });
        res
            .status(200)
            .json({ success: true, message: "Color deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Failed to delete color", error });
    }
});
exports.deleteColor = deleteColor;
