const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    primaryIssue: {
      type: String,
      required: true,
      enum: [
        'Cervical & Posture Care',
        'Spine & Chiropractic Care',
        'Paralysis & Neuro Rehab',
        'Sports Rehab & Joint Pain',
        'Osteopathy & Manual Therapy',
        'Advanced Cupping & Needling',
        'Home Physiotherapy'
      ]
    },
    symptoms: [
      {
        type: String
      }
    ],
    appointmentDate: {
      type: String,
      required: true
    },
    timeSlot: {
      type: String,
      required: true,
      enum: [
        '04:00 PM - 04:30 PM',
        '04:30 PM - 05:00 PM',
        '05:00 PM - 05:30 PM',
        '05:30 PM - 06:00 PM',
        '06:00 PM - 06:30 PM',
        '06:30 PM - 07:00 PM',
        '07:00 PM - 07:30 PM',
        '07:30 PM - 08:00 PM'
      ]
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    sessionNotes: {
      exercisesGiven: [
        {
          type: String
        }
      ],
      doctorRemarks: {
        type: String,
        default: ''
      },
      nextFollowUp: {
        type: String,
        default: ''
      }
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
