import React from 'react';
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { AppointmentCard } from '../../appointments';

export const PatientAppointmentsView = ({
  appointments = [],
  loading = false,
  error = '',
  onCancel,
  cancelLoadingId = null,
  onOpenBooking,
  lang = 'en'
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-teal" role="status"></div>
        <p className="mt-2 text-muted small">Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-2 mb-4 rounded-3 text-start">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3 bg-body">
        <Calendar size={48} className="text-teal mb-3 opacity-50 mx-auto" />
        <h5 className="fw-bold mb-2">No Appointments Found</h5>
        <p className="text-muted small max-w-md mx-auto mb-4" style={{ maxWidth: '450px' }}>
          You don't have any booked appointments yet. Book a consultation with Dr. Neha Sharma (PT) for personalized rehabilitation.
        </p>
        {onOpenBooking && (
          <button
            type="button"
            onClick={onOpenBooking}
            className="btn btn-teal text-white rounded-pill px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 mx-auto shadow-sm"
          >
            <Plus size={18} />
            <span>Book Appointment Now</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="row g-3 text-start">
      {appointments.map((app) => (
        <div key={app._id} className="col-md-6">
          <AppointmentCard
            appointment={app}
            onCancel={onCancel}
            isCancelling={cancelLoadingId === app._id}
          />
        </div>
      ))}
    </div>
  );
};

export default PatientAppointmentsView;
