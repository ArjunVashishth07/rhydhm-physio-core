import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { clinicDetails } from '../data/clinicData';
import { Activity, Globe, Sun, Moon, PhoneCall, UserCheck, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, lang, setLang, t } = useApp();
  const [navExpanded, setNavExpanded] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm transition-all"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              backgroundColor: 'rgba(13, 148, 136, 0.15)',
              color: '#0d9488'
            }}
          >
            <Activity size={24} className="stroke-[2.5]" />
          </div>
          <div className="d-flex flex-column">
            <span className="fs-5 lh-1 fw-bold text-teal" style={{ color: '#0d9488', letterSpacing: '-0.02em' }}>
              {t('brand')}
            </span>
            <small className="text-muted fw-normal" style={{ fontSize: '0.75rem' }}>
              {t('doctor')} • {t('qualifications')}
            </small>
          </div>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setNavExpanded(!navExpanded)}
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <a
                className="nav-link fw-medium px-3 rounded-2"
                href="/#services"
                onClick={() => setNavExpanded(false)}
              >
                {t('services')}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium px-3 rounded-2"
                href="/#doctor-about"
                onClick={() => setNavExpanded(false)}
              >
                {t('aboutDoctor')}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link fw-medium px-3 rounded-2 d-flex align-items-center gap-1"
                href="/#patient-history"
                onClick={() => setNavExpanded(false)}
              >
                <UserCheck size={16} />
                {t('patientHistory')}
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 rounded-2 text-teal d-flex align-items-center gap-1"
                to="/admin"
                onClick={() => setNavExpanded(false)}
                style={{ color: '#0d9488' }}
              >
                <ShieldCheck size={16} />
                {t('adminLogin')}
              </Link>
            </li>
          </ul>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2 flex-wrap mt-3 mt-lg-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold"
              title="Switch Language / भाषा बदलें"
            >
              <Globe size={16} className="text-teal" style={{ color: '#0d9488' }} />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: '38px', height: '38px' }}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-warning" />
              ) : (
                <Moon size={18} className="text-primary" />
              )}
            </button>

            {/* Direct Call Button */}
            <a
              href={`tel:${clinicDetails.contacts[0]}`}
              className="btn text-white rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm"
              style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
            >
              <PhoneCall size={16} />
              <span>{t('callNow')}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
