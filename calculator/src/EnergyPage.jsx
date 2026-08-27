import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';


function StyledSlider({ label, min, max, value, onChange, name, valueLabel }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          name={name}
          onChange={onChange}
          style={{ flex: 1, margin: '0 16px', accentColor: GREEN_DARK }}
        />
      </div>
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 20, marginTop: 4, fontStyle: 'italic' }}>{valueLabel || (value + ' hours')}</div>
    </div>
  );
}

function OptionButtonGroup({ label, name, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{label}</div>
      <div className="option-group">
        {options.map(opt => (
          <button
            type="button"
            key={opt.value}
            className={`option-btn${value === opt.value ? ' selected' : ''}`}
            onClick={() => onChange({ target: { name, value: opt.value } })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EnergyPage({ onNext, formData }) {
  const [form, setForm] = useState({
    credits: formData.credits || 0,
    timeLabs: formData.timeLabs || 0,
    timeLibrary: formData.timeLibrary || 0,
    timeGymkhana: formData.timeGymkhana || 0
  });
  const navigate = useNavigate();

  const handleSlider = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });
  const handleOption = e => setForm({ ...form, [e.target.name]: Number(e.target.value) });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);
    navigate('/food');
  };

  const handleBack = () => {
    navigate('/hostel');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="bg-overlay">
        <img src={logo} alt="Logo" className="logo-small" />
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 32, textAlign: 'center' }}>Energy</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <StyledSlider label="Credits taken" min={0} max={54} value={form.credits} onChange={handleSlider} name="credits" valueLabel={form.credits + ' credits'} />
          <OptionButtonGroup label="Time in Labs (hours/week)" name="timeLabs" value={form.timeLabs} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <OptionButtonGroup label="Time in Library (hours/week)" name="timeLibrary" value={form.timeLibrary} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <OptionButtonGroup label="Time in Gymkhana (hours/week)" name="timeGymkhana" value={form.timeGymkhana} onChange={handleOption} options={[{label:'0',value:0},{label:'1–5',value:3},{label:'6–10',value:8},{label:'11+',value:13}]} />
          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: 'transparent',
                color: '#666',
                border: '2px solid #ddd',
                fontWeight: 600,
                fontSize: 18,
                padding: '12px 24px',
                borderRadius: 999,
                cursor: 'pointer',
                transition: 'all 0.2s',
                flex: 1,
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#f5f5f5'; e.currentTarget.style.color = '#333'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666'; }}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(90deg, #8BC34A 0%, #4CAF50 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 4px 16px rgba(139,195,74,0.15)',
                padding: '12px 24px',
                borderRadius: 999,
                letterSpacing: 1,
                cursor: 'pointer',
                transition: 'background 0.2s',
                flex: 1,
              }}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 