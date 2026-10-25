import apiClient from '../../../api/apiClient';

/**
 * Save or update digital prescription for a given appointment
 */
export const savePrescription = async (appointmentId, payload) => {
  const response = await apiClient.post(
    `/api/admin/appointments/${appointmentId}/prescription`,
    payload
  );
  return response.data;
};

/**
 * Fetch patient prescription history by phone number
 */
export const fetchPatientPrescriptions = async (phone) => {
  const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');
  const response = await apiClient.get(`/api/appointments/patient-history/${cleanPhone}`);
  return response.data;
};
