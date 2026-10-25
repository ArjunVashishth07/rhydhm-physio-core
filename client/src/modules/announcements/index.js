// Announcements Module Barrel Export
export { AdminAnnouncementFormModal } from './components/AdminAnnouncementFormModal';
export { AnnouncementPreviewModal } from './components/AnnouncementPreviewModal';
export { AnnouncementTable } from './components/AnnouncementTable';
export { AnnouncementCard } from './components/AnnouncementCard';
export { CriticalNoticeBanner } from './components/CriticalNoticeBanner';

export {
  fetchAnnouncements,
  fetchPatientAnnouncements,
  fetchRegisteredPatients,
  createAnnouncement,
  updateAnnouncement,
  dismissAnnouncement,
  deleteAnnouncement
} from './api/announcementsApi';
