import { Router } from "express";
import * as CartController from "../controllers/cartController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();
router.post("/add", authenticatedUser, CartController.addToCart);
router.delete(
  "/remove/:productId",
  authenticatedUser,
  CartController.removeFromCart
);
router.get("/:userId", authenticatedUser, CartController.getCartByUser);

export default router;
