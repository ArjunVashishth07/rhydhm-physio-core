import React from 'react';
import {
  Megaphone,
  Plus,
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  Globe,
  Edit,
  EyeOff,
  Trash2,
  ShieldAlert
} from 'lucide-react';

export const AnnouncementTable = ({
  announcements = [],
  loading = false,
  error = '',
  searchTerm = '',
  activeFilter = 'All',
  onOpenCreate,
  onOpenEdit,
  onDismiss,
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
          <p className="mt-2 text-muted small">Loading announcement records...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Megaphone size={40} className="mb-2 opacity-50 text-teal" />
          <h5 className="fw-bold mb-1">No announcements found</h5>
          <p className="mb-3 small">
            {searchTerm || activeFilter !== 'All'
              ? 'Try adjusting your search query or filter pills.'
              : 'Broadcast your first clinical notice or advisory to patients.'}
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="btn btn-teal text-white rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
          >
            <Plus size={18} />
            <span>Create Announcement</span>
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-start">
            <thead className="bg-body-secondary text-uppercase small text-muted">
              <tr>
                <th className="ps-4" style={{ minWidth: '260px' }}>TITLE & DETAILS</th>
                <th style={{ minWidth: '120px' }}>TYPE</th>
                <th style={{ minWidth: '170px' }}>TARGET AUDIENCE</th>
                <th style={{ minWidth: '160px' }}>EXPIRY & VALIDITY</th>
                <th style={{ minWidth: '110px' }}>STATUS</th>
                <th className="text-end pe-4" style={{ minWidth: '180px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((item) => {
                const isLive = item.status === 'Live';
                const isDismissed = item.status === 'Dismissed';
                const isExpired = item.status === 'Expired';

                return (
                  <tr key={item._id}>
                    {/* Title & Description */}
                    <td className="ps-4 py-3">
                      <div className="fw-bold fs-6 text-body">{item.title}</div>
                      <p
                        className="text-secondary small mb-1 text-truncate"
                        style={{ maxWidth: '340px' }}
                        title={item.description}
                      >
                        {item.description}
                      </p>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                        Created: {new Date(item.createdAt).toLocaleDateString()}
                      </small>
                    </td>

                    {/* Type Badge */}
                    <td>
                      {item.type === 'critical' ? (
                        <span className="badge bg-danger text-white rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                          <AlertTriangle size={13} />
                          <span>Critical</span>
                        </span>
                      ) : item.type === 'advisory' ? (
                        <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                          <Sparkles size={13} />
                          <span>Advisory</span>
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                          <Info size={13} />
                          <span>Regular</span>
                        </span>
                      )}
                    </td>

                    {/* Target Audience */}
                    <td>
                      {item.targetType === 'individual' && item.targetPatientId ? (
                        <div>
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 mb-1">
                            <UserCheck size={12} />
                            <span>Specific Patient</span>
                          </span>
                          <div className="small fw-semibold text-body">
                            {item.targetPatientId.fullName || 'Patient'}
                          </div>
                          <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
                            {item.targetPatientId.mobile || item.targetPatientId.email}
                          </small>
                        </div>
                      ) : (
                        <span className="badge bg-body-secondary text-body border rounded-pill px-2.5 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                          <Globe size={13} className="text-teal" />
                          <span>All Patients</span>
                        </span>
                      )}
                    </td>

                    {/* Expiry & Validity */}
                    <td>
                      <div className="fw-semibold text-body small">
                        {new Date(item.expiryDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
                        {new Date(item.expiryDate).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {isLive && (
                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1">
                          <span
                            className="rounded-circle bg-success d-inline-block"
                            style={{ width: '6px', height: '6px' }}
                          ></span>
                          <span>Live</span>
                        </span>
                      )}
                      {isDismissed && (
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2.5 py-1 fw-semibold">
                          Dismissed
                        </span>
                      )}
                      {isExpired && (
                        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 fw-semibold">
                          Expired
                        </span>
                      )}
                    </td>

                    {/* Actions: Edit, Dismiss, Delete */}
                    <td className="text-end pe-4">
                      <div className="d-inline-flex align-items-center gap-1">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onOpenEdit(item)}
                          className="btn btn-outline-teal btn-sm rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                          title="Edit announcement"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>

                        {/* Dismiss Button */}
                        <button
                          type="button"
                          onClick={() => onDismiss(item._id, item.title)}
                          disabled={!item.isActive}
                          className={`btn btn-sm rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1 btn-action-dismiss ${
                            !item.isActive ? 'disabled' : ''
                          }`}
                          title={
                            item.isActive
                              ? 'Deactivate announcement immediately'
                              : 'Already dismissed'
                          }
                        >
                          <EyeOff size={14} />
                          <span>Dismiss</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDelete(item._id, item.title)}
                          className="btn btn-outline-danger btn-sm rounded-circle p-1.5 ms-1"
                          title="Delete announcement permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AnnouncementTable;
