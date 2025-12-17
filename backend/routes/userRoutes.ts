import { Router } from "express";
import * as USerController from "../controllers/userController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();
router.put(
  "/profile/update/:userId",
  authenticatedUser,
  USerController.updateUserProfile
);

export default router;
