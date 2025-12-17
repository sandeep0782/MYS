import express from "express";
import { authenticatedUser } from "../middleware/authmidleware";
import * as CategoryController from "../controllers/categoryController";

const router = express.Router();

router.post("/", authenticatedUser, CategoryController.createCategory);

router.get("/", authenticatedUser, CategoryController.getAllCategories);

router.get("/:id", authenticatedUser, CategoryController.getCategoryById);

router.put("/:id", authenticatedUser, CategoryController.updateCategory);

router.delete("/:id", authenticatedUser, CategoryController.deleteCategory);

export default router;
