const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  updateAppointmentStatus,
  updatePrescription,
  deleteAppointment
} = require('../controllers/adminController');

// GET /api/admin/appointments
router.get('/appointments', getAllAppointments);

// PUT /api/admin/appointments/:id/status
router.put('/appointments/:id/status', updateAppointmentStatus);

// POST /api/admin/appointments/:id/prescription
router.post('/appointments/:id/prescription', updatePrescription);

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;
