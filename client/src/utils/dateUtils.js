/**
 * Date Utility Functions for RHYDHM Physio & Fitness Center
 */

// Convert Date object or ISO string to datetime-local string (YYYY-MM-DDTHH:mm) for HTML form inputs
export const toDatetimeLocal = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

// Returns datetime-local string for (now + days)
export const getDefaultExpiry = (days = 7) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDatetimeLocal(d);
};

// Returns a human-friendly date string (e.g., "Oct 25, 2026")
export const formatDisplayDate = (dateStr, lang = 'en') => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Formats announcement expiry date and time
export const formatAnnouncementExpiry = (dateStr, lang = 'en') => {
  if (!dateStr) return 'No expiry date';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Calculates remaining validity badge text (e.g., "12h left", "5d left", "Expired")
export const getExpiryStatus = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const diffMs = d - new Date();
  if (diffMs <= 0) return 'Expired';
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  if (diffHours < 24) {
    return `${diffHours}h left`;
  }
  return `${diffDays}d left`;
};
