import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  MessageSquare,
  CheckCircle2,
  X
} from 'lucide-react';
import { generatePrescriptionWhatsAppLink } from '../utils/whatsappHelper';

export const PrescriptionEditModal = ({
  isOpen,
  onClose,
  appointment,
  onUpdateStatus,
  onSavePrescription,
  updatingStatus = false,
  savingPrescription = false,
  actionSuccess = ''
}) => {
  const [exercises, setExercises] = useState([]);
  const [newExerciseInput, setNewExerciseInput] = useState('');
  const [doctorRemarks, setDoctorRemarks] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');

  // Sync state when selected appointment changes
  useEffect(() => {
    if (appointment) {
      setExercises(appointment.sessionNotes?.exercisesGiven || []);
      setDoctorRemarks(appointment.sessionNotes?.doctorRemarks || '');
      setNextFollowUp(appointment.sessionNotes?.nextFollowUp || '');
      setNewExerciseInput('');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleAddExercise = () => {
    if (!newExerciseInput.trim()) return;
    setExercises([...exercises, newExerciseInput.trim()]);
    setNewExerciseInput('');
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSavePrescription({
      exercisesGiven: exercises,
      doctorRemarks: doctorRemarks.trim(),
      nextFollowUp
    });
  };

  const currentStatus = appointment.status || 'Pending';

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(15, 12, 10, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 1055
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden text-start">
          {/* Modal Header */}
          <div
            className="modal-header text-white p-4 clinical-modal-header border-0 d-flex align-items-center justify-content-between"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' }}
          >
            <div>
              <h4 className="modal-title fw-bold mb-0 text-white">{appointment.patientName}</h4>
              <small className="text-white-50">
                Phone: {appointment.phone} • Age: {appointment.age} ({appointment.gender})
              </small>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 bg-body text-start">
            {actionSuccess && (
              <div className="alert alert-success alert-dismissible fade show small d-flex align-items-center gap-2 mb-3 rounded-3" role="alert">
                <CheckCircle2 size={18} className="text-success" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Appointment Info Summary */}
            <div className="p-3 bg-body-tertiary rounded-3 mb-4 border">
              <div className="row g-2 small">
                <div className="col-sm-6">
                  <strong>Condition:</strong> {appointment.primaryIssue}
                </div>
                <div className="col-sm-6">
                  <strong>Date & Slot:</strong> {appointment.appointmentDate} ({appointment.timeSlot})
                </div>
                {appointment.symptoms?.length > 0 && (
                  <div className="col-12">
                    <strong>Selected Symptoms:</strong> {appointment.symptoms.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* 1. STATUS UPDATE CONTROLS */}
            <div className="mb-4">
              <label className="form-label fw-bold text-body small d-block">
                Update Appointment Status
              </label>
              <div className="btn-group w-100 flex-wrap gap-1" role="group">
                {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateStatus(st)}
                    disabled={updatingStatus}
                    className={`btn btn-sm py-2 fw-bold rounded-2 transition-all ${
                      currentStatus === st
                        ? st === 'Completed'
                          ? 'btn-success text-white'
                          : st === 'Confirmed'
                          ? 'btn-primary text-white'
                          : st === 'Cancelled'
                          ? 'btn-danger text-white'
                          : 'btn-warning text-dark'
                        : 'btn-outline-secondary'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            {/* 2. DIGITAL PRESCRIPTION FORM */}
            <form onSubmit={handleSubmit}>
              <h5 className="fw-bold text-teal mb-3 d-flex align-items-center gap-2">
                <FileText size={20} />
                <span>Digital Prescription & Doctor Notes</span>
              </h5>

              {/* Add Exercises */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Recommended Exercises
                </label>
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Chin Tucks (10 reps x 3 sets)"
                    value={newExerciseInput}
                    onChange={(e) => setNewExerciseInput(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="btn btn-teal text-white fw-semibold d-inline-flex align-items-center gap-1"
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Exercise List Pills */}
                {exercises.length > 0 ? (
                  <ul className="list-group list-group-numbered mb-0">
                    {exercises.map((ex, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center py-2 bg-body"
                      >
                        <span className="small fw-medium">{ex}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(idx)}
                          className="btn btn-outline-danger btn-sm p-1 border-0"
                          title="Remove exercise"
                        >
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <small className="text-muted fst-italic">No exercises added yet.</small>
                )}
              </div>

              {/* Doctor Remarks */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">
                  Doctor Remarks / Clinical Advice
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter clinical observations, precautions, or modalities applied..."
                  value={doctorRemarks}
                  onChange={(e) => setDoctorRemarks(e.target.value)}
                ></textarea>
              </div>

              {/* Next Follow-Up Date */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small">
                  Next Follow-Up Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                />
              </div>

              {/* Save Prescription Button */}
              <button
                type="submit"
                disabled={savingPrescription}
                className="btn btn-teal text-white w-100 py-2.5 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {savingPrescription ? (
                  <div className="spinner-border spinner-border-sm" role="status"></div>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Digital Prescription</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer bg-body-tertiary d-flex justify-content-between align-items-center flex-wrap gap-2 p-3">
            {/* WhatsApp Quick Action Button */}
            <a
              href={generatePrescriptionWhatsAppLink({
                ...appointment,
                sessionNotes: {
                  exercisesGiven: exercises,
                  doctorRemarks,
                  nextFollowUp
                }
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2"
            >
              <MessageSquare size={18} />
              <span>Send WhatsApp Summary</span>
            </a>

            <button
              type="button"
              className="btn btn-secondary rounded-pill px-4"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionEditModal;
