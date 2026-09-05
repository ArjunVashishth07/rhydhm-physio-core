const Appointment = require('../models/Appointment');

const ALL_SLOTS = [
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
  '05:00 PM - 05:30 PM',
  '05:30 PM - 06:00 PM',
  '06:00 PM - 06:30 PM',
  '06:30 PM - 07:00 PM',
  '07:00 PM - 07:30 PM',
  '07:30 PM - 08:00 PM'
];

// @desc    Book a new appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    console.log('Incoming Booking Payload:', req.body);

    const { appointmentDate, timeSlot } = req.body;

    if (appointmentDate && timeSlot) {
      const existingBooking = await Appointment.findOne({
        appointmentDate,
        timeSlot,
        status: { $ne: 'Cancelled' }
      });

      if (existingBooking) {
        return res.status(400).json({
          success: false,
          message: 'The selected time slot is already booked for this date.'
        });
      }
    }

    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: savedAppointment,
      data: savedAppointment
    });
  } catch (error) {
    console.error('Error saving appointment:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to book appointment'
    });
  }
};

// @desc    Get available time slots for a given date
// @route   GET /api/appointments/available-slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date query parameter is required (YYYY-MM-DD)'
      });
    }

    const bookedAppointments = await Appointment.find({
      appointmentDate: date,
      status: { $ne: 'Cancelled' }
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map((app) => app.timeSlot);
    const availableSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));

    return res.status(200).json({
      success: true,
      date,
      totalAvailable: availableSlots.length,
      availableSlots
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch available slots'
    });
  }
};

// @desc    Get patient appointment history and prescribed exercises by phone number
// @route   GET /api/appointments/patient-history/:phone
exports.getPatientHistoryByPhone = async (req, res) => {
  try {
    const phone = req.params.phone || req.query.phone;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const appointments = await Appointment.find({ phone }).sort({
      appointmentDate: -1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch patient history'
    });
  }
};
