import React from 'react';
import { Search } from 'lucide-react';

export const AdminFilterBar = ({
  activeFilter = 'All',
  onFilterChange,
  searchTerm = '',
  onSearchChange,
  counts = {}
}) => {
  const tabs = ['All', 'Pending', 'Confirmed', 'Completed'];

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 p-3 bg-body text-start">
      <div className="row g-3 align-items-center">
        {/* Left Column: Filter Tabs */}
        <div className="col-md-7 text-start">
          <div className="d-flex align-items-center gap-2 flex-wrap" role="group">
            {tabs.map((tab) => {
              const isSelected = activeFilter === tab;
              const count = counts[tab] !== undefined ? counts[tab] : 0;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onFilterChange?.(tab)}
                  className={`btn btn-sm rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${
                    isSelected ? 'btn-teal text-white shadow-sm' : 'btn-outline-secondary'
                  }`}
                >
                  <span>{tab}</span>
                  <span className="badge rounded-pill bg-white text-dark opacity-90 px-2 py-1">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Search Input */}
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-body border-end-0">
              <Search size={18} className="text-secondary" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0 text-body bg-body"
              placeholder="Search patient name, phone, condition..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterBar;
