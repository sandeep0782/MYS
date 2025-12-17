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
exports.authenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const authenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        if (!token)
            return (0, responseHandler_1.response)(res, 401, "User not authenticated");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = (yield User_1.default.findById(decoded.userId));
        if (!user)
            return (0, responseHandler_1.response)(res, 401, "User not found");
        // Now TypeScript knows _id exists
        req.id = user._id.toString();
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 401, "Invalid or expired token");
    }
});
exports.authenticatedUser = authenticatedUser;
