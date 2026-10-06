import React from 'react';
import { Clock, CheckCircle, XCircle, Award, Eye } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'APPLIED': return <Clock size={14} />;
      case 'UNDER_REVIEW': return <Eye size={14} />;
      case 'SHORTLISTED': return <Award size={14} />;
      case 'SELECTED': return <CheckCircle size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const formattedStatus = status ? status.replace('_', ' ') : 'UNKNOWN';

  return (
    <span className={`status-badge ${status || 'APPLIED'}`}>
      {getStatusIcon()}
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
