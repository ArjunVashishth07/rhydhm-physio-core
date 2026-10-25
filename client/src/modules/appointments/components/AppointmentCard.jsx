import React from 'react';
import { Calendar, Clock, MapPin, Home as HomeIcon, XCircle } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export const AppointmentCard = ({
  appointment,
  onCancel,
  isCancelling = false
}) => {
  if (!appointment) return null;

  const isHomeVisit = appointment.primaryIssue === 'Home Physiotherapy';
  const canCancel = appointment.status === 'Pending' || appointment.status === 'Confirmed';

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 card-hover text-start">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-teal-subtle text-teal fw-semibold mb-1">
            {appointment.primaryIssue}
          </span>
          <h5 className="fw-bold mb-0">{appointment.patientName}</h5>
        </div>
        <StatusBadge status={appointment.status || 'Pending'} showIcon />
      </div>

      {/* Details Grid */}
      <div className="row g-2 small text-muted mb-3">
        <div className="col-6">
          <div className="d-flex align-items-center gap-1.5">
            <Calendar size={15} className="text-teal" />
            <span><strong>Date:</strong> {appointment.appointmentDate}</span>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex align-items-center gap-1.5">
            <Clock size={15} className="text-teal" />
            <span><strong>Slot:</strong> {appointment.timeSlot}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex align-items-center gap-1.5">
            {isHomeVisit ? (
              <HomeIcon size={15} className="text-warning" />
            ) : (
              <MapPin size={15} className="text-teal" />
            )}
            <span>
              <strong>Mode:</strong> {isHomeVisit ? 'Home Visit' : 'Clinic Visit'}
            </span>
          </div>
        </div>
        {appointment.symptoms?.length > 0 && (
          <div className="col-12 mt-1">
            <span className="fw-semibold text-body">Symptoms: </span>
            <span>{appointment.symptoms.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Cancel Option for Pending/Confirmed */}
      {canCancel && onCancel && (
        <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center flex-wrap gap-2">
          <small className="text-muted">Need to reschedule or cancel?</small>
          <button
            type="button"
            onClick={() => onCancel(appointment._id, appointment.appointmentDate)}
            disabled={isCancelling}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
          >
            {isCancelling ? (
              <div className="spinner-border spinner-border-sm" role="status"></div>
            ) : (
              <>
                <XCircle size={14} />
                <span>Cancel Booking</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
