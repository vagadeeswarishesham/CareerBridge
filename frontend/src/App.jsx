import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import Applications from './pages/Applications';

// Company Pages
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyProfile from './pages/CompanyProfile';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import ManageApplications from './pages/ManageApplications';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Companies from './pages/Companies';
import PlacementRecords from './pages/PlacementRecords';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/applications" element={<Applications />} />
            </Route>
          </Route>

          {/* Protected Company Routes */}
          <Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/profile" element={<CompanyProfile />} />
              <Route path="/company/post-job" element={<PostJob />} />
              <Route path="/company/jobs" element={<ManageJobs />} />
              <Route path="/company/applications" element={<ManageApplications />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/companies" element={<Companies />} />
              <Route path="/admin/jobs" element={<Jobs />} />
              <Route path="/admin/applications" element={<ManageApplications />} />
              <Route path="/admin/placements" element={<PlacementRecords />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Route>
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
