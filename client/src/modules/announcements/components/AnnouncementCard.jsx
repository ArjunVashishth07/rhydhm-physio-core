import React from 'react';
import {
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  Calendar
} from 'lucide-react';
import { formatAnnouncementExpiry, getExpiryStatus } from '../../../utils/dateUtils';

export const AnnouncementCard = ({ announcement, theme = 'light', lang = 'en' }) => {
  if (!announcement) return null;

  const itemType = announcement.type || 'regular';
  const remaining = getExpiryStatus(announcement.expiryDate);
  const isDark = theme === 'dark';

  const cardClass = isDark
    ? 'patient-announcement-card dark-slate-card'
    : 'patient-announcement-card light-card';

  const accentClass =
    itemType === 'critical'
      ? 'announcement-accent-critical'
      : itemType === 'advisory'
      ? 'announcement-accent-advisory'
      : 'announcement-accent-regular';

  return (
    <div className={`${cardClass} ${accentClass}`}>
      {/* Top Header Bar */}
      <div className="announcement-card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Type Badge: Regular / Advisory / Critical */}
          {itemType === 'critical' ? (
            <span className="announcement-badge announcement-badge-critical">
              <AlertTriangle size={13} />
              <span>CRITICAL</span>
            </span>
          ) : itemType === 'advisory' ? (
            <span className="announcement-badge announcement-badge-advisory">
              <Sparkles size={13} />
              <span>ADVISORY</span>
            </span>
          ) : (
            <span className="announcement-badge announcement-badge-regular">
              <Info size={13} />
              <span>REGULAR</span>
            </span>
          )}

          {/* Direct Notice Tag */}
          {announcement.targetType === 'individual' && (
            <span className="announcement-badge announcement-badge-direct">
              <UserCheck size={12} />
              <span>
                Direct Notice {announcement.targetPatientName ? `• ${announcement.targetPatientName}` : ''}
              </span>
            </span>
          )}
        </div>

        {/* Expiry Date Display */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="announcement-expiry-meta d-inline-flex align-items-center gap-1.5">
            <Calendar size={13} className="text-teal" />
            <span>Expires: {formatAnnouncementExpiry(announcement.expiryDate, lang)}</span>
          </span>
          {remaining && (
            <span
              className={`announcement-expiry-chip ${
                itemType === 'critical' ? 'chip-critical' : ''
              }`}
            >
              {remaining}
            </span>
          )}
        </div>
      </div>

      {/* Card Body: Title & Full Description */}
      <div className="p-3.5 sm:p-4 pt-2">
        <h5 className="announcement-card-title text-sm sm:text-base font-semibold mb-1.5">
          {announcement.title}
        </h5>
        <p className="announcement-card-desc text-xs sm:text-sm leading-relaxed mb-0">
          {announcement.description}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementCard;
