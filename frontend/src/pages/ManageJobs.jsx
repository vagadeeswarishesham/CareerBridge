import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Trash2, Edit, Users, Eye } from 'lucide-react';

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      if (user?.companyId) {
        const res = await api.get(`/jobs/company/${user.companyId}`);
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Campus Drives</h3>
          <p className="text-muted small mb-0">View, edit, or remove your company's active job postings</p>
        </div>
        <Link to="/company/post-job" className="btn btn-primary fw-bold btn-sm">
          + Post New Drive
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm">
          <h5 className="fw-bold text-muted mb-2">No Drives Posted Yet</h5>
          <p className="text-muted small">Click 'Post New Drive' to create a new job opening.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Package</th>
                  <th>Min CGPA</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="fw-semibold text-dark">{job.title}</td>
                    <td>{job.location}</td>
                    <td className="fw-bold text-success">{job.salaryPackage}</td>
                    <td>{job.minCgpa || '0.0'}</td>
                    <td className="text-danger">{job.deadline}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/company/applications?jobId=${job.id}`} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" title="View Applicants">
                          <Users size={14} /> Applicants
                        </Link>
                        <button onClick={() => handleDelete(job.id)} className="btn btn-outline-danger btn-sm" title="Delete Drive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
