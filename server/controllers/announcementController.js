const Announcement = require('../models/Announcement');
const User = require('../models/User');

/**
 * Helper to compute announcement status string
 */
const computeStatus = (announcement, now = new Date()) => {
  if (!announcement.isActive) {
    return 'Dismissed';
  }
  const expiry = new Date(announcement.expiryDate);
  const start = new Date(announcement.startDate);

  if (now > expiry) {
    return 'Expired';
  }
  if (now < start) {
    return 'Scheduled';
  }
  return 'Live';
};

// @desc    Create a new announcement
// @route   POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      targetType,
      targetPatientId,
      startDate,
      expiryDate,
      isActive
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement title is required'
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Announcement description is required'
      });
    }

    if (!expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Announcement expiry date is required'
      });
    }

    if (targetType === 'individual' && !targetPatientId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a specific patient for individual targeting'
      });
    }

    const announcement = new Announcement({
      title: title.trim(),
      description: description.trim(),
      type: type || 'regular',
      targetType: targetType || 'all',
      targetPatientId: targetType === 'individual' ? targetPatientId : null,
      startDate: startDate ? new Date(startDate) : new Date(),
      expiryDate: new Date(expiryDate),
      isActive: isActive !== undefined ? isActive : true
    });

    await announcement.save();

    const populated = await Announcement.findById(announcement._id).populate(
      'targetPatientId',
      'fullName email mobile'
    );

    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: {
        ...populated.toObject(),
        status: computeStatus(populated)
      }
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create announcement'
    });
  }
};

// @desc    Get all announcements for admin management
// @route   GET /api/announcements/admin
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('targetPatientId', 'fullName email mobile')
      .sort({ createdAt: -1 });

    const now = new Date();
    const formatted = announcements.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        status: computeStatus(obj, now)
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      announcements: formatted
    });
  } catch (error) {
    console.error('Error fetching admin announcements:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch announcements'
    });
  }
};

// @desc    Update an existing announcement
// @route   PUT /api/announcements/:id
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      type,
      targetType,
      targetPatientId,
      startDate,
      expiryDate,
      isActive
    } = req.body;

    const existing = await Announcement.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    if (title !== undefined) existing.title = title.trim();
    if (description !== undefined) existing.description = description.trim();
    if (type !== undefined) existing.type = type;
    if (targetType !== undefined) {
      existing.targetType = targetType;
      existing.targetPatientId = targetType === 'individual' ? targetPatientId : null;
    } else if (targetPatientId !== undefined) {
      existing.targetPatientId = targetPatientId;
    }
    if (startDate !== undefined) existing.startDate = new Date(startDate);
    if (expiryDate !== undefined) existing.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) existing.isActive = Boolean(isActive);

    await existing.save();

    const populated = await Announcement.findById(existing._id).populate(
      'targetPatientId',
      'fullName email mobile'
    );

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: {
        ...populated.toObject(),
        status: computeStatus(populated)
      }
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update announcement'
    });
  }
};

// @desc    Dismiss an announcement (deactivate isActive: false)
// @route   PATCH /api/announcements/:id/dismiss
exports.dismissAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Announcement.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).populate('targetPatientId', 'fullName email mobile');

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement dismissed successfully',
      announcement: {
        ...updated.toObject(),
        status: 'Dismissed'
      }
    });
  } catch (error) {
    console.error('Error dismissing announcement:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to dismiss announcement'
    });
  }
};

// @desc    Get active announcements for patient portal
// @route   GET /api/announcements/patient
exports.getPatientAnnouncements = async (req, res) => {
  try {
    const now = new Date();
    const patientId = req.user?.userId || req.query.patientId;

    // Build target criteria
    let targetCriteria = { targetType: 'all' };
    if (patientId) {
      targetCriteria = {
        $or: [
          { targetType: 'all' },
          { targetType: 'individual', targetPatientId: patientId }
        ]
      };
    }

    const query = {
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
      ...targetCriteria
    };

    const announcements = await Announcement.find(query)
      .populate('targetPatientId', 'fullName email mobile')
      .sort({
        // Critical announcements first, then advisory, then regular, then newest
        createdAt: -1
      });

    // Custom sort priority: critical (1) > advisory (2) > regular (3)
    const priorityMap = { critical: 1, advisory: 2, regular: 3 };
    announcements.sort((a, b) => {
      const pA = priorityMap[a.type] || 4;
      const pB = priorityMap[b.type] || 4;
      if (pA !== pB) return pA - pB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const formatted = announcements.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        targetPatientName: obj.targetPatientId?.fullName || null
      };
    });

    return res.status(200).json({
      success: true,
      count: formatted.length,
      announcements: formatted
    });
  } catch (error) {
    console.error('Error fetching patient announcements:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patient announcements'
    });
  }
};

// @desc    Get list of registered patients for admin selection dropdown
// @route   GET /api/announcements/patients
exports.getPatientsList = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' })
      .select('_id fullName email mobile role')
      .sort({ fullName: 1 });

    // Fallback if no specific role='patient' found
    const result =
      patients.length > 0
        ? patients
        : await User.find().select('_id fullName email mobile role').sort({ fullName: 1 });

    return res.status(200).json({
      success: true,
      count: result.length,
      patients: result
    });
  } catch (error) {
    console.error('Error fetching patients list:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patients list'
    });
  }
};

// @desc    Delete announcement permanently
// @route   DELETE /api/announcements/:id
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete announcement'
    });
  }
};
