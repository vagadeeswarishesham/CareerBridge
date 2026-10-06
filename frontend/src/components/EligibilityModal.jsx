import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EligibilityModal = ({ show, onClose, result, jobTitle, onApply }) => {
  if (!show || !result) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom-0 pb-0">
            <h5 className="modal-title fw-bold">Eligibility Check</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center py-4">
            {result.eligible ? (
              <div className="text-success mb-3">
                <CheckCircle size={56} className="mb-2" />
                <h4 className="fw-bold">You are Eligible!</h4>
                <p className="text-muted small">You meet all criteria for <strong>{jobTitle}</strong>.</p>
              </div>
            ) : (
              <div className="text-danger mb-3">
                <XCircle size={56} className="mb-2" />
                <h4 className="fw-bold">Not Eligible</h4>
                <p className="text-muted small">Requirements mismatch for <strong>{jobTitle}</strong>.</p>
              </div>
            )}

            <div className="card bg-light border-0 p-3 text-start mb-3">
              <h6 className="fw-bold mb-2 text-secondary d-flex align-items-center gap-2">
                <AlertCircle size={16} /> Details & Criteria
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li className={`mb-1 ${result.cgpaValid ? 'text-success' : 'text-danger'}`}>
                  {result.cgpaValid ? '✓' : '✗'} CGPA Criteria
                </li>
                <li className={`mb-1 ${result.branchValid ? 'text-success' : 'text-danger'}`}>
                  {result.branchValid ? '✓' : '✗'} Branch Eligibility
                </li>
                <li className={`mb-1 ${result.gradYearValid ? 'text-success' : 'text-danger'}`}>
                  {result.gradYearValid ? '✓' : '✗'} Graduation Year
                </li>
                <li className={`mb-1 ${result.deadlineValid ? 'text-success' : 'text-danger'}`}>
                  {result.deadlineValid ? '✓' : '✗'} Application Deadline
                </li>
              </ul>
            </div>

            {result.reasons && result.reasons.length > 0 && (
              <div className="text-start alert alert-info py-2 px-3 mb-0 small">
                <strong>Notes:</strong> {result.reasons.join(' | ')}
              </div>
            )}
          </div>
          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            {result.eligible && onApply && (
              <button type="button" className="btn btn-primary" onClick={onApply}>
                Proceed to Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityModal;
