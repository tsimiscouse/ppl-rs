import { PrismaClient } from '@prisma/client';
import { PatientQueueData } from '../types';
import { generateQueueNumber } from '../utils/generateQueueNumber'; 

const prisma = new PrismaClient();

export const patientQueueService = {
  // Get all patient queues with doctor and visit time details
  getAllPatientQueues: async () => {
    return await prisma.patientqueue.findMany({
      include: {
        doctor: true,
        visittime: true
      },
      orderBy: {
        created_at: 'asc'
      }
    });
  },

  // Create a new patient queue
  createPatientQueue: async (data: PatientQueueData) => {
    const queue_number = await generateQueueNumber(data.doctor_id);

    return await prisma.patientqueue.create({
      data: {
        queue_number: queue_number,
        patient_name: data.patient_name,
        doctor_id: data.doctor_id,
        visit_time_id: data.visit_time_id
      },
      include: {
        doctor: true,
        visittime: true
      }
    });
  },
  
  // Delete patient queue
  deletePatientQueue: async (id: number) => {
    return await prisma.patientqueue.delete({
      where: { id }
    });
  },

  getPatientQueueById: async (id: number) => {
    return await prisma.patientqueue.findUnique({
      where: { id },
      include: {
        doctor: true,
        visittime: true
      }
    });
  },
};