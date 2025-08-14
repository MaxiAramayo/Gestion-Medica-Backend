/*
  Warnings:

  - You are about to drop the `area_report_type` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[area_id,name]` on the table `report_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `area_id` to the `report_types` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."area_report_type" DROP CONSTRAINT "area_report_type_area_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."area_report_type" DROP CONSTRAINT "area_report_type_report_type_id_fkey";

-- DropIndex
DROP INDEX "public"."report_types_name_key";

-- AlterTable
ALTER TABLE "public"."report_types" ADD COLUMN     "area_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."area_report_type";

-- CreateIndex
CREATE UNIQUE INDEX "report_types_area_id_name_key" ON "public"."report_types"("area_id", "name");

-- AddForeignKey
ALTER TABLE "public"."report_types" ADD CONSTRAINT "report_types_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "public"."medical_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
