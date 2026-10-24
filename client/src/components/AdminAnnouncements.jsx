import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Megaphone,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  Edit,
  EyeOff,
  UserCheck,
  Globe,
  Trash2,
  Users,
  X,
  Check,
  ChevronDown,
  ShieldAlert,
  Save,
  Filter,
  Eye,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import AnnouncementBanner from './AnnouncementBanner';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/announcements`;

// Helper: Convert Date to datetime-local string (YYYY-MM-DDTHH:mm)
const toDatetimeLocal = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  const YYYY = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const DD = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

// Helper: Get default expiry (7 days from now)
const getDefaultExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return toDatetimeLocal(d);
};

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
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Dedicated Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTheme, setPreviewTheme] = useState('light'); // 'light' | 'dark'

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

  // Close patient dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPatientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE_URL}/admin`);
      if (res.data?.success && Array.isArray(res.data.announcements)) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error('Error fetching admin announcements:', err);
      setError(err.response?.data?.message || 'Failed to load announcements from server.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Patients List for dropdown
  const fetchPatients = async () => {
    setPatientsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/patients`);
      if (res.data?.success && Array.isArray(res.data.patients)) {
        setPatients(res.data.patients);
      }
    } catch (err) {
      console.error('Error fetching patients list:', err);
    } finally {
      setPatientsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchPatients();
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
    setPatientSearchTerm('');
    setIsPatientDropdownOpen(false);
    setShowPreviewModal(false);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    const targetPatientId =
      item.targetPatientId?._id || item.targetPatientId || '';

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
    setPatientSearchTerm('');
    setIsPatientDropdownOpen(false);
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

  // Quick Preset Expiry Pill click handler
  const handlePresetExpiry = (hours) => {
    const d = new Date(Date.now() + hours * 60 * 60 * 1000);
    setFormData((prev) => ({
      ...prev,
      expiryDate: toDatetimeLocal(d)
    }));
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
        targetPatientId:
          formData.targetType === 'individual' ? formData.targetPatientId : null,
        startDate: new Date(formData.startDate),
        expiryDate: new Date(formData.expiryDate),
        isActive: formData.isActive
      };

      if (editingItem) {
        // Update existing announcement
        const res = await axios.put(`${API_BASE_URL}/${editingItem._id}`, payload);
        if (res.data?.success) {
          setActionSuccess(`Announcement "${payload.title}" updated successfully!`);
          fetchAnnouncements();
          handleCloseModal();
        }
      } else {
        // Create new announcement
        const res = await axios.post(API_BASE_URL, payload);
        if (res.data?.success) {
          setActionSuccess(`Announcement "${payload.title}" published successfully!`);
          fetchAnnouncements();
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

  // Immediate Dismissal Handler (PATCH isActive: false)
  const handleDismiss = async (id, title) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/${id}/dismiss`);
      if (res.data?.success) {
        setActionSuccess(`Announcement "${title}" was deactivated.`);
        // Update local state immediately
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
        const res = await axios.delete(`${API_BASE_URL}/${id}`);
        if (res.data?.success) {
          setActionSuccess('Announcement deleted permanently.');
          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete announcement');
      }
    }
  };

  // Selected Patient Details for Individual Target
  const selectedPatient = patients.find((p) => p._id === formData.targetPatientId);

  // Filtered patients for dropdown search (filtered by full name or phone number)
  const filteredPatients = patients.filter((p) => {
    const term = patientSearchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.fullName?.toLowerCase().includes(term) ||
      p.mobile?.includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
  });

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

  // Prepare simulated preview item for AnnouncementBanner
  const previewItem = {
    _id: 'preview-id-patient-portal',
    title: formData.title.trim() || 'Specialized Spine & Posture Assessment Clinic',
    description:
      formData.description.trim() ||
      'Free posture evaluation and ergonomic spine alignment consultations are available every Saturday morning with Dr. Neha Sharma (PT). Advance booking recommended.',
    type: formData.type || 'regular',
    targetType: formData.targetType,
    targetPatientName: selectedPatient?.fullName || (formData.targetType === 'individual' ? 'Selected Patient' : null),
    startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
    expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : new Date(Date.now() + 7 * 24 * 3600 * 1000),
    isActive: true
  };

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
                fetchAnnouncements();
                fetchPatients();
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

      {/* ANNOUNCEMENTS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-start">
        {error && (
          <div className="alert alert-danger m-3 mb-0 d-flex align-items-center gap-2">
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-teal" role="status"></div>
            <p className="mt-2 text-muted small">Loading announcement records...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <Megaphone size={40} className="mb-2 opacity-50 text-teal" />
            <h5 className="fw-bold mb-1">No announcements found</h5>
            <p className="mb-3 small">
              {searchTerm || activeFilter !== 'All'
                ? 'Try adjusting your search query or filter pills.'
                : 'Broadcast your first clinical notice or advisory to patients.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="btn btn-teal text-white rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
            >
              <Plus size={18} />
              <span>Create Announcement</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 text-start">
              <thead className="bg-body-secondary text-uppercase small text-muted">
                <tr>
                  <th className="ps-4" style={{ minWidth: '260px' }}>TITLE & DETAILS</th>
                  <th style={{ minWidth: '120px' }}>TYPE</th>
                  <th style={{ minWidth: '170px' }}>TARGET AUDIENCE</th>
                  <th style={{ minWidth: '160px' }}>EXPIRY & VALIDITY</th>
                  <th style={{ minWidth: '110px' }}>STATUS</th>
                  <th className="text-end pe-4" style={{ minWidth: '180px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.map((item) => {
                  const isLive = item.status === 'Live';
                  const isDismissed = item.status === 'Dismissed';
                  const isExpired = item.status === 'Expired';

                  return (
                    <tr key={item._id}>
                      {/* Title & Description */}
                      <td className="ps-4 py-3">
                        <div className="fw-bold fs-6 text-body">{item.title}</div>
                        <p
                          className="text-secondary small mb-1 text-truncate"
                          style={{ maxWidth: '340px' }}
                          title={item.description}
                        >
                          {item.description}
                        </p>
                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                          Created: {new Date(item.createdAt).toLocaleDateString()}
                        </small>
                      </td>

                      {/* Type Badge */}
                      <td>
                        {item.type === 'critical' ? (
                          <span className="badge bg-danger text-white rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                            <AlertTriangle size={13} />
                            <span>Critical</span>
                          </span>
                        ) : item.type === 'advisory' ? (
                          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                            <Sparkles size={13} />
                            <span>Advisory</span>
                          </span>
                        ) : (
                          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1">
                            <Info size={13} />
                            <span>Regular</span>
                          </span>
                        )}
                      </td>

                      {/* Target Audience */}
                      <td>
                        {item.targetType === 'individual' && item.targetPatientId ? (
                          <div>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 mb-1">
                              <UserCheck size={12} />
                              <span>Specific Patient</span>
                            </span>
                            <div className="small fw-semibold text-body">
                              {item.targetPatientId.fullName || 'Patient'}
                            </div>
                            <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
                              {item.targetPatientId.mobile || item.targetPatientId.email}
                            </small>
                          </div>
                        ) : (
                          <span className="badge bg-body-secondary text-body border rounded-pill px-2.5 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold">
                            <Globe size={13} className="text-teal" />
                            <span>All Patients</span>
                          </span>
                        )}
                      </td>

                      {/* Expiry & Validity */}
                      <td>
                        <div className="fw-semibold text-body small">
                          {new Date(item.expiryDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <small className="text-secondary d-block" style={{ fontSize: '0.75rem' }}>
                          {new Date(item.expiryDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </td>

                      {/* Status Badge */}
                      <td>
                        {isLive && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 fw-bold d-inline-flex align-items-center gap-1">
                            <span
                              className="rounded-circle bg-success d-inline-block"
                              style={{ width: '6px', height: '6px' }}
                            ></span>
                            <span>Live</span>
                          </span>
                        )}
                        {isDismissed && (
                          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill px-2.5 py-1 fw-semibold">
                            Dismissed
                          </span>
                        )}
                        {isExpired && (
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill px-2.5 py-1 fw-semibold">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Actions: Edit, Dismiss, Delete */}
                      <td className="text-end pe-4">
                        <div className="d-inline-flex align-items-center gap-1">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="btn btn-outline-teal btn-sm rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                            title="Edit announcement"
                          >
                            <Edit size={14} />
                            <span>Edit</span>
                          </button>

                          {/* Dismiss Button */}
                          <button
                            type="button"
                            onClick={() => handleDismiss(item._id, item.title)}
                            disabled={!item.isActive}
                            className={`btn btn-sm rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1 ${
                              item.isActive
                                ? 'btn-outline-warning text-dark'
                                : 'btn-outline-secondary opacity-50'
                            }`}
                            title={
                              item.isActive
                                ? 'Deactivate announcement immediately'
                                : 'Already dismissed'
                            }
                          >
                            <EyeOff size={14} />
                            <span>Dismiss</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item._id, item.title)}
                            className="btn btn-outline-danger btn-sm rounded-circle p-1.5 ms-1"
                            title="Delete announcement permanently"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ANNOUNCEMENT MODAL */}
      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1055
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden text-start">
              {/* Modal Header */}
              <div
                className="modal-header border-0 text-white p-4"
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2.5 rounded-circle bg-white text-teal d-flex align-items-center justify-content-center shadow-xs">
                    <Megaphone size={22} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-white">
                      {editingItem ? 'Edit Announcement' : 'Create New Announcement'}
                    </h4>
                    <small className="text-white-50">
                      Configure banner type, audience targeting, quick expiry, and preview live
                    </small>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4 bg-body">
                {formError && (
                  <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3 rounded-3">
                    <AlertTriangle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitForm}>
                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-body small">
                      Announcement Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g., Specialized Spine & Posture Assessment Clinic"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-body small">
                      Description / Content <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="3"
                      className="form-control rounded-3"
                      placeholder="Enter the full message to display in the banner..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  {/* Visual Type Selector: 3 Clickable Card Pills */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-body small d-block">
                      Announcement Type <span className="text-danger">*</span>
                    </label>
                    <div className="row g-2">
                      {[
                        {
                          val: 'regular',
                          label: 'Regular',
                          desc: 'Silver/Platinum clinic notice',
                          icon: Info,
                          activeStyle: {
                            borderColor: '#94a3b8',
                            backgroundColor: 'rgba(148, 163, 184, 0.15)',
                            color: 'var(--text-primary)'
                          }
                        },
                        {
                          val: 'advisory',
                          label: 'Advisory',
                          desc: 'Nordic cyan clinical advisory',
                          icon: Sparkles,
                          activeStyle: {
                            borderColor: '#0ea5e9',
                            backgroundColor: 'rgba(14, 165, 233, 0.15)',
                            color: '#0284c7'
                          }
                        },
                        {
                          val: 'critical',
                          label: 'Critical',
                          desc: 'Ruby/Red urgent alert',
                          icon: AlertTriangle,
                          activeStyle: {
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            color: '#dc2626'
                          }
                        }
                      ].map((typeOption) => {
                        const IconComp = typeOption.icon;
                        const isSelected = formData.type === typeOption.val;

                        return (
                          <div className="col-4" key={typeOption.val}>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, type: typeOption.val })}
                              className={`w-100 p-2.5 rounded-3 border text-center transition-all ${
                                isSelected ? 'shadow-sm' : 'bg-body-secondary border-0 text-muted'
                              }`}
                              style={isSelected ? { ...typeOption.activeStyle, borderWidth: '2px' } : {}}
                            >
                              <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                                <IconComp size={16} />
                                <span className="fw-bold small">{typeOption.label}</span>
                              </div>
                              <small className="d-block" style={{ fontSize: '0.7rem', opacity: 0.85 }}>
                                {typeOption.desc}
                              </small>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Audience Switcher & Search */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-body small d-block">
                      Target Audience <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex align-items-center gap-4 p-2.5 rounded-3 bg-body-secondary mb-2">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="targetTypeRadio"
                          id="targetAll"
                          checked={formData.targetType === 'all'}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              targetType: 'all',
                              targetPatientId: ''
                            })
                          }
                        />
                        <label className="form-check-label fw-semibold small cursor-pointer" htmlFor="targetAll">
                          All Patients (Broadcast)
                        </label>
                      </div>

                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="targetTypeRadio"
                          id="targetIndividual"
                          checked={formData.targetType === 'individual'}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              targetType: 'individual'
                            })
                          }
                        />
                        <label className="form-check-label fw-semibold small cursor-pointer" htmlFor="targetIndividual">
                          Specific Patient
                        </label>
                      </div>
                    </div>

                    {/* Instant Debounced Search Dropdown for Specific Patient */}
                    {formData.targetType === 'individual' && (
                      <div className="position-relative" ref={dropdownRef}>
                        {selectedPatient ? (
                          <div className="p-2.5 rounded-3 border bg-body d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                              <div className="p-2 rounded-circle bg-teal-subtle text-teal">
                                <UserCheck size={16} />
                              </div>
                              <div>
                                <div className="fw-bold small text-body">{selectedPatient.fullName}</div>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                                  Phone: {selectedPatient.mobile} • Email: {selectedPatient.email}
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, targetPatientId: '' });
                                setIsPatientDropdownOpen(true);
                              }}
                              className="btn btn-outline-secondary btn-sm rounded-pill px-2.5 py-1 text-xs"
                            >
                              Change Patient
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="input-group">
                              <span className="input-group-text bg-body border-end-0">
                                <Search size={16} className="text-secondary" />
                              </span>
                              <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Search patient by full name or phone number..."
                                value={patientSearchTerm}
                                onFocus={() => setIsPatientDropdownOpen(true)}
                                onChange={(e) => {
                                  setPatientSearchTerm(e.target.value);
                                  setIsPatientDropdownOpen(true);
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
                              >
                                <ChevronDown size={16} />
                              </button>
                            </div>

                            {/* Filtered Dropdown Menu */}
                            {isPatientDropdownOpen && (
                              <div
                                className="position-absolute w-100 mt-1 shadow-lg border rounded-3 bg-body overflow-hidden"
                                style={{ zIndex: 1060, maxHeight: '220px', overflowY: 'auto' }}
                              >
                                {patientsLoading ? (
                                  <div className="p-3 text-center text-muted small">
                                    <div className="spinner-border spinner-border-sm text-teal me-2" role="status"></div>
                                    Loading registered patients...
                                  </div>
                                ) : filteredPatients.length === 0 ? (
                                  <div className="p-3 text-center text-muted small">
                                    No patients found matching "{patientSearchTerm}".
                                  </div>
                                ) : (
                                  filteredPatients.map((patient) => (
                                    <div
                                      key={patient._id}
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          targetPatientId: patient._id
                                        });
                                        setIsPatientDropdownOpen(false);
                                        setPatientSearchTerm('');
                                      }}
                                      className="p-2.5 border-bottom d-flex align-items-center justify-content-between hover-bg cursor-pointer transition-all"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <div>
                                        <div className="fw-bold small text-body">{patient.fullName}</div>
                                        <small className="text-secondary">
                                          Phone: {patient.mobile} • {patient.email}
                                        </small>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-teal btn-sm rounded-pill px-2.5 py-0.5 text-xs text-white"
                                      >
                                        Select
                                      </button>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Start Date & Expiry Date Pickers with Quick Presets */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-5">
                      <label className="form-label fw-semibold text-body small">
                        Start Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="form-control rounded-3"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>

                    <div className="col-md-7">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <label className="form-label fw-semibold text-body small mb-0">
                          Expiry Date & Time <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex align-items-center gap-1">
                          <span className="text-muted small me-1" style={{ fontSize: '0.72rem' }}>Quick:</span>
                          <button
                            type="button"
                            onClick={() => handlePresetExpiry(24)}
                            className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                            style={{ fontSize: '0.7rem' }}
                            title="Set expiry 24 hours from now"
                          >
                            24h
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePresetExpiry(72)}
                            className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                            style={{ fontSize: '0.7rem' }}
                            title="Set expiry 3 days from now"
                          >
                            3 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePresetExpiry(168)}
                            className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                            style={{ fontSize: '0.7rem' }}
                            title="Set expiry 7 days from now"
                          >
                            7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePresetExpiry(720)}
                            className="btn btn-outline-secondary btn-sm py-0 px-1.5 rounded-pill"
                            style={{ fontSize: '0.7rem' }}
                            title="Set expiry 30 days from now"
                          >
                            30 Days
                          </button>
                        </div>
                      </div>
                      <input
                        type="datetime-local"
                        className="form-control rounded-3"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Active Switch */}
                  <div className="form-check form-switch mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="isActiveSwitch"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="isActiveSwitch">
                      Activate announcement immediately ({formData.isActive ? 'Live' : 'Inactive/Dismissed'})
                    </label>
                  </div>

                  {/* Action Buttons: Cancel, Preview Modal, and Publish */}
                  <div className="d-flex align-items-center justify-content-between pt-2 border-top gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={handleCloseModal}
                      disabled={submitting}
                    >
                      Cancel
                    </button>

                    <div className="d-flex align-items-center gap-2 ms-auto">
                      {/* DEDICATED PREVIEW BUTTON */}
                      <button
                        type="button"
                        onClick={() => setShowPreviewModal(true)}
                        className="btn btn-outline-teal rounded-pill px-3.5 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                      >
                        <Eye size={17} />
                        <span>Preview Announcement</span>
                      </button>

                      {/* PUBLISH / SAVE BUTTON */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-teal text-white rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            <span>{editingItem ? 'Save Changes' : 'Publish Announcement'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PREVIEW MODAL (POP-UP) SIMULATING PATIENT DASHBOARD */}
      {showPreviewModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 1065
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden text-start">
              {/* Preview Modal Header */}
              <div className="modal-header border-bottom bg-body px-4 py-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-circle bg-teal-subtle text-teal d-flex align-items-center justify-content-center">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-body">Patient Portal Viewport Preview</h5>
                    <small className="text-muted">
                      Verify visual hierarchy, glassmorphism, and contrast before publishing
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  {/* Theme Mode Toggle (Light Mode vs Dark Mode) */}
                  <div className="bg-body-secondary p-1 rounded-pill d-inline-flex align-items-center gap-1 border">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('light')}
                      className={`btn btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 border-0 transition-all ${
                        previewTheme === 'light'
                          ? 'bg-white text-dark shadow-xs fw-bold'
                          : 'text-muted'
                      }`}
                    >
                      <Sun size={14} className={previewTheme === 'light' ? 'text-warning' : ''} />
                      <span>Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('dark')}
                      className={`btn btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center gap-1.5 border-0 transition-all ${
                        previewTheme === 'dark'
                          ? 'bg-dark text-white shadow-xs fw-bold'
                          : 'text-muted'
                      }`}
                    >
                      <Moon size={14} className={previewTheme === 'dark' ? 'text-info' : ''} />
                      <span>Dark Mode</span>
                    </button>
                  </div>

                  {/* Prominent Close (✕) Button */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                    onClick={() => setShowPreviewModal(false)}
                    aria-label="Close preview"
                    title="Close preview"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Preview Modal Body (Simulated Viewport) */}
              <div
                className="modal-body p-4 p-md-5 transition-all"
                style={{
                  backgroundColor: previewTheme === 'dark' ? '#0b0f19' : '#f1f5f9'
                }}
              >
                {/* Viewport Frame */}
                <div
                  className="preview-viewport-container p-4 p-md-5 rounded-4 shadow-sm mx-auto transition-all"
                  data-bs-theme={previewTheme}
                  data-theme={previewTheme}
                  style={{
                    maxWidth: '880px',
                    backgroundColor: previewTheme === 'dark' ? '#141210' : '#ffffff',
                    border: previewTheme === 'dark' ? '1px solid #332c25' : '1px solid #e2e8f0',
                    color: previewTheme === 'dark' ? '#faf5ee' : '#0f172a'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom opacity-75">
                    <span className="small font-monospace text-muted d-flex align-items-center gap-1.5">
                      <span className="rounded-circle bg-success d-inline-block" style={{ width: '8px', height: '8px' }}></span>
                      Simulated Patient Portal • Top Viewport
                    </span>
                    <span className="badge bg-secondary-subtle text-secondary rounded-pill px-2.5 py-1 small">
                      {previewTheme.toUpperCase()} MODE
                    </span>
                  </div>

                  {/* 1. The Real AnnouncementBanner Rendered with Current Form Values */}
                  <AnnouncementBanner previewItems={[previewItem]} />

                  {/* 2. Simulated Top Greeting Banner */}
                  <div
                    className="card border-0 shadow-sm rounded-4 p-4 text-white position-relative overflow-hidden clinical-banner mt-3"
                    style={{ opacity: 0.9 }}
                  >
                    <div
                      className="badge px-3 py-1 rounded-pill mb-2 fw-semibold clinical-banner-badge"
                      style={{ width: 'fit-content' }}
                    >
                      Patient Portal
                    </div>
                    <h3 className="fw-bold mb-1 text-white">Welcome back, Arjun Vashishth</h3>
                    <p className="text-white-50 mb-3 small">
                      Mobile: +91 9876543210 • Manage your physiotherapy appointments, exercise routines, and prescriptions.
                    </p>
                    <div className="d-flex gap-2">
                      <span className="btn btn-sm btn-light rounded-pill px-3 py-1.5 fw-semibold opacity-75">
                        Book Appointment
                      </span>
                      <span className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 opacity-75">
                        Refresh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
