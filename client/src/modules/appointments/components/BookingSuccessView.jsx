import React from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';

export const BookingSuccessView = ({
  booking,
  lang = 'en',
  title = 'Appointment Booked Successfully!',
  whatsAppButtonText = 'Confirm & Send Details on WhatsApp'
}) => {
  if (!booking) return null;

  // Generate WhatsApp Share Link
  const getWhatsAppLink = (b) => {
    const text =
      `*RHYDHM Physio & Fitness Center - New Appointment*\n\n` +
      `*Patient Name:* ${b.patientName}\n` +
      `*Phone:* ${b.phone}\n` +
      `*Age/Gender:* ${b.age} yrs / ${b.gender}\n` +
      `*Primary Issue:* ${b.primaryIssue}\n` +
      `*Date:* ${b.appointmentDate}\n` +
      `*Time Slot:* ${b.timeSlot}\n` +
      (b.symptoms?.length ? `*Symptoms:* ${b.symptoms.join(', ')}\n` : '');

    return `https://wa.me/919760421410?text=${encodeURIComponent(text)}`;
  };

  const bookingId = booking._id
    ? booking._id.substring(18)
    : 'RHY-' + Date.now().toString().slice(-4);

  return (
    <div className="alert alert-success border-0 shadow-sm p-4 mb-4 rounded-4 text-start">
      <div className="d-flex align-items-center gap-3 mb-2">
        <CheckCircle className="text-success flex-shrink-0" size={32} />
        <div>
          <h5 className="alert-heading fw-bold mb-0">{title}</h5>
          <small className="text-muted">Booking Reference: #{bookingId}</small>
        </div>
      </div>
      <hr />
      <div className="row g-2 mb-3 small">
        <div className="col-sm-6">
          <strong>Patient Name:</strong> {booking.patientName}
        </div>
        <div className="col-sm-6">
          <strong>Phone:</strong> {booking.phone}
        </div>
        <div className="col-sm-6">
          <strong>Date:</strong> {booking.appointmentDate}
        </div>
        <div className="col-sm-6">
          <strong>Time Slot:</strong> {booking.timeSlot}
        </div>
        <div className="col-12">
          <strong>Clinical Condition:</strong> {booking.primaryIssue}
        </div>
        {booking.symptoms?.length > 0 && (
          <div className="col-12">
            <strong>Symptoms:</strong> {booking.symptoms.join(', ')}
          </div>
        )}
      </div>

      <a
        href={getWhatsAppLink(booking)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success rounded-pill w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2.5 shadow-sm"
      >
        <MessageSquare size={20} />
        <span>{whatsAppButtonText}</span>
      </a>
    </div>
  );
};

export default BookingSuccessView;
