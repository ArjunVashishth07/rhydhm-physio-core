import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import apiClient from '../../../api/apiClient';

export const AdminPasscodeGate = ({ onUnlock }) => {
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasscodeError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/api/auth/doctor-pin-login', { passcode });
      if (res.data?.success && res.data?.token) {
        localStorage.setItem('rhydhm_admin_auth', 'true');
        localStorage.setItem('rhydhm_admin_token', res.data.token);
        if (!localStorage.getItem('rhydhm_token')) {
          localStorage.setItem('rhydhm_token', res.data.token);
        }
        onUnlock?.();
      }
    } catch (err) {
      setPasscodeError(err.response?.data?.message || 'Invalid passcode. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header text-white text-center py-3.5 clinical-banner border-0">
              <div className="p-2.5 rounded-circle d-inline-flex mb-2 clinical-modal-icon">
                <Lock size={24} />
              </div>
              <h5 className="fw-bold mb-0 text-white">Doctor Admin Portal</h5>
              <small className="text-white-50">RHYDHM Physio & Fitness Center</small>
            </div>
            <div className="card-body p-3.5 sm:p-4 text-start">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold small text-muted">
                    Portal Passcode
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg text-center fw-bold"
                    placeholder="••••"
                    maxLength="4"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    autoFocus
                  />
                  {passcodeError && (
                    <div className="text-danger small mt-1.5 fw-semibold">{passcodeError}</div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-teal w-100 py-2.5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                  ) : (
                    <span>Unlock Portal</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPasscodeGate;
