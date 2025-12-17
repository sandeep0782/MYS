import { Router } from "express";
import * as WishlistController from "../controllers/wishlistController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();
router.post("/add", authenticatedUser, WishlistController.addToWishlist);
router.delete(
  "/remove/:productId",
  authenticatedUser,
  WishlistController.removeFromWishlist
);
router.get("/:userId", authenticatedUser, WishlistController.getWishlistByUser);

export default router;
