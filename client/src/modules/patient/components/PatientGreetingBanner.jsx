import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export const PatientGreetingBanner = ({
  displayName = 'Patient',
  phone = '',
  totalSessions = 0,
  upcomingVisits = 0,
  onBookClick,
  onRefresh,
  loading = false,
  lang = 'en',
  bookAppointmentLabel = 'Book Appointment'
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 p-3.5 sm:p-4 p-md-5 mb-4 text-white position-relative overflow-hidden clinical-banner text-start">
      <div className="row align-items-center">
        {/* Left Column: Greeting, Phone & Actions */}
        <div className="col-md-8">
          <div className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold clinical-banner-badge">
            Patient Portal
          </div>
          <h3 className="fw-bold mb-1 text-white">
            {lang === 'hi' ? 'स्वागत है,' : 'Welcome back,'} {displayName}
          </h3>
          <p className="text-white-50 mb-3 small">
            {phone ? `Mobile: +91 ${phone} • ` : ''}Manage your physiotherapy appointments, exercise routines, and doctor prescriptions.
          </p>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onBookClick}
              className="btn rounded-pill fw-semibold px-3.5 py-1.5 shadow-sm d-inline-flex align-items-center gap-2 clinical-banner-btn"
            >
              <Plus size={17} />
              <span>{bookAppointmentLabel}</span>
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="btn btn-outline-light rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5"
              disabled={loading}
            >
              <RefreshCw size={15} className={loading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Right Column: Quick KPI Glassmorphism Stat Cards */}
        <div className="col-md-4 mt-3 mt-md-0">
          <div className="row g-2">
            <div className="col-6">
              <div
                className="p-3 rounded-3 shadow-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span
                  className="small d-block fw-semibold mb-1"
                  style={{ color: '#ffffff', opacity: 0.95, fontSize: '0.8rem' }}
                >
                  Total Sessions
                </span>
                <h4 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
                  {totalSessions}
                </h4>
              </div>
            </div>
            <div className="col-6">
              <div
                className="p-3 rounded-3 shadow-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                <span
                  className="small d-block fw-semibold mb-1"
                  style={{ color: '#ffffff', opacity: 0.95, fontSize: '0.8rem' }}
                >
                  Upcoming Visits
                </span>
                <h4 className="fw-bold mb-0" style={{ color: '#ffffff' }}>
                  {upcomingVisits}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientGreetingBanner;
