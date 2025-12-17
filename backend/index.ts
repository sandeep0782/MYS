import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookiesParser from "cookie-parser";
import connectDB from "./config/dbconnect";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import addressRoutes from "./routes/addressRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import passport from "./controllers/strategy/googlestrategy";
import brandRoutes from "./routes/brandRoutes";
import colorRoutes from "./routes/colorRoutes";
import categoryRoutes from "./routes/categoryRoutes";

// import "./types/types";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // allow cookies to be sent cross-origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["x-rtb-fingerprint-id"], // <-- add this line
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookiesParser());
app.use(passport.initialize());

connectDB();

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test API working!",
  });
});

// API ENDPOINT
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user/address", addressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
