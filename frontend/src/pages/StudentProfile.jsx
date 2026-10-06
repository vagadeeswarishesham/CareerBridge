import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    address: '',
    branch: 'CSE',
    cgpa: 0.0,
    skills: '',
    resumeUrl: '',
    graduationYear: 2026
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (user?.studentId) {
        const res = await api.get(`/students/${user.studentId}`);
        setProfile(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    // Client side CGPA validation
    const cgpaNum = parseFloat(profile.cgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      setError('CGPA must be between 0.0 and 10.0');
      setSaving(false);
      return;
    }

    try {
      const res = await api.put(`/students/${user.studentId}`, {
        ...profile,
        cgpa: cgpaNum,
        graduationYear: parseInt(profile.graduationYear)
      });
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="stat-icon primary">
            <User size={28} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">Student Profile</h3>
            <p className="text-muted small mb-0">Update your academic information and resume details</p>
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
            <div className="col-md-6">
              <label className="form-label fw-medium small">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Email Address</label>
              <input
                type="email"
                className="form-control bg-light"
                value={profile.email || ''}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Phone Number *</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={profile.phone || ''}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium small">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={profile.dob || ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium small">Gender</label>
              <select name="gender" className="form-select" value={profile.gender || 'Male'} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Branch *</label>
              <select name="branch" className="form-select" value={profile.branch || 'CSE'} onChange={handleChange}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">CGPA (0.0 - 10.0) *</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                className="form-control"
                value={profile.cgpa || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-medium small">Graduation Year *</label>
              <select name="graduationYear" className="form-select" value={profile.graduationYear || 2026} onChange={handleChange}>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2027">2027</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={profile.address || ''}
                onChange={handleChange}
                placeholder="City, State"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Technical Skills (Comma separated)</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                value={profile.skills || ''}
                onChange={handleChange}
                placeholder="e.g. Java, Spring Boot, React, MySQL, Python"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Resume Link (PDF URL / Google Drive link)</label>
              <input
                type="url"
                name="resumeUrl"
                className="form-control"
                value={profile.resumeUrl || ''}
                onChange={handleChange}
                placeholder="https://careerbridge.edu/resumes/my_resume.pdf"
              />
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2"
              >
                {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={18} />}
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
