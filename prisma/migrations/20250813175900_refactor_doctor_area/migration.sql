/*
  Warnings:

  - You are about to drop the `doctor_specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `specialty_area` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `doctor_area_id` to the `doctor_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialty_id_fkey";

-- DropForeignKey
ALTER TABLE "specialty_area" DROP CONSTRAINT "specialty_area_area_id_fkey";

-- DropForeignKey
ALTER TABLE "specialty_area" DROP CONSTRAINT "specialty_area_specialty_id_fkey";

-- AlterTable
ALTER TABLE "doctor_details" ADD COLUMN     "doctor_area_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "doctor_specialties";

-- DropTable
DROP TABLE "specialties";

-- DropTable
DROP TABLE "specialty_area";

-- AddForeignKey
ALTER TABLE "doctor_details" ADD CONSTRAINT "doctor_details_doctor_area_id_fkey" FOREIGN KEY ("doctor_area_id") REFERENCES "medical_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
