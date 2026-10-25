import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  EyeOff
} from 'lucide-react';
import { toDatetimeLocal, getDefaultExpiry } from '../utils/dateUtils';
import {
  fetchAnnouncements,
  fetchRegisteredPatients,
  createAnnouncement,
  updateAnnouncement,
  dismissAnnouncement,
  deleteAnnouncement,
  AdminAnnouncementFormModal,
  AnnouncementPreviewModal,
  AnnouncementTable
} from '../modules/announcements';

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Filtering & Search
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Registered Patients for Specific Target Selection
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Dedicated Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'regular',
    targetType: 'all',
    targetPatientId: '',
    startDate: toDatetimeLocal(new Date()),
    expiryDate: getDefaultExpiry(),
    isActive: true
  });

  // Fetch Announcements
  const loadAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAnnouncements();
      if (data?.success && Array.isArray(data.announcements)) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('Error fetching admin announcements:', err);
      setError(err.response?.data?.message || 'Failed to load announcements from server.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Patients List for dropdown
  const loadPatients = async () => {
    setPatientsLoading(true);
    try {
      const data = await fetchRegisteredPatients();
      if (data?.success && Array.isArray(data.patients)) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients list:', err);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    loadPatients();
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      type: 'regular',
      targetType: 'all',
      targetPatientId: '',
      startDate: toDatetimeLocal(new Date()),
      expiryDate: getDefaultExpiry(),
      isActive: true
    });
    setFormError('');
    setShowPreviewModal(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    const targetPatientId = item.targetPatientId?._id || item.targetPatientId || '';

    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'regular',
      targetType: item.targetType || 'all',
      targetPatientId,
      startDate: toDatetimeLocal(item.startDate) || toDatetimeLocal(new Date()),
      expiryDate: toDatetimeLocal(item.expiryDate) || getDefaultExpiry(),
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setFormError('');
    setShowPreviewModal(false);
    setIsModalOpen(true);
  };

  // Close Main Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowPreviewModal(false);
    setEditingItem(null);
    setFormError('');
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Please enter an announcement title.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please enter announcement details or description.');
      return;
    }
    if (!formData.expiryDate) {
      setFormError('Please specify an expiry date and time.');
      return;
    }
    if (formData.targetType === 'individual' && !formData.targetPatientId) {
      setFormError('Please select a specific patient for individual targeting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        targetType: formData.targetType,
        targetPatientId: formData.targetType === 'individual' ? formData.targetPatientId : null,
        startDate: new Date(formData.startDate),
        expiryDate: new Date(formData.expiryDate),
        isActive: formData.isActive
      };

      if (editingItem) {
        const res = await updateAnnouncement(editingItem._id, payload);
        if (res?.success) {
          setActionSuccess(`Announcement "${payload.title}" updated successfully!`);
          loadAnnouncements();
          handleCloseModal();
        }
      } else {
        const res = await createAnnouncement(payload);
        if (res?.success) {
          setActionSuccess(`Announcement "${payload.title}" published successfully!`);
          loadAnnouncements();
          handleCloseModal();
        }
      }
    } catch (err) {
      console.error('Error saving announcement:', err);
      setFormError(err.response?.data?.message || 'Failed to save announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  // Immediate Dismissal Handler
  const handleDismiss = async (id, title) => {
    try {
      const res = await dismissAnnouncement(id);
      if (res?.success) {
        setActionSuccess(`Announcement "${title}" was deactivated.`);
        setAnnouncements((prev) =>
          prev.map((a) => (a._id === id ? { ...a, isActive: false, status: 'Dismissed' } : a))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dismiss announcement');
    }
  };

  // Delete Announcement
  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete announcement "${title}"?`)) {
      try {
        const res = await deleteAnnouncement(id);
        if (res?.success) {
          setActionSuccess('Announcement deleted permanently.');
          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete announcement');
      }
    }
  };

  // Calculate KPI Counts
  const totalCount = announcements.length;
  const liveCount = announcements.filter((a) => a.status === 'Live').length;
  const dismissedCount = announcements.filter((a) => a.status === 'Dismissed').length;
  const expiredCount = announcements.filter((a) => a.status === 'Expired').length;

  // Filter Announcements for Table Display
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesFilter =
      activeFilter === 'All' ||
      item.status === activeFilter ||
      item.type === activeFilter.toLowerCase();

    const matchesSearch =
      searchTerm === '' ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetPatientId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetPatientId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetPatientId?.mobile?.includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const selectedPatient = patients.find((p) => p._id === formData.targetPatientId);

  return (
    <div className="admin-announcements">
      {/* Toast Notification Alert */}
      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center justify-content-between mb-4 shadow-sm rounded-3">
          <div className="d-flex align-items-center gap-2">
            <CheckCircle2 size={18} className="text-success" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionSuccess('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* KPI STAT CARDS */}
      <div className="row g-3 mb-4">
        {/* Total Announcements */}
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100"
            style={{ minHeight: '120px' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Total Announcements</span>
              <div className="p-2 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center">
                <Megaphone size={20} />
              </div>
            </div>
            <h2 className="fs-2 fw-bold m-0">{totalCount}</h2>
          </div>
        </div>

        {/* Live Active */}
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100"
            style={{ minHeight: '120px' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Live on Portal</span>
              <div className="p-2 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <h2 className="fs-2 fw-bold m-0 text-success">{liveCount}</h2>
          </div>
        </div>

        {/* Dismissed */}
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100"
            style={{ minHeight: '120px' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Dismissed / Inactive</span>
              <div className="p-2 bg-secondary-subtle text-secondary rounded-circle d-flex align-items-center justify-content-center">
                <EyeOff size={20} />
              </div>
            </div>
            <h2 className="fs-2 fw-bold m-0 text-secondary">{dismissedCount}</h2>
          </div>
        </div>

        {/* Expired */}
        <div className="col-6 col-md-3">
          <div
            className="card border-0 shadow-sm rounded-4 p-4 bg-body d-flex flex-column justify-content-between h-100"
            style={{ minHeight: '120px' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Expired</span>
              <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-circle d-flex align-items-center justify-content-center">
                <Clock size={20} />
              </div>
            </div>
            <h2 className="fs-2 fw-bold m-0 text-warning-emphasis">{expiredCount}</h2>
          </div>
        </div>
      </div>

      {/* CONTROLS & FILTER BAR */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 p-3">
        <div className="row g-3 align-items-center">
          {/* Filter Pills */}
          <div className="col-lg-6 text-start">
            <div className="d-flex align-items-center gap-1.5 flex-wrap" role="group">
              {['All', 'Live', 'Dismissed', 'Expired', 'Critical', 'Advisory', 'Regular'].map((tab) => {
                const count =
                  tab === 'All'
                    ? totalCount
                    : ['Live', 'Dismissed', 'Expired'].includes(tab)
                    ? announcements.filter((a) => a.status === tab).length
                    : announcements.filter((a) => a.type === tab.toLowerCase()).length;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
                      activeFilter === tab
                        ? 'btn-teal text-white shadow-sm'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    <span>{tab}</span>
                    <span className="badge rounded-pill bg-white text-dark opacity-90 px-1.5 py-0.5 small">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div className="col-lg-3 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-body border-end-0">
                <Search size={16} className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0 text-body bg-body"
                placeholder="Search title, details, recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons: Create & Refresh */}
          <div className="col-lg-3 col-md-6 text-lg-end d-flex align-items-center justify-content-lg-end gap-2">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn btn-teal text-white rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm"
            >
              <Plus size={18} />
              <span>New Announcement</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loadAnnouncements();
                loadPatients();
              }}
              className="btn btn-outline-secondary rounded-circle p-2"
              title="Refresh Announcements"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS TABLE COMPONENT */}
      <AnnouncementTable
        announcements={filteredAnnouncements}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        onOpenCreate={handleOpenCreateModal}
        onOpenEdit={handleOpenEditModal}
        onDismiss={handleDismiss}
        onDelete={handleDelete}
      />

      {/* CREATE / EDIT FORM MODAL COMPONENT */}
      <AdminAnnouncementFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        formData={formData}
        setFormData={setFormData}
        editingItem={editingItem}
        patients={patients}
        patientsLoading={patientsLoading}
        onOpenPreview={() => setShowPreviewModal(true)}
        submitting={submitting}
        formError={formError}
      />

      {/* DEDICATED PREVIEW MODAL COMPONENT */}
      <AnnouncementPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        formData={formData}
        selectedPatient={selectedPatient}
      />
    </div>
  );
};

export default AdminAnnouncements;
