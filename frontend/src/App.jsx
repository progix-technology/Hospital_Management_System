import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from './components/PageLoader';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts (Lightweight shells)
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import UserLayout from './layouts/UserLayout';
import DoctorLayout from './layouts/DoctorLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Marketing Website Pages (Lazy loaded)
const HomePage = lazy(() => import('./pages/home/home/HomePage'));
const AboutPage = lazy(() => import('./pages/home/about/AboutPage'));
const DoctorsPage = lazy(() => import('./pages/home/doctors/DoctorsPage'));
const DepartmentsPage = lazy(() => import('./pages/home/departments/DepartmentsPage'));
const DepartmentDetailsPage = lazy(() => import('./pages/home/departments/DepartmentDetailsPage'));
const ServicesPage = lazy(() => import('./pages/home/services/ServicesPage'));
const ServiceDetailsPage = lazy(() => import('./pages/home/services/ServiceDetailsPage'));
const PackagesPage = lazy(() => import('./pages/home/packages/PackagesPage'));
const ContactPage = lazy(() => import('./pages/home/contact/ContactPage'));
const BookAppointmentPage = lazy(() => import('./pages/home/appointment/BookAppointmentPage'));
const LegalPage = lazy(() => import('./pages/home/LegalPage'));

// Auth Pages (Lazy loaded)
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Patient Portal Pages (Lazy loaded)
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const PatientHealth = lazy(() => import('./pages/user/PatientHealth'));
const PatientAppointments = lazy(() => import('./pages/user/PatientAppointments'));
const PatientRecords = lazy(() => import('./pages/user/PatientRecords'));
const RecordDetailPage = lazy(() => import('./pages/user/RecordDetailPage'));
const PatientPrescriptions = lazy(() => import('./pages/user/PatientPrescriptions'));
const PatientBilling = lazy(() => import('./pages/user/PatientBilling'));
const PatientInsurance = lazy(() => import('./pages/user/PatientInsurance'));
const PatientSupport = lazy(() => import('./pages/user/PatientSupport'));
const PatientSettings = lazy(() => import('./pages/user/PatientSettings'));

// Doctor & Lab Pages (Lazy loaded)
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const DoctorAppointments = lazy(() => import('./pages/doctor/DoctorAppointments'));
const DoctorPatients = lazy(() => import('./pages/doctor/DoctorPatients'));
const DoctorPatientProfile = lazy(() => import('./pages/doctor/DoctorPatientProfile'));
const DoctorPrescriptions = lazy(() => import('./pages/doctor/DoctorPrescriptions'));
const DoctorReports = lazy(() => import('./pages/doctor/DoctorReports'));
const DoctorSettings = lazy(() => import('./pages/doctor/DoctorSettings'));
const LabTechnicianDashboard = lazy(() => import('./pages/doctor/LabTechnicianDashboard'));
const LabRequestsPage = lazy(() => import('./pages/doctor/LabRequestsPage'));
const LabSamplesPage = lazy(() => import('./pages/doctor/LabSamplesPage'));
const LabTestsCatalogPage = lazy(() => import('./pages/doctor/LabTestsCatalogPage'));
const LabResultsPage = lazy(() => import('./pages/doctor/LabResultsPage'));

// Admin Dashboard Pages (Lazy loaded)
const Dashboard = lazy(() => import('./pages/admin/dashboard/Dashboard'));
const PatientsList = lazy(() => import('./pages/admin/patients/PatientsList'));
const PatientDetails = lazy(() => import('./pages/admin/patients/PatientDetails'));
const DoctorsList = lazy(() => import('./pages/doctors/DoctorsList'));
const AddDoctor = lazy(() => import('./pages/admin/doctors/AddDoctor'));
const EditDoctor = lazy(() => import('./pages/admin/doctors/EditDoctor'));
const AppointmentsList = lazy(() => import('./pages/admin/appointments/AppointmentsList'));
const Settings = lazy(() => import('./pages/admin/settings/Settings'));
const Reports = lazy(() => import('./pages/admin/reports/Reports'));
const Analytics = lazy(() => import('./pages/admin/analytics/Analytics'));

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <BrowserRouter>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
        <Suspense fallback={<PageLoader />}>
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

          {/* Patient Portal Routes (Requires Token & Patient/Admin Role) */}
          <Route element={<ProtectedRoute allowedRoles={['patient', 'admin']} />}>
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
          </Route>

          {/* Doctor & Lab Technician Portal Routes (Requires Token & Staff Role) */}
          <Route element={<ProtectedRoute allowedRoles={['doctor', 'lab_technician', 'admin']} />}>
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
          </Route>

          {/* Admin Dashboard Routes (Requires Token & Admin Role) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
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
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
