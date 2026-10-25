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
  Award,
  X,
  Megaphone,
  AlertTriangle,
  Sparkles,
  Info,
  UserCheck,
  ArrowRight,
  Filter,
  Layers,
  Table as TableIcon,
  Users
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import '../components/AnnouncementBanner.css';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/appointments`;
const ANNOUNCEMENTS_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/announcements/patient`;

export const PatientDashboard = () => {
  const { user, logoutUser, lang, t, theme } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'prescriptions' | 'announcements'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Dedicated Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [dismissedCriticalId, setDismissedCriticalId] = useState(null);
  const [announcementFilter, setAnnouncementFilter] = useState('All'); // 'All' | 'critical' | 'advisory' | 'regular'
  const [announcementViewMode, setAnnouncementViewMode] = useState('cards'); // 'cards' | 'table'

  // Authentication Guard: Redirect guest to /login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const userPhone = user?.phone || user?.mobile || '';

  // Fetch patient appointments by phone number
  const fetchPatientHistory = async () => {
    if (!userPhone) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${API_BASE_URL}/patient-history/${userPhone}`);
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

  // Fetch active patient announcements
  const fetchPatientAnnouncements = async () => {
    setAnnouncementsLoading(true);
    try {
      const token = localStorage.getItem('rhydhm_token');
      const patientId = user?.id || user?._id;

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = {};
      if (patientId) {
        params.patientId = patientId;
      }

      const res = await axios.get(ANNOUNCEMENTS_API_URL, {
        headers,
        params
      });

      if (res.data?.success && Array.isArray(res.data.announcements)) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error('Error fetching patient announcements:', err);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  useEffect(() => {
    if (userPhone) {
      fetchPatientHistory();
    }
  }, [userPhone]);

  useEffect(() => {
    if (user) {
      fetchPatientAnnouncements();
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

  // Announcement KPI Counts & Helpers
  const activeAnnouncementsCount = announcements.length;
  const criticalCount = announcements.filter((a) => a.type === 'critical').length;
  const advisoryCount = announcements.filter((a) => a.type === 'advisory').length;
  const regularCount = announcements.filter((a) => a.type === 'regular' || !a.type).length;

  // Top Banner Optimization: Show only 1 sleek critical alert if active and not dismissed
  const activeCriticalAnnouncement = announcements.find(
    (a) => a.type === 'critical' && a._id !== dismissedCriticalId
  );

  // Format announcement expiry
  const formatAnnouncementExpiry = (dateStr) => {
    if (!dateStr) return 'No expiry date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Remaining validity time label
  const getExpiryStatus = (dateStr) => {
    if (!dateStr) return null;
    const diffMs = new Date(dateStr) - new Date();
    if (diffMs <= 0) return 'Expired';
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 24) {
      return `${diffHours}h left`;
    }
    return `${diffDays}d left`;
  };

  const filteredAnnouncements = announcements.filter((item) => {
    if (announcementFilter === 'All') return true;
    return item.type === announcementFilter.toLowerCase();
  });

  const patientDisplayName =
    user.fullName || appointments.find((a) => a.patientName)?.patientName || (userPhone ? `+91 ${userPhone}` : 'Patient');

  return (
    <div className="patient-dashboard pt-5 mt-4 pb-5 px-3 bg-body-tertiary min-vh-100 text-start">
      <div className="container max-w-5xl">
        {/* TOP BANNER OPTIMIZATION: Stacked banners pile removed. Only 1 compact critical notice shown if urgent */}
        {activeCriticalAnnouncement && (
          <div
            className="alert border-0 shadow-sm rounded-4 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2.5"
            style={{
              background:
                theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
              borderLeft: '5px solid #ef4444',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              boxShadow:
                theme === 'dark'
                  ? '0 8px 24px -4px rgba(239, 68, 68, 0.3)'
                  : '0 4px 16px -2px rgba(239, 68, 68, 0.15)'
            }}
            role="alert"
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="p-2.5 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-0.5">
                  <span
                    className="badge rounded-pill px-2 py-0.5 fw-bold"
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    CRITICAL NOTICE
                  </span>
                  <strong
                    className="fw-bold"
                    style={{ color: theme === 'dark' ? '#ffffff' : '#991b1b', fontSize: '0.95rem' }}
                  >
                    {activeCriticalAnnouncement.title}
                  </strong>
                </div>
                <p
                  className="mb-0 small text-truncate"
                  style={{
                    maxWidth: '560px',
                    color: theme === 'dark' ? '#fca5a5' : '#7f1d1d'
                  }}
                >
                  {activeCriticalAnnouncement.description}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 ms-auto">
              <button
                type="button"
                onClick={() => setActiveTab('announcements')}
                className="btn btn-danger btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1 shadow-xs"
                style={{ fontSize: '0.82rem' }}
              >
                <span>View Details</span>
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setDismissedCriticalId(activeCriticalAnnouncement._id)}
                className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '30px',
                  height: '30px',
                  background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                  border: 'none',
                  color: theme === 'dark' ? '#fca5a5' : '#991b1b'
                }}
                title="Dismiss alert"
                aria-label="Dismiss alert"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* TOP GREETING BANNER */}
        <div
          className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 text-white position-relative overflow-hidden clinical-banner"
        >
          <div className="row align-items-center">
            <div className="col-md-8">
              <div
                className="badge px-3 py-1.5 rounded-pill mb-2 fw-semibold clinical-banner-badge"
              >
                Patient Portal
              </div>
              <h2 className="fw-extrabold mb-1 text-white">
                {lang === 'hi' ? 'स्वागत है,' : 'Welcome back,'} {patientDisplayName}
              </h2>
              <p className="text-white-50 mb-3 small">
                Mobile: +91 {userPhone} • Manage your physiotherapy appointments, exercise routines, and doctor prescriptions.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="btn rounded-pill fw-bold px-4 py-2 shadow-sm d-inline-flex align-items-center gap-2 clinical-banner-btn"
                >
                  <Plus size={18} />
                  <span>{t('bookAppointment')}</span>
                </button>
                <button
                  onClick={() => {
                    fetchPatientHistory();
                    fetchPatientAnnouncements();
                  }}
                  className="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                  disabled={loading || announcementsLoading}
                >
                  <RefreshCw size={16} className={loading || announcementsLoading ? 'spin' : ''} />
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
              className={`btn rounded-pill px-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all ${
                activeTab === 'appointments' ? 'btn-teal text-white shadow-sm' : 'btn-ghost text-secondary'
              }`}
            >
              <Calendar size={18} className="me-1.5" />
              {lang === 'hi' ? 'मेरी अपॉइंटमेंट्स' : 'My Appointments'} ({totalSessions})
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`btn rounded-pill px-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all ${
                activeTab === 'prescriptions' ? 'btn-teal text-white shadow-sm' : 'btn-ghost text-secondary'
              }`}
            >
              <FileText size={18} className="me-1.5" />
              {lang === 'hi' ? 'पर्चा और व्यायाम' : 'Prescriptions & Exercises'} ({prescriptionRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`btn rounded-pill px-3.5 px-md-4 py-2 fw-bold text-nowrap transition-all d-inline-flex align-items-center gap-1.5 ${
                activeTab === 'announcements' ? 'btn-teal text-white shadow-sm' : 'btn-ghost text-secondary'
              }`}
            >
              <span role="img" aria-label="announcements">📢</span>
              <span>{lang === 'hi' ? 'सूचनाएं' : 'Announcements'}</span>
              <span
                className={`badge rounded-pill px-2 py-0.5 fw-bold ${
                  activeTab === 'announcements'
                    ? 'bg-white text-teal'
                    : activeAnnouncementsCount > 0
                    ? 'bg-teal text-white'
                    : 'bg-secondary text-white'
                }`}
                style={{ fontSize: '0.75rem' }}
              >
                {activeAnnouncementsCount}
              </span>
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
                <Calendar size={48} className="text-teal mb-3 opacity-50 mx-auto" />
                <h5 className="fw-bold mb-2">No Appointments Found</h5>
                <p className="text-muted small max-w-md mx-auto mb-4" style={{ maxWidth: '450px' }}>
                  You don't have any booked appointments yet. Book a consultation with Dr. Neha Sharma (PT) for personalized rehabilitation.
                </p>
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="btn btn-teal text-white rounded-pill px-4 py-2.5 fw-bold d-inline-flex align-items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  <span>Book Appointment Now</span>
                </button>
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
                            <span className="badge bg-teal-subtle text-teal fw-semibold mb-1">
                              {app.primaryIssue}
                            </span>
                            <h5 className="fw-bold mb-0">{app.patientName}</h5>
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
                          >
                            {app.status || 'Pending'}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="row g-2 small text-muted mb-3">
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-1.5">
                              <Calendar size={15} className="text-teal" />
                              <span><strong>Date:</strong> {app.appointmentDate}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-1.5">
                              <Clock size={15} className="text-teal" />
                              <span><strong>Slot:</strong> {app.timeSlot}</span>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-1.5">
                              {isHomeVisit ? (
                                <HomeIcon size={15} className="text-warning" />
                              ) : (
                                <MapPin size={15} className="text-teal" />
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
                <FileText size={48} className="text-teal mb-3 opacity-50 mx-auto" />
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
                          <Stethoscope size={20} className="text-teal" />
                          <h5 className="fw-bold mb-0">Dr. Neha Sharma (PT) — Prescription</h5>
                        </div>
                        <small className="text-muted">
                          Patient: <strong>{app.patientName}</strong> • Condition: <strong>{app.primaryIssue}</strong>
                        </small>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-body-tertiary text-body border">
                          <Calendar size={13} className="me-1" />
                          {app.appointmentDate}
                        </span>
                      </div>
                    </div>

                    {/* Prescribed Exercises List */}
                    {app.sessionNotes.exercisesGiven?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="fw-bold text-teal mb-2 d-flex align-items-center gap-1.5">
                          <CheckCircle2 size={18} />
                          Prescribed Exercise Routine:
                        </h6>
                        <div className="row g-2">
                          {app.sessionNotes.exercisesGiven.map((ex, idx) => (
                            <div key={idx} className="col-md-6">
                              <div
                                className="p-3 rounded-3 d-flex align-items-center gap-2.5 transition-all"
                                style={{
                                  backgroundColor: theme === 'dark' ? '#231e1a' : '#ffffff',
                                  border: theme === 'dark' ? '1px solid #383028' : '1px solid #e8dfd3'
                                }}
                              >
                                <span
                                  className="badge rounded-circle text-white p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                                  style={{ width: '26px', height: '26px', backgroundColor: 'var(--teal-primary)' }}
                                >
                                  {idx + 1}
                                </span>
                                <span
                                  className="fw-semibold small"
                                  style={{ color: theme === 'dark' ? '#faf5ee' : '#241e19' }}
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
                          backgroundColor: theme === 'dark' ? '#231e1a' : '#f7f4ef',
                          border: theme === 'dark' ? '1px solid #383028' : '1px solid #e8dfd3'
                        }}
                      >
                        <strong
                          className="d-block small mb-1"
                          style={{ color: theme === 'dark' ? '#ad9e8f' : '#6e6154' }}
                        >
                          Doctor Remarks & Advice:
                        </strong>
                        <p
                          className="mb-0 small fw-medium"
                          style={{ color: theme === 'dark' ? '#faf5ee' : '#241e19' }}
                        >
                          {app.sessionNotes.doctorRemarks}
                        </p>
                      </div>
                    )}

                    {/* Next Follow-Up */}
                    {app.sessionNotes.nextFollowUp && (
                      <div
                        className="d-inline-flex align-items-center gap-2 p-2 px-3 rounded-pill fw-semibold small bg-teal-subtle text-teal"
                        style={{
                          border: '1px solid var(--teal-border)',
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

        {/* TAB 3: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div>
            {/* Control Bar: Category Filters & View Switcher */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                {/* Filter Pills */}
                <div className="d-flex align-items-center gap-1.5 flex-wrap">
                  <span className="small text-muted fw-semibold me-1 d-flex align-items-center gap-1">
                    <Filter size={14} /> Filter:
                  </span>
                  {['All', 'Critical', 'Advisory', 'Regular'].map((filterOption) => {
                    const count =
                      filterOption === 'All'
                        ? announcements.length
                        : filterOption === 'Critical'
                        ? criticalCount
                        : filterOption === 'Advisory'
                        ? advisoryCount
                        : regularCount;

                    const isSelected = announcementFilter === filterOption;
                    return (
                      <button
                        key={filterOption}
                        type="button"
                        onClick={() => setAnnouncementFilter(filterOption)}
                        className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all d-inline-flex align-items-center gap-2 ${
                          isSelected
                            ? 'btn-teal text-white shadow-xs'
                            : 'btn-outline-secondary border-0 bg-body-tertiary text-muted'
                        }`}
                        style={{ fontSize: '0.82rem' }}
                      >
                        <span>{filterOption}</span>
                        <span
                          className={`badge rounded-pill px-2 py-0.5 fw-bold ms-1 ${
                            isSelected
                              ? 'bg-white text-teal shadow-xs'
                              : 'bg-body text-secondary border'
                          }`}
                          style={{ fontSize: '0.72rem', minWidth: '1.4rem' }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* View Switcher: Cards vs Table */}
                <div className="d-flex align-items-center gap-1 bg-body-tertiary p-1 rounded-pill border ms-auto">
                  <button
                    type="button"
                    onClick={() => setAnnouncementViewMode('cards')}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                      announcementViewMode === 'cards'
                        ? 'btn-teal text-white shadow-xs'
                        : 'text-muted border-0 bg-transparent'
                    }`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <Layers size={14} />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnouncementViewMode('table')}
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                      announcementViewMode === 'table'
                        ? 'btn-teal text-white shadow-xs'
                        : 'text-muted border-0 bg-transparent'
                    }`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <TableIcon size={14} />
                    <span>Table</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Loader */}
            {announcementsLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-teal" role="status"></div>
                <p className="mt-2 text-muted small">Loading clinic announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3">
                <div
                  className="p-3 rounded-circle bg-teal-subtle text-teal d-inline-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '64px', height: '64px' }}
                >
                  <Megaphone size={32} />
                </div>
                <h5 className="fw-bold mb-2">
                  {announcements.length === 0
                    ? 'No Active Announcements'
                    : `No ${announcementFilter} Announcements Found`}
                </h5>
                <p className="text-muted small max-w-md mx-auto mb-0" style={{ maxWidth: '460px' }}>
                  {announcements.length === 0
                    ? 'You are all caught up! There are currently no new announcements, clinic schedule changes, or personal advisories.'
                    : `There are currently no announcements matching the "${announcementFilter}" category.`}
                </p>
                {announcements.length > 0 && announcementFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setAnnouncementFilter('All')}
                    className="btn btn-outline-teal btn-sm rounded-pill px-3 py-1.5 mt-3 mx-auto fw-semibold"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : announcementViewMode === 'table' ? (
              /* CLEAN TABLE FORMAT */
              <div
                className={`card border shadow-sm rounded-4 overflow-hidden patient-table-container ${
                  theme === 'dark' ? 'patient-table-dark' : 'patient-table-light'
                }`}
              >
                <div className="table-responsive">
                  <table className="table patient-announcement-table align-middle mb-0 text-start">
                    <thead>
                      <tr>
                        <th style={{ minWidth: '140px', width: '15%' }}>TYPE</th>
                        <th style={{ minWidth: '280px', width: '45%' }}>TITLE & DESCRIPTION</th>
                        <th style={{ minWidth: '220px', width: '25%' }}>EXPIRY DATE</th>
                        <th style={{ minWidth: '130px', width: '15%' }}>AUDIENCE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAnnouncements.map((item) => {
                        const itemType = item.type || 'regular';
                        const remaining = getExpiryStatus(item.expiryDate);

                        return (
                          <tr key={item._id}>
                            {/* Column 1: Type Badge */}
                            <td>
                              {itemType === 'critical' ? (
                                <span className="announcement-badge announcement-badge-critical">
                                  <AlertTriangle size={13} />
                                  <span>Critical</span>
                                </span>
                              ) : itemType === 'advisory' ? (
                                <span className="announcement-badge announcement-badge-advisory">
                                  <Sparkles size={13} />
                                  <span>Advisory</span>
                                </span>
                              ) : (
                                <span className="announcement-badge announcement-badge-regular">
                                  <Info size={13} />
                                  <span>Regular</span>
                                </span>
                              )}
                            </td>

                            {/* Column 2: Title & Description */}
                            <td>
                              <div className="fw-bold fs-6 mb-1 text-truncate" style={{ maxWidth: '420px' }}>
                                {item.title}
                              </div>
                              <p
                                className="small mb-1"
                                style={{
                                  color: theme === 'dark' ? '#cbd5e1' : '#475569',
                                  lineHeight: '1.55'
                                }}
                              >
                                {item.description}
                              </p>
                              {item.targetType === 'individual' && (
                                <span
                                  className="announcement-badge announcement-badge-direct mt-1"
                                  style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem' }}
                                >
                                  <UserCheck size={11} />
                                  <span>
                                    Direct Notice {item.targetPatientName ? `• ${item.targetPatientName}` : ''}
                                  </span>
                                </span>
                              )}
                            </td>

                            {/* Column 3: Expiry Date */}
                            <td>
                              <div className="d-flex flex-column gap-1.5">
                                <div className="d-inline-flex align-items-center gap-1.5 small fw-semibold text-nowrap">
                                  <Clock size={14} className="text-teal flex-shrink-0" />
                                  <span>{formatAnnouncementExpiry(item.expiryDate)}</span>
                                </div>
                                {remaining && (
                                  <span
                                    className={`announcement-expiry-chip ${
                                      itemType === 'critical' ? 'chip-critical' : ''
                                    }`}
                                    style={{ width: 'fit-content' }}
                                  >
                                    Valid ({remaining})
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Column 4: Audience */}
                            <td>
                              {item.targetType === 'individual' ? (
                                <span className="badge rounded-pill px-2.5 py-1 small fw-semibold bg-warning-subtle text-warning-emphasis border border-warning-subtle d-inline-flex align-items-center gap-1.5">
                                  <User size={12} />
                                  <span>Personal</span>
                                </span>
                              ) : (
                                <span className="badge rounded-pill px-2.5 py-1 small fw-semibold bg-primary-subtle text-primary border border-primary-subtle d-inline-flex align-items-center gap-1.5">
                                  <Users size={12} />
                                  <span>All Patients</span>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CLEAN CARDS VIEW: Redesigned Airy Light Theme & Double-Shade Dark Theme */
              <div className="announcement-cards-stack">
                {filteredAnnouncements.map((item) => {
                  const itemType = item.type || 'regular';
                  const remaining = getExpiryStatus(item.expiryDate);
                  const isDark = theme === 'dark';

                  const cardClass = isDark
                    ? 'patient-announcement-card dark-slate-card'
                    : 'patient-announcement-card light-card';

                  const accentClass =
                    itemType === 'critical'
                      ? 'announcement-accent-critical'
                      : itemType === 'advisory'
                      ? 'announcement-accent-advisory'
                      : 'announcement-accent-regular';

                  return (
                    <div key={item._id} className={`${cardClass} ${accentClass}`}>
                      {/* Top Header Bar */}
                      <div className="announcement-card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {/* Type Badge: Regular / Advisory / Critical */}
                          {itemType === 'critical' ? (
                            <span className="announcement-badge announcement-badge-critical">
                              <AlertTriangle size={13} />
                              <span>CRITICAL</span>
                            </span>
                          ) : itemType === 'advisory' ? (
                            <span className="announcement-badge announcement-badge-advisory">
                              <Sparkles size={13} />
                              <span>ADVISORY</span>
                            </span>
                          ) : (
                            <span className="announcement-badge announcement-badge-regular">
                              <Info size={13} />
                              <span>REGULAR</span>
                            </span>
                          )}

                          {/* Direct Notice Tag */}
                          {item.targetType === 'individual' && (
                            <span className="announcement-badge announcement-badge-direct">
                              <UserCheck size={12} />
                              <span>
                                Direct Notice {item.targetPatientName ? `• ${item.targetPatientName}` : ''}
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Expiry Date Display */}
                        <div className="d-flex align-items-center gap-2 ms-auto">
                          <span className="announcement-expiry-meta d-inline-flex align-items-center gap-1.5">
                            <Calendar size={13} className="text-teal" />
                            <span>Expires: {formatAnnouncementExpiry(item.expiryDate)}</span>
                          </span>
                          {remaining && (
                            <span
                              className={`announcement-expiry-chip ${
                                itemType === 'critical' ? 'chip-critical' : ''
                              }`}
                            >
                              {remaining}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Body: Title & Full Description */}
                      <div className="p-4 pt-3">
                        <h5 className="announcement-card-title mb-2">
                          {item.title}
                        </h5>
                        <p className="announcement-card-desc mb-0">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BOOKING MODAL */}
        {showBookingModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              zIndex: 1060
            }}
            onClick={() => setShowBookingModal(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden position-relative">
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-3 z-3 bg-white p-2 rounded-circle shadow-sm"
                  onClick={() => setShowBookingModal(false)}
                  aria-label="Close"
                ></button>
                <BookingForm
                  onBookingSuccess={() => {
                    fetchPatientHistory();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
