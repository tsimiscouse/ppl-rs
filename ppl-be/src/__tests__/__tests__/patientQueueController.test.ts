const mockFindFirst = jest.fn();

const mockPrismaClient = {
  patientqueue: {
    findFirst: mockFindFirst
  }
};

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});

import { Request, Response } from 'express';
import { patientQueueController } from '../../controllers/patientQueueController';
import { patientQueueService } from '../../services/patientQueueServices';
import { doctorService } from '../../services/doctorServices';
import { PrismaClient } from '@prisma/client';

// Mock services
jest.mock('../../services/patientQueueServices');
jest.mock('../../services/doctorServices');

describe('Patient Queue Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
    mockFindFirst.mockReset();
  });

  describe('getAllPatientQueues', () => {
    it('should return all patient queues with formatted time', async () => {
      // Mock data
      const mockDate = new Date('2023-01-01T10:00:00Z');
      const mockQueues = [
        {
          id: 1,
          patient_name: 'Test Patient',
          doctor_id: 1,
          visit_time_id: 1,
          visittime: {
            id: 1,
            time_slot: mockDate,
            doctor_id: 1
          },
          doctor: {
            id: 1,
            name: 'Dr. Test'
          }
        }
      ];

      // Setup mock implementation
      (patientQueueService.getAllPatientQueues as jest.Mock).mockResolvedValue(mockQueues);

      // Execute controller
      await patientQueueController.getAllPatientQueues(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(patientQueueService.getAllPatientQueues).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            visitTime: expect.objectContaining({
              formatted_time: expect.any(String)
            })
          })
        ]),
        message: 'Patient queues retrieved successfully'
      });
    });

    it('should handle errors when fetching patient queues', async () => {
      // Mock error
      const mockError = new Error('Database error');
      (patientQueueService.getAllPatientQueues as jest.Mock).mockRejectedValue(mockError);

      // Execute controller
      await patientQueueController.getAllPatientQueues(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(patientQueueService.getAllPatientQueues).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to retrieve patient queues'
      });
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('createPatientQueue', () => {
    beforeEach(() => {
      mockRequest = {
        body: {
          patient_name: 'Test Patient',
          doctor_id: 1,
          visit_time_id: 1
        }
      };
    });

    it('should create a patient queue successfully', async () => {
      // Mock data
      const mockDate = new Date('2023-01-01T10:00:00Z');
      const mockDoctor = { id: 1, name: 'Dr. Test' };
      const mockNewQueue = {
        id: 1,
        patient_name: 'Test Patient',
        doctor_id: 1,
        visit_time_id: 1,
        visittime: {
          id: 1,
          time_slot: mockDate,
          doctor_id: 1
        },
        doctor: mockDoctor
      };

      // Mock service responses
      (doctorService.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);
      mockFindFirst.mockResolvedValue(null); // No existing queue
      (patientQueueService.createPatientQueue as jest.Mock).mockResolvedValue(mockNewQueue);

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          doctor_id: 1,
          visit_time_id: 1
        }
      });
      expect(patientQueueService.createPatientQueue).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          visitTime: expect.objectContaining({
            formatted_time: expect.any(String)
          })
        }),
        message: 'Pendaftaran antrian berhasil'
      });
    });

    it('should return 400 when patient name is missing', async () => {
      // Missing patient name
      mockRequest.body = {
        doctor_id: 1,
        visit_time_id: 1
      };

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Nama pasien wajib diisi'
      });
      expect(doctorService.getDoctorById).not.toHaveBeenCalled();
    });

    it('should return 400 when patient name is too long', async () => {
      // Patient name too long
      mockRequest.body = {
        patient_name: 'A'.repeat(51), // 51 characters, exceeds 50 limit
        doctor_id: 1,
        visit_time_id: 1
      };

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Nama pasien tidak boleh lebih dari 50 karakter'
      });
      expect(doctorService.getDoctorById).not.toHaveBeenCalled();
    });

    it('should return 404 when doctor is not found', async () => {
      // Doctor not found
      (doctorService.getDoctorById as jest.Mock).mockResolvedValue(null);

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Dokter tidak ditemukan'
      });
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it('should return 400 when doctor already has a queue at the specified time', async () => {
      // Mock existing queue
      const mockDoctor = { id: 1, name: 'Dr. Test' };
      const mockExistingQueue = {
        id: 1,
        patient_name: 'Existing Patient',
        doctor_id: 1,
        visit_time_id: 1
      };

      // Mock service responses
      (doctorService.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);
      mockFindFirst.mockResolvedValue(mockExistingQueue);

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          doctor_id: 1,
          visit_time_id: 1
        }
      });
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Dokter sudah memiliki antrian pada waktu tersebut'
      });
      expect(patientQueueService.createPatientQueue).not.toHaveBeenCalled();
    });

    it('should handle errors during queue creation', async () => {
      // Mock data
      const mockDoctor = { id: 1, name: 'Dr. Test' };
      const mockError = new Error('Database error');

      // Mock service responses
      (doctorService.getDoctorById as jest.Mock).mockResolvedValue(mockDoctor);
      mockFindFirst.mockResolvedValue(null); // No existing queue
      (patientQueueService.createPatientQueue as jest.Mock).mockRejectedValue(mockError);

      // Execute controller
      await patientQueueController.createPatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(doctorService.getDoctorById).toHaveBeenCalledWith(1);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          doctor_id: 1,
          visit_time_id: 1
        }
      });
      expect(patientQueueService.createPatientQueue).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Gagal mendaftarkan antrian'
      });
    });
  });

  describe('deletePatientQueue', () => {
    beforeEach(() => {
      mockRequest = {
        params: {
          id: '1'
        }
      };
    });

    it('should delete a patient queue successfully', async () => {
      // Mock data
      const mockQueue = {
        id: 1,
        patient_name: 'Test Patient',
        doctor_id: 1,
        visit_time_id: 1
      };

      // Mock service responses
      (patientQueueService.getPatientQueueById as jest.Mock).mockResolvedValue(mockQueue);
      (patientQueueService.deletePatientQueue as jest.Mock).mockResolvedValue(mockQueue);

      // Execute controller
      await patientQueueController.deletePatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(patientQueueService.getPatientQueueById).toHaveBeenCalledWith(1);
      expect(patientQueueService.deletePatientQueue).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockQueue,
        message: 'Antrian berhasil dihapus'
      });
    });

    it('should return 400 when id is invalid', async () => {
      // Invalid ID
      mockRequest.params = {
        id: 'invalid'
      };

      // Execute controller
      await patientQueueController.deletePatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'ID antrian tidak valid'
      });
      expect(patientQueueService.getPatientQueueById).not.toHaveBeenCalled();
    });

    it('should return 404 when patient queue is not found', async () => {
      // Queue not found
      (patientQueueService.getPatientQueueById as jest.Mock).mockResolvedValue(null);

      // Execute controller
      await patientQueueController.deletePatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(patientQueueService.getPatientQueueById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Antrian tidak ditemukan'
      });
      expect(patientQueueService.deletePatientQueue).not.toHaveBeenCalled();
    });

    it('should handle errors during queue deletion', async () => {
      // Mock data
      const mockQueue = {
        id: 1,
        patient_name: 'Test Patient',
        doctor_id: 1,
        visit_time_id: 1
      };
      const mockError = new Error('Database error');

      // Mock service responses
      (patientQueueService.getPatientQueueById as jest.Mock).mockResolvedValue(mockQueue);
      (patientQueueService.deletePatientQueue as jest.Mock).mockRejectedValue(mockError);

      // Execute controller
      await patientQueueController.deletePatientQueue(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(patientQueueService.getPatientQueueById).toHaveBeenCalledWith(1);
      expect(patientQueueService.deletePatientQueue).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Gagal menghapus antrian'
      });
    });
  });
});