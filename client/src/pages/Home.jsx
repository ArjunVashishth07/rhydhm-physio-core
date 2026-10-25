import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { clinicDetails } from '../data/clinicData';
import WelcomeAuthModal from '../components/WelcomeAuthModal';
import {
  Activity,
  Award,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Zap,
  Dumbbell,
  Sparkles,
  Home as HomeIcon,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const Home = () => {
  const { t, lang, user } = useApp();
  const navigate = useNavigate();

  const handleConsultationCTA = () => {
    if (user) {
      navigate('/patient-dashboard');
    } else {
      navigate('/login');
    }
  };

  // 7 Core Clinical Specialties
  const servicesList = [
    {
      title: 'Cervical & Posture Care',
      desc: lang === 'hi' ? 'गर्दन दर्द, चक्कर और पोस्चर सुधार' : 'Treatment for neck pain, stiffness, vertigo, and posture alignment.',
      icon: Activity
    },
    {
      title: 'Spine & Chiropractic Care',
      desc: lang === 'hi' ? 'कमर दर्द, साइटिका और स्पाइन एलाइनमेंट' : 'Spinal adjustments, sciatica relief, and disc rehabilitation.',
      icon: HeartPulse
    },
    {
      title: 'Paralysis & Neuro Rehab',
      desc: lang === 'hi' ? 'लकवा, स्ट्रोक और तंत्रिका पुनर्वास' : 'Post-stroke rehab, nerve compression therapy, and muscle retraining.',
      icon: Zap
    },
    {
      title: 'Sports Rehab & Joint Pain',
      desc: lang === 'hi' ? 'घुटने, कंधे और खेल चोटों का इलाज' : 'Knee, shoulder, ligament strain, and post-injury sports recovery.',
      icon: Dumbbell
    },
    {
      title: 'Osteopathy & Manual Therapy',
      desc: lang === 'hi' ? 'मांसपेशियों के खिंचाव एवं जोड़ गतिशीलता उपचार' : 'Myofascial release, joint mobilization, and holistic physical care.',
      icon: Stethoscope
    },
    {
      title: 'Advanced Cupping & Needling',
      desc: lang === 'hi' ? 'ड्राई नीडलिंग एवं हिजामा कपिंग थेरेपी' : 'Targeted trigger point dry needling and therapeutic vacuum cupping.',
      icon: Sparkles
    },
    {
      title: 'Home Physiotherapy',
      desc: lang === 'hi' ? 'घर पर फिजियोथेरेपी सेवा (बुजुर्गों एवं गंभीर मरीजों हेतु)' : 'Doorstep physiotherapy for bedridden or elderly patients.',
      icon: HomeIcon
    }
  ];

  return (
    <div className="home-page pb-5">
      {/* Welcome / Sign-in Modal on initial site load */}
      <WelcomeAuthModal />

      {/* HERO SECTION */}
      <section
        className="hero-section text-center py-4 sm:py-5 px-3 position-relative overflow-hidden"
        style={{
          background: 'var(--hero-gradient)',
          borderBottom: '1px solid var(--hero-border)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2 sm:py-3">
          <div className="badge bg-teal-subtle text-teal rounded-pill px-3 py-1.5 mb-2.5 fw-semibold d-inline-flex align-items-center gap-1.5 small">
            <Award size={15} />
            <span>{clinicDetails.designation}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl fw-bold mb-2.5 text-teal" style={{ letterSpacing: '-0.02em' }}>
            {t('brand')}
          </h1>

          <h5 className="fw-semibold text-body-secondary mb-2.5">
            {t('doctor')} <span className="badge bg-secondary-subtle text-body ms-2">{t('qualifications')}</span>
          </h5>

          <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto mb-3.5 leading-normal" style={{ maxWidth: '650px' }}>
            {t('heroSubtitle')}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-2.5 mb-3.5">
            <button
              type="button"
              onClick={handleConsultationCTA}
              className="btn btn-teal rounded-pill px-4 py-2 text-sm fw-semibold shadow-sm d-flex align-items-center gap-2"
            >
              <Calendar size={18} />
              <span>{user ? (lang === 'hi' ? 'अपॉइंटमेंट बुक करें ' : 'Book Appointment') : t('bookAppointment')}</span>
              <ArrowRight size={16} />
            </button>

            <a
              href={`tel:${clinicDetails.contacts[0]}`}
              className="btn btn-outline-teal rounded-pill px-4 py-2 text-sm fw-semibold d-flex align-items-center gap-2 ms-2"
            >
              <Phone size={18} />
              <span>{t('callNow')}</span>
            </a>
          </div>

          {/* Key Quick Info Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-4 text-muted small fw-medium mt-1">
            <div className="d-flex align-items-center gap-1.5">
              <Clock size={15} className="text-teal" />
              <span><strong>{t('timingsLabel')}:</strong> {t('timings')}</span>
            </div>
            <div className="d-flex align-items-center gap-1.5">
              <MapPin size={15} className="text-teal" />
              <span>Muradnagar, Ghaziabad</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-4 sm:py-5" id="services">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-3.5 sm:mb-4">
            <span className="badge bg-teal-subtle text-teal px-3 py-1 rounded-pill mb-2 fw-semibold small">
              Specialized Therapies
            </span>
            <h2 className="text-2xl sm:text-3xl fw-bold text-teal mb-2">{t('services')}</h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-normal" style={{ maxWidth: '600px' }}>
              Comprehensive physiotherapy, osteopathy, and rehabilitation procedures tailored for optimal recovery.
            </p>
          </div>

          <div className="row g-3">
            {servicesList.map((service, index) => {
              const IconComp = service.icon;
              return (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100 border shadow-sm rounded-4 p-3.5 sm:p-4 card-hover text-start d-flex flex-column">
                    <div className="p-2.5 rounded-3 bg-teal-subtle text-teal d-inline-flex mb-2.5" style={{ width: 'fit-content' }}>
                      <IconComp size={22} />
                    </div>
                    <h5 className="fw-bold mb-1.5 fs-6">{service.title}</h5>
                    <p className="text-muted text-xs sm:text-sm mb-3 flex-grow-1 leading-normal">{service.desc}</p>
                    <button
                      type="button"
                      onClick={handleConsultationCTA}
                      className="btn btn-link p-0 text-teal text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 mt-auto text-start"
                    >
                      <span>{t('bookAppointment')}</span> &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CREDENTIALS & HOSPITAL EXPERIENCE SECTION */}
      <section className="py-4 sm:py-5 bg-body-tertiary" id="doctor-about">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-3.5 sm:mb-4 mb-3">
            <h2 className="text-2xl sm:text-3xl fw-bold text-teal mb-1">{t('aboutDoctor')}</h2>
            <p className="text-sm text-muted mb-0">{clinicDetails.doctor} ({clinicDetails.qualifications})</p>
          </div>

          <div className="row g-3">
            {/* Registrations Card */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-3.5 sm:p-4 card-hover">
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="p-2.5 rounded-circle bg-teal-subtle text-teal flex-shrink-0 me-2">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 fs-6">Professional Registrations</h6>
                    <small className="text-muted">Verified Medical Certifications</small>
                  </div>
                </div>
                <ul className="list-group list-group-flush border-0">
                  {clinicDetails.registrations.map((reg, idx) => (
                    <li key={idx} className="list-group-item bg-transparent px-0 py-2 d-flex align-items-center gap-2 small">
                      <CheckCircle2 size={16} className="text-teal flex-shrink-0" />
                      <span className="fw-semibold">{reg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Experience Card */}
            <div className="col-md-6 col-lg-7">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-3.5 sm:p-4 card-hover">
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div className="p-2.5 rounded-circle bg-teal-subtle text-teal flex-shrink-0 me-2">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 fs-6">Past Clinical Experience</h6>
                    <small className="text-muted">Senior Roles in Premier Government & Private Hospitals</small>
                  </div>
                </div>
                <div className="row g-2 mt-2">
                  {clinicDetails.experience.map((exp, idx) => (
                    <div key={idx} className="col-12 col-sm-6">
                      <div className="p-2.5 rounded-3 bg-body border d-flex align-items-start gap-2 h-100">
                        <Award size={16} className="text-teal mt-0.5 flex-shrink-0" />
                        <span className="small fw-medium leading-normal">{exp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT SECTION */}
      <section className="py-4 sm:py-5 bg-body-tertiary">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="row g-3 align-items-stretch">
            {/* Address & Timings */}
            <div className="col-md-6 text-start">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-3.5 sm:p-4 text-white clinical-banner">
                <h5 className="fw-bold text-white mb-2.5">{t('brand')}</h5>

                <div className="d-flex align-items-start gap-2.5 mb-2.5">
                  <MapPin size={20} className="text-white-50 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="d-block text-white small">{t('addressLabel')}</strong>
                    <span className="text-white-50 small leading-normal">{t('address')}</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2.5 mb-2.5">
                  <Clock size={20} className="text-white-50 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="d-block text-white small">{t('timingsLabel')}</strong>
                    <span className="text-white-50 small leading-normal">{t('timings')} (Monday – Saturday)</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-2.5 mt-auto">
                  <Phone size={20} className="text-white-50 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="d-block text-white small">Phone Numbers</strong>
                    <div className="d-flex gap-2 flex-wrap mt-1">
                      {clinicDetails.contacts.map((c, i) => (
                        <a
                          key={i}
                          href={`tel:${c}`}
                          className="btn btn-sm clinical-banner-btn rounded-pill px-3 py-1 fw-bold shadow-sm"
                        >
                          {c}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="col-md-6 text-start">
              <div
                className="card h-100 border-0 shadow-sm rounded-4 p-3.5 sm:p-4 text-white clinical-banner"
              >
                <div className="d-flex align-items-center gap-2.5 mb-2.5">
                  <div
                    className="p-2.5 rounded-circle d-flex align-items-center justify-content-center clinical-banner-badge flex-shrink-0"
                  >
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-white fs-6">{t('doctor')}</h5>
                    <p className="mb-0 small opacity-75">{t('qualifications')}</p>
                  </div>
                </div>
                <p className="small mb-2.5 text-white-50 leading-normal">
                  {t('designation')} with extensive clinical experience treating musculoskeletal, spinal, and neurological conditions using advanced evidence-based modalities.
                </p>
                <div className="mt-auto pt-2.5 border-top border-white-50 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="small text-white-50">Need assistance? Call directly</span>
                  <a
                    href={`tel:${clinicDetails.contacts[0]}`}
                    className="btn btn-sm rounded-pill fw-bold px-3 py-1 shadow-sm clinical-banner-btn my-1"
                  >
                    {clinicDetails.contacts[0]}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
