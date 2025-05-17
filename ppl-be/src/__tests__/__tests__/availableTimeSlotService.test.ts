const mockVisittimeFindMany = jest.fn();
const mockPatientqueueFindMany = jest.fn();
const mockPatientqueueFindFirst = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      visittime: {
        findMany: mockVisittimeFindMany
      },
      patientqueue: {
        findMany: mockPatientqueueFindMany,
        findFirst: mockPatientqueueFindFirst
      }
    }))
  };
});

import * as service from '../../services/availableTimeSlotsService';
import { PrismaClient } from '@prisma/client';

const prismaInstanceInService = (service as any).prisma;

describe('Available Time Slots Service Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableTimeSlotsByDoctorId', () => {
    it('should return all time slots when no slots are booked', async () => {
      // Mock data
      const mockTimeSlots = [
        { id: 1, start_time: '09:00:00', end_time: '09:30:00' },
        { id: 2, start_time: '10:00:00', end_time: '10:30:00' },
        { id: 3, start_time: '11:00:00', end_time: '11:30:00' }
      ];
      
      const mockBookedSlots: { visit_time_id: number }[] = [];
      
      // Setup mock responses
      mockVisittimeFindMany.mockResolvedValue(mockTimeSlots);
      mockPatientqueueFindMany.mockResolvedValue(mockBookedSlots);
      
      // Call the service method
      const result = await service.availableTimeSlotsService.getAvailableTimeSlotsByDoctorId(1);
      
      // Assertions
      expect(mockVisittimeFindMany).toHaveBeenCalled();
      expect(mockPatientqueueFindMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          doctor_id: 1
        }),
        select: {
          visit_time_id: true
        }
      });
      expect(result).toEqual(mockTimeSlots);
      expect(result.length).toBe(3);
    });

    it('should filter out booked time slots', async () => {
      // Mock data
      const mockTimeSlots = [
        { id: 1, start_time: '09:00:00', end_time: '09:30:00' },
        { id: 2, start_time: '10:00:00', end_time: '10:30:00' },
        { id: 3, start_time: '11:00:00', end_time: '11:30:00' }
      ];
      
      const mockBookedSlots = [
        { visit_time_id: 2 }
      ];
      
      // Setup mock responses
      mockVisittimeFindMany.mockResolvedValue(mockTimeSlots);
      mockPatientqueueFindMany.mockResolvedValue(mockBookedSlots);
      
      // Call the service method
      const result = await service.availableTimeSlotsService.getAvailableTimeSlotsByDoctorId(1);
      
      // Assertions
      expect(result.length).toBe(2);
      expect(result).toEqual([
        { id: 1, start_time: '09:00:00', end_time: '09:30:00' },
        { id: 3, start_time: '11:00:00', end_time: '11:30:00' }
      ]);
    });

    it('should use provided date for filtering booked slots', async () => {
      // Mock date
      const testDate = '2025-05-17';
      const dayStart = new Date(testDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(testDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Mock data
      const mockTimeSlots = [
        { id: 1, start_time: '09:00:00', end_time: '09:30:00' },
        { id: 2, start_time: '10:00:00', end_time: '10:30:00' }
      ];
      
      const mockBookedSlots = [
        { visit_time_id: 1 }
      ];
      
      // Setup mock responses
      mockVisittimeFindMany.mockResolvedValue(mockTimeSlots);
      mockPatientqueueFindMany.mockResolvedValue(mockBookedSlots);
      
      // Call the service method
      const result = await service.availableTimeSlotsService.getAvailableTimeSlotsByDoctorId(1, testDate);
      
      // Assertions
      expect(mockPatientqueueFindMany).toHaveBeenCalledWith({
        where: {
          doctor_id: 1,
          created_at: {
            gte: expect.any(Date),
            lte: expect.any(Date)
          }
        },
        select: {
          visit_time_id: true
        }
      });
      
      // Extract the actual dates from the called arguments
      const callArgs = mockPatientqueueFindMany.mock.calls[0][0].where.created_at;
      
      // Check that dates are correctly set
      expect(callArgs.gte.toISOString().split('T')[0]).toBe(dayStart.toISOString().split('T')[0]);
      expect(callArgs.lte.toISOString().split('T')[0]).toBe(dayEnd.toISOString().split('T')[0]);
      
      expect(result).toEqual([
        { id: 2, start_time: '10:00:00', end_time: '10:30:00' }
      ]);
    });
  });

  describe('isTimeSlotAvailable', () => {
    it('should return true when time slot is available', async () => {
      // Mock that no booking was found
      mockPatientqueueFindFirst.mockResolvedValue(null);
      
      // Call the service method
      const result = await service.availableTimeSlotsService.isTimeSlotAvailable(1, 2);
      
      // Assertions
      expect(mockPatientqueueFindFirst).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when time slot is already booked', async () => {
      // Mock a booking being found
      mockPatientqueueFindFirst.mockResolvedValue({
        id: 123,
        doctor_id: 1,
        visit_time_id: 2,
        created_at: new Date()
      });
      
      // Call the service method
      const result = await service.availableTimeSlotsService.isTimeSlotAvailable(1, 2);
      
      // Assertions
      expect(mockPatientqueueFindFirst).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should use provided date for checking availability', async () => {
      // Mock date
      const testDate = '2025-05-17';
      const dayStart = new Date(testDate);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(testDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Mock no booking found
      mockPatientqueueFindFirst.mockResolvedValue(null);
      
      // Call the service method
      const result = await service.availableTimeSlotsService.isTimeSlotAvailable(1, 2, testDate);
      
      // Assertions
      expect(mockPatientqueueFindFirst).toHaveBeenCalledWith({
        where: {
          doctor_id: 1,
          visit_time_id: 2,
          created_at: {
            gte: expect.any(Date),
            lte: expect.any(Date)
          }
        }
      });
      
      // Extract the actual dates from the called arguments
      const callArgs = mockPatientqueueFindFirst.mock.calls[0][0].where.created_at;
      
      // Check that dates are correctly set
      expect(callArgs.gte.toISOString().split('T')[0]).toBe(dayStart.toISOString().split('T')[0]);
      expect(callArgs.lte.toISOString().split('T')[0]).toBe(dayEnd.toISOString().split('T')[0]);
      
      expect(result).toBe(true);
    });
  });
});