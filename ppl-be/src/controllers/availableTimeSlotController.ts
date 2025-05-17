import { Request, Response } from 'express';
import { availableTimeSlotsService } from '../services/availableTimeSlotsService';

export const availableTimeSlotsController = {
  getAvailableTimeSlots: async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const date = req.query.date as string | undefined;
      
      if (isNaN(doctorId)) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid doctor ID' 
        });
        return;
      }
      
      const availableTimeSlots = await availableTimeSlotsService.getAvailableTimeSlotsByDoctorId(doctorId, date);
      
      res.status(200).json({
        success: true,
        data: availableTimeSlots,
        message: 'Available time slots retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available time slots',
        error: (error as Error).message
      });
    }
  },
  
  checkTimeSlotAvailability: async (req: Request, res: Response): Promise<void> => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const timeSlotId = parseInt(req.params.timeSlotId);
      const date = req.query.date as string | undefined;
      
      if (isNaN(doctorId) || isNaN(timeSlotId)) {
        res.status(400).json({ 
          success: false, 
          message: 'Invalid doctor ID or time slot ID' 
        });
        return;
      }
      
      const isAvailable = await availableTimeSlotsService.isTimeSlotAvailable(doctorId, timeSlotId, date);
      
      res.status(200).json({
        success: true,
        data: { isAvailable },
        message: isAvailable 
          ? 'Time slot is available' 
          : 'Time slot is already booked'
      });
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check time slot availability',
        error: (error as Error).message
      });
    }
  }
};