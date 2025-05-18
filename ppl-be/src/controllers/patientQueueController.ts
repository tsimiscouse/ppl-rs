import { RequestHandler } from 'express';
import { patientQueueService } from '../services/patientQueueServices';
import { doctorService } from '../services/doctorServices';
import { ApiResponse, PatientQueueData } from '../types';
import { PrismaClient } from '@prisma/client';
import { getFormattedTime } from '../utils/timeFormatter';
const prisma = new PrismaClient();

// Get all patient queues
const getAllPatientQueues: RequestHandler = async (req, res, next) => {
  try {
    const patientQueues = await patientQueueService.getAllPatientQueues();

    const formattedPatientQueues = patientQueues.map((queue: { visittime: { time_slot: string | number | Date } }) => ({
      ...queue,
      visitTime: {
        ...queue.visittime,
        formatted_time: getFormattedTime(queue.visittime.time_slot)

      }
    }));

    const response: ApiResponse<typeof formattedPatientQueues> = {
      success: true,
      data: formattedPatientQueues,
      message: 'Patient queues retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting patient queues:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve patient queues'
    };

    res.status(500).json(response);
    return next(error);
  }
};

// Create a new patient queue
const createPatientQueue: RequestHandler = async (req, res): Promise<void> => {
  try {
    const patientQueueData: PatientQueueData = req.body;

    if (!patientQueueData.patient_name) {
      res.status(400).json({ success: false, error: 'Nama pasien wajib diisi' });
      return;
    }

    if (patientQueueData.patient_name.length > 50) {
      res.status(400).json({ success: false, error: 'Nama pasien tidak boleh lebih dari 50 karakter' });
      return;
    }

    const doctor = await doctorService.getDoctorById(patientQueueData.doctor_id);
    if (!doctor) {
      res.status(404).json({ success: false, error: 'Dokter tidak ditemukan' });
      return;
    }

    const existingQueue = await prisma.patientqueue.findFirst({
      where: {
        doctor_id: patientQueueData.doctor_id,
        visit_time_id: patientQueueData.visit_time_id
      }
    });

    if (existingQueue) {
      res.status(400).json({
        success: false,
        error: 'Dokter sudah memiliki antrian pada waktu tersebut'
      });
      return;
    }

    const newPatientQueue = await patientQueueService.createPatientQueue(patientQueueData);

    // Format response
    const formattedResponse = {
      ...newPatientQueue,
      visitTime: {
        ...newPatientQueue.visittime,
        formatted_time: getFormattedTime(newPatientQueue.visittime.time_slot)
      }
    };

    const response: ApiResponse<typeof formattedResponse> = {
      success: true,
      data: formattedResponse,
      message: 'Pendaftaran antrian berhasil'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating patient queue:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Gagal mendaftarkan antrian'
    };

    res.status(500).json(response);
  }
};


// Delete patient queue
const deletePatientQueue: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ success: false, error: 'ID antrian tidak valid' });
      return;
    }

    const patientQueue = await patientQueueService.getPatientQueueById(id);
    if (!patientQueue) {
      res.status(404).json({ success: false, error: 'Antrian tidak ditemukan' });
      return;
    }

    const deletedPatientQueue = await patientQueueService.deletePatientQueue(id);

    const response: ApiResponse<typeof deletedPatientQueue> = {
      success: true,
      data: deletedPatientQueue,
      message: 'Antrian berhasil dihapus'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error deleting patient queue:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Gagal menghapus antrian'
    };

    res.status(500).json(response);
  }
};

export const patientQueueController = {
  getAllPatientQueues,
  createPatientQueue,
  deletePatientQueue
};
