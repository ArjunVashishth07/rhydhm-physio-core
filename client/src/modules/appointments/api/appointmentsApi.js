import apiClient from '../../../api/apiClient';

const APPOINTMENTS_BASE = '/api/appointments';
const ADMIN_APPOINTMENTS_BASE = '/api/admin/appointments';

/**
 * Fetch available time slots for a given date (YYYY-MM-DD)
 */
export const fetchAvailableSlots = async (date) => {
  const response = await apiClient.get(`${APPOINTMENTS_BASE}/available-slots`, {
    params: { date }
  });
  return response.data;
};

/**
 * Book a new patient appointment
 */
export const bookAppointment = async (payload) => {
  const response = await apiClient.post(APPOINTMENTS_BASE, payload);
  return response.data;
};

/**
 * Fetch patient appointment history and prescriptions by mobile number
 */
export const fetchPatientAppointments = async (phone) => {
  const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
  const response = await apiClient.get(`${APPOINTMENTS_BASE}/patient-history/${cleanPhone}`);
  return response.data;
};

/**
 * Fetch all appointments for the Admin Dashboard
 */
export const fetchAdminAppointments = async () => {
  const response = await apiClient.get(ADMIN_APPOINTMENTS_BASE);
  return response.data;
};

/**
 * Update an appointment status (Pending, Confirmed, Completed, Cancelled)
 */
export const updateAppointmentStatus = async (id, status) => {
  const response = await apiClient.put(`${ADMIN_APPOINTMENTS_BASE}/${id}/status`, { status });
  return response.data;
};

/**
 * Patient-initiated appointment cancellation
 */
export const cancelAppointment = async (id) => {
  const response = await apiClient.put(`${APPOINTMENTS_BASE}/${id}/cancel`);
  return response.data;
};

/**
 * Permanently delete an appointment record
 */
export const deleteAppointment = async (id) => {
  const response = await apiClient.delete(`${ADMIN_APPOINTMENTS_BASE}/${id}`);
  return response.data;
};
