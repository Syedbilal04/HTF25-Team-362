import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import HealthLogForm from '../components/HealthLogForm'
import api from '../services/api'

export default function Logs() {
  const { user, token } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/logs')
      setLogs(response.data)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <LoadingSpinner />

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Health Logs</h2>
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
            {showForm ? '❌ Cancel' : '➕ Add Log'}
          </button>
        </div>

        {showForm && <HealthLogForm onSuccess={() => { setShowForm(false); fetchLogs(); }} />}

        {loading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
            <p>No health logs yet. Add your first log!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                background: 'white',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{log.log_type}</h3>
                  <span style={{ color: '#64748b', fontSize: '14px' }}>
                    {new Date(log.log_date).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: '#64748b', marginBottom: '12px' }}>{log.notes}</p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {log.blood_pressure && <span>🩺 BP: {log.blood_pressure}</span>}
                  {log.weight && <span>⚖️ Weight: {log.weight} kg</span>}
                  {log.temperature && <span>🌡️ Temp: {log.temperature}°C</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
