import React from 'react';
import { Users, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminStatsRibbon = ({
  totalCount = 0,
  pendingCount = 0,
  confirmedCount = 0,
  completedTodayCount = 0
}) => {
  return (
    <div className="row g-3 mb-4 text-start">
      {/* 1. Total Patients */}
      <div className="col-6 col-md-3">
        <div className="card border-0 shadow-sm rounded-4 p-3 sm:p-3.5 bg-body d-flex flex-column justify-content-between h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-semibold">Total Patients</span>
            <div className="p-2 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
              <Users size={18} />
            </div>
          </div>
          <h3 className="h4 fw-bold m-0">{totalCount}</h3>
        </div>
      </div>

      {/* 2. Pending Requests */}
      <div className="col-6 col-md-3">
        <div className="card border-0 shadow-sm rounded-4 p-3 sm:p-3.5 bg-body d-flex flex-column justify-content-between h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-semibold">Pending Requests</span>
            <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-circle d-flex align-items-center justify-content-center">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="h4 fw-bold m-0 text-warning-emphasis">{pendingCount}</h3>
        </div>
      </div>

      {/* 3. Confirmed Visits */}
      <div className="col-6 col-md-3">
        <div className="card border-0 shadow-sm rounded-4 p-3 sm:p-3.5 bg-body d-flex flex-column justify-content-between h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-semibold">Confirmed Visits</span>
            <div className="p-2 bg-info-subtle text-info-emphasis rounded-circle d-flex align-items-center justify-content-center">
              <Calendar size={18} />
            </div>
          </div>
          <h3 className="h4 fw-bold m-0 text-info-emphasis">{confirmedCount}</h3>
        </div>
      </div>

      {/* 4. Completed Today */}
      <div className="col-6 col-md-3">
        <div className="card border-0 shadow-sm rounded-4 p-3 sm:p-3.5 bg-body d-flex flex-column justify-content-between h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-muted small fw-semibold">Completed Today</span>
            <div className="p-2 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="h4 fw-bold m-0 text-success">{completedTodayCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsRibbon;
