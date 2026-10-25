import React, { useState, useRef, useEffect } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  Search,
  ChevronDown,
  Eye,
  Save
} from 'lucide-react';
import { toDatetimeLocal } from '../../../utils/dateUtils';

export const AdminAnnouncementFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingItem,
  patients = [],
  patientsLoading = false,
  onOpenPreview,
  submitting = false,
  formError = ''
}) => {
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPatientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Selected Patient Details for Individual Target
  const selectedPatient = patients.find((p) => p._id === formData.targetPatientId);

  // Filtered patients for dropdown search
  const filteredPatients = patients.filter((p) => {
    const term = patientSearchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.fullName?.toLowerCase().includes(term) ||
      p.mobile?.includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  });

  // Quick Preset Expiry Pill click handler
  const handlePresetExpiry = (hours) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      expiryDate: toDatetimeLocal(d)
    }));
  };

  const typeOptions = [
    {
      val: 'regular',
      label: 'Regular',
      desc: 'Silver/Platinum clinic notice',
      icon: Info,
      activeStyle: {
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.15)',
        color: 'var(--text-primary)'
      }
    },
    {
      val: 'advisory',
      label: 'Advisory',
      desc: 'Nordic cyan clinical advisory',
      icon: Sparkles,
      activeStyle: {
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        color: '#0284c7'
      }
    },
    {
      val: 'critical',
      label: 'Critical',
      desc: 'Ruby/Red urgent alert',
      icon: AlertTriangle,
      activeStyle: {
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#dc2626'
      }
    }
  ];

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1055
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden text-start">
          {/* Modal Header */}
          <div
            className="modal-header border-0 text-white p-4"
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2.5 rounded-circle bg-white text-teal d-flex align-items-center justify-content-center shadow-xs">
                <Megaphone size={22} />
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-white">
                  {editingItem ? 'Edit Announcement' : 'Create New Announcement'}
                </h4>
                <small className="text-white-50">
                  Configure banner type, audience targeting, quick expiry, and preview live
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-body">
            {formError && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3 rounded-3">
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={onSubmit}>
              {/* Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-body small">
                  Announcement Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g., Specialized Spine & Posture Assessment Clinic"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-body small">
                  Description / Content <span className="text-danger">*</span>
                </label>
                <textarea
                  rows="3"
                  className="form-control rounded-3"
                  placeholder="Enter the full message to display in the banner..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>

              {/* Visual Type Selector: 3 Clickable Card Pills */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-body small d-block">
                  Announcement Type <span className="text-danger">*</span>
                </label>
                <div className="row g-2">
                  {typeOptions.map((typeOption) => {
                    const IconComp = typeOption.icon;
                    const isSelected = formData.type === typeOption.val;

                    return (
                      <div className="col-4" key={typeOption.val}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: typeOption.val })}
                          className={`w-100 p-2.5 rounded-3 border text-center transition-all ${
                            isSelected ? 'shadow-sm' : 'bg-body-secondary border-0 text-muted'
                          }`}
                          style={isSelected ? { ...typeOption.activeStyle, borderWidth: '2px' } : {}}
                        >
                          <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                            <IconComp size={16} />
                            <span className="fw-bold small">{typeOption.label}</span>
                          </div>
                          <small className="d-block" style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                            {typeOption.desc}
                          </small>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience Switcher & Search */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-body small d-block">
                  Target Audience <span className="text-danger">*</span>
                </label>
                <div className="d-flex align-items-center gap-4 p-2.5 rounded-3 bg-body-secondary mb-2">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="targetTypeRadio"
                      id="targetAll"
                      checked={formData.targetType === 'all'}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          targetType: 'all',
                          targetPatientId: ''
                        })
                      }
                    />
                    <label className="form-check-label fw-semibold small cursor-pointer" htmlFor="targetAll">
                      All Patients (Broadcast)
                    </label>
                  </div>

                  <div className="form-check mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="targetTypeRadio"
                      id="targetIndividual"
                      checked={formData.targetType === 'individual'}
                      onChange={() =>
                        setFormData({
                          ...formData,
                          targetType: 'individual'
                        })
                      }
                    />
                    <label className="form-check-label fw-semibold small cursor-pointer" htmlFor="targetIndividual">
                      Specific Patient
                    </label>
                  </div>
                </div>

                {/* Instant Debounced Search Dropdown for Specific Patient */}
                {formData.targetType === 'individual' && (
                  <div className="position-relative" ref={dropdownRef}>
                    {selectedPatient ? (
                      <div className="p-2.5 rounded-3 border bg-body d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-2 rounded-circle bg-teal-subtle text-teal">
                            <UserCheck size={16} />
                          </div>
                          <div>
                            <div className="fw-bold small text-body">{selectedPatient.fullName}</div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              Phone: {selectedPatient.mobile} • Email: {selectedPatient.email}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, targetPatientId: '' });
                            setIsPatientDropdownOpen(true);
                          }}
                          className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-1 text-xs"
                        >
                          Change Patient
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="input-group">
                          <span className="input-group-text bg-body border-end-0">
                            <Search size={16} className="text-secondary" />
                          </span>
                          <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Search patient by full name or phone number..."
                            value={patientSearchTerm}
                            onFocus={() => setIsPatientDropdownOpen(true)}
                            onChange={(e) => {
                              setPatientSearchTerm(e.target.value);
                              setIsPatientDropdownOpen(true);
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>

                        {/* Filtered Dropdown Menu */}
                        {isPatientDropdownOpen && (
                          <div
                            className="position-absolute w-100 mt-1 shadow-lg border rounded-3 bg-body overflow-hidden"
                            style={{ zIndex: 1060, maxHeight: '220px', overflowY: 'auto' }}
                          >
                            {patientsLoading ? (
                              <div className="p-3 text-center text-muted small">
                                <div className="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
                                Loading registered patients...
                              </div>
                            ) : filteredPatients.length === 0 ? (
                              <div className="p-3 text-center text-muted small">
                                No patients found matching "{patientSearchTerm}".
                              </div>
                            ) : (
                              filteredPatients.map((patient) => (
                                <div
                                  key={patient._id}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      targetPatientId: patient._id
                                    });
                                    setIsPatientDropdownOpen(false);
                                    setPatientSearchTerm('');
                                  }}
                                  className="p-2.5 border-bottom d-flex align-items-center justify-content-between hover-bg cursor-pointer transition-all"
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div>
                                    <div className="fw-bold small text-body">{patient.fullName}</div>
                                    <small className="text-secondary">
                                      Phone: {patient.mobile} • {patient.email}
                                    </small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-teal btn-sm rounded-pill px-2.5 py-0.5 text-xs text-white"
                                  >
                                    Select
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Start Date & Expiry Date Pickers with Quick Presets */}
              <div className="row g-3 mb-3">
                <div className="col-md-5">
                  <label className="form-label fw-semibold text-body small">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control rounded-3"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="col-md-7">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label fw-semibold text-body small mb-0">
                      Expiry Date & Time <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex align-items-center gap-1">
                      <span className="text-muted small me-1" style={{ fontSize: '0.72rem' }}>Quick:</span>
                      <button
                        type="button"
                        onClick={() => handlePresetExpiry(24)}
                        className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                        style={{ fontSize: '0.7rem' }}
                        title="Set expiry 24 hours from now"
                      >
                        24h
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetExpiry(72)}
                        className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                        style={{ fontSize: '0.7rem' }}
                        title="Set expiry 3 days from now"
                      >
                        3 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetExpiry(168)}
                        className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                        style={{ fontSize: '0.7rem' }}
                        title="Set expiry 7 days from now"
                      >
                        7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetExpiry(720)}
                        className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                        style={{ fontSize: '0.7rem' }}
                        title="Set expiry 30 days from now"
                      >
                        30 Days
                      </button>
                    </div>
                  </div>
                  <input
                    type="datetime-local"
                    className="form-control rounded-3"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Active Switch */}
              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="isActiveSwitch"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label className="form-check-label small fw-semibold" htmlFor="isActiveSwitch">
                  Activate announcement immediately ({formData.isActive ? 'Live' : 'Inactive/Dismissed'})
                </label>
              </div>

              {/* Action Buttons: Cancel, Preview Modal, and Publish */}
              <div className="d-flex align-items-center justify-content-between pt-2 border-top gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <div className="d-flex align-items-center gap-2 ms-auto">
                  <button
                    type="button"
                    onClick={onOpenPreview}
                    className="btn btn-outline-teal rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  >
                    <Eye size={17} />
                    <span>Preview Announcement</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-teal text-white rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>{editingItem ? 'Save Changes' : 'Publish Announcement'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementFormModal;
