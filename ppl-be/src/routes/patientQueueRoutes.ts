import express from 'express';
import { patientQueueController } from '../controllers/patientQueueController';

const router = express.Router();

/**
 * @route   GET /api/patient-queues
 * @desc    Get all patient queues
 * @access  Public
 */
router.get('/', patientQueueController.getAllPatientQueues);

/**
 * @route   POST /api/patient-queues
 * @desc    Create a new patient queue
 * @access  Public
 */
router.post('/', patientQueueController.createPatientQueue);

/**
 * @route   DELETE /api/patient-queues/:id
 * @desc    Delete patient queue
 * @access  Private
 */
router.delete('/:id', patientQueueController.deletePatientQueue);

export default router;