import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useApp } from '../context/AppContext';
import { conditionSymptomsMap, timeSlots as defaultTimeSlots } from '../data/clinicData';
import { Calendar, Clock, User, Phone, Activity, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/appointments`;

export const BookingForm = () => {
  const { t, lang, user, openAuthModal } = useApp();

  // Today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [primaryIssue, setPrimaryIssue] = useState('Cervical & Posture Care');
  const [symptoms, setSymptoms] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(getTodayString());
  const [timeSlot, setTimeSlot] = useState('');

  // Async & Response States
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Auto-fill phone when logged in
  useEffect(() => {
    if (user && user.phone && !phone) {
      setPhone(user.phone);
    }
  }, [user]);

  // Fetch available time slots whenever date changes
  useEffect(() => {
    if (!appointmentDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/available-slots?date=${appointmentDate}`);
        if (response.data && response.data.availableSlots) {
          setAvailableSlots(response.data.availableSlots);
        } else {
          setAvailableSlots(defaultTimeSlots);
        }
      } catch (err) {
        console.warn('Could not fetch server slots, falling back to default slots:', err.message);
        setAvailableSlots(defaultTimeSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [appointmentDate]);

  // Reset selected symptoms when primary issue changes
  const handlePrimaryIssueChange = (e) => {
    const newIssue = e.target.value;
    setPrimaryIssue(newIssue);
    setSymptoms([]);
  };

  // Toggle symptom checkbox
  const handleSymptomToggle = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter((item) => item !== symptom));
    } else {
      setSymptoms([...symptoms, symptom]);
    }
  };

  // Core Booking Execution Helper
  const executeBooking = async (activePhone) => {
    const targetPhone = activePhone || phone || (user ? user.phone : '');

    const payload = {
      patientName,
      phone: targetPhone,
      age: Number(age),
      gender,
      primaryIssue,
      symptoms,
      appointmentDate,
      timeSlot
    };

    console.log('Form Submitted:');
    console.log('Data sent:', payload);

    setSubmitting(true);

    try {
      const res = await axios.post(API_BASE_URL, payload);
      console.log('Response received:', res.data);

      if (res.status === 201 || res.data) {
        const appointmentData = res.data?.appointment || res.data?.data || payload;
        setBookingSuccess(appointmentData);

        // Reset form inputs except date
        setPatientName('');
        if (!user) setPhone('');
        setAge('');
        setSymptoms([]);
        setTimeSlot('');
      }
    } catch (err) {
      console.error('Booking Error:', err);
      const errMsg =
        err.response?.data?.message ||
        (lang === 'hi'
          ? 'अपॉइंटमेंट बुक करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Failed to book appointment. Please verify details and try again.');
      setBookingError(errMsg);
      alert(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(null);

    if (!timeSlot) {
      const msg = lang === 'hi' ? 'कृपया एक समय स्लॉट चुनें' : 'Please select an appointment time slot.';
      setBookingError(msg);
      alert(msg);
      return;
    }

    // If guest, pause and prompt OTP modal
    if (!user) {
      openAuthModal((loggedInUser) => {
        const finalPhone = loggedInUser?.phone || phone;
        executeBooking(finalPhone);
      });
      return;
    }

    // Logged in user, submit directly
    executeBooking(user.phone || phone);
  };

  // Generate WhatsApp Share Link
  const getWhatsAppLink = (booking) => {
    const text =
      `*RHYDHM Physio & Fitness Center - New Appointment*\n\n` +
      `*Patient Name:* ${booking.patientName}\n` +
      `*Phone:* ${booking.phone}\n` +
      `*Age/Gender:* ${booking.age} yrs / ${booking.gender}\n` +
      `*Primary Issue:* ${booking.primaryIssue}\n` +
      `*Date:* ${booking.appointmentDate}\n` +
      `*Time Slot:* ${booking.timeSlot}\n` +
      (booking.symptoms?.length ? `*Symptoms:* ${booking.symptoms.join(', ')}\n` : '');

    return `https://wa.me/919760421410?text=${encodeURIComponent(text)}`;
  };

  const currentSymptoms = conditionSymptomsMap[primaryIssue] || [];

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden" id="booking-form">
      <div className="card-header bg-teal text-white p-4 text-center" style={{ backgroundColor: '#0d9488' }}>
        <h3 className="fw-bold mb-1 d-flex align-items-center justify-content-center gap-2">
          <Calendar size={26} />
          {t('bookAppointment')}
        </h3>
        <p className="mb-0 text-white-50 small">
          {lang === 'hi'
            ? 'अपनी सुविधा के अनुसार तारीख एवं समय स्लॉट चुनें'
            : 'Select your preferred date & time slot for consultation'}
        </p>
      </div>

      <div className="card-body p-4 p-md-5">
        {/* Success Alert */}
        {bookingSuccess && (
          <div className="alert alert-success border-0 shadow-sm p-4 mb-4 rounded-3 text-start">
            <div className="d-flex align-items-center gap-3 mb-2">
              <CheckCircle className="text-success" size={32} />
              <div>
                <h5 className="alert-heading fw-bold mb-0">{t('bookingSuccess')}</h5>
                <small className="text-muted">
                  Booking ID: #{bookingSuccess._id ? bookingSuccess._id.substring(18) : 'RHY-' + Date.now().toString().slice(-4)}
                </small>
              </div>
            </div>
            <hr />
            <div className="row g-2 mb-3 small">
              <div className="col-sm-6">
                <strong>{t('fullName')}:</strong> {bookingSuccess.patientName}
              </div>
              <div className="col-sm-6">
                <strong>{t('phoneNumber')}:</strong> {bookingSuccess.phone}
              </div>
              <div className="col-sm-6">
                <strong>{t('selectDate')}:</strong> {bookingSuccess.appointmentDate}
              </div>
              <div className="col-sm-6">
                <strong>{t('availableSlots')}:</strong> {bookingSuccess.timeSlot}
              </div>
              <div className="col-12">
                <strong>{t('selectCondition')}:</strong> {bookingSuccess.primaryIssue}
              </div>
            </div>

            <a
              href={getWhatsAppLink(bookingSuccess)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success rounded-pill w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2.5 shadow-sm"
            >
              <MessageSquare size={20} />
              {lang === 'hi' ? 'WhatsApp पर पुष्टि भेजें' : 'Confirm & Send Details on WhatsApp'}
            </a>
          </div>
        )}

        {/* Error Alert */}
        {bookingError && (
          <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2 mb-4">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Patient Details Row */}
          <div className="row g-3 mb-4">
            {/* Full Name */}
            <div className="col-md-6 text-start">
              <label className="form-label fw-semibold text-secondary small">
                {t('fullName')} <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary">
                  <User size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={lang === 'hi' ? 'उदाहरण: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-md-6 text-start">
              <label className="form-label fw-semibold text-secondary small">
                {t('phoneNumber')} <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-body-tertiary">
                  <Phone size={18} className="text-muted" />
                </span>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="97604XXXXX"
                  pattern="[0-9]{10}"
                  title="10-digit phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Age */}
            <div className="col-md-4 text-start">
              <label className="form-label fw-semibold text-secondary small">
                {t('age')} <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 35"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            {/* Gender Radio Pills */}
            <div className="col-md-8 text-start">
              <label className="form-label fw-semibold text-secondary small d-block">
                {t('gender')} <span className="text-danger">*</span>
              </label>
              <div className="btn-group w-100" role="group" aria-label="Gender selection">
                {['Male', 'Female', 'Other'].map((g) => {
                  const isSelected = gender === g;
                  return (
                    <React.Fragment key={g}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="genderRadio"
                        id={`gender-${g}`}
                        value={g}
                        checked={isSelected}
                        onChange={() => setGender(g)}
                      />
                      <label
                        className={`btn py-2 fw-semibold transition-all ${
                          isSelected ? 'shadow-sm' : ''
                        }`}
                        htmlFor={`gender-${g}`}
                        style={{
                          backgroundColor: isSelected ? '#0d9488' : 'transparent',
                          color: isSelected ? '#ffffff' : '#0f766e',
                          borderColor: '#0d9488',
                          borderWidth: '1px',
                          borderStyle: 'solid'
                        }}
                      >
                        {t(g.toLowerCase())}
                      </label>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Primary Issue Specialty Dropdown */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-secondary small">
              {t('selectCondition')} <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary">
                <Activity size={18} className="text-teal" style={{ color: '#0d9488' }} />
              </span>
              <select
                className="form-select fw-semibold"
                value={primaryIssue}
                onChange={handlePrimaryIssueChange}
                required
              >
                {Object.keys(conditionSymptomsMap).map((issueKey) => (
                  <option key={issueKey} value={issueKey}>
                    {issueKey}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Symptoms Checkboxes / Badges */}
          {currentSymptoms.length > 0 && (
            <div className="mb-4 text-start">
              <label className="form-label fw-semibold text-secondary small d-block">
                {t('symptoms')} <small className="text-muted fw-normal">({lang === 'hi' ? 'वैकल्पिक' : 'Optional'})</small>
              </label>
              <div className="d-flex flex-wrap gap-2">
                {currentSymptoms.map((sym) => {
                  const isSelected = symptoms.includes(sym);
                  return (
                    <button
                      type="button"
                      key={sym}
                      onClick={() => handleSymptomToggle(sym)}
                      className={`btn btn-sm rounded-pill transition-all text-start d-flex align-items-center gap-1.5 px-3 py-1.5 ${
                        isSelected
                          ? 'btn-teal text-white shadow-sm'
                          : 'btn-outline-secondary opacity-85'
                      }`}
                    >
                      <span style={{ fontSize: '1.1em' }}>{isSelected ? '✓' : '+'}</span>
                      <span>{sym}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-secondary small">
              {t('selectDate')} <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control fw-semibold"
              min={getTodayString()}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          {/* Available Slots Pill Grid */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-secondary small d-flex align-items-center justify-content-between">
              <span>
                {t('availableSlots')} <span className="text-danger">*</span>
              </span>
              <span className="badge bg-teal-subtle text-teal">
                <Clock size={14} className="me-1" />
                4:00 PM - 8:00 PM
              </span>
            </label>

            {loadingSlots ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-teal" role="status"></div>
                <span className="ms-2 small text-muted">
                  {lang === 'hi' ? 'समय स्लॉट लोड हो रहे हैं...' : 'Loading available slots...'}
                </span>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="alert alert-warning small mb-0">
                {t('noSlotsAvailable')}
              </div>
            ) : (
              <div className="row g-2">
                {availableSlots.map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <div key={slot} className="col-6 col-md-3">
                      <button
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`btn btn-sm w-100 rounded-3 py-2.5 fw-semibold transition-all ${
                          isSelected
                            ? 'btn-teal text-white shadow-sm scale-102'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {slot}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-teal btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-4"
            style={{ backgroundColor: '#0d9488', borderColor: '#0d9488' }}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{lang === 'hi' ? 'बुक हो रहा है...' : 'Booking...'}</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>{t('confirmBooking')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
