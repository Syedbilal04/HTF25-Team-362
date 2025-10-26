import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      padding: '16px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>🏥 HealthRecord</h1>
        </Link>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
          <Link to="/logs" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Logs</Link>
          <Link to="/reports" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Reports</Link>
          <Link to="/insights" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Insights</Link>
          <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Profile</Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
            <span style={{ color: 'white', fontSize: '14px' }}>👤 {user?.full_name}</span>
            <button 
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid white',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
