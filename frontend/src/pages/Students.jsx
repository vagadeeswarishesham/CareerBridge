import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Trash2, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentEnabled) => {
    try {
      await api.put(`/admin/users/${userId}/toggle`, { enabled: !currentEnabled });
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this student user account?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setStudents(students.filter(s => s.userId !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Registered Student Management</h3>
          <p className="text-muted small mb-0">View student academic profiles, manage access permissions, and export records</p>
        </div>
      </div>

      <div className="card p-3 mb-4 border-0 shadow-sm">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0 text-muted">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0"
            placeholder="Search by student name, email, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm p-4">
          <div className="table-responsive">
            <table className="table align-middle table-hover">
              <thead className="table-light small">
                <tr>
                  <th>Student Name</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Grad Year</th>
                  <th>Phone</th>
                  <th>Placement Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="fw-bold text-dark">{student.name}</div>
                      <div className="text-muted extra-small">{student.email}</div>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">{student.branch}</span>
                    </td>
                    <td className="fw-bold text-dark">{student.cgpa || '0.0'}</td>
                    <td>{student.graduationYear}</td>
                    <td>{student.phone || 'N/A'}</td>
                    <td>
                      {student.isPlaced ? (
                        <span className="badge bg-success-subtle text-success">Placed</span>
                      ) : (
                        <span className="badge bg-light text-muted border">Unplaced</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleDeleteUser(student.userId)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Student Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

export default Students;
