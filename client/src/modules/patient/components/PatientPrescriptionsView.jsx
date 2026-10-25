import React from 'react';
import { FileText } from 'lucide-react';
import { ExerciseRoutineCard } from '../../prescriptions';

export const PatientPrescriptionsView = ({
  prescriptionRecords = [],
  theme = 'light'
}) => {
  if (prescriptionRecords.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3 bg-body text-start">
        <FileText size={48} className="text-teal mb-3 opacity-50 mx-auto" />
        <h5 className="fw-bold mb-2 text-center">No Digital Prescriptions Available Yet</h5>
        <p className="text-muted small max-w-md mx-auto mb-0 text-center" style={{ maxWidth: '450px' }}>
          Once Dr. Neha Sharma (PT) prescribes custom rehabilitation exercises during your consultation, your digital prescription notes will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4 text-start">
      {prescriptionRecords.map((app) => (
        <ExerciseRoutineCard
          key={app._id}
          appointment={app}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default PatientPrescriptionsView;
