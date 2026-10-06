import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building2, ShieldCheck, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'STUDENT';
  
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fill sample credentials depending on role selection
    if (role === 'STUDENT') {
      setEmail('student@example.com');
      setPassword('Student@123');
    } else if (role === 'COMPANY') {
      setEmail('company@example.com');
      setPassword('Company@123');
    } else if (role === 'ADMIN') {
      setEmail('admin@example.com');
      setPassword('Admin@123');
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'COMPANY') navigate('/company');
      else navigate('/student');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
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
        <h3 className="fw-bold text-white mb-3">Welcome Back to Campus Placement Portal</h3>
        <p className="lead text-white-50 mb-4">
          Log in to manage job drives, track applications, and view campus placement analytics.
        </p>

        <div className="card bg-white bg-opacity-10 border-0 p-3 text-white small">
          <div className="fw-bold mb-1 text-warning">Quick Demo Credentials:</div>
          <div><strong>Student:</strong> student@example.com / Student@123</div>
          <div><strong>Company:</strong> company@example.com / Company@123</div>
          <div><strong>Admin:</strong> admin@example.com / Admin@123</div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h3 className="fw-bold mb-1">Sign In</h3>
          <p className="text-muted small mb-4">Select your role and enter your account credentials</p>

          {/* Role selector tabs */}
          <div className="nav nav-pills nav-justified mb-4 bg-light p-1 rounded-3" role="tablist">
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
            <button
              className={`nav-link rounded-2 fw-semibold d-flex align-items-center justify-content-center gap-1 ${role === 'ADMIN' ? 'active bg-primary' : 'text-secondary'}`}
              onClick={() => setRole('ADMIN')}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium small">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium small">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? <div className="spinner-border spinner-border-sm"></div> : <LogIn size={18} />}
              Sign In as {role}
            </button>
          </form>

          {role !== 'ADMIN' && (
            <div className="text-center mt-4 small text-muted">
              Don't have an account yet?{' '}
              <Link to={`/register?role=${role}`} className="fw-bold text-primary">
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
