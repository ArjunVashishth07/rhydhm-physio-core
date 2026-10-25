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
      className="navbar navbar-expand-lg sticky-top shadow-sm transition-all py-2"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: theme === 'dark' ? 'rgba(20, 18, 16, 0.94)' : 'rgba(250, 248, 245, 0.94)',
        borderBottom: theme === 'dark' ? '1px solid #332c25' : '1px solid #e8dfd3',
        minHeight: '60px'
      }}
    >
      <div className="container-fluid max-w-7xl px-3 px-sm-4 px-xl-5">
        {/* Brand / Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 flex-shrink-0 me-2 me-xl-3 py-0" to="/">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-xs flex-shrink-0"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--teal-subtle)',
              color: 'var(--teal-primary)'
            }}
          >
            <Activity size={20} className="stroke-[2.5]" />
          </div>
          <div className="d-flex flex-column text-start">
            <span className="fw-bold text-teal lh-1" style={{ color: 'var(--teal-primary)', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              {t('brand')}
            </span>
            <small className="text-muted fw-normal" style={{ fontSize: '0.72rem' }}>
              {t('doctor')} • {t('qualifications')}
            </small>
          </div>
        </Link>

        {/* Mobile Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none p-1"
          type="button"
          onClick={() => setNavExpanded(!navExpanded)}
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" style={{ width: '1.25em', height: '1.25em' }}></span>
        </button>

        {/* Navigation Content */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav align-items-center mx-lg-auto mb-2 mb-lg-0 gap-1 gap-xl-2 py-2 py-lg-0">
            <li className="nav-item text-nowrap">
              <a
                className="nav-link fw-medium px-2.5 py-1.5 rounded-pill text-nowrap d-inline-flex align-items-center text-secondary transition-all"
                style={{ fontSize: '0.85rem' }}
                href="/#services"
                onClick={() => setNavExpanded(false)}
              >
                {t('services')}
              </a>
            </li>
            <li className="nav-item text-nowrap">
              <a
                className="nav-link fw-medium px-2.5 py-1.5 rounded-pill text-nowrap d-inline-flex align-items-center text-secondary transition-all"
                style={{ fontSize: '0.85rem' }}
                href="/#doctor-about"
                onClick={() => setNavExpanded(false)}
              >
                {t('aboutDoctor')}
              </a>
            </li>
            <li className="nav-item text-nowrap">
              <Link
                className="nav-link fw-medium px-2.5 py-1.5 rounded-pill text-nowrap d-inline-flex align-items-center gap-1.5 text-secondary transition-all"
                style={{ fontSize: '0.85rem' }}
                to="/patient-dashboard"
                onClick={() => setNavExpanded(false)}
              >
                <UserCheck size={15} className="flex-shrink-0" />
                <span>{t('patientHistory')}</span>
              </Link>
            </li>
            <li className="nav-item text-nowrap">
              <Link
                className="nav-link fw-semibold px-2.5 py-1.5 rounded-pill text-nowrap d-inline-flex align-items-center gap-1.5 text-teal transition-all"
                style={{ fontSize: '0.85rem' }}
                to="/admin"
                onClick={() => setNavExpanded(false)}
              >
                <ShieldCheck size={15} className="flex-shrink-0" />
                <span>{t('adminLogin')}</span>
              </Link>
            </li>
          </ul>

          {/* Right Controls */}
          <div className="d-flex align-items-center gap-2 flex-nowrap flex-shrink-0 mt-2 mt-lg-0 ms-lg-auto">
            {/* Patient Auth Button / User Dropdown */}
            {user === null ? (
              <Link
                to="/login"
                onClick={() => setNavExpanded(false)}
                className="btn btn-teal btn-sm rounded-pill px-3 py-0 fw-semibold d-inline-flex align-items-center gap-1.5 text-white shadow-sm flex-shrink-0 text-nowrap"
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <User size={15} />
                <span>{lang === 'hi' ? 'लॉगिन' : 'Login / Sign Up'}</span>
              </Link>
            ) : (
              <div className="position-relative flex-shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn bg-teal-subtle text-teal btn-sm rounded-pill px-3 py-0 fw-semibold d-inline-flex align-items-center gap-1.5 border text-nowrap flex-shrink-0"
                  style={{
                    borderColor: 'var(--teal-border)',
                    height: '36px',
                    fontSize: '0.85rem'
                  }}
                >
                  <User size={15} className="flex-shrink-0" />
                  <span className="text-truncate" style={{ maxWidth: '125px' }}>
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
              className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-1.5 px-2.5 py-0 fw-semibold flex-shrink-0 text-nowrap"
              style={{ height: '36px', fontSize: '0.85rem' }}
              title="Switch Language / भाषा बदलें"
            >
              <Globe size={15} className="text-teal flex-shrink-0" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-outline-secondary btn-sm rounded-circle p-0 d-inline-flex align-items-center justify-content-center flex-shrink-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: '36px', height: '36px' }}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-warning" />
              ) : (
                <Moon size={16} className="text-primary" />
              )}
            </button>

            {/* Direct Call Button */}
            <a
              href={`tel:${clinicDetails.contacts[0]}`}
              className="btn btn-teal btn-sm rounded-pill px-3 py-0 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-sm text-white flex-shrink-0 text-nowrap"
              style={{ height: '36px', fontSize: '0.85rem' }}
            >
              <PhoneCall size={15} className="flex-shrink-0" />
              <span>{t('callNow')}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
