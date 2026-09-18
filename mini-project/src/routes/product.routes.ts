/**
 * src/routes/product.routes.ts
 *
 * Defines all routes for the /api/products resource.
 * Write operations (POST, PATCH, DELETE) require x-api-key.
 */

import { Router } from "express";
import { requireApiKey } from "../middleware/requireApiKey";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/",      listProducts);
router.get("/:id",   getProduct);
router.post("/",     requireApiKey, createProduct);
router.patch("/:id", requireApiKey, updateProduct);
router.delete("/:id",requireApiKey, deleteProduct);

export default router;