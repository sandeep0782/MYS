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
exports.checkUserAuth = exports.logout = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const responseHandler_1 = require("../utils/responseHandler");
const crypto_1 = __importDefault(require("crypto"));
const EmailConfig_1 = require("../config/EmailConfig");
const generateToken_1 = require("../utils/generateToken");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, agreeTerms } = req.body;
        if (!name || !email || !password) {
            return (0, responseHandler_1.response)(res, 400, "All fields are required");
        }
        if (!agreeTerms) {
            return (0, responseHandler_1.response)(res, 400, "You must agree to the terms & conditions");
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            return (0, responseHandler_1.response)(res, 409, "User already exists");
        }
        const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const user = new User_1.default({
            name,
            email,
            password,
            agreeTerms,
            verificationToken,
        });
        yield user.save();
        (0, EmailConfig_1.sendVerificationToEmail)(user.email, verificationToken);
        return (0, responseHandler_1.response)(res, 201, "User registered successfully. Please verify your email.");
    }
    catch (error) {
        console.log(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error, Please try again later");
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const user = yield User_1.default.findOne({ verificationToken: token });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "Invalid or expired verification token");
        }
        user.isVerified = true;
        user.verificationToken = null;
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });
        yield user.save();
        return (0, responseHandler_1.response)(res, 200, "Email verified successfully!");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            return (0, responseHandler_1.response)(res, 400, "Invalid email or password");
        }
        if (!user.isVerified) {
            return (0, responseHandler_1.response)(res, 400, "Please verify your email before logging in");
        }
        const accessToken = (0, generateToken_1.generateToken)(user);
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        return (0, responseHandler_1.response)(res, 200, "Logged in Successfully!", {
            user: { name: user.name, email: user.email },
        });
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return (0, responseHandler_1.response)(res, 400, "No Account found with this email Id");
        }
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, EmailConfig_1.sendResetPasswordLinktoEmail)(user.email, resetPasswordToken, user.name);
        return (0, responseHandler_1.response)(res, 200, "Passsword Reset Link has been sent to your registered email Successfully!");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body; // <--- req.body must exist here
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const user = yield User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        yield user.save();
        return res.status(200).json({ message: "Password reset successfully!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return (0, responseHandler_1.response)(res, 200, "Logout Successfully!");
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.logout = logout;
const checkUserAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        if (!userId) {
            return (0, responseHandler_1.response)(res, 401, "User unauthenticated. Please login to access your account");
        }
        const user = yield User_1.default.findById(userId).select("-password -resetPasswordToken -verificationToken -resetPasswordExpires");
        if (!user) {
            return (0, responseHandler_1.response)(res, 404, "User not found");
        }
        return (0, responseHandler_1.response)(res, 200, "User retrieved successfully", user);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.checkUserAuth = checkUserAuth;
