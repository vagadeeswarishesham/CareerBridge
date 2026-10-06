import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EligibilityModal from '../components/EligibilityModal';
import { 
  Building2, MapPin, Calendar, DollarSign, Award, 
  CheckCircle2, ArrowLeft, Send, AlertCircle, FileText 
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  
  // Custom resume & notes for application
  const [resumeUrl, setResumeUrl] = useState('');
  const [notes, setNotes] = useState('');

  // Eligibility check state
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async () => {
    if (!user || user.role !== 'STUDENT') {
      navigate('/login?role=STUDENT');
      return;
    }
    try {
      const res = await api.get(`/students/${user.studentId}/eligibility/${id}`);
      setEligibilityResult(res.data);
      setShowEligibilityModal(true);
    } catch (err) {
      alert(err.message || 'Error checking eligibility');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'STUDENT') {
      navigate('/login?role=STUDENT');
      return;
    }

    setApplying(true);
    setError('');
    setApplySuccess('');

    try {
      await api.post('/applications', {
        jobId: job.id,
        resumeUrl: resumeUrl || undefined,
        notes: notes || undefined
      });
      setApplySuccess('Application submitted successfully! Redirecting to applications tracker...');
      setTimeout(() => {
        navigate('/student/applications');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger mb-4">{error || 'Job not found'}</div>
        <button onClick={() => navigate('/jobs')} className="btn btn-outline-primary">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-1 text-secondary">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm border-0 mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 rounded-pill mb-2">
                  {job.jobType}
                </span>
                <h2 className="fw-bold mb-1 text-dark">{job.title}</h2>
                <h5 className="text-secondary fw-medium d-flex align-items-center gap-2">
                  <Building2 size={20} /> {job.companyName}
                </h5>
              </div>
              <span className="fw-bold text-success fs-4">{job.salaryPackage}</span>
            </div>

            <hr className="my-4 border-light" />

            <h5 className="fw-bold mb-3">Job Description</h5>
            <p className="text-secondary leading-relaxed mb-4" style={{ whiteSpace: 'pre-line' }}>
              {job.description}
            </p>

            <h5 className="fw-bold mb-3">Required Skills</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.split(',').map((skill, idx) => (
                <span key={idx} className="badge bg-light text-dark border px-3 py-2 fs-6">
                  {skill.trim()}
                </span>
              ))}
            </div>

            <h5 className="fw-bold mb-3">Eligibility Criteria</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 border">
                  <div className="text-muted small">Minimum CGPA</div>
                  <div className="fw-bold fs-5 text-primary">{job.minCgpa || '0.0'}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 border">
                  <div className="text-muted small">Eligible Branches</div>
                  <div className="fw-bold fs-5 text-primary">{job.eligibleBranch || 'ALL'}</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 border">
                  <div className="text-muted small">Graduation Year</div>
                  <div className="fw-bold fs-5 text-primary">{job.graduationYear || '2026'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info & Application Card */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm border-0 sticky-top" style={{ top: 90 }}>
            <h5 className="fw-bold mb-3">Drive Information</h5>

            <div className="d-flex align-items-center gap-3 mb-3">
              <MapPin className="text-primary" size={20} />
              <div>
                <div className="small text-muted">Job Location</div>
                <div className="fw-semibold">{job.location}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <Calendar className="text-primary" size={20} />
              <div>
                <div className="small text-muted">Application Deadline</div>
                <div className="fw-semibold text-danger">{job.deadline}</div>
              </div>
            </div>

            <hr className="my-3 border-light" />

            {user?.role === 'STUDENT' ? (
              <div>
                {error && <div className="alert alert-danger small py-2">{error}</div>}
                {applySuccess && <div className="alert alert-success small py-2">{applySuccess}</div>}

                <button
                  type="button"
                  onClick={handleCheckEligibility}
                  className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                >
                  <CheckCircle2 size={18} /> Check My Eligibility
                </button>

                <form onSubmit={handleApply}>
                  <div className="mb-3">
                    <label className="form-label fw-medium small">Custom Resume Link (Optional)</label>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="https://drive.google.com/your_resume.pdf"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                    />
                    <div className="form-text extra-small">Leave blank to use profile resume</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium small">Application Notes / Cover Note</label>
                    <textarea
                      rows="2"
                      className="form-control form-control-sm"
                      placeholder="Why are you a great fit for this role?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                  >
                    {applying ? <div className="spinner-border spinner-border-sm"></div> : <Send size={18} />}
                    Submit Application
                  </button>
                </form>
              </div>
            ) : user ? (
              <div className="alert alert-info small mb-0">
                You are logged in as <strong>{user.role}</strong>. Applications are reserved for Student accounts.
              </div>
            ) : (
              <div className="text-center">
                <p className="text-muted small mb-3">Login as a Student to apply for this campus drive</p>
                <button onClick={() => navigate('/login?role=STUDENT')} className="btn btn-primary w-100 fw-bold">
                  Login to Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EligibilityModal
        show={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
        result={eligibilityResult}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetails;
