import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import doctorImage from "../../../../assets/login_page_photo.png";



const SignupPage = () => {
  const { lang, theme, setLang, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isHindi = lang === "hi";
  const isDark = theme === "dark";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.mobile.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(isHindi ? "सभी फ़ील्ड भरें।" : "Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(
        isHindi ? "सही ईमेल दर्ज करें।" : "Please enter a valid email address."
      );
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError(
        isHindi
          ? "10 अंकों का मोबाइल नंबर दर्ज करें।"
          : "Enter a valid 10-digit mobile number."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        isHindi
          ? "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।"
          : "Password must be at least 6 characters."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(
        isHindi ? "पासवर्ड मेल नहीं खाते।" : "Passwords do not match."
      );
      return;
    }

    setStep("otp");
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp !== "123456") {
      setError(
        isHindi
          ? "गलत OTP। कृपया 123456 दर्ज करें।"
          : "Invalid OTP. Please enter 123456."
      );
      return;
    }

    // Demo only: no backend account is created here.
    const demoUser = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
    };

    localStorage.setItem("rhydhm_signup_demo", JSON.stringify(demoUser));

    setSuccess(
      isHindi
        ? "OTP सफलतापूर्वक सत्यापित हुआ!"
        : "OTP verified successfully!"
    );

    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };

  const resendOtp = () => {
    setOtp("");
    setError("");
    setSuccess(
      isHindi
        ? "टेस्ट OTP: 123456"
        : "Demo OTP: 123456"
    );
  };

  return (
    <div
      className={`auth-page ${isDark ? "auth-dark" : "auth-light"}`}
    >
      {/* Header */}
      <header className="auth-header">
        <div className="auth-brand">
          <span className="auth-brand-icon">
            <UserRound size={22} />
          </span>
          <span>RHYDHM Physio &amp; Fitness Center</span>
        </div>

        <div className="auth-header-controls">
          <button
            type="button"
            className="auth-control-btn"
            onClick={() => setLang(isHindi ? "en" : "hi")}
          >
            <Globe size={16} />
            {isHindi ? "हिन्दी" : "English"}
          </button>

          <button
            type="button"
            className="auth-control-btn"
            onClick={toggleTheme}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark
              ? isHindi
                ? "लाइट"
                : "Light"
              : isHindi
                ? "डार्क"
                : "Dark"}
          </button>
        </div>
      </header>

      {/* Main card */}
      <main className="auth-card">
        {/* Left image section */}
        <section className="auth-visual">
          <img
            src={doctorImage}
            alt="Healthcare professional"
            className="auth-doctor-image"
          />

          <div className="auth-visual-overlay">
            <span className="auth-image-badge">
              RHYDHM Physio &amp; Fitness Center
            </span>

            <h1>
              {isHindi
                ? "आपका स्वास्थ्य, हमारी प्राथमिकता"
                : "Your Health, Our Priority"}
            </h1>

            <p>
              {isHindi
                ? "बेहतर स्वास्थ्य और दर्द-मुक्त जीवन की ओर आपका पहला कदम।"
                : "Your first step towards better health and a pain-free life."}
            </p>
          </div>
        </section>

        {/* Right form section */}
        <section className="auth-form-section">
          <div className="auth-form-content">
            {step === "signup" ? (
              <>
                <span className="auth-eyebrow">
                  {isHindi ? "मरीज़ पोर्टल" : "PATIENT PORTAL"}
                </span>

                <h2>
                  {isHindi ? "खाता बनाएँ" : "Create Account"}
                </h2>

                <p className="auth-subtitle">
                  {isHindi
                    ? "शुरू करने के लिए अपनी जानकारी भरें।"
                    : "Register to begin your wellness journey."}
                </p>

                <form onSubmit={handleSignup}>
                  <div className="auth-field">
                    <label htmlFor="fullName">
                      {isHindi ? "पूरा नाम" : "Full Name"}
                    </label>
                    <div className="auth-input-wrap">
                      <UserRound size={17} />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder={
                          isHindi ? "अपना पूरा नाम दर्ज करें" : "Enter your full name"
                        }
                        value={formData.fullName}
                        onChange={handleChange}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="email">
                      {isHindi ? "ईमेल पता" : "Email Address"}
                    </label>
                    <div className="auth-input-wrap">
                      <Mail size={17} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="mobile">
                      {isHindi ? "मोबाइल नंबर" : "Mobile Number"}
                    </label>
                    <div className="auth-input-wrap">
                      <Phone size={17} />
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFormData((prev) => ({
                            ...prev,
                            mobile: value,
                          }));
                          setError("");
                        }}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="password">
                      {isHindi ? "पासवर्ड" : "Password"}
                    </label>
                    <div className="auth-input-wrap">
                      <LockKeyhole size={17} />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="confirmPassword">
                      {isHindi ? "पासवर्ड की पुष्टि करें" : "Confirm Password"}
                    </label>
                    <div className="auth-input-wrap">
                      <LockKeyhole size={17} />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && <p className="auth-error">{error}</p>}

                  <button type="submit" className="auth-submit-btn">
                    {isHindi ? "OTP प्राप्त करें" : "Continue to OTP"}
                  </button>
                </form>

                <p className="auth-switch-text">
                  {isHindi
                    ? "पहले से खाता है?"
                    : "Already have an account?"}{" "}
                  <Link to="/login">
                    {isHindi ? "लॉगिन करें" : "Login"}
                  </Link>
                </p>
              </>
            ) : (
              <>
                <span className="auth-eyebrow">
                  {isHindi ? "सुरक्षा सत्यापन" : "SECURITY VERIFICATION"}
                </span>

                <div className="auth-otp-icon">
                  <ShieldCheck size={30} />
                </div>

                <h2>{isHindi ? "OTP सत्यापित करें" : "Verify Your OTP"}</h2>

                <p className="auth-subtitle">
                  {isHindi
                    ? "अपना 6 अंकों का टेस्ट OTP दर्ज करें।"
                    : "Enter the 6-digit OTP to verify your registration."}
                </p>

                <div className="auth-demo-otp">
                  <strong>
                    {isHindi ? "टेस्ट OTP:" : "Demo OTP:"} 
                  </strong>
                  <span>
                    {isHindi
                      ? "अभी OTP ईमेल या SMS पर नहीं भेजा जाता।"
                      : "No email or SMS is sent in demo mode."}
                  </span>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="auth-field">
                    <label htmlFor="otp">
                      {isHindi ? "6 अंकों का OTP" : "Enter OTP"}
                    </label>
                    <div className="auth-input-wrap">
                      <ShieldCheck size={17} />
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 123456"
                        value={otp}
                        onChange={(e) => {
                          setOtp(e.target.value.replace(/\D/g, ""));
                          setError("");
                          setSuccess("");
                        }}
                        autoComplete="one-time-code"
                      />
                    </div>
                  </div>

                  {error && <p className="auth-error">{error}</p>}
                  {success && <p className="auth-success">{success}</p>}

                  <button type="submit" className="auth-submit-btn">
                    {isHindi ? "OTP सत्यापित करें" : "Verify OTP"}
                  </button>
                </form>

                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => {
                    setStep("signup");
                    setOtp("");
                    setError("");
                    setSuccess("");
                  }}
                >
                  <ArrowLeft size={16} />
                  {isHindi ? "वापस जाएँ" : "Back to Signup"}
                </button>

                <button
                  type="button"
                  className="auth-resend-btn"
                  onClick={resendOtp}
                >
                  {isHindi ? "OTP फिर से दिखाएँ" : "Resend Demo OTP"}
                </button>
              </>
            )}

            <div className="auth-footer">
              {isHindi
                ? "आपकी स्वस्थ यात्रा यहाँ से शुरू होती है।"
                : "Your wellness journey starts here."}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SignupPage;