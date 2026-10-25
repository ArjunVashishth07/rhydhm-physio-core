import React from 'react';
import { Calendar, FileText, LogOut, Megaphone } from 'lucide-react';

export const PatientTabNav = ({
  activeTab = 'appointments',
  onTabChange,
  appointmentsCount = 0,
  prescriptionsCount = 0,
  announcementsCount = 0,
  onLogout,
  lang = 'en'
}) => {
  return (
    <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 text-start">
      {/* Scrollable Clinical Tab Strip */}
      <div
        className="overflow-x-auto pb-1 max-w-full"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="d-inline-flex p-1 bg-body rounded-pill shadow-xs border text-nowrap" role="group">
          {/* Tab 1: Appointments */}
          <button
            type="button"
            onClick={() => onTabChange('appointments')}
            className={`btn rounded-pill px-3 px-sm-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all ${
              activeTab === 'appointments'
                ? 'btn-teal text-white shadow-sm'
                : 'btn-ghost text-secondary'
            }`}
          >
            <Calendar size={17} className="me-1.5" />
            <span>{lang === 'hi' ? 'मेरी अपॉइंटमेंट्स' : 'My Appointments'}</span>
            <span className="ms-1.5 opacity-90">({appointmentsCount})</span>
          </button>

          {/* Tab 2: Prescriptions */}
          <button
            type="button"
            onClick={() => onTabChange('prescriptions')}
            className={`btn rounded-pill px-3 px-sm-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all ${
              activeTab === 'prescriptions'
                ? 'btn-teal text-white shadow-sm'
                : 'btn-ghost text-secondary'
            }`}
          >
            <FileText size={17} className="me-1.5" />
            <span>{lang === 'hi' ? 'पर्चा और व्यायाम' : 'Prescriptions & Exercises'}</span>
            <span className="ms-1.5 opacity-90">({prescriptionsCount})</span>
          </button>

          {/* Tab 3: Announcements */}
          <button
            type="button"
            onClick={() => onTabChange('announcements')}
            className={`btn rounded-pill px-3 px-sm-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all d-inline-flex align-items-center gap-1.5 ${
              activeTab === 'announcements'
                ? 'btn-teal text-white shadow-sm'
                : 'btn-ghost text-secondary'
            }`}
          >
            <Megaphone size={17} className="me-1.5 " />
            <span>{lang === 'hi' ? 'सूचनाएं' : 'Announcements'}</span>
            <span className="ms-1.5 opacity-90">({announcementsCount})</span>
          </button>
        </div>
      </div>

      {/* Logout Action Button */}
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5 ms-auto ms-sm-0"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      )}
    </div>
  );
};

export default PatientTabNav;
