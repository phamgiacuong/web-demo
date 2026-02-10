import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(process.cwd(), "thuc-pham.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(raw);

  console.log("📦 Tổng sản phẩm:", products.length);

  for (const p of products) {
    try {
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description ?? "",
          price: new Prisma.Decimal(p.price),
          originPrice: p.originPrice
              ? new Prisma.Decimal(p.originPrice)
              : null,
          category: p.category,
          images: p.images ?? [],
          attributes: p.attributes ?? Prisma.JsonNull,
        },
      });

      console.log("✅ Insert:", p.name);
    } catch (err) {
      console.error("❌ Lỗi insert:", p.name);
      console.error(err.message);
    }
  }
}

main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });