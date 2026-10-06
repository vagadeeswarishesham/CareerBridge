import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Bell } from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-dark fs-5">
              {user?.role} PORTAL
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <User size={18} />
              </div>
              <div>
                <div className="fw-bold small text-dark lh-1">{user?.fullName}</div>
                <div className="text-muted extra-small">{user?.email}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
