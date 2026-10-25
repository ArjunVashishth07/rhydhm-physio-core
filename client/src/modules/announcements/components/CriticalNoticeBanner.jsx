import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export const CriticalNoticeBanner = ({
  announcement,
  theme = 'light',
  onDismiss,
  onViewDetails
}) => {
  if (!announcement) return null;

  return (
    <div
      className="alert border-0 shadow-sm rounded-4 p-3 sm:p-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2.5 overflow-hidden w-100"
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        borderLeft: '5px solid #ef4444',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow:
          theme === 'dark'
            ? '0 8px 24px -4px rgba(239, 68, 68, 0.3)'
            : '0 4px 16px -2px rgba(239, 68, 68, 0.15)'
      }}
      role="alert"
    >
      <div className="d-flex align-items-start gap-2.5 flex-grow-1" style={{ minWidth: 0, maxWidth: '100%' }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
          style={{
            width: '34px',
            height: '34px',
            minWidth: '34px',
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
          }}
        >
          <AlertTriangle size={17} />
        </div>
        <div className="flex-grow-1" style={{ minWidth: 0, maxWidth: '100%' }}>
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap" style={{ minWidth: 0 }}>
            <span
              className="badge rounded-pill px-2 py-0.5 fw-bold flex-shrink-0"
              style={{
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '0.68rem',
                letterSpacing: '0.05em'
              }}
            >
              CRITICAL NOTICE
            </span>
            <strong
              className="text-sm sm:text-base font-semibold"
              style={{
                color: theme === 'dark' ? '#ffffff' : '#991b1b',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {announcement.title}
            </strong>
          </div>
          <p
            className="mb-0 text-xs sm:text-sm leading-relaxed"
            style={{
              color: theme === 'dark' ? '#fca5a5' : '#7f1d1d',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            {announcement.description}
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 ms-auto pt-1 pt-sm-0 flex-shrink-0">
        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="btn btn-danger btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
            style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            <span>View Details</span>
            <ArrowRight size={14} />
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '30px',
              height: '30px',
              minWidth: '30px',
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
              border: 'none',
              color: theme === 'dark' ? '#fca5a5' : '#991b1b'
            }}
            title="Dismiss alert"
            aria-label="Dismiss alert"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CriticalNoticeBanner;
