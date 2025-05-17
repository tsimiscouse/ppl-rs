import express from 'express';
import { availableTimeSlotsController } from '../controllers/availableTimeSlotController';

const router = express.Router();

/**
 * @route GET /api/time-slots/available/:doctorId
 * @desc Get available time slots for a specific doctor
 * @access Public
 * @query date - Optional date to check availability (defaults to today)
 * @example GET /api/time-slots/available/2?date=2025-05-17
 */
router.get(
  '/available/:doctorId', 
  availableTimeSlotsController.getAvailableTimeSlots
);

/**
 * @route GET /api/time-slots/check/:doctorId/:timeSlotId
 * @desc Check if a specific time slot is available for a doctor
 * @access Public
 * @query date - Optional date to check availability (defaults to today)
 * @example GET /api/time-slots/check/2/3?date=2025-05-17
 */
router.get(
  '/check/:doctorId/:timeSlotId',
  availableTimeSlotsController.checkTimeSlotAvailability
);

export default router;