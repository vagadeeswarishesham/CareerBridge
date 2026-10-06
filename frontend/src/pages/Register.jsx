import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'STUDENT';

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    branch: 'CSE',
    cgpa: '8.0',
    graduationYear: '2026',
    companyName: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Inline validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must be a 10-digit number');
      return;
    }

    if (role === 'STUDENT') {
      const cgpaNum = parseFloat(formData.cgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setError('CGPA must be between 0.0 and 10.0');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: role,
        fullName: formData.fullName,
        phone: formData.phone,
        branch: role === 'STUDENT' ? formData.branch : null,
        cgpa: role === 'STUDENT' ? parseFloat(formData.cgpa) : null,
        graduationYear: role === 'STUDENT' ? parseInt(formData.graduationYear) : null,
        companyName: role === 'COMPANY' ? formData.companyName : null
      };

      await register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate(`/login?role=${role}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-brand-side">
        <div className="d-flex align-items-center gap-3 mb-4">
          <GraduationCap size={48} className="text-warning" />
          <h2 className="fw-bold mb-0 text-white">CAREER BRIDGE</h2>
        </div>
        <h3 className="fw-bold text-white mb-3">Join the Placement Portal</h3>
        <p className="lead text-white-50">
          Create an account to start applying for top campus drives or posting job opportunities.
        </p>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="text-muted small mb-4">Select your registration type below</p>

          <div className="nav nav-pills nav-justified mb-4 bg-light p-1 rounded-3">
            <button
              className={`nav-link rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-1 ${role === 'STUDENT' ? 'active bg-primary' : 'text-secondary'}`}
              onClick={() => setRole('STUDENT')}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              className={`nav-link rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-1 ${role === 'COMPANY' ? 'active bg-primary' : 'text-secondary'}`}
              onClick={() => setRole('COMPANY')}
            >
              <Building2 size={16} /> Company
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-3">
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium small">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-control"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium small">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label fw-medium small">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 chars"
                  minLength="6"
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-medium small">Phone Number *</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            {role === 'STUDENT' ? (
              <>
                <div className="row g-2 mb-3">
                  <div className="col-4">
                    <label className="form-label fw-medium small">Branch *</label>
                    <select name="branch" className="form-select" value={formData.branch} onChange={handleChange}>
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="IT">IT</option>
                      <option value="ME">ME</option>
                      <option value="CE">CE</option>
                      <option value="EE">EE</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-medium small">CGPA (0-10) *</label>
                    <input
                      type="number"
                      step="0.1"
                      name="cgpa"
                      className="form-control"
                      value={formData.cgpa}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label fw-medium small">Grad Year *</label>
                    <select name="graduationYear" className="form-select" value={formData.graduationYear} onChange={handleChange}>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <div className="mb-3">
                <label className="form-label fw-medium small">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-control"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Innovations"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mt-4"
            >
              {loading ? <div className="spinner-border spinner-border-sm"></div> : <UserPlus size={18} />}
              Register as {role}
            </button>
          </form>

          <div className="text-center mt-4 small text-muted">
            Already registered?{' '}
            <Link to={`/login?role=${role}`} className="fw-bold text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
