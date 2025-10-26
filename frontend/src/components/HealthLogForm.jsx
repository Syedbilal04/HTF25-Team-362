import { useState } from 'react'
import { logService } from '../services/logService'

export default function HealthLogForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    symptoms: [],
    mood: 5,
    sleep_hours: 8,
    pain_level: 0,
    temperature: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const commonSymptoms = ['headache', 'fever', 'cough', 'fatigue', 'nausea', 'back_pain', 'joint_pain', 'dizziness']

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await logService.createLog({
        ...formData,
        date: new Date().toISOString().split('T')[0]
      })
      onSuccess && onSuccess()
      setFormData({
        symptoms: [],
        mood: 5,
        sleep_hours: 8,
        pain_level: 0,
        temperature: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        notes: ''
      })
    } catch (err) {
      setError('Failed to save log: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
        📊 Daily Health Log
      </h3>

      {error && (
        <div style={{
          padding: '12px',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Symptoms */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Symptoms (select all that apply)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
            {commonSymptoms.map(symptom => (
              <label key={symptom} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '8px 12px',
                background: formData.symptoms.includes(symptom) ? '#e6fffa' : '#f8fafc',
                borderRadius: '8px',
                border: `1px solid ${formData.symptoms.includes(symptom) ? '#14b8a6' : '#e2e8f0'}`,
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                <input
                  type="checkbox"
                  checked={formData.symptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                  style={{ margin: 0 }}
                />
                {symptom.replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>

        {/* Mood Scale */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Mood (1-10): {formData.mood}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.mood}
            onChange={(e) => setFormData({...formData, mood: parseInt(e.target.value)})}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
            <span>😢 Very Low</span>
            <span>😐 Neutral</span>
            <span>😊 Great</span>
          </div>
        </div>

        {/* Sleep Hours */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Sleep Hours
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.sleep_hours}
            onChange={(e) => setFormData({...formData, sleep_hours: parseFloat(e.target.value)})}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Pain Level */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Pain Level (0-10): {formData.pain_level}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.pain_level}
            onChange={(e) => setFormData({...formData, pain_level: parseInt(e.target.value)})}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
            <span>😌 No Pain</span>
            <span>😰 Severe</span>
          </div>
        </div>

        {/* Vitals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Temperature (°F)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({...formData, temperature: e.target.value})}
              placeholder="98.6"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              BP Systolic
            </label>
            <input
              type="number"
              value={formData.blood_pressure_systolic}
              onChange={(e) => setFormData({...formData, blood_pressure_systolic: e.target.value})}
              placeholder="120"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              BP Diastolic
            </label>
            <input
              type="number"
              value={formData.blood_pressure_diastolic}
              onChange={(e) => setFormData({...formData, blood_pressure_diastolic: e.target.value})}
              placeholder="80"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Any additional observations or notes..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Saving...' : '💾 Save Health Log'}
        </button>
      </form>
    </div>
  )
}
