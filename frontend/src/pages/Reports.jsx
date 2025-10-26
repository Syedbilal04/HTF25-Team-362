import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import UploadReportForm from '../components/UploadReportForm'
import api from '../services/api'

export default function Reports() {
  const { user, token } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports')
      setReports(response.data)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return
    
    try {
      await api.delete(`/api/reports/${reportId}`)
      fetchReports()
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Failed to delete report')
    }
  }

  if (!user) return <LoadingSpinner />

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Medical Reports</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {showForm ? '❌ Cancel' : '📄 Upload Report'}
          </button>
        </div>

        {showForm && <UploadReportForm onSuccess={() => { setShowForm(false); fetchReports(); }} />}

        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📄</div>
            <p>No reports yet. Upload your first report!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {reports.map((report) => (
              <div key={report.id} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{report.title}</h3>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    {new Date(report.report_date).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ marginBottom: '8px', fontSize: '12px', color: '#64748b', textTransform: 'capitalize' }}>
                  {report.report_type?.replace('_', ' ')}
                </div>
                {report.description && <p style={{ color: '#64748b', marginBottom: '12px' }}>{report.description}</p>}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {report.file_name && (
                    <a 
                      href={`http://127.0.0.1:8000/static/uploads/${report.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#14b8a6',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      📎 View File
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(report.id)}
                    style={{
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
