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
const { optionalAuth, authenticate, requireRole } = require('../middleware/auth');

// Public / Patient active announcements (with optional JWT identification)
router.get('/patient', optionalAuth, getPatientAnnouncements);

// Administrative Routes: Strictly guarded behind JWT authentication and role authorization
router.post('/', authenticate, requireRole('doctor', 'admin'), createAnnouncement);
router.get('/admin', authenticate, requireRole('doctor', 'admin'), getAllAnnouncements);
router.get('/patients', authenticate, requireRole('doctor', 'admin'), getPatientsList);
router.put('/:id', authenticate, requireRole('doctor', 'admin'), updateAnnouncement);
router.patch('/:id/dismiss', authenticate, requireRole('doctor', 'admin'), dismissAnnouncement);
router.delete('/:id', authenticate, requireRole('doctor', 'admin'), deleteAnnouncement);

module.exports = router;
