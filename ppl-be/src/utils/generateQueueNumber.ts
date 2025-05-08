import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateQueueNumber = async (doctorId: number): Promise<string> => {
  // Get doctor's specialization prefix
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { specialization: true }
  });

  if (!doctor || !doctor.specialization) {
    throw new Error('Dokter tidak ditemukan atau tidak memiliki spesialisasi');
  }

  const specInitial = doctor.specialization.slice(0, 2).toUpperCase();

  // Count today's patient queues for this doctor
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const queueCountToday = await prisma.patientqueue.count({
    where: {
      doctor_id: doctorId,
      created_at: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  const queueNumber = specInitial + String(queueCountToday + 1).padStart(3, '0');
  return queueNumber;
};
