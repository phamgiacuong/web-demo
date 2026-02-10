-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "selectedAttributes" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributes" JSONB;
