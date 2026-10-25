import React, { useState } from 'react';
import { Eye, Sun, Moon, X } from 'lucide-react';
import AnnouncementBanner from '../../../components/AnnouncementBanner';

export const AnnouncementPreviewModal = ({
  isOpen,
  onClose,
  formData,
  selectedPatient
}) => {
  const [previewTheme, setPreviewTheme] = useState('light'); // 'light' | 'dark'

  if (!isOpen) return null;

  // Prepare simulated preview item
  const previewItem = {
    _id: 'preview-id-patient-portal',
    title: formData?.title?.trim() || 'Specialized Spine & Posture Assessment Clinic',
    description:
      formData?.description?.trim() ||
      'Free posture evaluation and ergonomic spine alignment consultations are available every Saturday morning with Dr. Neha Sharma (PT). Advance booking recommended.',
    type: formData?.type || 'regular',
    targetType: formData?.targetType || 'all',
    targetPatientName:
      selectedPatient?.fullName || (formData?.targetType === 'individual' ? 'Selected Patient' : null),
    startDate: formData?.startDate ? new Date(formData.startDate) : new Date(),
    expiryDate: formData?.expiryDate
      ? new Date(formData.expiryDate)
      : new Date(Date.now() + 7 * 24 * 3600 * 1000),
    isActive: true
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1065
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden text-start">
          {/* Preview Modal Header */}
          <div className="modal-header border-bottom bg-body px-4 py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-circle bg-teal-subtle text-teal d-flex align-items-center justify-content-center">
                <Eye size={18} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-body">Patient Portal Viewport Preview</h5>
                <small className="text-muted">
                  Verify visual hierarchy, glassmorphism, and contrast before publishing
                </small>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Theme Mode Toggle (Light Mode vs Dark Mode) */}
              <div className="bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center gap-1 border">
                <button
                  type="button"
                  onClick={() => setPreviewTheme('light')}
                  className={`btn btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 border-0 transition-all ${
                    previewTheme === 'light'
                      ? 'bg-white text-dark shadow-xs fw-bold'
                      : 'text-muted'
                  }`}
                >
                  <Sun size={14} className={previewTheme === 'light' ? 'text-warning' : ''} />
                  <span>Light Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme('dark')}
                  className={`btn btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 border-0 transition-all ${
                    previewTheme === 'dark'
                      ? 'bg-dark text-white shadow-xs fw-bold'
                      : 'text-muted'
                  }`}
                >
                  <Moon size={14} className={previewTheme === 'dark' ? 'text-info' : ''} />
                  <span>Dark Mode</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                onClick={onClose}
                aria-label="Close preview"
                title="Close preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Preview Modal Body (Simulated Viewport) */}
          <div
            className="modal-body p-4 p-md-5 transition-all"
            style={{
              backgroundColor: previewTheme === 'dark' ? '#0b0f19' : '#f1f5f9'
            }}
          >
            {/* Viewport Frame */}
            <div
              className="preview-viewport-container p-4 p-md-5 rounded-4 shadow-sm mx-auto transition-all"
              data-bs-theme={previewTheme}
              data-theme={previewTheme}
              style={{
                maxWidth: '880px',
                backgroundColor: previewTheme === 'dark' ? '#141210' : '#ffffff',
                border: previewTheme === 'dark' ? '1px solid #332c25' : '1px solid #e2e8f0',
                color: previewTheme === 'dark' ? '#faf5ee' : '#0f172a'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom opacity-75">
                <span className="small font-monospace text-muted d-flex align-items-center gap-1.5">
                  <span
                    className="rounded-circle bg-success d-inline-block"
                    style={{ width: '8px', height: '8px' }}
                  ></span>
                  Simulated Patient Portal • Top Viewport
                </span>
                <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
                  {previewTheme.toUpperCase()} MODE
                </span>
              </div>

              {/* 1. Real AnnouncementBanner Rendered with Current Form Values */}
              <AnnouncementBanner previewItems={[previewItem]} />

              {/* 2. Simulated Top Greeting Banner */}
              <div
                className="card border-0 shadow-sm rounded-4 p-4 text-white position-relative overflow-hidden clinical-banner mt-3"
                style={{ opacity: 0.9 }}
              >
                <div
                  className="badge px-3 py-1 rounded-pill mb-2 fw-semibold clinical-banner-badge"
                  style={{ width: 'fit-content' }}
                >
                  Patient Portal
                </div>
                <h3 className="fw-bold mb-1 text-white">Welcome back, Arjun Vashishth</h3>
                <p className="text-white-50 mb-3 small">
                  Mobile: +91 9876543210 • Manage your physiotherapy appointments, exercise routines, and prescriptions.
                </p>
                <div className="d-flex gap-2">
                  <span className="btn btn-sm btn-light rounded-pill px-3 py-1.5 fw-semibold opacity-75">
                    Book Appointment
                  </span>
                  <span className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 opacity-75">
                    Refresh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPreviewModal;
