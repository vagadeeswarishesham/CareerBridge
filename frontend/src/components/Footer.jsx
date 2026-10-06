import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <GraduationCap size={32} className="text-primary" />
              <h5 className="mb-0 fw-bold">CAREER BRIDGE</h5>
            </div>
            <p className="text-muted small">
              Connect • Apply • Build Your Future
            </p>
            <p className="text-muted small">
              A comprehensive campus placement management portal designed for students, recruiters, and placement administrators.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="fw-bold mb-3 text-uppercase text-primary">Portal</h6>
            <ul className="list-unstyled text-muted small">
              <li className="mb-2"><a href="/jobs" className="text-muted">Jobs & Internships</a></li>
              <li className="mb-2"><a href="/login" className="text-muted">Student Login</a></li>
              <li className="mb-2"><a href="/login" className="text-muted">Company Portal</a></li>
              <li className="mb-2"><a href="/login" className="text-muted">Admin Access</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase text-primary">Contact Placement Cell</h6>
            <p className="text-muted small mb-1">Department of Computer Science & Engineering</p>
            <p className="text-muted small mb-1">Email: placement@careerbridge.edu</p>
            <p className="text-muted small">Phone: +91 800-123-4567</p>
          </div>

          <div className="col-md-3">
            <h6 className="fw-bold mb-3 text-uppercase text-primary">Academic Project</h6>
            <p className="text-muted small">
              B.Tech CSE Final Year Major Project Architecture. Built using Spring Boot 3, React + Vite, MySQL, and JWT Security.
            </p>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>© {new Date().getFullYear()} Career Bridge Portal. All rights reserved.</div>
          <div>Crafted with <Heart size={14} className="text-danger mx-1 fill-danger" /> for B.Tech CSE Placement Cell</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
