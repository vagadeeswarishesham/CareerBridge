import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container py-5 text-center my-5">
      <AlertTriangle size={64} className="text-warning mb-3" />
      <h1 className="fw-bold display-4 text-dark">404 - Page Not Found</h1>
      <p className="lead text-muted mb-4">
        The requested page does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary fw-bold d-inline-flex align-items-center gap-2 px-4 py-2">
        <Home size={18} /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
