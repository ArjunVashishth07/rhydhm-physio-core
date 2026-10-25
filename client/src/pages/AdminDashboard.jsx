import React, { useState } from 'react';
import AdminAnnouncements from '../components/AdminAnnouncements';
import {
  AdminAppointmentTable
} from '../modules/appointments';
import {
  PrescriptionEditModal
} from '../modules/prescriptions';
import {
  useAdminDashboard,
  AdminPasscodeGate,
  AdminHeaderNav,
  AdminStatsRibbon,
  AdminFilterBar
} from '../modules/admin';

/**
 * AdminDashboard: Lean orchestrator coordinating administrative sub-views
 * via useAdminDashboard hook and modules inside .admin-portal-container.
 */
export const AdminDashboard = () => {
  const [mainTab, setMainTab] = useState('appointments'); // 'appointments' | 'announcements'

  // PIN Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rhydhm_admin_auth') === 'true';
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('rhydhm_admin_auth');
    localStorage.removeItem('rhydhm_admin_token');
  };

  // Encapsulated Admin Data & Mutations
  const {
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
    handleOpenModal,
    handleCloseModal,
    handleUpdateStatus,
    handleSavePrescription,
    handleDelete
  } = useAdminDashboard(isAuthenticated);

  // 1. PIN Shield Gate if locked
  if (!isAuthenticated) {
    return <AdminPasscodeGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="admin-dashboard pb-5 bg-body-tertiary min-vh-100">
      <div className="admin-portal-container mx-auto px-3 px-sm-4 px-xl-5 pt-3 sm:pt-4 pb-4">
        {/* Top Header & Tab Navigation Switcher */}
        <AdminHeaderNav
          mainTab={mainTab}
          onTabChange={setMainTab}
          onLockPortal={handleLogout}
        />

        {/* TAB 1: ANNOUNCEMENTS MANAGEMENT */}
        {mainTab === 'announcements' ? (
          <AdminAnnouncements />
        ) : (
          /* TAB 2: APPOINTMENTS & PRESCRIPTIONS MANAGEMENT */
          <>
            {/* KPI Summary Cards */}
            <AdminStatsRibbon
              totalCount={totalCount}
              pendingCount={pendingCount}
              confirmedCount={confirmedCount}
              completedTodayCount={completedTodayCount}
            />

            {/* Controls & Filter Bar */}
            <AdminFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              counts={{
                All: totalCount,
                Pending: pendingCount,
                Confirmed: confirmedCount,
                Completed: completedTodayCount
              }}
            />

            {/* Appointments Table */}
            <AdminAppointmentTable
              appointments={filteredAppointments}
              loading={loading}
              error={error}
              onOpenManageModal={handleOpenModal}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>

      {/* Modular Prescription & Manage Modal */}
      <PrescriptionEditModal
        isOpen={Boolean(selectedApp)}
        onClose={handleCloseModal}
        appointment={selectedApp}
        onUpdateStatus={handleUpdateStatus}
        onSavePrescription={handleSavePrescription}
        updatingStatus={updatingStatus}
        savingPrescription={savingPrescription}
        actionSuccess={actionSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
