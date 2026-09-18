/**
 * scripts/generate.ts  — Phase A
 *
 * Generates a CSV file of simulated product inventory records.
 * Output: data/products.csv
 *
 * Usage:  npm run generate
 */

import fs from "fs";
import path from "path";

interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

const CATEGORIES = ["Electronics", "Clothing", "Food", "Tools", "Books"];
const TOTAL = 500;

function randomFloat(min: number, max: number, dp = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad(n: number): string {
  return String(n).padStart(4, "0");
}

function generateProducts(count: number): Product[] {
  const base = new Date();
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    sku: `SKU-${pad(i + 1)}`,
    name: `Product ${pad(i + 1)}`,
    category: CATEGORIES[i % CATEGORIES.length],
    price: randomFloat(1, 999),
    stock: randomInt(0, 500),
    createdAt: new Date(base.getTime() - i * 86_400_000).toISOString(),
  }));
}

function toCsv(products: Product[]): string {
  const header = "id,sku,name,category,price,stock,createdAt";
  const rows = products.map(
    (p) => `${p.id},${p.sku},${p.name},${p.category},${p.price},${p.stock},${p.createdAt}`
  );
  return [header, ...rows].join("\n");
}

function main(): void {
  const outDir = path.join(__dirname, "..", "data");
  const outPath = path.join(outDir, "products.csv");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log(`Generating ${TOTAL} product records...`);
  const products = generateProducts(TOTAL);
  fs.writeFileSync(outPath, toCsv(products), "utf-8");
  console.log(`Done. Written to: ${outPath}`);
}

main();