import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

export default function Insights() {
  const { user, token } = useAuth()
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateInsight = async () => {
    setLoading(true)
    setError('')
    setInsight('')
    try {
      // Use the correct endpoint that exists in backend
      const response = await api.get('/api/ai/insights?days=30')
      
      // Format the response nicely
      const data = response.data
      let formatted = ''
      
      if (data.insights) {
        formatted = `📊 AI Health Analysis\n\n${data.insights}\n\n`
      }
      
      if (data.data_points_analyzed) {
        formatted += `Analyzed ${data.data_points_analyzed} days of health data.`
      }
      
      setInsight(formatted || JSON.stringify(data, null, 2))
    } catch (error) {
      setError('Failed to generate insight: ' + (error.response?.data?.detail || 'Please ensure you have health logs saved.'))
      console.error('Error generating insight:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <LoadingSpinner />

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>AI Health Insights</h2>

        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
        }}>
          {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {insight && (
            <div style={{
              padding: '24px',
              background: '#f0fdfa',
              borderRadius: '12px',
              marginBottom: '24px',
              lineHeight: '1.6',
              color: '#334155'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#0f766e' }}>
                🤖 AI Analysis
              </h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{insight}</p>
            </div>
          )}

          <button
            onClick={generateInsight}
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #14b8a6, #0d9488)',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? '⏳ Generating...' : '🤖 Generate Health Insight'}
          </button>

          <p style={{ marginTop: '16px', color: '#64748b', fontSize: '14px' }}>
            Get AI-powered health insights based on your health logs and reports
          </p>
        </div>
      </div>
    </>
  )
}
