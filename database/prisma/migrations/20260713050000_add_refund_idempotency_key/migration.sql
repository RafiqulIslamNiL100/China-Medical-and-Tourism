-- AlterTable
ALTER TABLE "Refund" ADD COLUMN "idempotencyKey" TEXT;
UPDATE "Refund" SET "idempotencyKey" = "id" WHERE "idempotencyKey" IS NULL;
ALTER TABLE "Refund" ALTER COLUMN "idempotencyKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Refund_idempotencyKey_key" ON "Refund"("idempotencyKey");
