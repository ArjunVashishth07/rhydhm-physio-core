import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import {
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  FileText,
  MessageSquare,
  RefreshCw,
  Phone,
  Plus,
  Trash2,
  Activity,
  ShieldAlert,
  Save,
  Lock
} from 'lucide-react';

const ADMIN_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin/appointments`;

export const AdminDashboard = () => {
  const { t, lang } = useApp();

  // Authentication State (Simple PIN protection for doctor portal)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rhydhm_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Data & Filtering States
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Appointment for Modal / Action Panel
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalStatus, setModalStatus] = useState('');

  // Prescription Form State inside Modal
  const [exercises, setExercises] = useState([]);
  const [newExerciseInput, setNewExerciseInput] = useState('');
  const [doctorRemarks, setDoctorRemarks] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Handle Passcode Unlock
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === '7777') {
      setIsAuthenticated(true);
      localStorage.setItem('rhydhm_admin_auth', 'true');
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid passcode. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rhydhm_admin_auth');
  };

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(ADMIN_API_URL);
      if (res.data && res.data.appointments) {
        setAppointments(res.data.appointments);
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
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  // Open Appointment Detail Modal
  const handleOpenModal = (app) => {
    setSelectedApp(app);
    setModalStatus(app.status || 'Pending');
    setExercises(app.sessionNotes?.exercisesGiven || []);
    setDoctorRemarks(app.sessionNotes?.doctorRemarks || '');
    setNextFollowUp(app.sessionNotes?.nextFollowUp || '');
    setActionSuccess('');
  };

  // Close Modal
  const handleCloseModal = () => {
    setSelectedApp(null);
  };

  // Update Status Request
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    setActionSuccess('');
    try {
      const res = await axios.put(`${ADMIN_API_URL}/${selectedApp._id}/status`, {
        status: newStatus
      });
      if (res.data?.success) {
        setModalStatus(newStatus);
        setSelectedApp({ ...selectedApp, status: newStatus });
        setActionSuccess(`Status updated to ${newStatus}`);
        fetchAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Add Exercise to List
  const handleAddExercise = () => {
    if (!newExerciseInput.trim()) return;
    setExercises([...exercises, newExerciseInput.trim()]);
    setNewExerciseInput('');
  };

  // Remove Exercise from List
  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  // Save Prescription Request
  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSavingPrescription(true);
    setActionSuccess('');

    const payload = {
      exercisesGiven: exercises,
      doctorRemarks,
      nextFollowUp
    };

    try {
      const res = await axios.post(`${ADMIN_API_URL}/${selectedApp._id}/prescription`, payload);
      if (res.data?.success) {
        setActionSuccess('Digital prescription saved successfully!');
        setSelectedApp({ ...selectedApp, sessionNotes: payload });
        fetchAppointments();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save prescription');
    } finally {
      setSavingPrescription(false);
    }
  };

  // Delete Patient Record Handler
  const handleDelete = async (id, patientName) => {
    if (window.confirm(`Are you sure you want to delete ${patientName}'s record?`)) {
      try {
        const res = await axios.delete(`${ADMIN_API_URL}/${id}`);
        if (res.data?.success) {
          setAppointments(appointments.filter((a) => a._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete appointment');
      }
    }
  };

  // Generate WhatsApp Message Link for Patient
  const getWhatsAppLink = (app) => {
    const text =
      `*RHYDHM Physio & Fitness Center*\n` +
      `Hello ${app.patientName},\n` +
      `Your appointment status: *${app.status}*\n` +
      `*Date:* ${app.appointmentDate}\n` +
      `*Time Slot:* ${app.timeSlot}\n` +
      `*Condition:* ${app.primaryIssue}\n\n` +
      (app.sessionNotes?.exercisesGiven?.length
        ? `*Prescribed Exercises:*\n` + app.sessionNotes.exercisesGiven.map((ex, i) => `${i + 1}. ${ex}`).join('\n') + `\n\n`
        : '') +
      (app.sessionNotes?.doctorRemarks ? `*Doctor Remarks:* ${app.sessionNotes.doctorRemarks}\n` : '') +
      (app.sessionNotes?.nextFollowUp ? `*Next Follow-Up:* ${app.sessionNotes.nextFollowUp}\n` : '') +
      `Doctor: Dr. Neha Sharma (PT)\nContact: 9760421410`;

    const cleanPhone = app.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  // Calculate KPI Counts
  const todayStr = new Date().toISOString().split('T')[0];
  const totalCount = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const completedTodayCount = appointments.filter(
    (a) => a.status === 'Completed' && (a.appointmentDate === todayStr || !a.appointmentDate)
  ).length;

  // Filtered Appointments List
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = activeFilter === 'All' || app.status === activeFilter;
    const matchesSearch =
      searchTerm === '' ||
      app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm) ||
      app.primaryIssue?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container pt-5 mt-5 pb-5 my-4">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-header bg-teal text-white text-center py-4" style={{ backgroundColor: '#0d9488' }}>
                <div className="p-3 bg-white text-teal rounded-circle d-inline-flex mb-2" style={{ color: '#0d9488' }}>
                  <Lock size={28} />
                </div>
                <h4 className="fw-bold mb-0">Doctor Admin Portal</h4>
                <small className="text-white-50">RHYDHM Physio & Fitness Center</small>
              </div>
              <div className="card-body p-4">
                {passcodeError && (
                  <div className="alert alert-danger small py-2 mb-3">{passcodeError}</div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold text-secondary small">Enter Passcode / PIN</label>
                    <input
                      type="password"
                      className="form-control form-control-lg text-center fw-bold"
                      placeholder="••••"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-teal w-100 btn-lg rounded-pill fw-bold text-white shadow-sm"
                    style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                  >
                    Unlock Portal
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard pt-5 mt-4 pb-5 px-3 bg-body-tertiary min-vh-100">
      <div className="container-fluid max-w-7xl">
        {/* Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="text-start">
            <span className="badge bg-teal-subtle text-teal px-3 py-1.5 rounded-pill mb-1 fw-semibold">
              Doctor Management System
            </span>
            <h2 className="fw-bold text-teal mb-0">Dr. Neha Sharma (PT) — Dashboard</h2>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={fetchAppointments}
              className="btn btn-outline-teal btn-sm rounded-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
              title="Lock Admin Portal"
            >
              <Lock size={16} />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* TOP KPI CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100" style={{ minHeight: '120px' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Total Bookings</span>
                <div className="p-2 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
                  <Users size={20} />
                </div>
              </div>
              <h2 className="fs-2 fw-bold m-0">{totalCount}</h2>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100" style={{ minHeight: '120px' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Pending</span>
                <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-circle d-flex align-items-center justify-content-center">
                  <Clock size={20} />
                </div>
              </div>
              <h2 className="fs-2 fw-bold m-0 text-warning-emphasis">{pendingCount}</h2>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100" style={{ minHeight: '120px' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Confirmed</span>
                <div className="p-2 bg-info-subtle text-info-emphasis rounded-circle d-flex align-items-center justify-content-center">
                  <Calendar size={20} />
                </div>
              </div>
              <h2 className="fs-2 fw-bold m-0 text-info-emphasis">{confirmedCount}</h2>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100" style={{ minHeight: '120px' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Completed Today</span>
                <div className="p-2 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center">
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <h2 className="fs-2 fw-bold m-0 text-success">{completedTodayCount}</h2>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
          <div className="row g-3 align-items-center">
            {/* Filter Tabs */}
            <div className="col-md-7 text-start">
              <div className="d-flex align-items-center gap-2 flex-wrap" role="group">
                {['All', 'Pending', 'Confirmed', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`btn btn-sm rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-2 transition-all ${
                      activeFilter === tab ? 'btn-teal text-white shadow-sm' : 'btn-outline-secondary'
                    }`}
                    style={activeFilter === tab ? { backgroundColor: '#0d9488', borderColor: '#0d9488' } : {}}
                  >
                    <span>{tab}</span>
                    <span className="badge rounded-pill bg-white text-dark opacity-90 px-2 py-1">
                      {tab === 'All'
                        ? totalCount
                        : appointments.filter((a) => a.status === tab).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-body border-end-0">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Search patient name, phone, condition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {error && (
            <div className="alert alert-danger m-3 mb-0 d-flex align-items-center gap-2">
              <ShieldAlert size={20} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-teal" role="status"></div>
              <p className="mt-2 text-muted small">Loading appointment records...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <Activity size={40} className="mb-2 opacity-50" />
              <p className="mb-0 fw-semibold">No appointments found matching your filter criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 text-start">
                <thead className="bg-body-secondary text-uppercase small text-muted">
                  <tr>
                    <th className="ps-4">PATIENT</th>
                    <th>AGE / GENDER</th>
                    <th>CONDITION / SPECIALTY</th>
                    <th>DATE & TIME SLOT</th>
                    <th>STATUS</th>
                    <th className="text-end pe-4">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((app) => (
                    <tr key={app._id}>
                      {/* Name & Phone */}
                      <td className="ps-4 py-3">
                        <div className="fw-bold text-white fs-6">{app.patientName || 'Anonymous Patient'}</div>
                        <div className="text-muted small">
                          <Phone size={14} className="me-1 text-teal" style={{ color: '#0d9488' }} />
                          {app.phone}
                        </div>
                      </td>

                      {/* Age & Gender */}
                      <td>
                        <span className="fw-semibold">{app.age} yrs</span>
                        <small className="text-muted d-block">{app.gender}</small>
                      </td>

                      {/* Condition */}
                      <td>
                        <span className="badge bg-teal-subtle text-teal fw-semibold" style={{ color: '#0d9488' }}>
                          {app.primaryIssue}
                        </span>
                        {app.symptoms?.length > 0 && (
                          <small className="text-muted d-block text-truncate mt-0.5" style={{ maxWidth: '220px' }}>
                            {app.symptoms.join(', ')}
                          </small>
                        )}
                      </td>

                      {/* Date & Slot */}
                      <td>
                        <div className="fw-semibold">{app.appointmentDate}</div>
                        <small className="text-muted">{app.timeSlot}</small>
                      </td>

                      {/* Status Badge */}
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-1.5 ${
                            app.status === 'Completed'
                              ? 'bg-success'
                              : app.status === 'Confirmed'
                              ? 'bg-primary'
                              : app.status === 'Cancelled'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {app.status || 'Pending'}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="text-end pe-4">
                        <button
                          onClick={() => handleOpenModal(app)}
                          className="btn btn-teal btn-sm rounded-pill px-3 py-1.5 fw-semibold text-white shadow-xs"
                          style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                        >
                          <FileText size={15} className="me-1" />
                          Manage / Prescribe
                        </button>
                        <button
                          onClick={() => handleDelete(app._id, app.patientName || 'this patient')}
                          className="btn btn-outline-danger btn-sm ms-2 px-2 py-1.5 rounded-pill"
                          title="Delete Patient Record"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ACTION & PRESCRIPTION MODAL */}
      {selectedApp && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              {/* Modal Header */}
              <div className="modal-header bg-teal text-white p-4" style={{ backgroundColor: '#0d9488' }}>
                <div>
                  <h4 className="modal-title fw-bold mb-0">{selectedApp.patientName}</h4>
                  <small className="text-white-50">
                    Phone: {selectedApp.phone} • Age: {selectedApp.age} ({selectedApp.gender})
                  </small>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 text-start">
                {actionSuccess && (
                  <div className="alert alert-success alert-dismissible fade show small" role="alert">
                    <CheckCircle2 size={18} className="me-1" />
                    {actionSuccess}
                    <button type="button" className="btn-close" onClick={() => setActionSuccess('')}></button>
                  </div>
                )}

                {/* Appointment Info Summary */}
                <div className="p-3 bg-body-tertiary rounded-3 mb-4 border">
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <strong>Condition:</strong> {selectedApp.primaryIssue}
                    </div>
                    <div className="col-sm-6">
                      <strong>Date & Slot:</strong> {selectedApp.appointmentDate} ({selectedApp.timeSlot})
                    </div>
                    {selectedApp.symptoms?.length > 0 && (
                      <div className="col-12">
                        <strong>Selected Symptoms:</strong> {selectedApp.symptoms.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* 1. STATUS UPDATE CONTROLS */}
                <div className="mb-4">
                  <label className="form-label fw-bold text-dark d-block">Update Appointment Status</label>
                  <div className="btn-group w-100 flex-wrap gap-1" role="group">
                    {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateStatus(st)}
                        disabled={updatingStatus}
                        className={`btn btn-sm py-2 fw-bold ${
                          modalStatus === st
                            ? st === 'Completed'
                              ? 'btn-success text-white'
                              : st === 'Confirmed'
                              ? 'btn-primary text-white'
                              : st === 'Cancelled'
                              ? 'btn-danger text-white'
                              : 'btn-warning text-dark'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="my-4" />

                {/* 2. DIGITAL PRESCRIPTION FORM */}
                <form onSubmit={handleSavePrescription}>
                  <h5 className="fw-bold text-teal mb-3 d-flex align-items-center gap-2">
                    <FileText size={20} />
                    Digital Prescription & Doctor Notes
                  </h5>

                  {/* Add Exercises */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Recommended Exercises</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Chin Tucks (10 reps x 3 sets)"
                        value={newExerciseInput}
                        onChange={(e) => setNewExerciseInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        className="btn btn-teal text-white fw-semibold"
                        style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                      >
                        <Plus size={18} /> Add
                      </button>
                    </div>

                    {/* Exercise List Pills */}
                    {exercises.length > 0 ? (
                      <ul className="list-group list-group-numbered mb-0">
                        {exercises.map((ex, idx) => (
                          <li
                            key={idx}
                            className="list-group-item d-flex justify-content-between align-items-center py-2 bg-body"
                          >
                            <span>{ex}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(idx)}
                              className="btn btn-outline-danger btn-sm p-1 border-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <small className="text-muted italic">No exercises added yet.</small>
                    )}
                  </div>

                  {/* Doctor Remarks */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Doctor Remarks / Instructions</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter clinical observations, precautions, or modalities applied..."
                      value={doctorRemarks}
                      onChange={(e) => setDoctorRemarks(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Next Follow-Up Date */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-secondary small">Next Follow-Up Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                    />
                  </div>

                  {/* Save Prescription Button */}
                  <button
                    type="submit"
                    disabled={savingPrescription}
                    className="btn btn-teal text-white w-100 py-2.5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                  >
                    {savingPrescription ? (
                      <div className="spinner-border spinner-border-sm" role="status"></div>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Digital Prescription
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-body-tertiary justify-content-between">
                {/* WhatsApp Quick Action Button */}
                <a
                  href={getWhatsAppLink(selectedApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2"
                >
                  <MessageSquare size={18} />
                  Send WhatsApp Confirmation / Prescription
                </a>

                <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={handleCloseModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
