const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  dismissAnnouncement,
  getPatientAnnouncements,
  getPatientsList,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { optionalAuth } = require('../middleware/auth');

// POST /api/announcements -> Create new announcement
router.post('/', createAnnouncement);

// GET /api/announcements/admin -> Fetch all announcements for admin
router.get('/admin', getAllAnnouncements);

// GET /api/announcements/patients -> Fetch registered patients for admin targeting dropdown
router.get('/patients', getPatientsList);

// GET /api/announcements/patient -> Fetch active announcements for the current patient
router.get('/patient', optionalAuth, getPatientAnnouncements);

// PUT /api/announcements/:id -> Update announcement
router.put('/:id', updateAnnouncement);

// PATCH /api/announcements/:id/dismiss -> Early dismissal (isActive: false)
router.patch('/:id/dismiss', dismissAnnouncement);

// DELETE /api/announcements/:id -> Delete announcement
router.delete('/:id', deleteAnnouncement);

module.exports = router;
