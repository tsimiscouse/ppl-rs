-- CreateTable
CREATE TABLE "doctor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "specialization" VARCHAR(100) NOT NULL,

    CONSTRAINT "doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patientqueue" (
    "id" SERIAL NOT NULL,
    "queue_number" VARCHAR(10) NOT NULL,
    "patient_name" VARCHAR(50) NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "visit_time_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patientqueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visittime" (
    "id" SERIAL NOT NULL,
    "time_slot" TIME(6) NOT NULL,

    CONSTRAINT "visittime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patientqueue" ADD CONSTRAINT "patientqueue_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patientqueue" ADD CONSTRAINT "patientqueue_visit_time_id_fkey" FOREIGN KEY ("visit_time_id") REFERENCES "visittime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
