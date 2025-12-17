import { Router } from "express";
import * as brandController from "../controllers/brandController";
import { authenticatedUser } from "../middleware/authmidleware";

const router = Router();

router.post("/", authenticatedUser, brandController.createBrand);

router.get("/", authenticatedUser, brandController.getAllBrands);

router.get("/:id", authenticatedUser, brandController.getBrandById);

router.put("/:id", authenticatedUser, brandController.updateBrand);

router.delete("/:id", authenticatedUser, brandController.deleteBrand);

export default router;
