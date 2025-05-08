import { RequestHandler } from 'express';
import { doctorService } from '../services/doctorServices';
import { ApiResponse, DoctorSpecialization } from '../types';

const getAllDoctors: RequestHandler = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();

    const response: ApiResponse<typeof doctors> = {
      success: true,
      data: doctors,
      message: 'Doctors retrieved successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting doctors:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve doctors',
    };

    res.status(500).json(response);
  }
};

const getDoctorsBySpecialization: RequestHandler = async (req, res) => {
  try {
    const { specialization } = req.params;

    if (!specialization) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Specialization is required',
      };
      res.status(400).json(response);
      return;
    }

    const doctors = await doctorService.getDoctorsBySpecialization(specialization);

    const response: ApiResponse<typeof doctors> = {
      success: true,
      data: doctors,
      message: `Doctors with specialization '${specialization}' retrieved successfully`,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting doctors by specialization:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve doctors by specialization',
    };

    res.status(500).json(response);
  }
};

const getAllSpecializations: RequestHandler = async (req, res) => {
  try {
    const specializations = await doctorService.getAllSpecializations();

    const response: ApiResponse<DoctorSpecialization[]> = {
      success: true,
      data: specializations,
      message: 'Specializations retrieved successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting specializations:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to retrieve specializations',
    };

    res.status(500).json(response);
  }
};

export const doctorController = {
  getAllDoctors,
  getDoctorsBySpecialization,
  getAllSpecializations,
};
