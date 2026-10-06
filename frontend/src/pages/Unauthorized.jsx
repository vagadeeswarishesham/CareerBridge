import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="container py-5 text-center my-5">
      <ShieldAlert size={64} className="text-danger mb-3" />
      <h1 className="fw-bold display-4 text-dark">403 - Access Denied</h1>
      <p className="lead text-muted mb-4">
        You do not have permission to access this portal page. Please log in with the appropriate role.
      </p>
      <Link to="/" className="btn btn-primary fw-bold d-inline-flex align-items-center gap-2 px-4 py-2">
        <Home size={18} /> Return to Homepage
      </Link>
    </div>
  );
};

export default Unauthorized;
