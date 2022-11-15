-- DropIndex
DROP INDEX "products_name_price_key";

-- CreateTable
CREATE TABLE "buys" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER,
    "product_id" INTEGER,
    "amount" TEXT NOT NULL,

    CONSTRAINT "buys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buys_id_key" ON "buys"("id");

-- AddForeignKey
ALTER TABLE "buys" ADD CONSTRAINT "buys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buys" ADD CONSTRAINT "buys_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
