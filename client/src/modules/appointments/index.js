// Appointments Module Barrel Export
export { SlotPicker } from './components/SlotPicker';
export { SymptomSelector } from './components/SymptomSelector';
export { BookingSuccessView } from './components/BookingSuccessView';
export { AdminAppointmentTable } from './components/AdminAppointmentTable';
export { AppointmentCard } from './components/AppointmentCard';

export {
  fetchAvailableSlots,
  bookAppointment,
  fetchPatientAppointments,
  fetchAdminAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
} from './api/appointmentsApi';
