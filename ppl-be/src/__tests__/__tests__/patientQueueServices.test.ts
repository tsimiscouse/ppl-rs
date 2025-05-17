const mockFindMany = jest.fn();
const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        patientqueue: {
          findMany: mockFindMany,
          create: mockCreate,
          delete: mockDelete,
          findUnique: mockFindUnique
        },
        $disconnect: jest.fn()
      };
    })
  };
});

import { PrismaClient } from '@prisma/client';
import { patientQueueService } from '../../services/patientQueueServices';
import { generateQueueNumber } from '../../utils/generateQueueNumber';

jest.mock('../../utils/generateQueueNumber', () => ({
  generateQueueNumber: jest.fn()
}));

describe('Patient Queue Service', () => {
  let prisma: PrismaClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('getAllPatientQueues', () => {
    it('should return all patient queues with relationships', async () => {
      // Mock data
      const mockQueues = [
        { 
          id: 1, 
          queue_number: 'A001', 
          patient_name: 'John Doe', 
          doctor_id: 1,
          visit_time_id: 1,
          created_at: new Date(),
          doctor: { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
          visittime: { id: 1, time_slot: '09:00 AM' }
        },
        { 
          id: 2, 
          queue_number: 'B001', 
          patient_name: 'Jane Smith', 
          doctor_id: 2,
          visit_time_id: 2,
          created_at: new Date(),
          doctor: { id: 2, name: 'Dr. Bob', specialization: 'Neurology' },
          visittime: { id: 2, time_slot: '10:00 AM' }
        }
      ];
      
      // Setup mock - using the mock functions directly
      mockFindMany.mockResolvedValue(mockQueues);
      
      // Execute
      const result = await patientQueueService.getAllPatientQueues();
      
      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        include: {
          doctor: true,
          visittime: true
        },
        orderBy: {
          created_at: 'asc'
        }
      });
      expect(result).toEqual(mockQueues);
    });
    
    it('should handle empty results', async () => {
      // Setup mock - using the mock functions directly
      mockFindMany.mockResolvedValue([]);
      
      // Execute
      const result = await patientQueueService.getAllPatientQueues();
      
      // Assert
      expect(mockFindMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    it('should propagate errors', async () => {
      // Setup mock - using the mock functions directly
      const errorMessage = 'Database connection failed';
      mockFindMany.mockRejectedValue(new Error(errorMessage));
      
      // Execute and assert
      await expect(patientQueueService.getAllPatientQueues()).rejects.toThrow(errorMessage);
    });
  });
  
  describe('createPatientQueue', () => {
    it('should create a patient queue with generated queue number', async () => {
      // Mock data
      const queueData = {
        patient_name: 'John Doe',
        doctor_id: 1,
        visit_time_id: 1
      };
      
      const mockGeneratedQueueNumber = 'A001';
      
      const mockCreatedQueue = {
        id: 1,
        queue_number: mockGeneratedQueueNumber,
        patient_name: queueData.patient_name,
        doctor_id: queueData.doctor_id,
        visit_time_id: queueData.visit_time_id,
        created_at: new Date(),
        doctor: { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
        visittime: { id: 1, time_slot: '09:00 AM' }
      };
      
      // Setup mocks - using the mock functions directly
      (generateQueueNumber as jest.Mock).mockResolvedValue(mockGeneratedQueueNumber);
      mockCreate.mockResolvedValue(mockCreatedQueue);
      
      // Execute
      const result = await patientQueueService.createPatientQueue(queueData);
      
      // Assert
      expect(generateQueueNumber).toHaveBeenCalledWith(queueData.doctor_id);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          queue_number: mockGeneratedQueueNumber,
          patient_name: queueData.patient_name,
          doctor_id: queueData.doctor_id,
          visit_time_id: queueData.visit_time_id
        },
        include: {
          doctor: true,
          visittime: true
        }
      });
      expect(result).toEqual(mockCreatedQueue);
    });
    
    it('should propagate errors from queue number generation', async () => {
      // Setup
      const queueData = {
        patient_name: 'John Doe',
        doctor_id: 1,
        visit_time_id: 1
      };
      
      const errorMessage = 'Failed to generate queue number';
      (generateQueueNumber as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      // Execute and assert
      await expect(patientQueueService.createPatientQueue(queueData)).rejects.toThrow(errorMessage);
      expect(mockCreate).not.toHaveBeenCalled();
    });
    
    it('should propagate errors from database creation', async () => {
      // Setup
      const queueData = {
        patient_name: 'John Doe',
        doctor_id: 1,
        visit_time_id: 1
      };
      
      const mockGeneratedQueueNumber = 'A001';
      const errorMessage = 'Database error';
      
      (generateQueueNumber as jest.Mock).mockResolvedValue(mockGeneratedQueueNumber);
      mockCreate.mockRejectedValue(new Error(errorMessage));
      
      // Execute and assert
      await expect(patientQueueService.createPatientQueue(queueData)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('deletePatientQueue', () => {
    it('should delete a patient queue by ID', async () => {
      // Mock data
      const queueId = 1;
      const mockDeletedQueue = {
        id: queueId,
        queue_number: 'A001',
        patient_name: 'John Doe',
        doctor_id: 1,
        visit_time_id: 1
      };
      
      // Setup mock - using the mock functions directly
      mockDelete.mockResolvedValue(mockDeletedQueue);
      
      // Execute
      const result = await patientQueueService.deletePatientQueue(queueId);
      
      // Assert
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: queueId }
      });
      expect(result).toEqual(mockDeletedQueue);
    });
    
    it('should throw error when queue not found', async () => {
      // Setup
      const queueId = 999;
      const errorMessage = `Cannot read properties of undefined (reading 'delete')`;
      mockDelete.mockRejectedValue(new Error(errorMessage));
      
      // Execute and assert
      await expect(patientQueueService.deletePatientQueue(queueId)).rejects.toThrow(errorMessage);
    });
  });
  
  describe('getPatientQueueById', () => {
    it('should return a patient queue by ID with relationships', async () => {
      // Mock data
      const queueId = 1;
      const mockQueue = {
        id: queueId,
        queue_number: 'A001',
        patient_name: 'John Doe',
        doctor_id: 1,
        visit_time_id: 1,
        created_at: new Date(),
        doctor: { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
        visittime: { id: 1, time_slot: '09:00 AM' }
      };
      
      // Setup mock - using the mock functions directly
      mockFindUnique.mockResolvedValue(mockQueue);
      
      // Execute
      const result = await patientQueueService.getPatientQueueById(queueId);
      
      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: queueId },
        include: {
          doctor: true,
          visittime: true
        }
      });
      expect(result).toEqual(mockQueue);
    });
    
    it('should return null when queue not found', async () => {
      // Setup
      const queueId = 999;
      mockFindUnique.mockResolvedValue(null);
      
      // Execute
      const result = await patientQueueService.getPatientQueueById(queueId);
      
      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: queueId },
        include: {
          doctor: true,
          visittime: true
        }
      });
      expect(result).toBeNull();
    });
  });
});