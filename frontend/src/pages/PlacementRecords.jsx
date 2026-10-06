import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Award, PlusCircle, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const PlacementRecords = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New placement record modal/form state
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    studentId: '',
    companyId: '',
    jobId: '',
    packageAmount: 12.0,
    placementDate: new Date().toISOString().split('T')[0],
    academicYear: '2025-2026'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [recRes, studRes, compRes, jobRes] = await Promise.all([
        api.get('/admin/placements'),
        api.get('/admin/students'),
        api.get('/admin/companies'),
        api.get('/admin/jobs')
      ]);
      setRecords(recRes.data);
      setStudents(studRes.data);
      setCompanies(compRes.data);
      setJobs(jobRes.data);
    } catch (err) {
      console.error('Failed to load placement records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/placements', {
        studentId: parseInt(newRecord.studentId),
        companyId: parseInt(newRecord.companyId),
        jobId: parseInt(newRecord.jobId),
        packageAmount: parseFloat(newRecord.packageAmount),
        placementDate: newRecord.placementDate,
        academicYear: newRecord.academicYear
      });

      setRecords([...records, res.data]);
      setSuccess('Placement record created successfully!');
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create placement record');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this placement record?')) return;
    try {
      await api.delete(`/admin/placements/${id}`);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete record');
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Official Placement Records</h3>
          <p className="text-muted small mb-0">Record and verify final job offer selections for students</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary fw-bold btn-sm">
          {showForm ? 'Cancel' : '+ Add Placement Record'}
        </button>
      </div>

      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small mb-3">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small mb-3">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Add Record Form */}
      {showForm && (
        <div className="card p-4 mb-4 border-0 shadow-sm bg-light">
          <h5 className="fw-bold mb-3 text-primary">Add New Student Placement Record</h5>
          <form onSubmit={handleCreateRecord}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-medium small">Select Student *</label>
                <select
                  className="form-select"
                  value={newRecord.studentId}
                  onChange={(e) => setNewRecord({ ...newRecord, studentId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.branch} - CGPA {s.cgpa})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium small">Select Recruiter Company *</label>
                <select
                  className="form-select"
                  value={newRecord.companyId}
                  onChange={(e) => setNewRecord({ ...newRecord, companyId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Company --</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium small">Select Job Drive *</label>
                <select
                  className="form-select"
                  value={newRecord.jobId}
                  onChange={(e) => setNewRecord({ ...newRecord, jobId: e.target.value })}
                  required
                >
                  <option value="">-- Choose Job --</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.salaryPackage})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium small">Package Amount (LPA) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  value={newRecord.packageAmount}
                  onChange={(e) => setNewRecord({ ...newRecord, packageAmount: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium small">Placement Offer Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newRecord.placementDate}
                  onChange={(e) => setNewRecord({ ...newRecord, placementDate: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium small">Academic Year *</label>
                <input
                  type="text"
                  className="form-control"
                  value={newRecord.academicYear}
                  onChange={(e) => setNewRecord({ ...newRecord, academicYear: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 mt-3">
                <button type="submit" disabled={saving} className="btn btn-primary fw-bold">
                  {saving ? 'Saving...' : 'Save Placement Record'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Placement Records Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : records.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm">
          <h5 className="fw-bold text-muted mb-2">No Placement Records Added</h5>
          <p className="text-muted small">Click '+ Add Placement Record' to record placed students.</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>Placed Student</th>
                  <th>Branch</th>
                  <th>Company</th>
                  <th>Package Offered</th>
                  <th>Placement Date</th>
                  <th>Academic Year</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="small">
                {records.map(rec => (
                  <tr key={rec.id}>
                    <td>
                      <div className="fw-bold text-dark">{rec.studentName}</div>
                      <div className="text-muted extra-small">{rec.studentEmail}</div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">{rec.branch}</span>
                    </td>
                    <td className="fw-bold text-secondary">{rec.companyName}</td>
                    <td className="fw-bold text-success fs-6">{rec.packageAmount} LPA</td>
                    <td>{rec.placementDate}</td>
                    <td>{rec.academicYear}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementRecords;
