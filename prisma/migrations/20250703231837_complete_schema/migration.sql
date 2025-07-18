/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "birth_date" DATE,
    "gender" VARCHAR(10),
    "phone_number" VARCHAR(20),
    "primary_email" VARCHAR(100),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100),
    "postal_code" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_details" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "license_number" VARCHAR(50) NOT NULL,

    CONSTRAINT "doctor_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_specialties" (
    "doctor_id" INTEGER NOT NULL,
    "specialty_id" INTEGER NOT NULL,

    CONSTRAINT "doctor_specialties_pkey" PRIMARY KEY ("doctor_id","specialty_id")
);

-- CreateTable
CREATE TABLE "health_centers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100),

    CONSTRAINT "health_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor_centers" (
    "doctor_id" INTEGER NOT NULL,
    "center_id" INTEGER NOT NULL,

    CONSTRAINT "doctor_centers_pkey" PRIMARY KEY ("doctor_id","center_id")
);

-- CreateTable
CREATE TABLE "social_security_providers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "social_security_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "social_security_provider_id" INTEGER,
    "affiliate_number" VARCHAR(50),
    "blood_group" VARCHAR(5),
    "allergies" TEXT,
    "pre_existing_conditions" TEXT,
    "medications" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "report_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_areas" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "medical_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialty_area" (
    "specialty_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,

    CONSTRAINT "specialty_area_pkey" PRIMARY KEY ("specialty_id","area_id")
);

-- CreateTable
CREATE TABLE "area_report_type" (
    "area_id" INTEGER NOT NULL,
    "report_type_id" INTEGER NOT NULL,

    CONSTRAINT "area_report_type_pkey" PRIMARY KEY ("area_id","report_type_id")
);

-- CreateTable
CREATE TABLE "medical_reports" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "report_type_id" INTEGER NOT NULL,
    "center_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_images" (
    "id" SERIAL NOT NULL,
    "report_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "image_type" VARCHAR(50),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" SERIAL NOT NULL,
    "report_type_id" INTEGER NOT NULL,
    "doctor_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "persons_dni_key" ON "persons"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "users_person_id_key" ON "users"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "specialties_name_key" ON "specialties"("name");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_details_person_id_key" ON "doctor_details"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_details_license_number_key" ON "doctor_details"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "social_security_providers_name_key" ON "social_security_providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patients_person_id_key" ON "patients"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_types_name_key" ON "report_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medical_areas_name_key" ON "medical_areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "report_templates_report_type_id_doctor_id_key" ON "report_templates"("report_type_id", "doctor_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_details" ADD CONSTRAINT "doctor_details_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_centers" ADD CONSTRAINT "doctor_centers_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_centers" ADD CONSTRAINT "doctor_centers_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "health_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_social_security_provider_id_fkey" FOREIGN KEY ("social_security_provider_id") REFERENCES "social_security_providers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialty_area" ADD CONSTRAINT "specialty_area_specialty_id_fkey" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "specialty_area" ADD CONSTRAINT "specialty_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "medical_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_report_type" ADD CONSTRAINT "area_report_type_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "medical_areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_report_type" ADD CONSTRAINT "area_report_type_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "report_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "report_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_reports" ADD CONSTRAINT "medical_reports_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "health_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_images" ADD CONSTRAINT "report_images_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "medical_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "report_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_templates" ADD CONSTRAINT "report_templates_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor_details"("id") ON DELETE SET NULL ON UPDATE CASCADE;
