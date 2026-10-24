import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Activity, X, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const WelcomeAuthModal = () => {
  const { user, lang, theme } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If user is already logged in, do not trigger
    if (user) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('rhydhm_welcome_dismissed');
    if (!dismissed) {
      // Gentle delayed appearance for smooth UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('rhydhm_welcome_dismissed', 'true');
  };

  const handleNavigateLogin = () => {
    handleClose();
    navigate('/login');
  };

  if (!isOpen || user) return null;

  const isHindi = lang === 'hi';

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(20, 18, 16, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1065
      }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content shadow-lg rounded-4 overflow-hidden text-start"
          style={{
            backgroundColor: theme === 'dark' ? '#1e1a17' : '#ffffff',
            color: theme === 'dark' ? '#faf5ee' : '#241e19',
            border: theme === 'dark' ? '1px solid #332c25' : '1px solid #e8dfd3'
          }}
        >
          {/* Header */}
          <div
            className="p-4 d-flex align-items-start justify-content-between position-relative"
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(135deg, rgba(200, 121, 44, 0.22) 0%, rgba(30, 26, 23, 0) 100%)'
                : 'linear-gradient(135deg, rgba(200, 121, 44, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
              borderBottom: theme === 'dark' ? '1px solid #332c25' : '1px solid #e8dfd3'
            }}
          >
            <div className="d-flex align-items-center gap-3">
              <div
                className="p-3 rounded-circle d-flex align-items-center justify-content-center shadow-xs"
                style={{
                  backgroundColor: 'var(--teal-primary)',
                  color: '#ffffff'
                }}
              >
                <Activity size={24} />
              </div>
              <div>
                <span
                  className="badge rounded-pill px-2.5 py-1 mb-1 fw-semibold small bg-teal-subtle text-teal"
                >
                  {isHindi ? 'मरीज पोर्टल' : 'Patient Portal'}
                </span>
                <h5 className="modal-title fw-bold mb-0" style={{ letterSpacing: '-0.02em' }}>
                  {isHindi ? 'रिदम फिजियो में आपका स्वागत है' : 'Welcome to RHYDHM Physio'}
                </h5>
              </div>
            </div>

            <button
              type="button"
              className={`btn-close ${theme === 'dark' ? 'btn-close-white' : ''} p-2`}
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <p className="text-secondary mb-4" style={{ fontSize: '0.96rem', lineHeight: '1.6' }}>
              {isHindi
                ? 'रिदम फिजियो एवं फिटनेस सेंटर में आपका स्वागत है। अपॉइंटमेंट बुक करने, डिजिटल पर्चे देखने और अपने स्वास्थ्य इतिहास को ट्रैक करने के लिए साइन इन करें, या क्लिनिक सेवाओं को देखना जारी रखें।'
                : 'Welcome to RHYDHM Physio & Fitness Center. Sign in to book appointments and view prescriptions, or continue browsing clinic services.'}
            </p>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex align-items-center gap-2.5 small text-muted">
                <ShieldCheck size={18} className="text-teal" />
                <span>
                  {isHindi
                    ? 'डॉ. नेहा शर्मा (पीटी) - प्रमाणित फिजियोथेरेपिस्ट एवं ऑस्टियोपैथ'
                    : 'Dr. Neha Sharma (PT) — Senior Physiotherapist & Osteopath'}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2.5 small text-muted">
                <UserCheck size={18} className="text-teal" />
                <span>
                  {isHindi
                    ? 'अपॉइंटमेंट ट्रैकिंग और व्यायाम पर्चा सीधे उपलब्ध'
                    : 'Instant appointment tracking & digital exercise prescriptions'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex flex-column gap-2 pt-2">
              <button
                type="button"
                onClick={handleNavigateLogin}
                className="btn btn-teal w-100 rounded-pill py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                <span>{isHindi ? 'लॉगिन / साइन अप करें' : 'Sign In / Register'}</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-outline-secondary w-100 rounded-pill py-2 fw-semibold small"
              >
                {isHindi ? 'सेवाएं देखना जारी रखें' : 'Continue Browsing Services'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuthModal;
