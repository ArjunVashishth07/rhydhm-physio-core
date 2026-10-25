import React from 'react';
import { Stethoscope, Calendar, CheckCircle2, Award } from 'lucide-react';

export const ExerciseRoutineCard = ({ appointment, theme = 'light' }) => {
  if (!appointment || !appointment.sessionNotes) return null;

  const { exercisesGiven = [], doctorRemarks = '', nextFollowUp = '' } =
    appointment.sessionNotes;

  const isDark = theme === 'dark';

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-start">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3 flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Stethoscope size={20} className="text-teal" />
            <h5 className="fw-bold mb-0">Dr. Neha Sharma (PT) — Prescription</h5>
          </div>
          <small className="text-muted">
            Patient: <strong>{appointment.patientName}</strong> • Condition: <strong>{appointment.primaryIssue}</strong>
          </small>
        </div>
        <div className="text-end">
          <span className="badge bg-body-tertiary text-body border">
            <Calendar size={13} className="me-1" />
            {appointment.appointmentDate}
          </span>
        </div>
      </div>

      {/* Prescribed Exercises List */}
      {exercisesGiven.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-teal mb-2 d-flex align-items-center gap-1.5">
            <CheckCircle2 size={18} />
            Prescribed Exercise Routine:
          </h6>
          <div className="row g-2">
            {exercisesGiven.map((ex, idx) => (
              <div key={idx} className="col-md-6">
                <div
                  className="p-3 rounded-3 d-flex align-items-center gap-2.5 transition-all"
                  style={{
                    backgroundColor: isDark ? '#231e1a' : '#ffffff',
                    border: isDark ? '1px solid #383028' : '1px solid #e8dfd3'
                  }}
                >
                  <span
                    className="badge rounded-circle text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: '26px',
                      height: '26px',
                      backgroundColor: 'var(--teal-primary)'
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className="fw-semibold small"
                    style={{ color: isDark ? '#faf5ee' : '#241e19' }}
                  >
                    {ex}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Remarks */}
      {doctorRemarks && (
        <div
          className="mb-3 p-3 rounded-3"
          style={{
            backgroundColor: isDark ? '#231e1a' : '#f7f4ef',
            border: isDark ? '1px solid #383028' : '1px solid #e8dfd3'
          }}
        >
          <strong
            className="d-block small mb-1"
            style={{ color: isDark ? '#ad9e8f' : '#6e6154' }}
          >
            Doctor Remarks & Advice:
          </strong>
          <p
            className="mb-0 small fw-medium"
            style={{ color: isDark ? '#faf5ee' : '#241e19' }}
          >
            {doctorRemarks}
          </p>
        </div>
      )}

      {/* Next Follow-Up */}
      {nextFollowUp && (
        <div
          className="d-inline-flex align-items-center gap-2 p-2 px-3 rounded-pill fw-semibold small bg-teal-subtle text-teal"
          style={{
            border: '1px solid var(--teal-border)',
            width: 'fit-content'
          }}
        >
          <Award size={16} />
          <span>Next Follow-Up Date: {nextFollowUp}</span>
        </div>
      )}
    </div>
  );
};

export default ExerciseRoutineCard;
