import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ logs: 0, reports: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [logsRes, reportsRes] = await Promise.all([
        api.get('/api/logs'),
        api.get('/api/reports')
      ])
      setStats({
        logs: logsRes.data.length || 0,
        reports: reportsRes.data.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!user) return <LoadingSpinner />

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
          Welcome back, {user.full_name}! 👋
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            { title: 'Health Logs', count: stats.logs, emoji: '📊', link: '/logs' },
            { title: 'Medical Reports', count: stats.reports, emoji: '📄', link: '/reports' },
            { title: 'AI Insights', count: '0', emoji: '🤖', link: '/insights' },
            { title: 'Profile', emoji: '👤', link: '/profile' }
          ].map((card, i) => (
            <div key={i} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }} onClick={() => navigate(card.link)}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{card.emoji}</div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{card.title}</h3>
              {card.count && <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#14b8a6' }}>{card.count}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
