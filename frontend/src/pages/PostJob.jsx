import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Save, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default deadline 30 days from today
  const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [job, setJob] = useState({
    title: '',
    description: '',
    location: 'Hyderabad',
    jobType: 'FULL_TIME',
    salaryPackage: '12.0 LPA',
    requiredSkills: 'Java, Spring Boot, React, MySQL',
    minCgpa: 7.5,
    eligibleBranch: 'CSE, IT, ECE',
    graduationYear: 2026,
    deadline: defaultDeadline
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Deadline validation
    if (new Date(job.deadline) < new Date().setHours(0, 0, 0, 0)) {
      setError('Application deadline must be a future date');
      setLoading(false);
      return;
    }

    try {
      await api.post('/jobs', {
        ...job,
        minCgpa: parseFloat(job.minCgpa),
        graduationYear: parseInt(job.graduationYear)
      });
      setSuccess('Job posting created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/company/jobs');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 850 }}>
      <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-1 text-secondary">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="stat-icon primary">
            <PlusCircle size={28} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">Post New Campus Drive</h3>
            <p className="text-muted small mb-0">Define job requirements, eligibility rules, and deadline</p>
          </div>
        </div>

        {success && (
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-3">
            <CheckCircle size={16} /> {success}
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-medium small">Job Title / Designation *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={job.title}
                onChange={handleChange}
                placeholder="e.g. Software Development Engineer (SDE-1)"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Job Type *</label>
              <select name="jobType" className="form-select" value={job.jobType} onChange={handleChange}>
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="PART_TIME">Part Time</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Salary Package / Stipend *</label>
              <input
                type="text"
                name="salaryPackage"
                className="form-control"
                value={job.salaryPackage}
                onChange={handleChange}
                placeholder="e.g. 14.5 LPA or 35,000 / month"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Work Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={job.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Bangalore, Remote"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Job Description & Responsibilities *</label>
              <textarea
                rows="4"
                name="description"
                className="form-control"
                value={job.description}
                onChange={handleChange}
                placeholder="Detailed description of role responsibilities, tech stack, expectations..."
                required
              ></textarea>
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Required Skills (Comma separated)</label>
              <input
                type="text"
                name="requiredSkills"
                className="form-control"
                value={job.requiredSkills}
                onChange={handleChange}
                placeholder="Java, React, SQL, Problem Solving"
              />
            </div>

            <h6 className="fw-bold mt-4 mb-2 text-primary">Eligibility Requirements</h6>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Minimum Cutoff CGPA *</label>
              <input
                type="number"
                step="0.1"
                name="minCgpa"
                className="form-control"
                value={job.minCgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Eligible Branches *</label>
              <input
                type="text"
                name="eligibleBranch"
                className="form-control"
                value={job.eligibleBranch}
                onChange={handleChange}
                placeholder="e.g. ALL or CSE, IT, ECE"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Target Graduation Year *</label>
              <select name="graduationYear" className="form-select" value={job.graduationYear} onChange={handleChange}>
                <option value="2026">2026 Batch</option>
                <option value="2025">2025 Batch</option>
                <option value="2027">2027 Batch</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Application Deadline *</label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={job.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2"
              >
                {loading ? <div className="spinner-border spinner-border-sm"></div> : <Save size={18} />}
                Publish Campus Drive
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
