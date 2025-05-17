import { Request, Response } from 'express';
import { availableTimeSlotsController } from '../../controllers/availableTimeSlotController';
import { availableTimeSlotsService } from '../../services/availableTimeSlotsService';

jest.mock('../../services/availableTimeSlotsService');

describe('Available Time Slots Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseObject = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse;
      })
    };
  });

  describe('getAvailableTimeSlots', () => {
    it('should return available time slots when given valid doctorId', async () => {
      // Mock data
      const mockTimeSlots = [
        { id: 1, start_time: '09:00:00', end_time: '09:30:00' },
        { id: 2, start_time: '10:00:00', end_time: '10:30:00' }
      ];
      
      // Setup mock request
      mockRequest = {
        params: { doctorId: '1' },
        query: { date: '2025-05-17' }
      };
      
      // Mock service method
      (availableTimeSlotsService.getAvailableTimeSlotsByDoctorId as jest.Mock).mockResolvedValue(mockTimeSlots);
      
      // Call the controller method
      await availableTimeSlotsController.getAvailableTimeSlots(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Assertions
      expect(availableTimeSlotsService.getAvailableTimeSlotsByDoctorId).toHaveBeenCalledWith(1, '2025-05-17');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTimeSlots,
        message: 'Available time slots retrieved successfully'
      });
    });

    it('should handle invalid doctorId parameter', async () => {
      // Setup mock request with invalid doctor ID
      mockRequest = {
        params: { doctorId: 'invalid' },
        query: {}
      };
      
      // Call the controller method
      await availableTimeSlotsController.getAvailableTimeSlots(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Assertions
      expect(availableTimeSlotsService.getAvailableTimeSlotsByDoctorId).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid doctor ID'
      });
    });

    it('should handle service errors', async () => {
      // Setup mock request
      mockRequest = {
        params: { doctorId: '1' },
        query: {}
      };
      
      // Mock service to throw an error
      const mockError = new Error('Database connection failed');
      (availableTimeSlotsService.getAvailableTimeSlotsByDoctorId as jest.Mock).mockRejectedValue(mockError);
      
      // Mock console.error to prevent actual logging during tests
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Call the controller method
      await availableTimeSlotsController.getAvailableTimeSlots(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Restore console.error
      console.error = originalConsoleError;
      
      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to fetch available time slots',
        error: 'Database connection failed'
      });
    });
  });

  describe('checkTimeSlotAvailability', () => {
    it('should return availability status when given valid parameters', async () => {
      // Setup mock request
      mockRequest = {
        params: { doctorId: '1', timeSlotId: '2' },
        query: { date: '2025-05-17' }
      };
      
      // Mock service method
      (availableTimeSlotsService.isTimeSlotAvailable as jest.Mock).mockResolvedValue(true);
      
      // Call the controller method
      await availableTimeSlotsController.checkTimeSlotAvailability(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Assertions
      expect(availableTimeSlotsService.isTimeSlotAvailable).toHaveBeenCalledWith(1, 2, '2025-05-17');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { isAvailable: true },
        message: 'Time slot is available'
      });
    });

    it('should handle invalid doctorId or timeSlotId parameters', async () => {
      // Setup mock request with invalid IDs
      mockRequest = {
        params: { doctorId: 'invalid', timeSlotId: 'abc' },
        query: {}
      };
      
      // Call the controller method
      await availableTimeSlotsController.checkTimeSlotAvailability(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Assertions
      expect(availableTimeSlotsService.isTimeSlotAvailable).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid doctor ID or time slot ID'
      });
    });

    it('should return correct message when time slot is not available', async () => {
      // Setup mock request
      mockRequest = {
        params: { doctorId: '1', timeSlotId: '2' },
        query: {}
      };
      
      // Mock service method
      (availableTimeSlotsService.isTimeSlotAvailable as jest.Mock).mockResolvedValue(false);
      
      // Call the controller method
      await availableTimeSlotsController.checkTimeSlotAvailability(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { isAvailable: false },
        message: 'Time slot is already booked'
      });
    });

    it('should handle service errors', async () => {
      // Setup mock request
      mockRequest = {
        params: { doctorId: '1', timeSlotId: '2' },
        query: {}
      };
      
      // Mock service to throw an error
      const mockError = new Error('Service unavailable');
      (availableTimeSlotsService.isTimeSlotAvailable as jest.Mock).mockRejectedValue(mockError);
      
      // Mock console.error to prevent actual logging during tests
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Call the controller method
      await availableTimeSlotsController.checkTimeSlotAvailability(
        mockRequest as Request, 
        mockResponse as Response
      );
      
      // Restore console.error
      console.error = originalConsoleError;
      
      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Failed to check time slot availability',
        error: 'Service unavailable'
      });
    });
  });
});