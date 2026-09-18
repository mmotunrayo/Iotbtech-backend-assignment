/**
 * src/controllers/product.controller.ts
 *
 * Handles HTTP req/res for the /api/products resource.
 * Delegates all logic to product.service.ts.
 */

import { Request, Response, NextFunction } from "express";
import * as ProductService from "../services/product.service";

// GET /api/products?page=1&limit=20
export function listProducts(req: Request, res: Response, next: NextFunction): void {
  try {
    const page  = Math.max(1, parseInt(req.query["page"]  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query["limit"] as string) || 20));
    res.json(ProductService.getAll(page, limit));
  } catch (err) { next(err); }
}

// GET /api/products/:id
export function getProduct(req: Request, res: Response, next: NextFunction): void {
  try {
    const product = ProductService.getById(req.params["id"]!);
    if (!product) {
      res.status(404).json({ error: "Not Found", message: `Product ${req.params["id"]} not found` });
      return;
    }
    res.json(product);
  } catch (err) { next(err); }
}

// POST /api/products
export function createProduct(req: Request, res: Response, next: NextFunction): void {
  try {
    const { sku, name, category, price, stock } = req.body;
    if (!sku || !name || !category || price === undefined || stock === undefined) {
      res.status(400).json({ error: "Bad Request", message: "sku, name, category, price, and stock are required" });
      return;
    }
    res.status(201).json(ProductService.create({ sku, name, category, price, stock }));
  } catch (err) { next(err); }
}

// PATCH /api/products/:id
export function updateProduct(req: Request, res: Response, next: NextFunction): void {
  try {
    const product = ProductService.update(req.params["id"]!, req.body);
    if (!product) {
      res.status(404).json({ error: "Not Found", message: `Product ${req.params["id"]} not found` });
      return;
    }
    res.json(product);
  } catch (err) { next(err); }
}

// DELETE /api/products/:id
export function deleteProduct(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = ProductService.remove(req.params["id"]!);
    if (!deleted) {
      res.status(404).json({ error: "Not Found", message: `Product ${req.params["id"]} not found` });
      return;
    }
    res.status(204).send();
  } catch (err) { next(err); }
}