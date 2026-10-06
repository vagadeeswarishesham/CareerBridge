import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, LayoutDashboard, User, Briefcase, FileText, 
  PlusCircle, Building2, BarChart2, Award, LogOut, CheckCircle
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <GraduationCap size={28} className="text-primary" />
        <div className="sidebar-brand">CAREER BRIDGE</div>
      </div>

      <ul className="sidebar-menu">
        {user.role === 'STUDENT' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/student" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/student/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <User size={20} />
                My Profile
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={20} />
                Explore Jobs
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/student/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FileText size={20} />
                My Applications
              </NavLink>
            </li>
          </>
        )}

        {user.role === 'COMPANY' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/company" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/company/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Building2 size={20} />
                Company Profile
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/company/post-job" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={20} />
                Post New Job
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/company/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={20} />
                Manage Jobs
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/company/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FileText size={20} />
                Applicants
              </NavLink>
            </li>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <li className="sidebar-item">
              <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={20} />
                Admin Dashboard
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <User size={20} />
                Students
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/companies" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Building2 size={20} />
                Companies
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/jobs" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Briefcase size={20} />
                All Jobs
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/applications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FileText size={20} />
                Applications
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/placements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Award size={20} />
                Placement Records
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <BarChart2 size={20} />
                Reports & Analytics
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="p-3 border-top border-secondary">
        <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
