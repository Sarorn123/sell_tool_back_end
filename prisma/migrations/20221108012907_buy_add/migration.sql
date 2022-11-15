-- DropForeignKey
ALTER TABLE "buys" DROP CONSTRAINT "buys_product_id_fkey";

-- AddForeignKey
ALTER TABLE "buys" ADD CONSTRAINT "buys_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
