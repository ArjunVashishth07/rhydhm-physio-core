import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, ShieldCheck, X, ArrowLeft, CheckCircle, RefreshCw, KeyRound } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, loginUser, lang } = useApp();

  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showToastHint, setShowToastHint] = useState(false);

  const otpInputRef = useRef(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Auto-focus OTP input when entering step 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isAuthModalOpen) {
      setStep(1);
      setPhone('');
      setOtp('');
      setError('');
      setShowToastHint(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setError(lang === 'hi' ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(30);
      setShowToastHint(true);
    }, 400);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');

    if (otp !== '1234') {
      setError(lang === 'hi' ? 'गलत OTP! कृपया 1234 का उपयोग करें।' : 'Invalid OTP! Please enter test OTP: 1234');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      loginUser({
        phone,
        name: 'Patient'
      });
    }, 400);
  };

  const handleResendOtp = () => {
    setTimer(30);
    setError('');
    setShowToastHint(true);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 1060
      }}
      onClick={closeAuthModal}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: '420px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden text-start">
          {/* Modal Header */}
          <div className="modal-header bg-teal text-white p-4 position-relative" style={{ backgroundColor: '#0d9488' }}>
            <div className="d-flex align-items-center gap-3">
              <div className="p-2.5 rounded-circle bg-white text-teal d-flex align-items-center justify-content-center shadow-xs">
                <ShieldCheck size={26} />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">
                  {step === 1
                    ? lang === 'hi'
                      ? 'मरीज लॉगिन / रजिस्ट्रेशन'
                      : 'Patient Login / Signup'
                    : lang === 'hi'
                    ? 'OTP का सत्यापन करें'
                    : 'Verify Mobile OTP'}
                </h5>
                <small className="text-white-50">RHYDHM Physio & Fitness Center</small>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white ms-auto"
              onClick={closeAuthModal}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {/* Test OTP Toast / Hint Banner */}
            {showToastHint && (
              <div className="alert alert-info border-0 shadow-xs py-2 px-3 mb-3 d-flex align-items-center justify-content-between rounded-3">
                <span className="small fw-semibold d-flex align-items-center gap-1.5 text-info-emphasis">
                  <KeyRound size={16} />
                  {lang === 'hi' ? 'परीक्षण OTP:' : 'Test OTP:'} <strong>1234</strong>
                </span>
                <button
                  onClick={() => setOtp('1234')}
                  className="btn btn-sm btn-outline-info rounded-pill py-0 px-2.5 text-nowrap fw-bold"
                  style={{ fontSize: '0.75rem' }}
                >
                  {lang === 'hi' ? 'ऑटो-फिल' : 'Auto-fill'}
                </button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 small rounded-3">
                {error}
              </div>
            )}

            {step === 1 ? (
              /* STEP 1: Phone Input */
              <form onSubmit={handleSendOtp}>
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small">
                    {lang === 'hi' ? '10-अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'} <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text bg-body-tertiary fw-semibold text-teal fs-6" style={{ color: '#0d9488' }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      className="form-control fw-bold fs-5"
                      placeholder="97604XXXXX"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                      autoFocus
                    />
                  </div>
                  <small className="text-muted d-block mt-2" style={{ fontSize: '0.78rem' }}>
                    {lang === 'hi'
                      ? 'हम आपको सत्यापन के लिए 4 अंकों का OTP भेजेंगे'
                      : 'We will send you a 4-digit OTP for instant authentication'}
                  </small>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.length < 10}
                  className="btn btn-teal text-white btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <>
                      <Phone size={20} />
                      <span>{lang === 'hi' ? 'OTP भेजें' : 'Send OTP'}</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP Input */
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <label className="form-label fw-semibold text-secondary small mb-0">
                      {lang === 'hi' ? '4-अंकों का OTP दर्ज करें' : 'Enter 4-Digit OTP'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-link p-0 text-teal text-decoration-none small fw-semibold d-flex align-items-center gap-1"
                      style={{ color: '#0d9488' }}
                    >
                      <ArrowLeft size={14} />
                      {lang === 'hi' ? 'नंबर बदलें' : 'Change Number'}
                    </button>
                  </div>

                  <div className="mb-2">
                    <input
                      ref={otpInputRef}
                      type="text"
                      className="form-control form-control-lg text-center fw-extrabold letter-spacing-2 fs-3"
                      placeholder="1234"
                      maxLength="4"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ letterSpacing: '0.5em' }}
                      required
                    />
                  </div>
                  <small className="text-muted d-block">
                    OTP sent to <strong>+91 {phone}</strong>
                  </small>
                </div>

                {/* Resend Timer */}
                <div className="d-flex align-items-center justify-content-between mb-4 small">
                  <span className="text-muted">
                    {timer > 0 ? (
                      <>Resend OTP in <strong>{timer}s</strong></>
                    ) : (
                      'Didn\'t receive OTP?'
                    )}
                  </span>
                  {timer === 0 && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="btn btn-link p-0 text-teal text-decoration-none fw-bold small d-flex align-items-center gap-1"
                      style={{ color: '#0d9488' }}
                    >
                      <RefreshCw size={14} />
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="btn btn-teal text-white btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm" role="status"></div>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>{lang === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify & Continue'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
