export const mockFindUnique = jest.fn();
export const mockCount = jest.fn();

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        doctor: {
          findUnique: mockFindUnique
        },
        patientqueue: {
          count: mockCount
        },
        $disconnect: jest.fn()
      };
    })
  };
});

import { generateQueueNumber } from '../../../src/utils/generateQueueNumber';
import { PrismaClient } from '@prisma/client';

describe('generateQueueNumber', () => {
  let prisma: any;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Get reference to the mocked functions
    prisma = new PrismaClient();
    prisma.doctor.findUnique = mockFindUnique;
    prisma.patientqueue.count = mockCount;
  });
  
  it('should generate a queue number with correct format', async () => {
    // Arrange
    const doctorId = 123;
    const specialization = 'Reproduksi';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(5); // 5 existing queues today
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('RE006');
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: doctorId },
      select: { specialization: true }
    });
    
    // Verify count was called with today's date range
    expect(mockCount).toHaveBeenCalledTimes(1);
    const countArgs = mockCount.mock.calls[0][0];
    expect(countArgs.where.doctor_id).toBe(doctorId);
    
    // Check date range passed to count (just verify it has gte and lte properties)
    expect(countArgs.where.created_at).toHaveProperty('gte');
    expect(countArgs.where.created_at).toHaveProperty('lte');
  });
  
  it('should handle first patient of the day', async () => {
    // Arrange
    const doctorId = 456;
    const specialization = 'Umum';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(0); // No existing queues today
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('UM001');
  });
  
  it('should handle double-digit queue numbers correctly', async () => {
    // Arrange
    const doctorId = 789;
    const specialization = 'Saraf';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(98); // 98 existing queues today
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('SA099');
  });
  
  it('should handle triple-digit queue numbers correctly', async () => {
    // Arrange
    const doctorId = 4;
    const specialization = 'Penyakit Dalam';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(999); // 999 existing queues today
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('PE1000'); // PE from Penyakit Dalam + 1000 (999+1 padded to 4 digits)
  });
  
  it('should throw error when doctor not found', async () => {
    // Arrange
    const doctorId = 999;
    mockFindUnique.mockResolvedValue(null);
    
    // Act & Assert
    await expect(generateQueueNumber(doctorId)).rejects.toThrow('Dokter tidak ditemukan atau tidak memiliki spesialisasi');
  });
  
  it('should throw error when doctor has no specialization', async () => {
    // Arrange
    const doctorId = 222;
    mockFindUnique.mockResolvedValue({ specialization: null });
    
    // Act & Assert
    await expect(generateQueueNumber(doctorId)).rejects.toThrow('Dokter tidak ditemukan atau tidak memiliki spesialisasi');
  });
  
  it('should take first two letters of specialization for prefix', async () => {
    // Arrange
    const doctorId = 1;
    const specialization = 'Gigi';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(7);
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('GI008');
  });
  
  it('should convert specialization prefix to uppercase', async () => {
    // Arrange
    const doctorId = 1;
    const specialization = 'Jantung';
    
    mockFindUnique.mockResolvedValue({ specialization });
    mockCount.mockResolvedValue(12);
    
    // Act
    const result = await generateQueueNumber(doctorId);
    
    // Assert
    expect(result).toBe('JA013');
  });
});