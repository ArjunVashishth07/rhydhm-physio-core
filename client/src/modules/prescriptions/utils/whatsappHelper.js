/**
 * WhatsApp Helper for Clinical Prescriptions and Appointments
 */
export const generatePrescriptionWhatsAppLink = (appointment) => {
  if (!appointment) return '';

  const exercises = appointment.sessionNotes?.exercisesGiven || [];
  const doctorRemarks = appointment.sessionNotes?.doctorRemarks || '';
  const nextFollowUp = appointment.sessionNotes?.nextFollowUp || '';

  const text =
    `*RHYDHM Physio & Fitness Center*\n` +
    `Hello ${appointment.patientName || 'Patient'},\n` +
    `Your appointment status: *${appointment.status || 'Confirmed'}*\n` +
    `*Date:* ${appointment.appointmentDate}\n` +
    `*Time Slot:* ${appointment.timeSlot}\n` +
    `*Condition:* ${appointment.primaryIssue}\n\n` +
    (exercises.length
      ? `*Prescribed Exercise Routine:*\n` +
        exercises.map((ex, i) => `${i + 1}. ${ex}`).join('\n') +
        `\n\n`
      : '') +
    (doctorRemarks ? `*Doctor Remarks & Advice:*\n${doctorRemarks}\n\n` : '') +
    (nextFollowUp ? `*Next Follow-Up Date:* ${nextFollowUp}\n\n` : '') +
    `Doctor: Dr. Neha Sharma (PT)\nContact: 9760421410`;

  const cleanPhone = String(appointment.phone || '').replace(/[^0-9]/g, '');
  const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
};

export default generatePrescriptionWhatsAppLink;
