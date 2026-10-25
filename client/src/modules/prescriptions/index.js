// Prescriptions Module Barrel Export
export { PrescriptionEditModal } from './components/PrescriptionEditModal';
export { ExerciseRoutineCard } from './components/ExerciseRoutineCard';
export { generatePrescriptionWhatsAppLink } from './utils/whatsappHelper';

export {
  savePrescription,
  fetchPatientPrescriptions
} from './api/prescriptionsApi';
