import express from 'express';
import { doctorController } from '../controllers/doctorController';

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all doctors
 * @access  Public
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @route   GET /api/doctors/specializations
 * @desc    Get all specializations
 * @access  Public
 */
router.get('/specializations', doctorController.getAllSpecializations);

/**
 * @route   GET /api/doctors/specialization/:specialization
 * @desc    Get doctors by specialization
 * @access  Public
 */
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);

export default router;