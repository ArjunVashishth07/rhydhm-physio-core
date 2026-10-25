import React from 'react';
import { Phone, FileText, Trash2, Activity, ShieldAlert } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export const AdminAppointmentTable = ({
  appointments = [],
  loading = false,
  error = '',
  onOpenManageModal,
  onDelete
}) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-start">
      {error && (
        <div className="alert alert-danger m-3 mb-0 d-flex align-items-center gap-2">
          <ShieldAlert size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status"></div>
          <p className="mt-2 text-muted small">Loading appointment records...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Activity size={40} className="mb-2 opacity-50" />
          <p className="mb-0 fw-semibold">No appointments found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-start">
            <thead className="bg-body-secondary text-uppercase small text-muted">
              <tr>
                <th className="ps-4" style={{ minWidth: '200px' }}>PATIENT</th>
                <th style={{ minWidth: '100px' }}>AGE / GENDER</th>
                <th style={{ minWidth: '240px' }}>CONDITION / SPECIALTY</th>
                <th style={{ minWidth: '170px' }}>DATE & TIME SLOT</th>
                <th style={{ minWidth: '120px' }}>STATUS</th>
                <th className="text-end pe-4" style={{ minWidth: '200px' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  {/* Name & Phone */}
                  <td className="ps-4 py-3">
                    <div className="fw-semibold fs-6 text-body">
                      {app.patientName || 'Anonymous Patient'}
                    </div>
                    <div className="text-secondary small d-flex align-items-center gap-1 mt-0.5">
                      <Phone size={13} className="text-teal flex-shrink-0" />
                      <span>{app.phone}</span>
                    </div>
                  </td>

                  {/* Age & Gender */}
                  <td>
                    <span className="fw-semibold text-body">{app.age} yrs</span>
                    <small className="text-secondary d-block">{app.gender}</small>
                  </td>

                  {/* Condition & Symptoms */}
                  <td>
                    <span className="badge bg-teal-subtle text-teal fw-semibold">
                      {app.primaryIssue}
                    </span>
                    {app.symptoms?.length > 0 && (
                      <small
                        className="text-secondary d-block mt-1 text-truncate"
                        style={{ maxWidth: '420px' }}
                        title={app.symptoms.join(', ')}
                      >
                        {app.symptoms.join(', ')}
                      </small>
                    )}
                  </td>

                  {/* Date & Slot */}
                  <td>
                    <div className="fw-semibold text-body">{app.appointmentDate}</div>
                    <small className="text-secondary">{app.timeSlot}</small>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <StatusBadge status={app.status || 'Pending'} showIcon />
                  </td>

                  {/* Action Buttons: Clean Single Line */}
                  <td className="text-end pe-4 text-nowrap" style={{ whiteSpace: 'nowrap' }}>
                    <div className="d-inline-flex align-items-center justify-content-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenManageModal(app)}
                        className="btn btn-teal btn-sm rounded-pill px-3 py-1.5 fw-semibold text-white shadow-xs d-inline-flex align-items-center gap-1.5 text-nowrap"
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <FileText size={15} />
                        <span>Manage / Prescribe</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(app._id, app.patientName || 'this patient')}
                        className="btn btn-outline-danger btn-sm p-1.5 rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        title="Delete Patient Record"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointmentTable;
