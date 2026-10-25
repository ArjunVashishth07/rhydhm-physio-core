import { useState, useEffect, useCallback } from 'react';
import {
  fetchPatientAppointments,
  cancelAppointment
} from '../../appointments';
import { fetchPatientAnnouncements } from '../../announcements';

/**
 * Custom hook to encapsulate patient dashboard data fetching, cancellation,
 * announcements, and KPI metrics.
 */
export const usePatientDashboard = (phone = '', patientId = '') => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [dismissedCriticalId, setDismissedCriticalId] = useState(null);

  // Clean phone input
  const cleanPhone = String(phone || '').replace(/[^0-9]/g, '');

  // 1. Fetch Patient Appointments
  const loadAppointments = useCallback(async () => {
    if (!cleanPhone) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchPatientAppointments(cleanPhone);
      if (data && data.data) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error('Error fetching patient appointments:', err);
      setError(
        err.response?.data?.message || 'Failed to load your appointment history.'
      );
    } finally {
      setLoading(false);
    }
  }, [cleanPhone]);

  // 2. Fetch Patient Announcements
  const loadAnnouncements = useCallback(async () => {
    setAnnouncementsLoading(true);
    try {
      const data = await fetchPatientAnnouncements(patientId);
      if (data?.success && Array.isArray(data.announcements)) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Error fetching patient announcements:', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  }, [patientId]);

  // Initial fetch effects
  useEffect(() => {
    if (cleanPhone) {
      loadAppointments();
    } else {
      setLoading(false);
    }
  }, [cleanPhone, loadAppointments]);

  useEffect(() => {
    loadAnnouncements();
  }, [patientId, loadAnnouncements]);

  // 3. Handle Appointment Cancellation
  const handleCancelAppointment = async (id, appDate, confirmPrompt) => {
    const confirmation = confirmPrompt || `Are you sure you want to cancel your appointment for ${appDate}?`;
    if (window.confirm(confirmation)) {
      setCancelLoadingId(id);
      try {
        const res = await cancelAppointment(id);
        if (res?.success) {
          setAppointments((prev) =>
            prev.map((a) => (a._id === id ? { ...a, status: 'Cancelled' } : a))
          );
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel appointment');
      } finally {
        setCancelLoadingId(null);
      }
    }
  };

  // 4. Combined Refresh Handler
  const refreshAll = useCallback(() => {
    loadAppointments();
    loadAnnouncements();
  }, [loadAppointments, loadAnnouncements]);

  // 5. Computed KPI Metrics & Record Slices
  const totalSessions = appointments.length;
  const upcomingVisits = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  ).length;

  const prescriptionRecords = appointments.filter(
    (a) =>
      a.sessionNotes &&
      (a.sessionNotes.exercisesGiven?.length > 0 ||
        a.sessionNotes.doctorRemarks ||
        a.sessionNotes.nextFollowUp)
  );

  const activeCriticalAnnouncement = announcements.find(
    (a) => a.type === 'critical' && a._id !== dismissedCriticalId
  );

  const criticalCount = announcements.filter((a) => a.type === 'critical').length;
  const advisoryCount = announcements.filter((a) => a.type === 'advisory').length;
  const regularCount = announcements.filter((a) => a.type === 'regular' || !a.type).length;

  return {
    appointments,
    loading,
    error,
    cancelLoadingId,
    announcements,
    announcementsLoading,
    dismissedCriticalId,
    setDismissedCriticalId,
    totalSessions,
    upcomingVisits,
    prescriptionRecords,
    activeCriticalAnnouncement,
    criticalCount,
    advisoryCount,
    regularCount,
    handleCancelAppointment,
    refreshAll
  };
};

export default usePatientDashboard;
