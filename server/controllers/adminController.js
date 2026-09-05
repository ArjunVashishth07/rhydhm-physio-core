const Appointment = require('../models/Appointment');

// @desc    Get all appointments for doctor dashboard
// @route   GET /api/admin/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      appointmentDate: -1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error('Error fetching admin appointments:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch appointments'
    });
  }
};

// @desc    Update appointment status (Pending, Confirmed, Completed, Cancelled)
// @route   PUT /api/admin/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment: updated
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update appointment status'
    });
  }
};

// @desc    Add or update digital prescription and doctor session notes
// @route   POST /api/admin/appointments/:id/prescription
exports.updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { exercisesGiven, doctorRemarks, nextFollowUp } = req.body;

    const sessionNotes = {
      exercisesGiven: Array.isArray(exercisesGiven) ? exercisesGiven : [],
      doctorRemarks: doctorRemarks || '',
      nextFollowUp: nextFollowUp || ''
    };

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { sessionNotes },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Prescription saved successfully',
      appointment: updated
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to save prescription'
    });
  }
};

// @desc    Delete appointment record
// @route   DELETE /api/admin/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.status(200).json({ success: true, message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
