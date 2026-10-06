import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import { 
  GraduationCap, Building2, Briefcase, Award, ArrowRight, 
  CheckCircle2, Users, Search, FileCheck, ShieldCheck, User 
} from 'lucide-react';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/active');
        setFeaturedJobs(response.data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch jobs', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center py-5">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="hero-tagline">
                Connect • Apply • Build Your Future
              </div>
              <h1 className="hero-title">
                CAREER BRIDGE
              </h1>
              <h2 className="hero-subtitle mb-4">
                Student Placement and Career Management Portal
              </h2>
              <p className="lead text-white-50 mb-4">
                Empowering B.Tech CSE students and recruiters with an all-in-one placement automation ecosystem. Real-time tracking, automated eligibility validation, and seamless career management.
              </p>

              <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                <Link to="/login?role=STUDENT" className="btn btn-warning btn-lg fw-bold d-flex align-items-center gap-2 px-4 shadow">
                  <GraduationCap size={22} />
                  Student Portal
                </Link>
                <Link to="/login?role=COMPANY" className="btn btn-light btn-lg fw-bold text-primary d-flex align-items-center gap-2 px-4 shadow">
                  <Building2 size={22} />
                  Recruiter Portal
                </Link>
                <Link to="/login?role=ADMIN" className="btn btn-outline-light btn-lg fw-bold d-flex align-items-center gap-2 px-4">
                  <ShieldCheck size={22} />
                  Admin Login
                </Link>
              </div>
            </div>

            <div className="col-lg-5 mt-5 mt-lg-0 text-center">
              <div className="glass-panel p-4 rounded-4 shadow-lg text-dark text-start">
                <h5 className="fw-bold mb-3 text-primary d-flex align-items-center gap-2">
                  <Award size={24} /> Live Placement Drive 2026
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                    <div className="fw-bold text-dark">Google SDE Recruitment</div>
                    <div className="small text-muted">Package: 28.0 LPA • Eligible: CSE, IT, ECE</div>
                  </div>
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-success">
                    <div className="fw-bold text-dark">Microsoft Cloud Engineer</div>
                    <div className="small text-muted">Package: 22.5 LPA • Eligible: Min CGPA 8.0</div>
                  </div>
                  <div className="p-3 bg-light rounded-3 border-start border-4 border-warning">
                    <div className="fw-bold text-dark">TCS Digital Hiring Drive</div>
                    <div className="small text-muted">Package: 9.0 LPA • Eligible: All Branches</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-white py-4 border-bottom shadow-sm">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <div className="stat-value text-primary">94.8%</div>
              <div className="stat-label">Placement Record</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value text-success">45+</div>
              <div className="stat-label">Partner Companies</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value text-warning">28 LPA</div>
              <div className="stat-label">Highest Package Offered</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-value text-info">120+</div>
              <div className="stat-label">Active Openings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill">Seamless Process</span>
            <h2 className="fw-bold mt-2">How Career Bridge Works</h2>
            <p className="text-muted">Streamlined three-step journey to your dream career</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-4 text-center border-0 shadow-sm">
                <div className="stat-icon primary mx-auto mb-3">
                  <User size={28} />
                </div>
                <h5 className="fw-bold">1. Create Profile</h5>
                <p className="text-muted small">
                  Register with your academic details, branch, CGPA, technical skills, and resume link.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 text-center border-0 shadow-sm">
                <div className="stat-icon warning mx-auto mb-3">
                  <Search size={28} />
                </div>
                <h5 className="fw-bold">2. Check & Apply</h5>
                <p className="text-muted small">
                  Browse posted drives, run instant CGPA & branch eligibility check, and submit applications.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-4 text-center border-0 shadow-sm">
                <div className="stat-icon success mx-auto mb-3">
                  <FileCheck size={28} />
                </div>
                <h5 className="fw-bold">3. Track & Get Placed</h5>
                <p className="text-muted small">
                  Monitor status progression in real-time from shortlisting to final selection & offer letter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Campus Drives</h2>
              <p className="text-muted mb-0">Active job opportunities available for application</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary d-flex align-items-center gap-2">
              View All Jobs <ArrowRight size={18} />
            </Link>
          </div>

          {loadingJobs ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {featuredJobs.map(job => (
                <div key={job.id} className="col-md-6 col-lg-4">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
