import React from 'react';

export const SymptomSelector = ({
  symptomsList = [],
  selectedSymptoms = [],
  onToggleSymptom,
  lang = 'en',
  label = 'Symptoms',
  optionalText = 'Optional'
}) => {
  if (!symptomsList || symptomsList.length === 0) return null;

  return (
    <div className="mb-4 text-start">
      <label className="form-label fw-semibold text-secondary small d-block">
        {label} <small className="text-muted fw-normal">({optionalText})</small>
      </label>
      <div className="d-flex flex-wrap gap-2">
        {symptomsList.map((sym) => {
          const isSelected = selectedSymptoms.includes(sym);
          return (
            <button
              type="button"
              key={sym}
              onClick={() => onToggleSymptom(sym)}
              className={`btn btn-sm rounded-pill transition-all text-start d-flex align-items-center gap-1.5 px-3 py-1.5 ${
                isSelected
                  ? 'btn-teal text-white shadow-sm'
                  : 'btn-outline-secondary opacity-85'
              }`}
            >
              <span style={{ fontSize: '1.1em' }}>{isSelected ? '✓' : '+'}</span>
              <span>{sym}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SymptomSelector;
