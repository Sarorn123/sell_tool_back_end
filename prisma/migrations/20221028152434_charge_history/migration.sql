-- CreateTable
CREATE TABLE "chargHistories" (
    "id" SERIAL NOT NULL,
    "amount" VARCHAR(250) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency" VARCHAR(250) NOT NULL,
    "user_id" INTEGER,

    CONSTRAINT "chargHistories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chargHistories_id_key" ON "chargHistories"("id");

-- AddForeignKey
ALTER TABLE "chargHistories" ADD CONSTRAINT "chargHistories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
