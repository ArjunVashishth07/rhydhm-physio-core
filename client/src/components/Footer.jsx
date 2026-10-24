import React from 'react';
import { useApp } from '../context/AppContext';
import { clinicDetails } from '../data/clinicData';
import { Activity, Phone, MapPin, Clock, Heart } from 'lucide-react';

export const Footer = () => {
  const { t, theme } = useApp();

  return (
    <footer
      className="py-5 mt-auto transition-all"
      style={{
        backgroundColor: theme === 'dark' ? '#0e0c0b' : '#1e1915',
        color: '#ad9e8f',
        borderTop: '1px solid rgba(244, 217, 160, 0.12)'
      }}
    >
      <div className="container text-start">
        <div className="row g-4 mb-4">
          {/* Clinic Brand & Info */}
          <div className="col-md-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-circle bg-teal text-white d-inline-flex">
                <Activity size={20} />
              </div>
              <h5 className="fw-bold text-white mb-0">{t('brand')}</h5>
            </div>
            <p className="small mb-3" style={{ maxWidth: '400px', color: '#ad9e8f' }}>
              {t('doctor')} ({t('qualifications')}) — {t('designation')}
            </p>
            <p className="small mb-0" style={{ color: '#ad9e8f' }}>
              Dedicated to non-surgical spine care, osteopathy, and personalized rehabilitation.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold text-white mb-3">Quick Navigation</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <a href="#services" className="text-decoration-none text-teal">
                  {t('services')}
                </a>
              </li>
              <li>
                <a href="#doctor-about" className="text-decoration-none text-teal">
                  {t('aboutDoctor')}
                </a>
              </li>
              <li>
                <a href="/patient-dashboard" className="text-decoration-none text-teal">
                  {t('bookAppointment')}
                </a>
              </li>
              <li>
                <a href="/patient-dashboard" className="text-decoration-none text-teal">
                  {t('patientHistory')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-6 col-md-4">
            <h6 className="fw-bold text-white mb-3">Contact & Timings</h6>
            <div className="d-flex flex-column gap-2 small">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-teal flex-shrink-0 mt-1" />
                <span>{t('address')}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Clock size={16} className="text-teal flex-shrink-0" />
                <span>{t('timings')} (Mon – Sat)</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-teal flex-shrink-0" />
                <span>{clinicDetails.contacts.join(' / ')}</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(244, 217, 160, 0.12)' }} />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small">
          <span>
            © {new Date().getFullYear()} {t('brand')}. All rights reserved.
          </span>
          <span className="d-flex align-items-center gap-1" style={{ color: '#ad9e8f' }}>
            Carefully crafted for better patient recovery <Heart size={14} className="text-danger fill-danger" />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
