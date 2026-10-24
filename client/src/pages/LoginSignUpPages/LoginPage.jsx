
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserRound, LockKeyhole } from "lucide-react";
import doctorImage from "../../assets/login_page_photo.png";
import "./LoginPage.css";
import { useApp } from "../../context/AppContext";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth`;

function LoginPage() {
  const { lang, theme, loginUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isHindi = lang === "hi";
  const isDark = theme === "dark";

  const text = {
    welcome: isHindi ? "वापस स्वागत है!" : "Welcome Back!",
    subtitle: isHindi
      ? "अपने अकाउंट में लॉगिन करें"
      : "Login to your patient account",
    email: isHindi ? "ईमेल या मोबाइल नंबर" : "Email or Mobile Number",
    password: isHindi ? "पासवर्ड" : "Password",
    forgot: isHindi ? "पासवर्ड भूल गए?" : "Forgot Password?",
    login: isHindi ? "लॉगिन करें" : "Login",
    register: isHindi ? "रजिस्टर करें" : "Register Now",
    account: isHindi
      ? "अकाउंट नहीं है?"
      : "Don't have an account?",
    quote: isHindi
      ? "आपका स्वास्थ्य, हमारी प्राथमिकता"
      : "Your Health, Our Priority",
    description: isHindi
      ? "बेहतर स्वास्थ्य और दर्द-मुक्त जीवन की ओर आपका पहला कदम।"
      : "Your first step towards better health and a pain-free life.",
    clinic: "RHYDHM Physio & Fitness Center",
    language: isHindi ? "हिन्दी" : "English",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (res.data?.success) {
        loginUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('rhydhm_token', res.data.token);
        }
        navigate("/patient-dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isHindi
          ? "लॉगिन विफल रहा। कृपया अपनी जानकारी जांचें।"
          : "Login failed. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={`auth-page ${isDark ? "auth-dark" : "auth-light"}`}>
      <main className="auth-layout">
        {/* LEFT: Image and welcome message */}
        <section className="auth-visual">
          <img
            src={doctorImage}
            alt="Physiotherapist at RHYDHМ Physio and Fitness Center"
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

        {/* RIGHT: Login form */}
        <section className="auth-form-section">
          <div className="auth-form-card">
            <div className="auth-heading">
              <span className="auth-small-label">
                {isHindi ? "PATIENT PORTAL" : "PATIENT PORTAL"}
              </span>

              <h2>{text.welcome}</h2>
              <p>{text.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <strong>
                  <label htmlFor="patient-email" className="fs-4">
                  {text.email}
                </label>
                </strong>

                <div className="auth-input-wrap">
                  <UserRound size={19} />
                  
                    <input
                    id="patient-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      isHindi
                        ? "ईमेल या मोबाइल नंबर दर्ज करें"
                        : "Enter email or mobile number"
                    }
                    autoComplete="username"
                    required
                    className="fs-5"
                  />
                 
                </div>
              </div>

              <div className="auth-field">
                <strong>
                  <label htmlFor="patient-password" className="fs-4">
                  {text.password}
                </label>
                </strong>

                <div className="auth-input-wrap">
                  <LockKeyhole size={19} />
                  <input
                    id="patient-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      isHindi
                        ? "अपना पासवर्ड दर्ज करें"
                        : "Enter your password"
                    }
                    autoComplete="current-password"
                    required
                    className="fs-5"
                  />

                  <button
                    type="button"
                    className="auth-show-password fs-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? (isHindi ? "छिपाएँ" : "Hide")
                      : (isHindi ? "दिखाएँ" : "Show")}
                  </button>
                </div>
              </div>

              <div className="auth-forgot-row">
                <Link to="/forgot-password" className="fs-6">
                  {text.forgot}
                </Link>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 text-start">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="auth-submit fs-5">
                {loading ? (isHindi ? "लॉगिन हो रहा है..." : "Logging in...") : text.login}
              </button>
            </form>

            <strong>
              <div className="auth-register">
              <span className="me-1">{text.account}</span>
              <Link to="/register">{text.register}</Link>
            </div>
            </strong>

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

export default LoginPage;
