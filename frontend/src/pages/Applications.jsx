import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import { FileText, Building2, Calendar, DollarSign, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      if (user?.studentId) {
        const res = await api.get(`/applications/student/${user.studentId}`);
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusClass = (currentStatus, targetStatus) => {
    const order = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'SELECTED'];
    
    if (currentStatus === 'REJECTED') {
      return targetStatus === 'APPLIED' ? 'completed' : 'rejected';
    }

    const currentIndex = order.indexOf(currentStatus);
    const targetIndex = order.indexOf(targetStatus);

    if (currentIndex >= targetIndex) {
      return 'completed';
    }
    return '';
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-1">My Applications & Status Tracker</h3>
      <p className="text-muted small mb-4">Track the live recruitment stage of your submitted applications</p>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm">
          <h5 className="fw-bold text-muted mb-2">No Applications Submitted Yet</h5>
          <p className="text-muted small">Explore available jobs and submit your first application!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {applications.map(app => (
            <div key={app.id} className="card border-0 shadow-sm p-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <h4 className="fw-bold mb-1 text-dark">{app.jobTitle}</h4>
                  <div className="text-secondary fw-medium d-flex align-items-center gap-2">
                    <Building2 size={18} /> {app.companyName}
                  </div>
                </div>

                <div className="text-md-end">
                  <div className="mb-1"><StatusBadge status={app.status} /></div>
                  <div className="text-muted extra-small">
                    Applied on: {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="bg-light p-3 rounded-3 my-2">
                <div className="tracker-steps">
                  <div className={`tracker-step ${getStepStatusClass(app.status, 'APPLIED')}`}>
                    <div className="step-node"><Clock size={16} /></div>
                    <div className="extra-small fw-bold">Applied</div>
                  </div>
                  <div className={`tracker-step ${getStepStatusClass(app.status, 'UNDER_REVIEW')}`}>
                    <div className="step-node"><FileText size={16} /></div>
                    <div className="extra-small fw-bold">Under Review</div>
                  </div>
                  <div className={`tracker-step ${getStepStatusClass(app.status, 'SHORTLISTED')}`}>
                    <div className="step-node"><Award size={16} /></div>
                    <div className="extra-small fw-bold">Shortlisted</div>
                  </div>
                  <div className={`tracker-step ${getStepStatusClass(app.status, 'SELECTED')}`}>
                    <div className="step-node">
                      {app.status === 'REJECTED' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div className="extra-small fw-bold">
                      {app.status === 'REJECTED' ? 'Rejected' : 'Selected'}
                    </div>
                  </div>
                </div>
              </div>

              {app.notes && (
                <div className="alert alert-info py-2 px-3 mb-0 small mt-2">
                  <strong>HR Feedback / Notes:</strong> {app.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
