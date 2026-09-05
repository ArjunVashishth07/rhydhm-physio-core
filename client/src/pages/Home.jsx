import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { clinicDetails } from '../data/clinicData';
import BookingForm from '../components/BookingForm';
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
  Search,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/appointments`;

export const Home = () => {
  const { t, lang } = useApp();

  // Patient History Lookup State
  const [historyPhone, setHistoryPhone] = useState('');
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyResults, setHistoryResults] = useState(null);
  const [historyError, setHistoryError] = useState('');

  const handleHistorySearch = async (e) => {
    e.preventDefault();
    if (!historyPhone || historyPhone.length < 10) {
      setHistoryError(lang === 'hi' ? 'कृपया 10-अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }

    setHistoryLoading(true);
    setHistoryError('');
    setHistoryResults(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/patient-history/${historyPhone}`);
      if (res.data && res.data.data) {
        setHistoryResults(res.data.data);
      }
    } catch (err) {
      console.error('History Lookup Error:', err);
      setHistoryError(
        err.response?.data?.message ||
          (lang === 'hi'
            ? 'इतिहास खोजने में विफलता हुई।'
            : 'Could not retrieve history for this phone number.')
      );
    } finally {
      setHistoryLoading(false);
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
      {/* HERO SECTION */}
      <section className="hero-section text-center py-5 px-3 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(13, 148, 136, 0.02) 100%)',
        borderBottom: '1px solid rgba(13, 148, 136, 0.1)'
      }}>
        <div className="container py-4">
          <div className="badge bg-teal-subtle text-teal rounded-pill px-3 py-2 mb-3 fw-semibold d-inline-flex align-items-center gap-2">
            <Award size={16} />
            <span>{clinicDetails.designation}</span>
          </div>

          <h1 className="display-4 fw-extrabold mb-3 text-teal" style={{ color: '#0d9488', letterSpacing: '-0.03em' }}>
            {t('brand')}
          </h1>

          <h4 className="fw-semibold text-body-secondary mb-3">
            {t('doctor')} <span className="badge bg-secondary-subtle text-body ms-2">{t('qualifications')}</span>
          </h4>

          <p className="lead text-muted max-w-2xl mx-auto mb-4" style={{ maxWidth: '750px' }}>
            {t('heroSubtitle')}
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <a
              href="#booking-section"
              className="btn btn-teal btn-lg rounded-pill px-4 py-3 fw-bold shadow d-flex align-items-center gap-2"
              style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
            >
              <Calendar size={20} />
              <span>{t('bookAppointment')}</span>
            </a>

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
                  <div className="card h-100 border-0 shadow-sm rounded-4 p-4 card-hover text-start">
                    <div className="p-3 rounded-3 bg-teal-subtle text-teal d-inline-flex mb-3" style={{ width: 'fit-content' }}>
                      <IconComp size={26} />
                    </div>
                    <h5 className="fw-bold mb-2">{service.title}</h5>
                    <p className="text-muted small mb-3">{service.desc}</p>
                    <a href="#booking-section" className="text-teal text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1 mt-auto">
                      <span>{t('bookAppointment')}</span> &rarr;
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section className="py-5 bg-body-tertiary" id="booking-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT HISTORY & PRESCRIPTIONS LOOKUP SECTION */}
      <section className="py-5" id="patient-history">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-start">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-circle bg-teal-subtle text-teal">
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{t('patientHistory')}</h4>
                    <p className="text-muted small mb-0">{t('enterPhonePrompt')}</p>
                  </div>
                </div>

                <form onSubmit={handleHistorySearch} className="row g-2 mb-4">
                  <div className="col-sm-8">
                    <div className="input-group">
                      <span className="input-group-text bg-body-tertiary">
                        <Phone size={18} className="text-muted" />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter phone number (e.g. 9760421410)"
                        value={historyPhone}
                        onChange={(e) => setHistoryPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <button
                      type="submit"
                      disabled={historyLoading}
                      className="btn btn-teal w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2"
                      style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
                    >
                      {historyLoading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                      ) : (
                        <>
                          <Search size={18} />
                          <span>{t('searchHistory')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {historyError && (
                  <div className="alert alert-warning small mb-3">
                    {historyError}
                  </div>
                )}

                {historyResults && (
                  <div>
                    {historyResults.length === 0 ? (
                      <div className="alert alert-info small mb-0">
                        {lang === 'hi' ? 'इस नंबर के लिए कोई पुराना अपॉइंटमेंट रिकॉर्ड नहीं मिला।' : 'No past appointment records found for this phone number.'}
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        <h6 className="fw-bold text-teal mb-0">
                          {lang === 'hi' ? `कुल अपॉइंटमेंट (${historyResults.length})` : `Total Appointments Found (${historyResults.length})`}
                        </h6>
                        {historyResults.map((app) => (
                          <div key={app._id} className="border rounded-3 p-3 bg-body shadow-xs">
                            <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                              <div>
                                <span className="fw-bold text-dark">{app.patientName}</span>
                                <span className="badge bg-secondary-subtle text-body ms-2">{app.primaryIssue}</span>
                              </div>
                              <span className={`badge ${app.status === 'Completed' ? 'bg-success' : app.status === 'Confirmed' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                {app.status}
                              </span>
                            </div>

                            <div className="row g-2 small text-muted mb-2">
                              <div className="col-sm-6">
                                <Calendar size={14} className="me-1" />
                                <strong>Date:</strong> {app.appointmentDate}
                              </div>
                              <div className="col-sm-6">
                                <Clock size={14} className="me-1" />
                                <strong>Slot:</strong> {app.timeSlot}
                              </div>
                            </div>

                            {/* Prescribed Exercises & Doctor Notes */}
                            {app.sessionNotes && (app.sessionNotes.exercisesGiven?.length > 0 || app.sessionNotes.doctorRemarks) && (
                              <div className="p-2.5 rounded bg-body-tertiary border mt-2 small">
                                <div className="fw-bold text-teal d-flex align-items-center gap-1 mb-1">
                                  <FileText size={14} />
                                  Prescribed Exercises & Remarks:
                                </div>
                                {app.sessionNotes.exercisesGiven?.length > 0 && (
                                  <ul className="mb-1 ps-3">
                                    {app.sessionNotes.exercisesGiven.map((ex, i) => (
                                      <li key={i}>{ex}</li>
                                    ))}
                                  </ul>
                                )}
                                {app.sessionNotes.doctorRemarks && (
                                  <div><strong>Doctor Remarks:</strong> {app.sessionNotes.doctorRemarks}</div>
                                )}
                                {app.sessionNotes.nextFollowUp && (
                                  <div><strong>Next Follow-up:</strong> {app.sessionNotes.nextFollowUp}</div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                <h4 className="fw-bold text-teal mb-3">{t('brand')}</h4>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <MapPin size={22} className="text-teal flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-dark">{t('addressLabel')}</strong>
                    <span className="text-muted small">{t('address')}</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-3">
                  <Clock size={22} className="text-teal flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-dark">{t('timingsLabel')}</strong>
                    <span className="text-muted small">{t('timings')} (Monday – Saturday)</span>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <Phone size={22} className="text-teal flex-shrink-0 mt-1" />
                  <div>
                    <strong className="d-block text-dark">Phone Numbers</strong>
                    <div className="d-flex gap-2 flex-wrap mt-1">
                      {clinicDetails.contacts.map((c, i) => (
                        <a key={i} href={`tel:${c}`} className="btn btn-sm btn-outline-teal rounded-pill px-3">
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
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 bg-teal text-white" style={{ backgroundColor: '#0d9488' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-3 rounded-circle bg-white text-teal">
                    <Stethoscope size={30} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-white">{t('doctor')}</h4>
                    <p className="text-white-50 mb-0">{t('qualifications')}</p>
                  </div>
                </div>
                <p className="text-white-50 small mb-3">
                  {t('designation')} with extensive clinical experience treating musculoskeletal, spinal, and neurological conditions using advanced evidence-based modalities.
                </p>
                <div className="mt-auto pt-3 border-top border-white-50 d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="small text-white-50">Need assistance? Call directly</span>
                  <a href={`tel:${clinicDetails.contacts[0]}`} className="btn btn-light btn-sm rounded-pill fw-bold text-teal px-3">
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
