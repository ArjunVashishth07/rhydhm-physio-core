const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  updateAppointmentStatus,
  updatePrescription,
  deleteAppointment
} = require('../controllers/adminController');
const { authenticate, requireRole } = require('../middleware/auth');

// Guard all administrative routes behind JWT authentication and role verification
router.use(authenticate, requireRole('doctor', 'admin'));

// GET /api/admin/appointments
router.get('/appointments', getAllAppointments);

// PUT /api/admin/appointments/:id/status
router.put('/appointments/:id/status', updateAppointmentStatus);

// POST /api/admin/appointments/:id/prescription
router.post('/appointments/:id/prescription', updatePrescription);

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;
