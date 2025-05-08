import { doctor, patientqueue, visittime } from '@prisma/client';

export interface DoctorData {
  id?: number;
  name: string;
  specialization: string;
}

export interface VisitTimeData {
  id?: number;
  time_slot: string;
}

export interface PatientQueueData {
  id?: number;
  patient_name: string;
  doctor_id: number;
  visit_time_id: number;
}

export interface PatientQueueWithRelations extends patientqueue {
  doctor: doctor;
  visitTime: visittime;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DoctorSpecialization {
  specialization: string;
}
