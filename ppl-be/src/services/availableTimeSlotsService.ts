import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const availableTimeSlotsService = {
  getAvailableTimeSlotsByDoctorId: async (doctorId: number, date?: string) => {
    // Convert string date to Date object or use today's date
    const targetDate = date ? new Date(date) : new Date();
    
    // Set the start and end of the target date
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Get all time slots
    const allTimeSlots = await prisma.visittime.findMany();
    
    // Get booked time slots for the specified doctor on the target date
    const bookedTimeSlots = await prisma.patientqueue.findMany({
      where: {
        doctor_id: doctorId,
        created_at: {
          gte: dayStart,
          lte: dayEnd
        }
      },
      select: {
        visit_time_id: true
      }
    });
    
    // Extract the IDs of booked time slots
    const bookedTimeSlotIds = bookedTimeSlots.map(slot => slot.visit_time_id);
    
    // Filter to get only available time slots
    const availableTimeSlots = allTimeSlots.filter(
      timeSlot => !bookedTimeSlotIds.includes(timeSlot.id)
    );
    
    return availableTimeSlots;
  },

  isTimeSlotAvailable: async (doctorId: number, timeSlotId: number, date?: string) => {
    // Convert string date to Date object or use today's date
    const targetDate = date ? new Date(date) : new Date();
    
    // Set the start and end of the target date
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Check if the time slot is already booked
    const bookedTimeSlot = await prisma.patientqueue.findFirst({
      where: {
        doctor_id: doctorId,
        visit_time_id: timeSlotId,
        created_at: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    });
    
    return !bookedTimeSlot;
  }
};