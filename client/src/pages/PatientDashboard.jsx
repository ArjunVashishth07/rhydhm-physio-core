import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import {
  User,
  Calendar,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  LogOut,
  MapPin,
  Stethoscope,
  Home as HomeIcon,
  XCircle,
  Award
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/appointments`;

export const PatientDashboard = () => {
  const { user, openAuthModal, logoutUser, lang, t, theme } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'prescriptions'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // Authentication Guard: Redirect guest to Home and trigger AuthModal
  useEffect(() => {
    if (!user) {
      navigate('/');
      setTimeout(() => {
        openAuthModal();
      }, 100);
    }
  }, [user, navigate, openAuthModal]);

  // Fetch patient appointments by phone number
  const fetchPatientHistory = async () => {
    if (!user?.phone) return;
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${API_BASE_URL}/patient-history/${user.phone}`);
      if (res.data && res.data.data) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error('Error loading patient dashboard:', err);
      setError(
        err.response?.data?.message ||
          (lang === 'hi'
            ? 'आपके अपॉइंटमेंट लोड करने में विफलता हुई।'
            : 'Failed to load your appointment history.')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      fetchPatientHistory();
    }
  }, [user]);

  // Handle Cancel Appointment
  const handleCancelAppointment = async (id, appDate) => {
    if (
      window.confirm(
        lang === 'hi'
          ? `क्या आप निश्चित रूप से ${appDate} की अपनी अपॉइंटमेंट रद्द करना चाहते हैं?`
          : `Are you sure you want to cancel your appointment for ${appDate}?`
      )
    ) {
      setCancelLoadingId(id);
      try {
        const res = await axios.put(`${API_BASE_URL}/${id}/cancel`);
        if (res.data?.success) {
          setAppointments(
            appointments.map((a) => (a._id === id ? { ...a, status: 'Cancelled' } : a))
          );
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel appointment');
      } finally {
        setCancelLoadingId(null);
      }
    }
  };

  if (!user) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-teal mb-3" role="status"></div>
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  // Calculate Quick Stats
  const totalSessions = appointments.length;
  const upcomingVisits = appointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Pending'
  ).length;

  // Filter prescriptions (appointments that have sessionNotes with exercises or remarks)
  const prescriptionRecords = appointments.filter(
    (a) =>
      a.sessionNotes &&
      (a.sessionNotes.exercisesGiven?.length > 0 ||
        a.sessionNotes.doctorRemarks ||
        a.sessionNotes.nextFollowUp)
  );

  const patientDisplayName =
    appointments.find((a) => a.patientName)?.patientName || `+91 ${user.phone}`;

  return (
    <div className="patient-dashboard pt-5 mt-4 pb-5 px-3 bg-body-tertiary min-vh-100 text-start">
      <div className="container max-w-5xl">
        {/* TOP GREETING BANNER */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-teal text-white position-relative overflow-hidden" style={{ backgroundColor: '#0d9488' }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="badge bg-white text-teal px-3 py-1.5 rounded-pill mb-2 fw-semibold" style={{ color: '#0d9488' }}>
                Patient Portal
              </div>
              <h2 className="fw-extrabold mb-1 text-white">
                {lang === 'hi' ? 'स्वागत है,' : 'Welcome back,'} {patientDisplayName}
              </h2>
              <p className="text-white-50 mb-3 small">
                Mobile: +91 {user.phone} • Manage your physiotherapy appointments, exercise routines, and doctor prescriptions.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <a
                  href="/#booking-section"
                  className="btn btn-light rounded-pill fw-bold text-teal px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2"
                  style={{ color: '#0d9488' }}
                >
                  <Plus size={18} />
                  <span>{t('bookAppointment')}</span>
                </a>
                <button
                  onClick={fetchPatientHistory}
                  className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Glassmorphism Stat Cards */}
            <div className="col-md-4 mt-4 mt-md-0">
              <div className="row g-2">
                <div className="col-6">
                  <div
                    className="p-3 rounded-3 shadow-xs"
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span className="small d-block fw-semibold mb-1" style={{ color: '#ffffff', opacity: 0.95 }}>
                      Total Sessions
                    </span>
                    <h3 className="fw-extrabold mb-0" style={{ color: '#ffffff' }}>
                      {totalSessions}
                    </h3>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded-3 shadow-xs"
                    style={{
                      background: 'rgba(255, 255, 255, 0.18)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <span className="small d-block fw-semibold mb-1" style={{ color: '#ffffff', opacity: 0.95 }}>
                      Upcoming Visits
                    </span>
                    <h3 className="fw-extrabold mb-0" style={{ color: '#ffffff' }}>
                      {upcomingVisits}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION BAR */}
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div className="btn-group p-1 bg-body rounded-pill shadow-xs border" role="group">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
                activeTab === 'appointments' ? 'btn-teal text-white shadow-sm' : 'btn-ghost text-secondary'
              }`}
              style={activeTab === 'appointments' ? { backgroundColor: '#0d9488', borderColor: '#0d9488' } : {}}
            >
              <Calendar size={18} className="me-1.5" />
              {lang === 'hi' ? 'मेरी अपॉइंटमेंट्स' : 'My Appointments'} ({totalSessions})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`btn rounded-pill px-4 py-2 fw-bold text-nowrap transition-all ${
                activeTab === 'prescriptions' ? 'btn-teal text-white shadow-sm' : 'btn-ghost text-secondary'
              }`}
              style={activeTab === 'prescriptions' ? { backgroundColor: '#0d9488', borderColor: '#0d9488' } : {}}
            >
              <FileText size={18} className="me-1.5" />
              {lang === 'hi' ? 'पर्चा और व्यायाम' : 'Prescriptions & Exercises'} ({prescriptionRecords.length})
            </button>
          </div>

          <button
            onClick={logoutUser}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {error && (
          <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: MY APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-teal" role="status"></div>
                <p className="mt-2 text-muted small">Loading your appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3">
                <Calendar size={48} className="text-teal mb-3 opacity-50 mx-auto" style={{ color: '#0d9488' }} />
                <h5 className="fw-bold mb-2">No Appointments Found</h5>
                <p className="text-muted small max-w-md mx-auto mb-4" style={{ maxWidth: '450px' }}>
                  You don't have any booked appointments yet. Book a consultation with Dr. Neha Sharma (PT) for personalized rehabilitation.
                </p>
                <a
                  href="/#booking-section"
                  className="btn btn-teal text-white rounded-pill px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 mx-auto"
                  style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                >
                  <Plus size={18} />
                  <span>Book Appointment Now</span>
                </a>
              </div>
            ) : (
              <div className="row g-3">
                {appointments.map((app) => {
                  const isHomeVisit = app.primaryIssue === 'Home Physiotherapy';
                  return (
                    <div key={app._id} className="col-md-6">
                      <div className="card border-0 shadow-sm rounded-4 p-4 h-100 card-hover">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <span className="badge bg-teal-subtle text-teal fw-semibold mb-1" style={{ color: '#0d9488' }}>
                              {app.primaryIssue}
                            </span>
                            <h5 className="fw-bold text-dark mb-0">{app.patientName}</h5>
                          </div>
                          {/* Real-time Status Chip */}
                          <span
                            className={`badge rounded-pill px-3 py-1.5 fw-semibold ${
                              app.status === 'Confirmed'
                                ? 'bg-success'
                                : app.status === 'Completed'
                                ? 'bg-teal text-white'
                                : app.status === 'Cancelled'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                            style={app.status === 'Completed' ? { backgroundColor: '#0d9488' } : {}}
                          >
                            {app.status || 'Pending'}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="row g-2 small text-muted mb-3">
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-1.5">
                              <Calendar size={15} className="text-teal" style={{ color: '#0d9488' }} />
                              <span><strong>Date:</strong> {app.appointmentDate}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-1.5">
                              <Clock size={15} className="text-teal" style={{ color: '#0d9488' }} />
                              <span><strong>Slot:</strong> {app.timeSlot}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-1.5">
                              {isHomeVisit ? (
                                <HomeIcon size={15} className="text-warning" />
                              ) : (
                                <MapPin size={15} className="text-teal" style={{ color: '#0d9488' }} />
                              )}
                              <span>
                                <strong>Mode:</strong> {isHomeVisit ? 'Home Visit' : 'Clinic Visit'}
                              </span>
                            </div>
                          </div>
                          {app.symptoms?.length > 0 && (
                            <div className="col-12 mt-1">
                              <span className="fw-semibold text-dark">Symptoms: </span>
                              <span>{app.symptoms.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Cancel Option for Pending/Confirmed */}
                        {(app.status === 'Pending' || app.status === 'Confirmed') && (
                          <div className="pt-3 border-top mt-auto d-flex justify-content-between align-items-center">
                            <small className="text-muted">Need to cancel?</small>
                            <button
                              onClick={() => handleCancelAppointment(app._id, app.appointmentDate)}
                              disabled={cancelLoadingId === app._id}
                              className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1"
                            >
                              {cancelLoadingId === app._id ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                              ) : (
                                <>
                                  <XCircle size={14} />
                                  <span>Cancel Booking</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRESCRIPTIONS & EXERCISES */}
        {activeTab === 'prescriptions' && (
          <div>
            {prescriptionRecords.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3">
                <FileText size={48} className="text-teal mb-3 opacity-50 mx-auto" style={{ color: '#0d9488' }} />
                <h5 className="fw-bold mb-2">No Digital Prescriptions Available Yet</h5>
                <p className="text-muted small max-w-md mx-auto mb-0" style={{ maxWidth: '450px' }}>
                  Once Dr. Neha Sharma (PT) prescribes custom rehabilitation exercises during your consultation, your digital prescription notes will appear here.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-4">
                {prescriptionRecords.map((app) => (
                  <div key={app._id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-3 flex-wrap gap-2">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Stethoscope size={20} className="text-teal" style={{ color: '#0d9488' }} />
                          <h5 className="fw-bold mb-0">Dr. Neha Sharma (PT) — Prescription</h5>
                        </div>
                        <small className="text-muted">
                          Patient: <strong>{app.patientName}</strong> • Condition: <strong>{app.primaryIssue}</strong>
                        </small>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-body-tertiary text-dark border">
                          <Calendar size={13} className="me-1" />
                          {app.appointmentDate}
                        </span>
                      </div>
                    </div>

                    {/* Prescribed Exercises List */}
                    {app.sessionNotes.exercisesGiven?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="fw-bold text-teal mb-2 d-flex align-items-center gap-1.5" style={{ color: '#0d9488' }}>
                          <CheckCircle2 size={18} />
                          Prescribed Exercise Routine:
                        </h6>
                        <div className="row g-2">
                          {app.sessionNotes.exercisesGiven.map((ex, idx) => (
                            <div key={idx} className="col-md-6">
                              <div
                                className="p-3 rounded-3 d-flex align-items-center gap-2.5 transition-all"
                                style={{
                                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                                  border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
                                }}
                              >
                                <span
                                  className="badge rounded-circle text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: '26px', height: '26px', backgroundColor: '#0d9488' }}
                                >
                                  {idx + 1}
                                </span>
                                <span
                                  className="fw-semibold small"
                                  style={{ color: theme === 'dark' ? '#f1f5f9' : '#0f172a' }}
                                >
                                  {ex}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Doctor Remarks */}
                    {app.sessionNotes.doctorRemarks && (
                      <div
                        className="mb-3 p-3 rounded-3"
                        style={{
                          backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
                          border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0'
                        }}
                      >
                        <strong
                          className="d-block small mb-1"
                          style={{ color: theme === 'dark' ? '#94a3b8' : '#475569' }}
                        >
                          Doctor Remarks & Advice:
                        </strong>
                        <p
                          className="mb-0 small fw-medium"
                          style={{ color: theme === 'dark' ? '#e2e8f0' : '#334155' }}
                        >
                          {app.sessionNotes.doctorRemarks}
                        </p>
                      </div>
                    )}

                    {/* Next Follow-Up */}
                    {app.sessionNotes.nextFollowUp && (
                      <div
                        className="d-inline-flex align-items-center gap-2 p-2 px-3 rounded-pill fw-semibold small"
                        style={{
                          backgroundColor: theme === 'dark' ? 'rgba(13, 148, 136, 0.2)' : 'rgba(13, 148, 136, 0.12)',
                          color: theme === 'dark' ? '#2dd4bf' : '#0d9488',
                          border: theme === 'dark' ? '1px solid rgba(45, 212, 191, 0.3)' : '1px solid rgba(13, 148, 136, 0.2)',
                          width: 'fit-content'
                        }}
                      >
                        <Award size={16} />
                        <span>Next Follow-Up Date: {app.sessionNotes.nextFollowUp}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
