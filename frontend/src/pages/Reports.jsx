import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart2, Download, Printer, Award, DollarSign } from 'lucide-react';

const Reports = () => {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReportsData(res.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  const { summary, branchWise, companyWise, packageStats, placements } = reportsData || {};

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Campus Placement Reports & Analytics</h3>
          <p className="text-muted small mb-0">Official academic year placement statistics and breakdown reports</p>
        </div>
        <button onClick={handlePrint} className="btn btn-outline-primary btn-sm fw-bold d-flex align-items-center gap-1">
          <Printer size={16} /> Print / Export PDF
        </button>
      </div>

      {/* Summary KPI grid */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white text-center">
            <div className="text-muted small">Total Students</div>
            <div className="fs-3 fw-bold text-primary">{summary?.totalStudents || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white text-center">
            <div className="text-muted small">Students Placed</div>
            <div className="fs-3 fw-bold text-success">{summary?.selectedStudents || 0}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white text-center">
            <div className="text-muted small">Placement Percentage</div>
            <div className="fs-3 fw-bold text-warning">{summary?.placementPercentage || 0}%</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 bg-white text-center">
            <div className="text-muted small">Highest Package</div>
            <div className="fs-3 fw-bold text-danger">{packageStats?.maxPackage || 0} LPA</div>
          </div>
        </div>
      </div>

      {/* Branch wise breakdown */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Branch-wise Student Demographics</h5>
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Branch</th>
                  <th className="text-end">Student Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(branchWise || {}).map(([branch, count]) => (
                  <tr key={branch}>
                    <td className="fw-semibold">{branch}</td>
                    <td className="text-end fw-bold">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3">Recruiter Company Placements</h5>
            <table className="table table-sm table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Company</th>
                  <th className="text-end">Placements Count</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(companyWise || {}).map(([comp, count]) => (
                  <tr key={comp}>
                    <td className="fw-semibold">{comp}</td>
                    <td className="text-end fw-bold text-success">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Placements Table */}
      <div className="card border-0 shadow-sm p-4">
        <h5 className="fw-bold mb-3">Detailed Placement Offer List</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light small">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Branch</th>
                <th>Company</th>
                <th>Package Offered</th>
                <th>Offer Date</th>
              </tr>
            </thead>
            <tbody className="small">
              {(placements || []).map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{idx + 1}</td>
                  <td className="fw-bold text-dark">{p.studentName}</td>
                  <td><span className="badge bg-primary-subtle text-primary">{p.branch}</span></td>
                  <td className="fw-semibold text-secondary">{p.companyName}</td>
                  <td className="fw-bold text-success">{p.packageAmount} LPA</td>
                  <td>{p.placementDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
