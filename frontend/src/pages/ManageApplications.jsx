import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { 
  Users, CheckCircle2, XCircle, Award, Eye, 
  ExternalLink, FileText, Search 
} from 'lucide-react';

const ManageApplications = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const filterJobId = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterJobId]);

  const fetchApplications = async () => {
    try {
      if (user?.companyId) {
        let url = `/applications/company/${user.companyId}`;
        if (filterJobId) {
          url = `/applications/job/${filterJobId}`;
        }
        const res = await api.get(url);
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdating(true);
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        notes: statusNote || undefined
      });
      
      setApplications(applications.map(a => a.id === appId ? res.data : a));
      setSelectedApp(null);
      setStatusNote('');
    } catch (err) {
      alert(err.message || 'Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Applicant Management & Shortlisting</h3>
          <p className="text-muted small mb-0">Review student profiles, shortlist, reject, or select candidates</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm">
          <h5 className="fw-bold text-muted mb-2">No Applications Found</h5>
          <p className="text-muted small">No student applications have been submitted for this drive yet.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>Student Candidate</th>
                  <th>Applied Drive</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Grad Year</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div className="fw-bold text-dark">{app.studentName}</div>
                      <div className="text-muted extra-small">{app.studentEmail}</div>
                    </td>
                    <td className="fw-semibold text-primary">{app.jobTitle}</td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary">{app.studentBranch}</span>
                    </td>
                    <td className="fw-bold text-dark">{app.studentCgpa || '0.0'}</td>
                    <td>{app.studentGraduationYear}</td>
                    <td>
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1">
                          <ExternalLink size={12} /> Resume
                        </a>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                          className="btn btn-outline-purple btn-sm"
                          style={{ borderColor: '#7e22ce', color: '#7e22ce' }}
                          title="Shortlist Candidate"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                          className="btn btn-outline-success btn-sm"
                          title="Select Candidate"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="btn btn-outline-danger btn-sm"
                          title="Reject Candidate"
                        >
                          Reject
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

export default ManageApplications;
