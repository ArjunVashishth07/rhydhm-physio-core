const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getAvailableSlots,
  getPatientHistoryByPhone
} = require('../controllers/appointmentController');

// POST /api/appointments -> bookAppointment
router.post('/', bookAppointment);

// GET /api/appointments/available-slots -> getAvailableSlots
router.get('/available-slots', getAvailableSlots);

// GET /api/appointments/patient-history/:phone -> getPatientHistoryByPhone
router.get('/patient-history/:phone', getPatientHistoryByPhone);
router.get('/patient-history', getPatientHistoryByPhone);

module.exports = router;
