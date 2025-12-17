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
exports.getCartByUser = exports.removeFromCart = exports.addToCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const CartItems_1 = __importDefault(require("../models/CartItems"));
const CartItems_2 = __importDefault(require("../models/CartItems"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 400, "Product not found");
        }
        // if (product.seller.toString() === userId) {
        //   return response(res, 400, "You cannot add your product to cart");
        // }
        let cart = yield CartItems_2.default.findOne({ user: userId });
        if (!cart) {
            cart = new CartItems_2.default({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity = quantity;
            // existingItem.quantity += quantity;
        }
        else {
            cart.items.push({
                product: new mongoose_1.default.Types.ObjectId(productId),
                quantity: quantity,
            }); // or cast to ICartItem
        }
        yield cart.save();
        const updatedCart = yield CartItems_2.default.findOne({ user: userId }).populate("items.product");
        return (0, responseHandler_1.response)(res, 200, "Item Added to cart successfully", {
            cartId: cart._id,
        }); // ✅ Only send the ID if needed
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please try again later");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        let cart = yield CartItems_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart not found for this user");
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "Item removed from cart successfully");
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please try again later");
    }
});
exports.removeFromCart = removeFromCart;
const getCartByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id; // ✅ from token
        let cart = yield CartItems_1.default.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return (0, responseHandler_1.response)(res, 404, "Cart is empty", { items: [] });
        }
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "User cart get successfully", cart);
    }
    catch (error) {
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please try again later");
    }
});
exports.getCartByUser = getCartByUser;
