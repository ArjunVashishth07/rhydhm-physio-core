import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import {
  Bell,
  AlertTriangle,
  Info,
  Sparkles,
  X,
  UserCheck
} from 'lucide-react';
import './AnnouncementBanner.css';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/announcements`;

export const AnnouncementBanner = () => {
  const { user } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  
  // Pure local in-memory dismissal state (resets on F5 refresh or re-login)
  const [dismissedIds, setDismissedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active announcements targeted to this patient
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
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

      const res = await axios.get(`${API_BASE_URL}/patient`, {
        headers,
        params
      });

      if (res.data?.success && Array.isArray(res.data.announcements)) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error('Error fetching patient announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  // Filter out in-memory dismissed announcements
  const visibleAnnouncements = announcements.filter(
    (item) => !dismissedIds.includes(item._id)
  );

  // Handle in-memory dismissal for current tab view (never persisted to localStorage/sessionStorage)
  const handleDismiss = (id) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  // If loading or all announcements have been dismissed in this memory session, render nothing
  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  // Format expiry preview
  const formatExpiry = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass-banner-stack d-flex flex-column gap-3 mb-4" role="region" aria-label="Clinic Announcements">
      {visibleAnnouncements.map((item) => {
        const itemType = item.type || 'regular';

        const variantClass =
          itemType === 'critical'
            ? 'glass-banner-critical'
            : itemType === 'advisory'
            ? 'glass-banner-advisory'
            : 'glass-banner-regular';

        return (
          <div
            key={item._id}
            className={`glass-banner-card p-3 p-md-4 ${variantClass}`}
          >
            <div className="d-flex align-items-start gap-3">
              {/* Skeuomorphic Icon Disc */}
              <div className="banner-icon-disc">
                {itemType === 'critical' && <AlertTriangle size={22} />}
                {itemType === 'advisory' && <Sparkles size={22} />}
                {itemType === 'regular' && <Info size={22} />}
              </div>

              {/* Announcement Content */}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                  {/* Type Badge */}
                  <span className="banner-badge">
                    {itemType === 'critical' && <AlertTriangle size={12} />}
                    {itemType === 'advisory' && <Sparkles size={12} />}
                    {itemType === 'regular' && <Bell size={12} />}
                    <span>{itemType.toUpperCase()}</span>
                  </span>

                  {/* Personalized Direct Notice Tag */}
                  {item.targetType === 'individual' && (
                    <span className="badge banner-direct-notice-badge rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 small fw-semibold">
                      <UserCheck size={12} />
                      <span>Direct Notice</span>
                    </span>
                  )}

                  {/* Expiry Note */}
                  {item.expiryDate && (
                    <span className="banner-expiry small ms-auto d-none d-sm-inline">
                      Valid until {formatExpiry(item.expiryDate)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h5 className="fw-bold mb-1 banner-title" style={{ letterSpacing: '-0.01em' }}>
                  {item.title}
                </h5>

                {/* Description */}
                <p className="mb-0 banner-desc small" style={{ lineHeight: '1.5' }}>
                  {item.description}
                </p>
              </div>

              {/* Independent In-Memory Dismiss Button */}
              <button
                type="button"
                onClick={() => handleDismiss(item._id)}
                className="banner-dismiss-btn ms-2"
                title="Dismiss announcement"
                aria-label="Dismiss announcement"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncementBanner;
