import { PrismaClient } from '@prisma/client';
import { DoctorData, DoctorSpecialization } from '../types';

const prisma = new PrismaClient();

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    return await prisma.doctor.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  },

  // Get doctors by specialization
  getDoctorsBySpecialization: async (specialization: string) => {
    return await prisma.doctor.findMany({
      where: {
        specialization: {
          equals: specialization,
          mode: 'insensitive' // Case insensitive search
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  },

  // Get all unique specializations
  getAllSpecializations: async (): Promise<DoctorSpecialization[]> => {
    const specializations = await prisma.doctor.findMany({
      select: {
        specialization: true
      },
      distinct: ['specialization'],
      orderBy: {
        specialization: 'asc'
      }
    });
    return specializations;
  },

  getDoctorById: async (id: number) => {
    return await prisma.doctor.findUnique({
      where: { id }
    });
  },
};