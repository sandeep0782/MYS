import { Router } from "express";
import * as productController from "../controllers/productController";
import { authenticatedUser } from "../middleware/authmidleware";
import { multerMiddleware } from "../config/cloudinaryConfig";

const router = Router();

// CREATE PRODUCT
router.post(
  "/",
  authenticatedUser,
  multerMiddleware,
  productController.createProduct
);

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

// GET PRODUCT BY ID
// router.get("/:id", authenticatedUser, productController.getProductById);

router.get("/slug/:slug", productController.getProductBySlug); // ✅ new slug route

// DELETE PRODUCT BY PRODUCT ID
router.delete(
  "/seller/:productId",
  authenticatedUser,
  productController.deleteProduct
);

// GET PRODUCTS BY SELLER ID
router.get(
  "/seller/:sellerId",
  authenticatedUser,
  productController.getProductBySellerId
);

export default router;
