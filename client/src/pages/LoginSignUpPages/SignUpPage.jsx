import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Globe,
  Moon,
  Sun,
  CheckCircle2
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import doctorImage from "../../assets/login_page_photo.png";
import "./LoginPage.css";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth`;

function SignUpPage() {
  const { lang, theme, setLang, toggleTheme, loginUser } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isHindi = lang === "hi";
  const isDark = theme === "dark";

  const text = {
    clinic: "RHYDHM Physio & Fitness Center",
    portal: isHindi ? "मरीज़ पोर्टल" : "PATIENT PORTAL",
    welcome: isHindi ? "नया खाता बनाएँ" : "Create Account",
    subtitle: isHindi
      ? "अपनी देखभाल शुरू करने के लिए पंजीकरण करें"
      : "Register to begin your clinical wellness journey",
    fullName: isHindi ? "पूरा नाम" : "Full Name",
    email: isHindi ? "ईमेल पता" : "Email Address",
    mobile: isHindi ? "10-अंकों का मोबाइल नंबर" : "10-Digit Mobile Number",
    password: isHindi ? "पासवर्ड (कम से कम 6 अक्षर)" : "Password (min 6 characters)",
    confirmPassword: isHindi ? "पासवर्ड की पुष्टि करें" : "Confirm Password",
    submit: isHindi ? "खाता बनाएँ" : "Create Account",
    submitting: isHindi ? "खाता बन रहा है..." : "Creating Account...",
    hasAccount: isHindi ? "पहले से खाता है?" : "Already have an account?",
    login: isHindi ? "लॉगिन करें" : "Login Now",
    quote: isHindi
      ? "आपका स्वास्थ्य, हमारी प्राथमिकता"
      : "Your Health, Our Priority",
    description: isHindi
      ? "बेहतर स्वास्थ्य और दर्द-मुक्त जीवन की ओर आपका पहला कदम।"
      : "Your first step towards better health and a pain-free life.",
    language: isHindi ? "हिन्दी" : "English",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 1. Validation
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(isHindi ? "कृपया सभी फ़ील्ड भरें।" : "Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError(
        isHindi ? "कृपया वैध ईमेल पता दर्ज करें।" : "Please enter a valid email address."
      );
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      setError(
        isHindi
          ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।"
          : "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        isHindi
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(
        isHindi ? "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।" : "Passwords do not match."
      );
      return;
    }

    // 2. Submit to Backend API
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: cleanMobile,
        password: formData.password
      });

      if (res.data?.success) {
        if (res.data.user) {
          loginUser(res.data.user);
        }
        if (res.data.token) {
          localStorage.setItem("rhydhm_token", res.data.token);
        }

        setSuccess(
          isHindi
            ? "खाता सफलतापूर्वक बन गया! डैशबोर्ड पर भेजा जा रहा है..."
            : "Account created successfully! Redirecting to dashboard..."
        );

        setTimeout(() => {
          navigate("/patient-dashboard");
        }, 1100);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isHindi ? "पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।" : "Registration failed. Please verify details and try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${isDark ? "auth-dark" : "auth-light"}`}>
      {/* Top Header Bar */}
      <div className="auth-topbar">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">
            <UserRound size={22} />
          </span>
          <span>{text.clinic}</span>
        </Link>

        <div className="auth-controls">
          <button
            type="button"
            className="auth-control-btn"
            onClick={() => setLang(isHindi ? "en" : "hi")}
            aria-label="Change language"
          >
            <Globe size={17} />
            {text.language}
          </button>

          <button
            type="button"
            className="auth-control-btn"
            onClick={toggleTheme}
            aria-label="Change theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
            {isDark
              ? (isHindi ? "लाइट मोड" : "Light")
              : (isHindi ? "डार्क मोड" : "Dark")}
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <main className="auth-layout">
        {/* LEFT: Clinical Visual Banner */}
        <section className="auth-visual">
          <img
            src={doctorImage}
            alt="Physiotherapy professional at RHYDHM Clinic"
            className="auth-doctor-image"
          />

          <div className="auth-image-overlay" />

          <div className="auth-visual-content">
            <strong>
              <span className="auth-eyebrow fs-6">
                {text.clinic}
              </span>
            </strong>
            <h1>{text.quote}</h1>
            <p>{text.description}</p>
          </div>
        </section>

        {/* RIGHT: Dedicated Registration Form */}
        <section className="auth-form-section">
          <div className="auth-form-card auth-signup-card">
            <div className="auth-heading">
              <span className="auth-small-label">{text.portal}</span>
              <h2>{text.welcome}</h2>
              <p>{text.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="auth-field">
                <label htmlFor="patient-name">
                  {text.fullName}
                </label>
                <div className="auth-input-wrap">
                  <UserRound size={18} />
                  <input
                    id="patient-name"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={isHindi ? "उदाहरण: राहुल शर्मा" : "e.g. Rahul Sharma"}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="auth-field">
                <label htmlFor="patient-email">
                  {text.email}
                </label>
                <div className="auth-input-wrap">
                  <Mail size={18} />
                  <input
                    id="patient-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isHindi ? "ईमेल पता दर्ज करें" : "name@example.com"}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="auth-field">
                <label htmlFor="patient-mobile">
                  {text.mobile}
                </label>
                <div className="auth-input-wrap">
                  <Phone size={18} />
                  <input
                    id="patient-mobile"
                    name="mobile"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({ ...prev, mobile: val }));
                      setError("");
                    }}
                    placeholder="97604XXXXX"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-field">
                <label htmlFor="patient-password">
                  {text.password}
                </label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="patient-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isHindi ? "पासवर्ड दर्ज करें" : "Create password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (isHindi ? "छिपाएँ" : "Hide") : (isHindi ? "दिखाएँ" : "Show")}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="auth-field">
                <label htmlFor="patient-confirm-password">
                  {text.confirmPassword}
                </label>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    id="patient-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={isHindi ? "पासवर्ड दोबारा दर्ज करें" : "Confirm password"}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-show-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (isHindi ? "छिपाएँ" : "Hide") : (isHindi ? "दिखाएँ" : "Show")}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 text-start">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="alert alert-success py-2 px-3 small rounded-3 mb-3 text-start d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-submit fs-5 mt-2"
              >
                {loading ? text.submitting : text.submit}
              </button>
            </form>

            {/* Switch to Login Link */}
            <div className="auth-register mt-3">
              <span className="me-1">{text.hasAccount}</span>
              <Link to="/login" className="fw-bold">{text.login}</Link>
            </div>

            <p className="auth-footer">
              {isHindi
                ? "आपकी सेहत, हमारी देखभाल।"
                : "Your wellness journey starts here."}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignUpPage;