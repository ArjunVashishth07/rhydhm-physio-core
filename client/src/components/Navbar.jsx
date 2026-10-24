import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { clinicDetails } from '../data/clinicData';
import { Activity, Globe, Sun, Moon, PhoneCall, UserCheck, ShieldCheck, User, LogOut, FileText } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, lang, setLang, t, user, openAuthModal, logoutUser } = useApp();
  const [navExpanded, setNavExpanded] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'hi' : 'en');
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm transition-all"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: theme === 'dark' ? 'rgba(20, 18, 16, 0.94)' : 'rgba(250, 248, 245, 0.94)',
        borderBottom: theme === 'dark' ? '1px solid #332c25' : '1px solid #e8dfd3'
      }}
    >
      <div className="container">
        {/* Brand / Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            className="p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
            style={{
              backgroundColor: 'var(--teal-subtle)',
              color: 'var(--teal-primary)'
            }}
          >
            <Activity size={24} className="stroke-[2.5]" />
          </div>
          <div className="d-flex flex-column">
            <span className="fs-5 lh-1 fw-bold text-teal" style={{ color: 'var(--teal-primary)', letterSpacing: '-0.02em' }}>
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
              <Link
                className="nav-link fw-medium px-3 rounded-2 d-flex align-items-center gap-1"
                to="/patient-dashboard"
                onClick={() => setNavExpanded(false)}
              >
                <UserCheck size={16} />
                {t('patientHistory')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link fw-semibold px-3 rounded-2 text-teal d-flex align-items-center gap-1"
                to="/admin"
                onClick={() => setNavExpanded(false)}
              >
                <ShieldCheck size={16} />
                {t('adminLogin')}
              </Link>
            </li>
          </ul>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2 flex-wrap mt-3 mt-lg-0">
            {/* Patient Auth Button / User Dropdown */}
            {user === null ? (
              <Link
                to="/login"
                onClick={() => setNavExpanded(false)}
                className="btn btn-teal btn-sm rounded-pill px-3.5 py-1.5 fw-bold d-flex align-items-center gap-1.5 text-white shadow-sm"
              >
                <User size={16} />
                <span>{lang === 'hi' ? 'लॉगिन / साइन अप' : 'Login / Sign Up'}</span>
              </Link>
            ) : (
              <div className="position-relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn bg-teal-subtle text-teal btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-2 border"
                  style={{ borderColor: 'var(--teal-border)' }}
                >
                  <User size={16} />
                  <span>
                    {user.fullName || (user.phone ? `+91 ${user.phone}` : (user.mobile ? `+91 ${user.mobile}` : 'Patient'))}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="dropdown-menu dropdown-menu-end show position-absolute shadow-lg border-0 rounded-3 mt-2 p-2"
                    style={{ right: 0, minWidth: '200px', zIndex: 1050 }}
                  >
                    <div className="px-3 py-1.5 mb-1 border-bottom">
                      <strong className="d-block text-truncate small">{user.fullName || 'Patient'}</strong>
                      <small className="text-muted text-truncate d-block" style={{ fontSize: '0.75rem' }}>
                        {user.email || user.mobile || user.phone}
                      </small>
                    </div>
                    <Link
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 small fw-medium"
                      to="/patient-dashboard"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setNavExpanded(false);
                      }}
                    >
                      <FileText size={16} className="text-teal" />
                      {lang === 'hi' ? 'मरीज डैशबोर्ड' : 'Patient Dashboard'}
                    </Link>
                    <hr className="dropdown-divider my-1" />
                    <button
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 small fw-medium text-danger"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setNavExpanded(false);
                        logoutUser();
                      }}
                    >
                      <LogOut size={16} />
                      {lang === 'hi' ? 'लॉगआउट' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold"
              title="Switch Language / भाषा बदलें"
            >
              <Globe size={16} className="text-teal" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center "
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
              className="btn btn-teal btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm text-white"
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
