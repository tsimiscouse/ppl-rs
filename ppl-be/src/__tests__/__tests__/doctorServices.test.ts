// Mock the Prisma client module
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        doctor: {
          findMany: mockFindMany,
          findUnique: mockFindUnique
        },
        $disconnect: jest.fn()
      };
    })
  };
});

import { PrismaClient } from '@prisma/client';
import { doctorService } from '../../services/doctorServices';
import { DoctorSpecialization } from '../../types';

describe('Doctor Service', () => {
  let prisma: PrismaClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });
  
  afterEach(() => {
    jest.resetAllMocks();
  });
  
  describe('getAllDoctors', () => {
    it('should return all doctors ordered by name', async () => {
      // Mock data
      const mockDoctors = [
        { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
        { id: 2, name: 'Dr. Bob', specialization: 'Neurology' }
      ];
      
      // Setup mock
      mockFindMany.mockResolvedValue(mockDoctors);
      
      // Execute
      const result = await doctorService.getAllDoctors();
      
      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' }
      });
      expect(result).toEqual(mockDoctors);
    });
    
    it('should handle empty results', async () => {
      // Setup mock
      mockFindMany.mockResolvedValue([]);
      
      // Execute
      const result = await doctorService.getAllDoctors();
      
      // Assert
      expect(mockFindMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    it('should propagate errors', async () => {
      // Setup mock
      const errorMessage = 'Database connection failed';
      mockFindMany.mockRejectedValue(new Error(errorMessage));
      
      // Execute and assert
      await expect(doctorService.getAllDoctors()).rejects.toThrow(errorMessage);
    });
  });
  
  describe('getDoctorsBySpecialization', () => {
    it('should return doctors filtered by specialization', async () => {
      // Mock data
      const specialization = 'Cardiology';
      const mockDoctors = [
        { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' },
        { id: 3, name: 'Dr. Charlie', specialization: 'Cardiology' }
      ];
      
      // Setup mock
      mockFindMany.mockResolvedValue(mockDoctors);
      
      // Execute
      const result = await doctorService.getDoctorsBySpecialization(specialization);
      
      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          specialization: {
            equals: specialization,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      });
      expect(result).toEqual(mockDoctors);
    });
    
    it('should handle case insensitive search', async () => {
      // Setup
      const specialization = 'cardiology';
      const mockDoctors = [
        { id: 1, name: 'Dr. Alice', specialization: 'Cardiology' }
      ];
      
      // Setup mock
      mockFindMany.mockResolvedValue(mockDoctors);
      
      // Execute
      const result = await doctorService.getDoctorsBySpecialization(specialization);
      
      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          specialization: {
            equals: specialization,
            mode: 'insensitive'
          }
        },
        orderBy: { name: 'asc' }
      });
      expect(result).toEqual(mockDoctors);
    });
    
    it('should return empty array when no doctors found', async () => {
      // Setup
      mockFindMany.mockResolvedValue([]);
      
      // Execute
      const result = await doctorService.getDoctorsBySpecialization('Dentistry');
      
      // Assert
      expect(result).toEqual([]);
    });
  });
  
  describe('getAllSpecializations', () => {
    it('should return all unique specializations', async () => {
      // Mock data
      const mockSpecializations: DoctorSpecialization[] = [
        { specialization: 'Cardiology' },
        { specialization: 'Neurology' },
        { specialization: 'Pediatrics' }
      ];
      
      // Setup mock
      mockFindMany.mockResolvedValue(mockSpecializations);
      
      // Execute
      const result = await doctorService.getAllSpecializations();
      
      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        select: { specialization: true },
        distinct: ['specialization'],
        orderBy: { specialization: 'asc' }
      });
      expect(result).toEqual(mockSpecializations);
    });
    
    it('should return empty array when no specializations found', async () => {
      // Setup
      mockFindMany.mockResolvedValue([]);
      
      // Execute
      const result = await doctorService.getAllSpecializations();
      
      // Assert
      expect(result).toEqual([]);
    });
  });
  
  describe('getDoctorById', () => {
    it('should return a doctor by ID', async () => {
      // Mock data
      const doctorId = 1;
      const mockDoctor = { 
        id: doctorId, 
        name: 'Dr. Alice', 
        specialization: 'Cardiology' 
      };
      
      // Setup mock
      mockFindUnique.mockResolvedValue(mockDoctor);
      
      // Execute
      const result = await doctorService.getDoctorById(doctorId);
      
      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: doctorId }
      });
      expect(result).toEqual(mockDoctor);
    });
    
    it('should return null when doctor not found', async () => {
      // Setup
      const doctorId = 999;
      mockFindUnique.mockResolvedValue(null);
      
      // Execute
      const result = await doctorService.getDoctorById(doctorId);
      
      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: doctorId }
      });
      expect(result).toBeNull();
    });
  });
});