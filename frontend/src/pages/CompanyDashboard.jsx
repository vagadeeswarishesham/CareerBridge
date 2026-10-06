import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, Award, CheckCircle, PlusCircle, Building2 } from 'lucide-react';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      if (user?.companyId) {
        const [compRes, jobsRes, appsRes] = await Promise.all([
          api.get(`/companies/${user.companyId}`),
          api.get(`/jobs/company/${user.companyId}`),
          api.get(`/applications/company/${user.companyId}`)
        ]);
        setCompany(compRes.data);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      }
    } catch (err) {
      console.error('Failed to load company dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;
  const selected = applications.filter(a => a.status === 'SELECTED').length;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="card border-0 shadow-sm p-4 bg-gradient-primary text-white mb-4" style={{ background: 'linear-gradient(135deg, #123a8f 0%, #1e5bd8 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="fw-bold mb-1">Welcome, {company?.companyName || user?.fullName}! 🏢</h2>
            <p className="mb-0 text-white-50">
              Industry: <strong>{company?.industry || 'Technology'}</strong> | Location: <strong>{company?.location || 'Hyderabad'}</strong>
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/company/post-job" className="btn btn-warning fw-bold btn-sm px-3 d-inline-flex align-items-center gap-1">
              <PlusCircle size={16} /> Post New Drive
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Briefcase />
            </div>
            <div>
              <div className="stat-value">{totalJobs}</div>
              <div className="stat-label">Active Job Postings</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon warning">
              <Users />
            </div>
            <div>
              <div className="stat-value">{totalApps}</div>
              <div className="stat-label">Total Applicants</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon info">
              <Award />
            </div>
            <div>
              <div className="stat-value">{shortlisted}</div>
              <div className="stat-label">Shortlisted Candidates</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle />
            </div>
            <div>
              <div className="stat-value">{selected}</div>
              <div className="stat-label">Hired Candidates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Drives Table */}
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Our Campus Drives</h5>
          <Link to="/company/jobs" className="btn btn-link p-0 text-decoration-none small">
            Manage All Drives
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-4 text-muted small">
            No job drives posted yet. Click 'Post New Drive' to create one!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Package</th>
                  <th>Deadline</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="small">
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="fw-semibold text-dark">{job.title}</td>
                    <td>{job.location}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">{job.jobType}</span>
                    </td>
                    <td className="fw-bold text-success">{job.salaryPackage}</td>
                    <td className="text-danger">{job.deadline}</td>
                    <td>
                      <Link to={`/company/applications?jobId=${job.id}`} className="btn btn-outline-primary btn-sm">
                        View Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
