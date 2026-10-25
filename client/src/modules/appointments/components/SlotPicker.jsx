import React from 'react';
import { Clock } from 'lucide-react';

export const SlotPicker = ({
  availableSlots = [],
  selectedSlot = '',
  onSelectSlot,
  loading = false,
  lang = 'en',
  label = 'Available Slots',
  noSlotsText = 'No slots available for this date'
}) => {
  return (
    <div className="mb-4 text-start">
      <label className="form-label fw-semibold text-secondary small d-flex align-items-center justify-content-between">
        <span>
          {label} <span className="text-danger">*</span>
        </span>
        <span className="badge bg-teal-subtle text-teal">
          <Clock size={14} className="me-1" />
          4:00 PM - 8:00 PM
        </span>
      </label>

      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-teal" role="status"></div>
          <span className="ms-2 small text-muted">
            {lang === 'hi' ? 'समय स्लॉट लोड हो रहे हैं...' : 'Loading available slots...'}
          </span>
        </div>
      ) : availableSlots.length === 0 ? (
        <div className="alert alert-warning small mb-0 rounded-3">
          {noSlotsText}
        </div>
      ) : (
        <div className="row g-2">
          {availableSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <div key={slot} className="col-6 col-md-3">
                <button
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`btn btn-sm w-100 rounded-3 py-2.5 fw-semibold transition-all ${
                    isSelected
                      ? 'btn-teal text-white shadow-sm scale-102'
                      : 'btn-outline-secondary'
                  }`}
                >
                  {slot}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SlotPicker;
