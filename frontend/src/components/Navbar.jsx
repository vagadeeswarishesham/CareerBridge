import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'COMPANY') return '/company';
    return '/student';
  };

  return (
    <nav className="public-navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="brand-logo">
          <GraduationCap size={32} className="text-primary" />
          <div>
            <div>CAREER BRIDGE</div>
            <div className="brand-tagline">Student Placement Portal</div>
          </div>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <Link to="/jobs" className="btn btn-link text-decoration-none fw-semibold text-secondary">
            Explore Jobs
          </Link>
          
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Link to={getDashboardPath()} className="btn btn-primary d-flex align-items-center gap-2">
                <LayoutDashboard size={18} />
                Dashboard ({user.role})
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-danger d-flex align-items-center gap-2">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2">
                <LogIn size={18} />
                Login
              </Link>
              <Link to="/register" className="btn btn-primary d-flex align-items-center gap-2">
                <UserPlus size={18} />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
