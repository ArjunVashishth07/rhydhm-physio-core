import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookingForm from '../components/BookingForm';
import BaseModal from '../components/common/BaseModal';
import { CriticalNoticeBanner } from '../modules/announcements';
import {
  usePatientDashboard,
  PatientGreetingBanner,
  PatientTabNav,
  PatientAppointmentsView,
  PatientPrescriptionsView,
  PatientAnnouncementsView
} from '../modules/patient';
import '../components/AnnouncementBanner.css';

/**
 * PatientDashboard: Ultra-lean orchestrator coordinating sub-views via usePatientDashboard hook.
 */
export const PatientDashboard = () => {
  const { user, logoutUser, lang, t, theme } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'prescriptions' | 'announcements'
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Authentication Guard: Redirect guests to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const userPhone = user?.phone || user?.mobile || '';
  const patientId = user?.id || user?._id || '';

  // Encapsulated data state & mutations via custom hook
  const {
    appointments,
    loading,
    error,
    cancelLoadingId,
    announcements,
    announcementsLoading,
    totalSessions,
    upcomingVisits,
    prescriptionRecords,
    activeCriticalAnnouncement,
    setDismissedCriticalId,
    handleCancelAppointment,
    refreshAll
  } = usePatientDashboard(userPhone, patientId);

  if (!user) {
    return (
      <div className="container text-center py-5 my-5">
        <div className="spinner-border text-teal mb-3" role="status"></div>
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  const patientDisplayName =
    user.fullName ||
    appointments.find((a) => a.patientName)?.patientName ||
    (userPhone ? `+91 ${userPhone}` : 'Patient');

  return (
    <div className="patient-dashboard pb-5 bg-body-tertiary min-vh-100 text-start">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 pb-4" style={{ maxWidth: '64rem' }}>
        {/* Session-Dismissible Critical Notice Banner */}
        {activeCriticalAnnouncement && (
          <CriticalNoticeBanner
            announcement={activeCriticalAnnouncement}
            theme={theme}
            onViewDetails={() => setActiveTab('announcements')}
            onDismiss={() => setDismissedCriticalId(activeCriticalAnnouncement._id)}
          />
        )}

        {/* Top Welcome & KPI Header Banner */}
        <PatientGreetingBanner
          displayName={patientDisplayName}
          phone={userPhone}
          totalSessions={totalSessions}
          upcomingVisits={upcomingVisits}
          onBookClick={() => setShowBookingModal(true)}
          onRefresh={refreshAll}
          loading={loading || announcementsLoading}
          lang={lang}
          bookAppointmentLabel={t('bookAppointment')}
        />

        {/* Horizontally Scrollable Clinical Tab Navigation */}
        <PatientTabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          appointmentsCount={totalSessions}
          prescriptionsCount={prescriptionRecords.length}
          announcementsCount={announcements.length}
          onLogout={logoutUser}
          lang={lang}
        />

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <PatientAppointmentsView
            appointments={appointments}
            loading={loading}
            error={error}
            onCancel={(id, appDate) =>
              handleCancelAppointment(
                id,
                appDate,
                lang === 'hi'
                  ? `क्या आप निश्चित रूप से ${appDate} की अपनी अपॉइंटमेंट रद्द करना चाहते हैं?`
                  : `Are you sure you want to cancel your appointment for ${appDate}?`
              )
            }
            cancelLoadingId={cancelLoadingId}
            onOpenBooking={() => setShowBookingModal(true)}
            lang={lang}
          />
        )}

        {/* TAB 2: Digital Prescriptions & Exercise Routines */}
        {activeTab === 'prescriptions' && (
          <PatientPrescriptionsView
            prescriptionRecords={prescriptionRecords}
            theme={theme}
          />
        )}

        {/* TAB 3: Clinic Announcements & Personal Advisories */}
        {activeTab === 'announcements' && (
          <PatientAnnouncementsView
            announcements={announcements}
            loading={announcementsLoading}
            theme={theme}
            lang={lang}
          />
        )}

        {/* Reusable Accessible Booking Modal */}
        <BaseModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          size="lg"
        >
          <BookingForm
            onBookingSuccess={() => {
              setShowBookingModal(false);
              refreshAll();
            }}
          />
        </BaseModal>
      </div>
    </div>
  );
};

export default PatientDashboard;
