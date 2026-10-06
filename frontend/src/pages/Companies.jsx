import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, Trash2, Search, Globe, Phone } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to load companies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this company account?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setCompanies(companies.filter(c => c.userId !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete company');
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Partner Companies & Recruiters</h3>
          <p className="text-muted small mb-0">Directory of registered recruiter organizations and contact HRs</p>
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
            placeholder="Search by company name, industry, or location..."
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
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Location</th>
                  <th>HR Representative</th>
                  <th>Contact Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredCompanies.map(company => (
                  <tr key={company.id}>
                    <td>
                      <div className="fw-bold text-dark">{company.companyName}</div>
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-muted extra-small">
                          {company.website}
                        </a>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info">{company.industry || 'Technology'}</span>
                    </td>
                    <td>{company.location || 'N/A'}</td>
                    <td>{company.hrName || 'N/A'}</td>
                    <td>{company.email}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(company.userId)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Company Account"
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

export default Companies;
