import { Router } from "express";
import * as AddressController from "../controllers/addressController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();
router.post(
  "/create-or-update",
  authenticatedUser,
  AddressController.createorUpdateAddressById
);
router.get("/", authenticatedUser, AddressController.getAddressByUserId);

export default router;
