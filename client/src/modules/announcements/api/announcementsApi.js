import apiClient from '../../../api/apiClient';

const ANNOUNCEMENTS_BASE = '/api/announcements';

/**
 * Fetch all announcements for the Admin Dashboard (including inactive, expired, dismissed)
 */
export const fetchAnnouncements = async () => {
  const response = await apiClient.get(`${ANNOUNCEMENTS_BASE}/admin`);
  return response.data;
};

/**
 * Fetch active announcements relevant to a specific patient or broadcast to all
 */
export const fetchPatientAnnouncements = async (patientId = null) => {
  const params = {};
  if (patientId) {
    params.patientId = patientId;
  }
  const response = await apiClient.get(`${ANNOUNCEMENTS_BASE}/patient`, { params });
  return response.data;
};

/**
 * Fetch list of registered patients for admin individual targeting dropdown
 */
export const fetchRegisteredPatients = async () => {
  const response = await apiClient.get(`${ANNOUNCEMENTS_BASE}/patients`);
  return response.data;
};

/**
 * Create a new clinical announcement
 */
export const createAnnouncement = async (payload) => {
  const response = await apiClient.post(ANNOUNCEMENTS_BASE, payload);
  return response.data;
};

/**
 * Update an existing announcement
 */
export const updateAnnouncement = async (id, payload) => {
  const response = await apiClient.put(`${ANNOUNCEMENTS_BASE}/${id}`, payload);
  return response.data;
};

/**
 * Early dismissal (set isActive: false)
 */
export const dismissAnnouncement = async (id) => {
  const response = await apiClient.patch(`${ANNOUNCEMENTS_BASE}/${id}/dismiss`);
  return response.data;
};

/**
 * Permanently delete an announcement
 */
export const deleteAnnouncement = async (id) => {
  const response = await apiClient.delete(`${ANNOUNCEMENTS_BASE}/${id}`);
  return response.data;
};
