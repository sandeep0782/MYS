"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbconnect_1 = __importDefault(require("./config/dbconnect"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const wishlistRoutes_1 = __importDefault(require("./routes/wishlistRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const googlestrategy_1 = __importDefault(require("../backend/controllers/strategy/googlestrategy"));
const brandRoutes_1 = __importDefault(require("./routes/brandRoutes"));
const colorRoutes_1 = __importDefault(require("./routes/colorRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
// import "./types/types";
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, // allow cookies to be sent cross-origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["x-rtb-fingerprint-id"], // <-- add this line
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(googlestrategy_1.default.initialize());
(0, dbconnect_1.default)();
app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Test API working!",
    });
});
// API ENDPOINT
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/cart", cartRoutes_1.default);
app.use("/api/wishlist", wishlistRoutes_1.default);
app.use("/api/user/address", addressRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/order", orderRoutes_1.default);
app.use("/api/brand", brandRoutes_1.default);
app.use("/api/colors", colorRoutes_1.default);
app.use("/api/category", categoryRoutes_1.default);
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
