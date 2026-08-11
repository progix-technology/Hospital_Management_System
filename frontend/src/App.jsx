import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/admin/dashboard/Dashboard';
import PatientsList from './pages/admin/patients/PatientsList';
import PatientDetails from './pages/admin/patients/PatientDetails';
import DoctorsList from './pages/doctors/DoctorsList';
import AddDoctor from './pages/admin/doctors/AddDoctor';
import EditDoctor from './pages/admin/doctors/EditDoctor';
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPatientProfile from './pages/doctor/DoctorPatientProfile';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorReports from './pages/doctor/DoctorReports';
import DoctorSettings from './pages/doctor/DoctorSettings';
import LabTechnicianDashboard from './pages/doctor/LabTechnicianDashboard';
import LabRequestsPage from './pages/doctor/LabRequestsPage';
import LabSamplesPage from './pages/doctor/LabSamplesPage';
import LabTestsCatalogPage from './pages/doctor/LabTestsCatalogPage';
import LabResultsPage from './pages/doctor/LabResultsPage';
import AppointmentsList from './pages/admin/appointments/AppointmentsList';
import Settings from './pages/admin/settings/Settings';
import Reports from './pages/admin/reports/Reports';
import Analytics from './pages/admin/analytics/Analytics';
import PatientAppointments from './pages/user/PatientAppointments';
import PatientHealth from './pages/user/PatientHealth';
import PatientRecords from './pages/user/PatientRecords';
import PatientPrescriptions from './pages/user/PatientPrescriptions';
import PatientBilling from './pages/user/PatientBilling';
import PatientInsurance from './pages/user/PatientInsurance';
import PatientSupport from './pages/user/PatientSupport';
import PatientSettings from './pages/user/PatientSettings';
import RecordDetailPage from './pages/user/RecordDetailPage';

import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';

import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/home/home/HomePage';
import AboutPage from './pages/home/about/AboutPage';
import DoctorsPage from './pages/home/doctors/DoctorsPage';
import DepartmentsPage from './pages/home/departments/DepartmentsPage';
import DepartmentDetailsPage from './pages/home/departments/DepartmentDetailsPage';
import ServicesPage from './pages/home/services/ServicesPage';
import ServiceDetailsPage from './pages/home/services/ServiceDetailsPage';
import PackagesPage from './pages/home/packages/PackagesPage';
import ContactPage from './pages/home/contact/ContactPage';
import BookAppointmentPage from './pages/home/appointment/BookAppointmentPage';
import LegalPage from './pages/home/LegalPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Routes>
          
          {/* Public Marketing Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/:id" element={<DepartmentDetailsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailsPage />} />
            <Route path="/facilities" element={<div className="p-20 text-center text-2xl font-bold">Facilities Coming Soon</div>} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/blog" element={<div className="p-20 text-center text-2xl font-bold">Blog Coming Soon</div>} />
            <Route path="/gallery" element={<div className="p-20 text-center text-2xl font-bold">Gallery Coming Soon</div>} />
            <Route path="/testimonials" element={<div className="p-20 text-center text-2xl font-bold">Testimonials Coming Soon</div>} />
            <Route path="/careers" element={<div className="p-20 text-center text-2xl font-bold">Careers Coming Soon</div>} />
            <Route path="/privacy" element={<LegalPage />} />
            <Route path="/terms" element={<LegalPage />} />
            <Route path="/faq" element={<LegalPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/emergency" element={<div className="p-20 text-center text-2xl font-bold">Emergency Coming Soon</div>} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Patient Portal Routes */}
          <Route element={<UserLayout />}>
            <Route path="/portal" element={<UserDashboard />} />
            <Route path="/portal/health" element={<PatientHealth />} />
            <Route path="/portal/appointments" element={<PatientAppointments />} />
            <Route path="/portal/records" element={<PatientRecords />} />
            <Route path="/portal/records/:id" element={<RecordDetailPage />} />
            <Route path="/portal/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/portal/billing" element={<PatientBilling />} />
            <Route path="/portal/insurance" element={<PatientInsurance />} />
            <Route path="/portal/support" element={<PatientSupport />} />
            <Route path="/portal/settings" element={<PatientSettings />} />
          </Route>

          {/* Doctor & Lab Technician Portal Routes */}
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/patients/:id" element={<DoctorPatientProfile />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/doctor/reports" element={<DoctorReports />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />
            <Route path="/lab/dashboard" element={<LabTechnicianDashboard />} />
            <Route path="/lab/requests" element={<LabRequestsPage />} />
            <Route path="/lab/samples" element={<LabSamplesPage />} />
            <Route path="/lab/tests" element={<LabTestsCatalogPage />} />
            <Route path="/lab/results" element={<LabResultsPage />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/patients" element={<PatientsList />} />
            <Route path="/admin/patients/:id" element={<PatientDetails />} />
            <Route path="/admin/doctors/add" element={<AddDoctor />} />
            <Route path="/admin/doctors/edit/:id" element={<EditDoctor />} />
            <Route path="/admin/doctors" element={<DoctorsList />} />
            <Route path="/admin/appointments" element={<AppointmentsList />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
