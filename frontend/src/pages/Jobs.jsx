import React, { useState, useEffect } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import EligibilityModal from '../components/EligibilityModal';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Eligibility modal state
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/active');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckEligibility = async (jobId) => {
    if (!user || user.role !== 'STUDENT') {
      navigate('/login?role=STUDENT');
      return;
    }

    try {
      const job = jobs.find(j => j.id === jobId);
      setSelectedJob(job);
      const res = await api.get(`/students/${user.studentId}/eligibility/${jobId}`);
      setEligibilityResult(res.data);
      setShowModal(true);
    } catch (err) {
      alert(err.message || 'Error checking eligibility');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === 'ALL' || job.eligibleBranch === 'ALL' || job.eligibleBranch?.includes(branchFilter);
    const matchesType = typeFilter === 'ALL' || job.jobType === typeFilter;

    return matchesSearch && matchesBranch && matchesType;
  });

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <Briefcase className="text-primary" /> Browse Job & Internship Openings
          </h2>
          <p className="text-muted mb-0">Explore active recruitment drives and check your eligibility</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-3 mb-4 shadow-sm border-0 bg-white">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search job title, company name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <select
              className="form-select bg-light"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
            >
              <option value="ALL">All Eligible Branches</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="IT">IT</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="EE">EE</option>
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select bg-light"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Employment Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="PART_TIME">Part Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm p-5">
          <h5 className="fw-bold text-muted mb-2">No Matching Job Drives Found</h5>
          <p className="text-muted small">Try clearing filters or search with different keywords.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="col-md-6 col-lg-4">
              <JobCard
                job={job}
                isStudent={user?.role === 'STUDENT'}
                onCheckEligibility={handleCheckEligibility}
              />
            </div>
          ))}
        </div>
      )}

      {/* Eligibility Result Modal */}
      <EligibilityModal
        show={showModal}
        onClose={() => setShowModal(false)}
        result={eligibilityResult}
        jobTitle={selectedJob?.title}
        onApply={() => {
          setShowModal(false);
          navigate(`/jobs/${selectedJob?.id}`);
        }}
      />
    </div>
  );
};

export default Jobs;
