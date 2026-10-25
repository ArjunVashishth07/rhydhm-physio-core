import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { conditionSymptomsMap, timeSlots as defaultTimeSlots } from '../data/clinicData';
import { Calendar, User, Phone, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import {
  SlotPicker,
  SymptomSelector,
  BookingSuccessView,
  fetchAvailableSlots,
  bookAppointment
} from '../modules/appointments';

export const BookingForm = ({ onBookingSuccess } = {}) => {
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
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // Auto-fill phone and name when logged in
  useEffect(() => {
    const userPhone = user?.phone || user?.mobile;
    if (userPhone && !phone) {
      setPhone(userPhone);
    }
    if (user?.fullName && !patientName) {
      setPatientName(user.fullName);
    }
  }, [user]);

  // Fetch available time slots whenever date changes
  useEffect(() => {
    if (!appointmentDate) return;

    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await fetchAvailableSlots(appointmentDate);
        if (response && response.availableSlots) {
          setAvailableSlots(response.availableSlots);
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

    loadSlots();
  }, [appointmentDate]);

  // Reset selected symptoms when primary issue changes
  const handlePrimaryIssueChange = (e) => {
    setPrimaryIssue(e.target.value);
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
    const userActivePhone = user?.phone || user?.mobile || '';
    const targetPhone = activePhone || phone || userActivePhone;

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

    setSubmitting(true);
    setBookingError('');

    try {
      const res = await bookAppointment(payload);
      const appointmentData = res?.appointment || res?.data || payload;
      setBookingSuccess(appointmentData);

      if (onBookingSuccess && typeof onBookingSuccess === 'function') {
        onBookingSuccess(appointmentData);
      }

      // Reset form inputs except date
      setPatientName('');
      if (!user) setPhone('');
      setAge('');
      setSymptoms([]);
      setTimeSlot('');
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

  const currentSymptoms = conditionSymptomsMap[primaryIssue] || [];

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden" id="booking-form">
      <div className="card-header text-white p-4 text-center clinical-banner border-0">
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
        {/* Success Alert with WhatsApp Action */}
        {bookingSuccess && (
          <BookingSuccessView
            booking={bookingSuccess}
            lang={lang}
            title={t('bookingSuccess')}
            whatsAppButtonText={
              lang === 'hi' ? 'WhatsApp पर पुष्टि भेजें' : 'Confirm & Send Details on WhatsApp'
            }
          />
        )}

        {/* Error Alert */}
        {bookingError && (
          <div className="alert alert-danger border-0 shadow-sm d-flex align-items-center gap-2 mb-4 rounded-3 text-start">
            <AlertCircle size={20} />
            <span>{bookingError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Patient Name */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-secondary small">
              {t('fullName')} <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary">
                <User size={18} className="text-teal" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder={lang === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="mb-4 text-start">
            <label className="form-label fw-semibold text-secondary small">
              {t('phoneNumber')} <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-body-tertiary">
                <Phone size={18} className="text-teal" />
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Age & Gender Row */}
          <div className="row g-3 mb-4 text-start">
            <div className="col-sm-6">
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
            <div className="col-sm-6">
              <label className="form-label fw-semibold text-secondary small d-block">
                {t('gender')} <span className="text-danger">*</span>
              </label>
              <div className="btn-group w-100" role="group">
                {['Male', 'Female', 'Other'].map((g) => {
                  const isChecked = gender === g;
                  return (
                    <React.Fragment key={g}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="genderOptions"
                        id={`gender-${g}`}
                        autoComplete="off"
                        checked={isChecked}
                        onChange={() => setGender(g)}
                      />
                      <label
                        className={`btn btn-outline-secondary ${
                          isChecked ? 'active btn-teal text-white' : ''
                        }`}
                        htmlFor={`gender-${g}`}
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
                <Activity size={18} className="text-teal" />
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

          {/* Modular Symptoms Chips */}
          <SymptomSelector
            symptomsList={currentSymptoms}
            selectedSymptoms={symptoms}
            onToggleSymptom={handleSymptomToggle}
            lang={lang}
            label={t('symptoms')}
            optionalText={lang === 'hi' ? 'वैकल्पिक' : 'Optional'}
          />

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

          {/* Modular Slot Picker */}
          <SlotPicker
            availableSlots={availableSlots}
            selectedSlot={timeSlot}
            onSelectSlot={setTimeSlot}
            loading={loadingSlots}
            lang={lang}
            label={t('availableSlots')}
            noSlotsText={t('noSlotsAvailable')}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-teal btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mt-4"
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
