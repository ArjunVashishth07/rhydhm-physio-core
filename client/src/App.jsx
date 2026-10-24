import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import LoginPage from './pages/LoginSignUpPages/LoginPage';
import SignUpPage from './pages/LoginSignUpPages/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
      </div>
    </BrowserRouter>
  );
}

export default App;
