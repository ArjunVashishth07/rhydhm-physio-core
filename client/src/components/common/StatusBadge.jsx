import React from 'react';
import { Clock, CheckCircle2, Check, XCircle } from 'lucide-react';

/**
 * Reusable StatusBadge Component for Appointments & Clinical states
 */
export const StatusBadge = ({ status = 'Pending', className = '', showIcon = false }) => {
  const normStatus = String(status || 'Pending').trim();

  let badgeClass = 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
  let Icon = Clock;

  if (normStatus === 'Confirmed') {
    badgeClass = 'bg-primary-subtle text-primary border border-primary-subtle';
    Icon = Check;
  } else if (normStatus === 'Completed') {
    badgeClass = 'bg-success-subtle text-success border border-success-subtle';
    Icon = CheckCircle2;
  } else if (normStatus === 'Cancelled') {
    badgeClass = 'bg-danger-subtle text-danger border border-danger-subtle';
    Icon = XCircle;
  }

  return (
    <span
      className={`badge rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 small ${badgeClass} ${className}`}
    >
      {showIcon && <Icon size={13} />}
      <span>{normStatus}</span>
    </span>
  );
};

export default StatusBadge;
