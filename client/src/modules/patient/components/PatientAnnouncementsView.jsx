import React, { useState } from 'react';
import {
  Megaphone,
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  Filter,
  Layers,
  Table as TableIcon,
  Users,
  User,
  Clock
} from 'lucide-react';
import { AnnouncementCard } from '../../announcements';
import { formatAnnouncementExpiry, getExpiryStatus } from '../../../utils/dateUtils';

export const PatientAnnouncementsView = ({
  announcements = [],
  loading = false,
  theme = 'light',
  lang = 'en'
}) => {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const criticalCount = announcements.filter((a) => a.type === 'critical').length;
  const advisoryCount = announcements.filter((a) => a.type === 'advisory').length;
  const regularCount = announcements.filter((a) => a.type === 'regular' || !a.type).length;

  const filtered = announcements.filter((item) => {
    if (filter === 'All') return true;
    return item.type === filter.toLowerCase();
  });

  return (
    <div className="text-start">
      {/* Control Bar: Category Filters & View Switcher */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-body">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Filter Pills */}
          <div className="d-flex align-items-center gap-1.5 flex-wrap">
            <span className="small text-muted fw-semibold me-1 d-flex align-items-center gap-1">
              <Filter size={14} /> Filter:
            </span>
            {['All', 'Critical', 'Advisory', 'Regular'].map((filterOption) => {
              const count =
                filterOption === 'All'
                  ? announcements.length
                  : filterOption === 'Critical'
                  ? criticalCount
                  : filterOption === 'Advisory'
                  ? advisoryCount
                  : regularCount;

              const isSelected = filter === filterOption;
              return (
                <button
                  key={filterOption}
                  type="button"
                  onClick={() => setFilter(filterOption)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-inline-flex align-items-center gap-2 mx-1 ${
                    isSelected
                      ? 'btn-teal text-white shadow-xs'
                      : 'btn-outline-secondary border-0 bg-body-secondary text-muted'
                  }`}
                  style={{ fontSize: '0.82rem' }}
                >
                  <span>{filterOption}</span>
                  <span
                    className={`badge rounded-pill px-2 py-0.5 fw-bold ms-1 ${
                      isSelected
                        ? 'bg-white text-teal shadow-xs'
                        : 'bg-body text-secondary border'
                    }`}
                    style={{ fontSize: '0.72rem', minWidth: '1.4rem' }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Switcher: Cards vs Table */}
          <div className="d-flex align-items-center gap-1 bg-body-tertiary p-1 rounded-pill border ms-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                viewMode === 'cards'
                  ? 'btn-teal text-white shadow-xs'
                  : 'text-muted border-0 bg-transparent'
              }`}
              style={{ fontSize: '0.8rem' }}
            >
              <Layers size={14} />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'btn-teal text-white shadow-xs'
                  : 'text-muted border-0 bg-transparent'
              }`}
              style={{ fontSize: '0.8rem' }}
            >
              <TableIcon size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-teal" role="status"></div>
          <p className="mt-2 text-muted small">Loading clinic announcements...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3 bg-body">
          <div
            className="p-3 rounded-circle bg-teal-subtle text-teal d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: '64px', height: '64px' }}
          >
            <Megaphone size={32} />
          </div>
          <h5 className="fw-bold mb-2">
            {announcements.length === 0
              ? 'No Active Announcements'
              : `No ${filter} Announcements Found`}
          </h5>
          <p className="text-muted small max-w-md mx-auto mb-0" style={{ maxWidth: '460px' }}>
            {announcements.length === 0
              ? 'You are all caught up! There are currently no new announcements, clinic schedule changes, or personal advisories.'
              : `There are currently no announcements matching the "${filter}" category.`}
          </p>
          {announcements.length > 0 && filter !== 'All' && (
            <button
              type="button"
              onClick={() => setFilter('All')}
              className="btn btn-outline-teal btn-sm rounded-pill px-3 py-1.5 mt-3 mx-auto fw-semibold"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div
          className={`card border shadow-sm rounded-4 overflow-hidden patient-table-container ${
            theme === 'dark' ? 'patient-table-dark' : 'patient-table-light'
          }`}
        >
          <div className="table-responsive">
            <table className="table patient-announcement-table align-middle mb-0 text-start">
              <thead>
                <tr>
                  <th style={{ minWidth: '140px', width: '15%' }}>TYPE</th>
                  <th style={{ minWidth: '280px', width: '45%' }}>TITLE & DESCRIPTION</th>
                  <th style={{ minWidth: '220px', width: '25%' }}>EXPIRY DATE</th>
                  <th style={{ minWidth: '130px', width: '15%' }}>AUDIENCE</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const itemType = item.type || 'regular';
                  const remaining = getExpiryStatus(item.expiryDate);

                  return (
                    <tr key={item._id}>
                      {/* Column 1: Type Badge */}
                      <td>
                        {itemType === 'critical' ? (
                          <span className="announcement-badge announcement-badge-critical">
                            <AlertTriangle size={13} />
                            <span>Critical</span>
                          </span>
                        ) : itemType === 'advisory' ? (
                          <span className="announcement-badge announcement-badge-advisory">
                            <Sparkles size={13} />
                            <span>Advisory</span>
                          </span>
                        ) : (
                          <span className="announcement-badge announcement-badge-regular">
                            <Info size={13} />
                            <span>Regular</span>
                          </span>
                        )}
                      </td>

                      {/* Column 2: Title & Description */}
                      <td>
                        <div className="fw-bold fs-6 mb-1 text-truncate" style={{ maxWidth: '420px' }}>
                          {item.title}
                        </div>
                        <p
                          className="small mb-1"
                          style={{
                            color: theme === 'dark' ? '#cbd5e1' : '#475569',
                            lineHeight: '1.55'
                          }}
                        >
                          {item.description}
                        </p>
                        {item.targetType === 'individual' && (
                          <span
                            className="announcement-badge announcement-badge-direct mt-1"
                            style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}
                          >
                            <UserCheck size={11} />
                            <span>
                              Direct Notice {item.targetPatientName ? `• ${item.targetPatientName}` : ''}
                            </span>
                          </span>
                        )}
                      </td>

                      {/* Column 3: Expiry Date */}
                      <td>
                        <div className="d-flex flex-column gap-1.5">
                          <div className="d-inline-flex align-items-center gap-1.5 small fw-semibold text-nowrap">
                            <Clock size={14} className="text-teal flex-shrink-0" />
                            <span>{formatAnnouncementExpiry(item.expiryDate)}</span>
                          </div>
                          {remaining && (
                            <span
                              className={`announcement-expiry-chip ${
                                itemType === 'critical' ? 'chip-critical' : ''
                              }`}
                              style={{ width: 'fit-content' }}
                            >
                              Valid ({remaining})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Column 4: Audience */}
                      <td>
                        {item.targetType === 'individual' ? (
                          <span className="badge rounded-pill px-2.5 py-1 small fw-semibold bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1.5">
                            <User size={12} />
                            <span>Personal</span>
                          </span>
                        ) : (
                          <span className="badge rounded-pill px-2.5 py-1 small fw-semibold bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1.5">
                            <Users size={12} />
                            <span>All Patients</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS STACK VIEW */
        <div className="announcement-cards-stack">
          {filtered.map((item) => (
            <AnnouncementCard
              key={item._id}
              announcement={item}
              theme={theme}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAnnouncementsView;
