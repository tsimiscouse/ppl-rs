import express from 'express';
import request from 'supertest';
import router from '../../routes/availableTimeSlotRoutes';
import { availableTimeSlotsController } from '../../controllers/availableTimeSlotController';

jest.mock('../../controllers/availableTimeSlotController');

describe('Available Time Slot Routes Tests', () => {
  // Create a test app with the router
  const app = express();
  app.use('/api/time-slots', router);

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock controller methods
    (availableTimeSlotsController.getAvailableTimeSlots as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        data: [{ id: 1, start_time: '09:00:00' }],
        message: 'Test response'
      });
    });
    
    (availableTimeSlotsController.checkTimeSlotAvailability as jest.Mock).mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        data: { isAvailable: true },
        message: 'Test availability response'
      });
    });
  });

  describe('GET /api/time-slots/available/:doctorId', () => {
    it('should route to getAvailableTimeSlots controller method', async () => {
      // Send a request to the route
      const response = await request(app).get('/api/time-slots/available/1');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(availableTimeSlotsController.getAvailableTimeSlots).toHaveBeenCalled();
      expect(response.body).toEqual({
        success: true,
        data: [{ id: 1, start_time: '09:00:00' }],
        message: 'Test response'
      });
    });

    it('should pass query parameters to controller method', async () => {
      // Send a request with query parameter
      await request(app).get('/api/time-slots/available/1?date=2025-05-17');
      
      // Extract the request object that was passed to the controller method
      const controllerCall = (availableTimeSlotsController.getAvailableTimeSlots as jest.Mock).mock.calls[0][0];
      
      // Assertions
      expect(controllerCall.params.doctorId).toBe('1');
      expect(controllerCall.query.date).toBe('2025-05-17');
    });
  });

  describe('GET /api/time-slots/check/:doctorId/:timeSlotId', () => {
    it('should route to checkTimeSlotAvailability controller method', async () => {
      // Send a request to the route
      const response = await request(app).get('/api/time-slots/check/1/2');
      
      // Assertions
      expect(response.status).toBe(200);
      expect(availableTimeSlotsController.checkTimeSlotAvailability).toHaveBeenCalled();
      expect(response.body).toEqual({
        success: true,
        data: { isAvailable: true },
        message: 'Test availability response'
      });
    });

    it('should pass route parameters and query parameters to controller method', async () => {
      // Send a request with query parameter
      await request(app).get('/api/time-slots/check/1/2?date=2025-05-17');
      
      // Extract the request object that was passed to the controller method
      const controllerCall = (availableTimeSlotsController.checkTimeSlotAvailability as jest.Mock).mock.calls[0][0];
      
      // Assertions
      expect(controllerCall.params.doctorId).toBe('1');
      expect(controllerCall.params.timeSlotId).toBe('2');
      expect(controllerCall.query.date).toBe('2025-05-17');
    });
  });

  describe('Route parameters validation', () => {
    it('should handle non-existent routes', async () => {
      // Send a request to a non-existent route
      const response = await request(app).get('/api/time-slots/invalid-route');
      
      // Assertions
      expect(response.status).toBe(404);
      expect(availableTimeSlotsController.getAvailableTimeSlots).not.toHaveBeenCalled();
      expect(availableTimeSlotsController.checkTimeSlotAvailability).not.toHaveBeenCalled();
    });
  });
});