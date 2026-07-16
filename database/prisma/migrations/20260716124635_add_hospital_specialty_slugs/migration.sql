-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "specialtySlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
