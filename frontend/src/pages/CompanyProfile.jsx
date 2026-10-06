import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Building2, Save, CheckCircle, AlertCircle } from 'lucide-react';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [company, setCompany] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    location: '',
    description: '',
    hrName: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (user?.companyId) {
        const res = await api.get(`/companies/${user.companyId}`);
        setCompany(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');

    try {
      const res = await api.put(`/companies/${user.companyId}`, company);
      setCompany(res.data);
      setSuccess('Company profile updated successfully!');
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
            <Building2 size={28} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">Company Profile</h3>
            <p className="text-muted small mb-0">Manage recruiter organization details</p>
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
              <label className="form-label fw-medium small">Company Name *</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                value={company.companyName || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Email Address</label>
              <input
                type="email"
                className="form-control bg-light"
                value={company.email || ''}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={company.phone || ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">HR Contact Person Name</label>
              <input
                type="text"
                name="hrName"
                className="form-control"
                value={company.hrName || ''}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Industry Domain</label>
              <input
                type="text"
                name="industry"
                className="form-control"
                value={company.industry || ''}
                onChange={handleChange}
                placeholder="e.g. Software, Financial Tech, Cloud Services"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium small">Headquarters / Office Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={company.location || ''}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Bangalore"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Official Website URL</label>
              <input
                type="url"
                name="website"
                className="form-control"
                value={company.website || ''}
                onChange={handleChange}
                placeholder="https://company.com"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-medium small">Company Description</label>
              <textarea
                rows="4"
                name="description"
                className="form-control"
                value={company.description || ''}
                onChange={handleChange}
                placeholder="Briefly describe company vision, products, and culture..."
              ></textarea>
            </div>

            <div className="col-12 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2"
              >
                {saving ? <div className="spinner-border spinner-border-sm"></div> : <Save size={18} />}
                Save Company Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
