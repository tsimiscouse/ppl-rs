import { Request, Response } from 'express';
import { doctorController } from '../../controllers/doctorController';
import { doctorService } from '../../services/doctorServices';
import { DoctorSpecialization } from '../../types';

// Mock the doctorService
jest.mock('../../services/doctorServices', () => ({
  doctorService: {
    getAllDoctors: jest.fn(),
    getDoctorsBySpecialization: jest.fn(),
    getAllSpecializations: jest.fn(),
  },
}));

describe('Doctor Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock response with json and status functions
    responseObject = {};
    mockResponse = {
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getAllDoctors', () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Smith', specialization: 'Cardiology' },
      { id: 2, name: 'Dr. Johnson', specialization: 'Neurology' },
    ];

    it('should return all doctors with 200 status code when successful', async () => {
      // Arrange
      (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(mockDoctors);
      mockRequest = {};

      // Act
      await doctorController.getAllDoctors(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getAllDoctors).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockDoctors,
        message: 'Doctors retrieved successfully',
      });
    });

    it('should return error with 500 status code when service fails', async () => {
      // Arrange
      const error = new Error('Database error');
      (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error);
      mockRequest = {};

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await doctorController.getAllDoctors(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getAllDoctors).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error getting doctors:', error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to retrieve doctors',
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('getDoctorsBySpecialization', () => {
    const mockDoctors = [
      { id: 1, name: 'Dr. Smith', specialization: 'Cardiology' },
      { id: 3, name: 'Dr. Williams', specialization: 'Cardiology' },
    ];

    it('should return doctors by specialization with 200 status code when successful', async () => {
      // Arrange
      const specialization = 'Cardiology';
      (doctorService.getDoctorsBySpecialization as jest.Mock).mockResolvedValue(mockDoctors);
      mockRequest = {
        params: { specialization },
      };

      // Act
      await doctorController.getDoctorsBySpecialization(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getDoctorsBySpecialization).toHaveBeenCalledWith(specialization);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockDoctors,
        message: `Doctors with specialization '${specialization}' retrieved successfully`,
      });
    });

    it('should return 400 status code when specialization is missing', async () => {
      // Arrange
      mockRequest = {
        params: {},
      };

      // Act
      await doctorController.getDoctorsBySpecialization(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getDoctorsBySpecialization).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Specialization is required',
      });
    });

    it('should return error with 500 status code when service fails', async () => {
      // Arrange
      const specialization = 'Cardiology';
      const error = new Error('Database error');
      (doctorService.getDoctorsBySpecialization as jest.Mock).mockRejectedValue(error);
      mockRequest = {
        params: { specialization },
      };

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await doctorController.getDoctorsBySpecialization(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getDoctorsBySpecialization).toHaveBeenCalledWith(specialization);
      expect(consoleSpy).toHaveBeenCalledWith('Error getting doctors by specialization:', error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to retrieve doctors by specialization',
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('getAllSpecializations', () => {
    const mockSpecializations: DoctorSpecialization[] = [
      { specialization: 'Jantung' },
      { specialization: 'Mata' },
      { specialization: 'Kulit' },
    ];

    it('should return all specializations with 200 status code when successful', async () => {
      // Arrange
      (doctorService.getAllSpecializations as jest.Mock).mockResolvedValue(mockSpecializations);
      mockRequest = {};

      // Act
      await doctorController.getAllSpecializations(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getAllSpecializations).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockSpecializations,
        message: 'Specializations retrieved successfully',
      });
    });

    it('should return error with 500 status code when service fails', async () => {
      // Arrange
      const error = new Error('Database error');
      (doctorService.getAllSpecializations as jest.Mock).mockRejectedValue(error);
      mockRequest = {};

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      await doctorController.getAllSpecializations(mockRequest as Request, mockResponse as Response, () => {});

      // Assert
      expect(doctorService.getAllSpecializations).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error getting specializations:', error);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to retrieve specializations',
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });
});