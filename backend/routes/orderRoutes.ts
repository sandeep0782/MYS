import { Router } from "express";
import * as OrderController from "../controllers/OrderController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();
router.post("/", authenticatedUser, OrderController.createOrUpdateOrder);
router.get("/user/:userId", authenticatedUser, OrderController.getOrderByUser);
router.get("/:id", authenticatedUser, OrderController.getOrderById);

router.get("/invoice/:id", authenticatedUser, OrderController.generateInvoice);
router.post(
  "/razorpay",
  authenticatedUser,
  OrderController.createPaymentWithRazorpay
);

export default router;
