import React from 'react';
import { Calendar, Megaphone } from 'lucide-react';

export const AdminHeaderNav = ({
  mainTab = 'appointments',
  onTabChange,
  onLockPortal,
  clinicBrand = 'RHYDHM Physio & Fitness Center',
  doctorName = 'Dr. Neha Sharma (PT)'
}) => {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 text-start">
      {/* Brand & Subtitle */}
      <div>
        <h2 className="fw-bold mb-1">Doctor Portal Management</h2>
        <p className="text-muted small mb-0">
          {clinicBrand} • {doctorName}
        </p>
      </div>

      {/* Navigation Controls: Switcher & Lock Trigger */}
      <div className="d-flex align-items-center flex-wrap gap-2 gap-sm-3">
        {/* Primary Tab Switcher */}
        <div className="bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center border shadow-xs">
          <button
            type="button"
            onClick={() => onTabChange('appointments')}
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
              mainTab === 'appointments'
                ? 'btn-teal text-white shadow-xs'
                : 'text-muted border-0 bg-transparent'
            }`}
          >
            <Calendar size={16} />
            <span>Appointments</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('announcements')}
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold d-inline-flex align-items-center gap-2 transition-all ${
              mainTab === 'announcements'
                ? 'btn-teal text-white shadow-xs'
                : 'text-muted border-0 bg-transparent'
            }`}
          >
            <Megaphone size={16} />
            <span>Announcements</span>
          </button>
        </div>

        {/* Lock Portal Button */}
        {onLockPortal && (
          <button
            type="button"
            onClick={onLockPortal}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 fw-semibold shadow-xs"
          >
            Lock Portal
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminHeaderNav;
