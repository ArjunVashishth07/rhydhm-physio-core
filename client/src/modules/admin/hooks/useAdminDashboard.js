import { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from '../../appointments';
import { savePrescription } from '../../prescriptions';

/**
 * Custom hook encapsulating administrative appointment management,
 * status transitions, digital prescriptions, and live KPI counts.
 */
export const useAdminDashboard = (isAuthenticated = false) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Appointment for Detail / Prescription Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // 1. Fetch All Admin Appointments
  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminAppointments();
      if (data && data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load appointments from server. Please check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, loadAppointments]);

  // 2. Open / Close Manage Modal
  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setActionSuccess('');
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  // 3. Update Appointment Status
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    setActionSuccess('');
    try {
      const res = await updateAppointmentStatus(selectedApp._id, newStatus);
      if (res?.success) {
        setSelectedApp({ ...selectedApp, status: newStatus });
        setActionSuccess(`Status updated to ${newStatus}`);
        loadAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 4. Save Prescription
  const handleSavePrescription = async (prescriptionPayload) => {
    if (!selectedApp) return;
    setSavingPrescription(true);
    setActionSuccess('');
    try {
      const res = await savePrescription(selectedApp._id, prescriptionPayload);
      if (res?.success) {
        setActionSuccess('Digital prescription saved successfully!');
        setSelectedApp({ ...selectedApp, sessionNotes: prescriptionPayload });
        loadAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setSavingPrescription(false);
    }
  };

  // 5. Delete Appointment Record
  const handleDelete = async (id, patientName) => {
    if (window.confirm(`Are you sure you want to delete ${patientName}'s record?`)) {
      try {
        const res = await deleteAppointment(id);
        if (res?.success) {
          setAppointments((prev) => prev.filter((a) => a._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete appointment');
      }
    }
  };

  // 6. Live KPI Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedTodayCount = appointments.filter(
    (a) => a.status === 'Completed' && (a.appointmentDate === todayStr || !a.appointmentDate)
  ).length;

  // 7. Filtered & Searched Appointments Slice
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.primaryIssue?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return {
    appointments,
    filteredAppointments,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedApp,
    updatingStatus,
    savingPrescription,
    actionSuccess,
    totalCount,
    pendingCount,
    confirmedCount,
    completedTodayCount,
    loadAppointments,
    handleOpenModal,
    handleCloseModal,
    handleUpdateStatus,
    handleSavePrescription,
    handleDelete
  };
};

export default useAdminDashboard;
