/**
 * scripts/aggregate.ts  — Phase A
 *
 * Reads data/products.csv using a Node.js Readable stream and computes
 * per-category statistics: count, min/max/avg price, total stock.
 *
 * Usage:  npm run aggregate   (run "npm run generate" first)
 */

import fs from "fs";
import path from "path";
import readline from "readline";

interface CategoryStats {
  count: number;
  totalStock: number;
  price: { sum: number; min: number; max: number };
}

function createStats(): CategoryStats {
  return { count: 0, totalStock: 0, price: { sum: 0, min: Infinity, max: -Infinity } };
}

async function aggregate(filePath: string): Promise<Map<string, CategoryStats>> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}\nRun "npm run generate" first.`));
      return;
    }

    const map = new Map<string, CategoryStats>();
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath, { encoding: "utf-8" }),
      crlfDelay: Infinity,
    });

    let lineNo = 0;

    rl.on("line", (line) => {
      lineNo++;
      if (lineNo === 1) return; // skip header

      const parts = line.split(",");
      if (parts.length < 7) return;

      const category = parts[3]!.trim();
      const price = parseFloat(parts[4]!);
      const stock = parseInt(parts[5]!, 10);

      if (isNaN(price) || isNaN(stock)) return;

      if (!map.has(category)) map.set(category, createStats());
      const s = map.get(category)!;
      s.count++;
      s.totalStock += stock;
      s.price.sum += price;
      if (price < s.price.min) s.price.min = price;
      if (price > s.price.max) s.price.max = price;
    });

    rl.on("close", () => { console.log(`Processed ${lineNo - 1} rows.\n`); resolve(map); });
    rl.on("error", reject);
  });
}

function printReport(map: Map<string, CategoryStats>): void {
  console.log("=== Product Aggregation Report ===\n");
  for (const [cat, s] of [...map.entries()].sort()) {
    const avg = (s.price.sum / s.count).toFixed(2);
    console.log(`Category: ${cat}  (${s.count} products, stock: ${s.totalStock})`);
    console.log(`  Price — min: $${s.price.min.toFixed(2)}  max: $${s.price.max.toFixed(2)}  avg: $${avg}\n`);
  }
}

async function main(): Promise<void> {
  const csvPath = path.join(__dirname, "..", "data", "products.csv");
  console.log(`Aggregating: ${csvPath}\n`);
  try {
    const result = await aggregate(csvPath);
    printReport(result);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();