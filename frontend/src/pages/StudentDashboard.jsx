import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { 
  FileText, Clock, Award, CheckCircle, Briefcase, 
  ArrowRight, User, AlertCircle 
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      if (user?.studentId) {
        const [studentRes, appsRes, jobsRes] = await Promise.all([
          api.get(`/students/${user.studentId}`),
          api.get(`/applications/student/${user.studentId}`),
          api.get('/jobs/active')
        ]);
        setStudent(studentRes.data);
        setApplications(appsRes.data);
        setRecommendedJobs(jobsRes.data.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load student dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const totalApps = applications.length;
  const underReview = applications.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'APPLIED').length;
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
      {/* Header Banner */}
      <div className="card border-0 shadow-sm p-4 bg-gradient-primary text-white mb-4 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #123a8f 0%, #1e5bd8 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h2 className="fw-bold mb-1">Welcome back, {student?.name || user?.fullName}! 👋</h2>
            <p className="mb-0 text-white-50">
              Branch: <strong>{student?.branch || 'CSE'}</strong> | CGPA: <strong>{student?.cgpa || '0.0'}</strong> | Graduation: <strong>{student?.graduationYear || '2026'}</strong>
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {student?.isPlaced ? (
              <span className="badge bg-success fs-6 px-3 py-2">
                <CheckCircle size={16} className="me-1" /> Placed Student
              </span>
            ) : (
              <Link to="/student/profile" className="btn btn-warning fw-bold btn-sm px-3">
                <User size={16} className="me-1" /> Edit Profile & Resume
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon primary">
              <FileText />
            </div>
            <div>
              <div className="stat-value">{totalApps}</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-xl-3">
          <div className="stat-card">
            <div className="stat-icon warning">
              <Clock />
            </div>
            <div>
              <div className="stat-value">{underReview}</div>
              <div className="stat-label">In Review</div>
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
              <div className="stat-label">Shortlisted</div>
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
              <div className="stat-label">Selected Offers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications & Recommended Jobs */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">My Applications Status</h5>
              <Link to="/student/applications" className="btn btn-link p-0 text-decoration-none small">
                View All
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                No applications submitted yet. Browse jobs to apply!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover">
                  <thead className="table-light small">
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {applications.slice(0, 5).map(app => (
                      <tr key={app.id}>
                        <td className="fw-semibold text-dark">{app.jobTitle}</td>
                        <td className="text-secondary">{app.companyName}</td>
                        <td className="text-muted">
                          {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recommended Job Drives</h5>
              <Link to="/jobs" className="btn btn-link p-0 text-decoration-none small">
                Explore All
              </Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {recommendedJobs.map(job => (
                <div key={job.id} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold text-dark">{job.title}</div>
                    <div className="small text-muted">{job.companyName} • {job.salaryPackage}</div>
                  </div>
                  <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
