import express from "express";
import { authenticatedUser } from "../middleware/authmidleware";
import * as ColorController from "../controllers/ColorController";

const router = express.Router();

// Routes
router.get("/", authenticatedUser, ColorController.getColors);
router.get("/:id", authenticatedUser, ColorController.getColorById);
router.post("/", authenticatedUser, ColorController.createColor);
router.put("/:id", authenticatedUser, ColorController.updateColor);
router.delete("/:id", authenticatedUser, ColorController.deleteColor);

export default router;
