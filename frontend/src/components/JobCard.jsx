import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';

const JobCard = ({ job, isStudent, onCheckEligibility }) => {
  return (
    <div className="card h-100 p-4 shadow-sm border-0 position-relative">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <span className="badge bg-primary-subtle text-primary fw-semibold mb-2 px-3 py-1 rounded-pill">
            {job.jobType || 'FULL_TIME'}
          </span>
          <h5 className="card-title fw-bold mb-1 text-dark">{job.title}</h5>
          <div className="text-secondary fw-medium d-flex align-items-center gap-1">
            <Building2 size={16} />
            {job.companyName}
          </div>
        </div>
        <div className="text-end">
          <span className="fw-bold text-success fs-5">{job.salaryPackage}</span>
        </div>
      </div>

      <p className="card-text text-muted small mb-3 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {job.requiredSkills && job.requiredSkills.split(',').map((skill, idx) => (
          <span key={idx} className="badge bg-light text-secondary border">
            {skill.trim()}
          </span>
        ))}
      </div>

      <div className="row g-2 text-muted small mb-4">
        <div className="col-6 d-flex align-items-center gap-1">
          <MapPin size={14} className="text-primary" />
          <span>{job.location}</span>
        </div>
        <div className="col-6 d-flex align-items-center gap-1">
          <Calendar size={14} className="text-primary" />
          <span>Deadline: {job.deadline}</span>
        </div>
        <div className="col-6">
          <span>Min CGPA: <strong>{job.minCgpa || '0.0'}</strong></span>
        </div>
        <div className="col-6">
          <span>Branch: <strong>{job.eligibleBranch || 'ALL'}</strong></span>
        </div>
      </div>

      <div className="mt-auto d-flex gap-2">
        <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary w-100 btn-sm">
          View Details
        </Link>
        {isStudent && onCheckEligibility && (
          <button onClick={() => onCheckEligibility(job.id)} className="btn btn-primary w-100 btn-sm d-flex align-items-center justify-content-center gap-1">
            <CheckCircle2 size={15} />
            Check Eligibility
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
