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
        className="hero-section text-center py-5 px-3 position-relative overflow-hidden"
        style={{
          background: 'var(--hero-gradient)',
          borderBottom: '1px solid var(--hero-border)'
        }}
      >
        <div className="container py-4">
          <div className="badge bg-teal-subtle text-teal rounded-pill px-3 py-2 mb-3 fw-semibold d-inline-flex align-items-center gap-2">
            <Award size={16} />
            <span>{clinicDetails.designation}</span>
          </div>

          <h1 className="display-4 fw-extrabold mb-3 text-teal" style={{ letterSpacing: '-0.03em' }}>
            {t('brand')}
          </h1>

          <h4 className="fw-semibold text-body-secondary mb-3">
            {t('doctor')} <span className="badge bg-secondary-subtle text-body ms-2">{t('qualifications')}</span>
          </h4>

          <p className="lead text-muted max-w-2xl mx-auto mb-4" style={{ maxWidth: '750px' }}>
            {t('heroSubtitle')}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <button
              type="button"
              onClick={handleConsultationCTA}
              className="btn btn-teal btn-lg rounded-pill px-4 py-3 fw-bold shadow d-flex align-items-center gap-2"
            >
              <Calendar size={20} />
              <span>{user ? (lang === 'hi' ? 'अपॉइंटमेंट बुक करें (डैशबोर्ड)' : 'Book Appointment (Dashboard)') : t('bookAppointment')}</span>
              <ArrowRight size={18} />
            </button>

            <a
              href={`tel:${clinicDetails.contacts[0]}`}
              className="btn btn-outline-teal btn-lg rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2"
            >
              <Phone size={20} />
              <span>{t('callNow')}</span>
            </a>
          </div>

          {/* Key Quick Info Pills */}
          <div className="d-flex flex-wrap justify-content-center gap-4 text-muted small fw-medium mt-2">
            <div className="d-flex align-items-center gap-1.5">
              <Clock size={16} className="text-teal" />
              <span><strong>{t('timingsLabel')}:</strong> {t('timings')}</span>
            </div>
            <div className="d-flex align-items-center gap-1.5">
              <MapPin size={16} className="text-teal" />
              <span>Muradnagar, Ghaziabad</span>
            </div>
          </div>
        </div>
      </section>

          {/* SERVICES SECTION */}
      <section className="py-5" id="services">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-teal-subtle text-teal px-3 py-1.5 rounded-pill mb-2 fw-semibold">
              Specialized Therapies
            </span>
            <h2 className="fw-bold text-teal mb-2">{t('services')}</h2>
            <p className="text-muted max-w-xl mx-auto" style={{ maxWidth: '600px' }}>
              Comprehensive physiotherapy, osteopathy, and rehabilitation procedures tailored for optimal recovery.
            </p>
          </div>

          <div className="row g-4">
            {servicesList.map((service, index) => {
              const IconComp = service.icon;
              return (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="card h-100 border shadow-sm rounded-4 p-4 card-hover text-start d-flex flex-column">
                    <div className="p-3 rounded-3 bg-teal-subtle text-teal d-inline-flex mb-3" style={{ width: 'fit-content' }}>
                      <IconComp size={26} />
                    </div>
                    <h5 className="fw-bold mb-2">{service.title}</h5>
                    <p className="text-muted small mb-3 flex-grow-1">{service.desc}</p>
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
      <section className="py-5 bg-body-tertiary" id="doctor-about">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-teal">{t('aboutDoctor')}</h2>
            <p className="text-muted mb-0">{clinicDetails.doctor} ({clinicDetails.qualifications})</p>
          </div>

          <div className="row g-4">
            {/* Registrations Card */}
            <div className="col-md-6 col-lg-5">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 card-hover">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-circle bg-teal-subtle text-teal">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Professional Registrations</h5>
                    <small className="text-muted">Verified Medical Certifications</small>
                  </div>
                </div>
                <ul className="list-group list-group-flush border-0">
                  {clinicDetails.registrations.map((reg, idx) => (
                    <li key={idx} className="list-group-item bg-transparent px-0 d-flex align-items-center gap-2">
                      <CheckCircle2 size={18} className="text-teal" />
                      <span className="fw-semibold">{reg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Experience Card */}
            <div className="col-md-6 col-lg-7">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 card-hover">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-circle bg-teal-subtle text-teal">
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Past Clinical Experience</h5>
                    <small className="text-muted">Senior Roles in Premier Government & Private Hospitals</small>
                  </div>
                </div>
                <div className="row g-2">
                  {clinicDetails.experience.map((exp, idx) => (
                    <div key={idx} className="col-12 col-sm-6">
                      <div className="p-3 rounded-3 bg-body border d-flex align-items-start gap-2 h-100">
                        <Award size={18} className="text-teal mt-1 flex-shrink-0" />
                        <span className="small fw-medium">{exp}</span>
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
      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Address & Timings */}
            <div className="col-md-6 text-start">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-white clinical-banner">
                <h4 className="fw-bold text-white mb-3">{t('brand')}</h4>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <MapPin size={22} className="text-white-50 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-white">{t('addressLabel')}</strong>
                    <span className="text-white-50 small">{t('address')}</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <Clock size={22} className="text-white-50 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-white">{t('timingsLabel')}</strong>
                    <span className="text-white-50 small">{t('timings')} (Monday – Saturday)</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <Phone size={22} className="text-white-50 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-white">Phone Numbers</strong>
                    <div className="d-flex gap-2 flex-wrap mt-1">
                      {clinicDetails.contacts.map((c, i) => (
                        <a
                          key={i}
                          href={`tel:${c}`}
                          className="btn btn-sm clinical-banner-btn rounded-pill px-3 fw-bold shadow-sm"
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
                className="card h-100 border-0 shadow-sm rounded-4 p-4 text-white clinical-banner"
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="p-3 rounded-circle d-flex align-items-center justify-content-center clinical-banner-badge"
                  >
                    <Stethoscope size={28} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-white">{t('doctor')}</h4>
                    <p className="mb-0 opacity-75">{t('qualifications')}</p>
                  </div>
                </div>
                <p className="small mb-3 text-white-50">
                  {t('designation')} with extensive clinical experience treating musculoskeletal, spinal, and neurological conditions using advanced evidence-based modalities.
                </p>
                <div className="mt-auto pt-3 border-top border-white-50 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="small text-white-50">Need assistance? Call directly</span>
                  <a
                    href={`tel:${clinicDetails.contacts[0]}`}
                    className="btn btn-sm rounded-pill fw-bold px-3 shadow-sm clinical-banner-btn"
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
