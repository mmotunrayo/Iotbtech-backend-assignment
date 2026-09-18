/**
 * src/services/product.service.ts
 *
 * Business logic and in-memory store for the Product resource.
 * No req/res here — fully framework-agnostic.
 */

import { v4 as uuidv4 } from "uuid";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// In-memory store
let store: Product[] = [];

export function getAll(page = 1, limit = 20): PaginatedResult<Product> {
  const total = store.length;
  const start = (page - 1) * limit;
  return {
    data: store.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export function getById(id: string): Product | undefined {
  return store.find((p) => p.id === id);
}

export function create(dto: CreateProductDto): Product {
  const product: Product = {
    id: uuidv4(),
    sku: dto.sku,
    name: dto.name,
    category: dto.category,
    price: dto.price,
    stock: dto.stock,
    createdAt: new Date().toISOString(),
  };
  store.push(product);
  return product;
}

export function update(id: string, dto: Partial<CreateProductDto>): Product | undefined {
  const product = store.find((p) => p.id === id);
  if (!product) return undefined;
  Object.assign(product, dto);
  return product;
}

export function remove(id: string): boolean {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}

export function seed(): void {
  const categories = ["Electronics", "Clothing", "Food", "Tools", "Books"];
  for (let i = 1; i <= 10; i++) {
    create({
      sku: `SKU-${String(i).padStart(4, "0")}`,
      name: `Sample Product ${i}`,
      category: categories[i % categories.length],
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 100),
    });
  }
}