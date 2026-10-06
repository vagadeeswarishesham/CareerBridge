import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  Users, Building2, Briefcase, FileText, Award, 
  BarChart2, CheckCircle, TrendingUp, DollarSign 
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // Prepare chart data
  const branchLabels = Object.keys(stats?.branchWiseStats || {});
  const branchCounts = Object.values(stats?.branchWiseStats || {});

  const pieData = {
    labels: branchLabels,
    datasets: [
      {
        label: 'Students by Branch',
        data: branchCounts,
        backgroundColor: ['#1e5bd8', '#16a34a', '#f59e0b', '#7e22ce', '#dc2626', '#0284c7'],
      },
    ],
  };

  const companyLabels = Object.keys(stats?.companyWiseStats || {});
  const companyCounts = Object.values(stats?.companyWiseStats || {});

  const barData = {
    labels: companyLabels.length > 0 ? companyLabels : ['Google', 'Microsoft', 'TCS', 'Infosys'],
    datasets: [
      {
        label: 'Placements by Company',
        data: companyCounts.length > 0 ? companyCounts : [1, 1, 1, 0],
        backgroundColor: '#1e5bd8',
      },
    ],
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Placement Administrator Control Center</h2>
          <p className="text-muted small mb-0">System-wide monitoring, student & recruiter management, analytics</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/placements" className="btn btn-primary btn-sm fw-bold">
            + New Placement Record
          </Link>
          <Link to="/admin/reports" className="btn btn-outline-primary btn-sm fw-bold">
            <BarChart2 size={16} className="me-1" /> View Full Reports
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Users />
            </div>
            <div>
              <div className="stat-value">{stats?.totalStudents || 0}</div>
              <div className="stat-label">Total Registered Students</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon info">
              <Building2 />
            </div>
            <div>
              <div className="stat-value">{stats?.totalCompanies || 0}</div>
              <div className="stat-label">Partner Companies</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon warning">
              <Briefcase />
            </div>
            <div>
              <div className="stat-value">{stats?.totalJobs || 0}</div>
              <div className="stat-label">Active Job Drives</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FileText />
            </div>
            <div>
              <div className="stat-value">{stats?.totalApplications || 0}</div>
              <div className="stat-label">Applications Submitted</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon success">
              <Award />
            </div>
            <div>
              <div className="stat-value">{stats?.selectedStudents || 0}</div>
              <div className="stat-label">Selected Students</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="stat-card">
            <div className="stat-icon success">
              <TrendingUp />
            </div>
            <div>
              <div className="stat-value text-success">{stats?.placementPercentage || 0}%</div>
              <div className="stat-label">Overall Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Package Stats Banner */}
      <div className="card border-0 shadow-sm p-4 bg-light mb-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
          <DollarSign size={20} /> Package Statistics Summary (2025-2026 Batch)
        </h5>
        <div className="row text-center g-3">
          <div className="col-md-4">
            <div className="p-3 bg-white rounded-3 border">
              <div className="text-muted small">Highest Package Offered</div>
              <div className="fs-4 fw-bold text-success">{stats?.packageStats?.maxPackage || 28.0} LPA</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-white rounded-3 border">
              <div className="text-muted small">Average Package Offered</div>
              <div className="fs-4 fw-bold text-primary">{stats?.packageStats?.avgPackage || 24.8} LPA</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-white rounded-3 border">
              <div className="text-muted small">Minimum Package Offered</div>
              <div className="fs-4 fw-bold text-dark">{stats?.packageStats?.minPackage || 22.5} LPA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Branch Demographics</h5>
            <div style={{ maxHeight: 300, display: 'flex', justifyContent: 'center' }}>
              <Pie data={pieData} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Company Placements Distribution</h5>
            <div style={{ maxHeight: 300 }}>
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
