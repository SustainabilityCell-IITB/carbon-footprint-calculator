import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';

// Google Apps Script Web App URL that appends each submission as a row in
// your Google Sheet. Set VITE_SHEET_URL in calculator/.env.production.
// See google-apps-script/Code.gs for the script to paste + how to deploy.
// If empty, submissions are simply skipped (the calculator still works).
const SHEET_URL = import.meta.env.VITE_SHEET_URL || '';

const HOSTEL_MIN = 1;
const HOSTEL_MAX = 21;
const HOSTELS_PER_PAGE = 7;
const GREEN = '#BDD873';
const GREEN_DARK = '#8BC34A';

function HostelSelector({ value, onChange }) {
  const [start, setStart] = useState(1);

  // Responsive hostel display - more on desktop, fewer on mobile
  const isMobile = window.innerWidth <= 700;
  const hostelsPerPage = isMobile ? 5 : HOSTELS_PER_PAGE;

  const end = Math.min(start + hostelsPerPage - 1, HOSTEL_MAX);
  const canPrev = start > HOSTEL_MIN;
  const canNext = end < HOSTEL_MAX;
  const hostels = [];
  for (let i = start; i <= end; i++) hostels.push(i);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
      <button type="button" onClick={() => setStart(Math.max(HOSTEL_MIN, start - hostelsPerPage))} disabled={!canPrev} style={{ background: 'none', border: 'none', fontSize: 28, color: canPrev ? GREEN_DARK : '#ccc', cursor: canPrev ? 'pointer' : 'default' }}>&lt;</button>
      {hostels.map(num => (
        <button
          key={num}
          type="button"
          onClick={() => onChange(num)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: value === num ? GREEN : '#e6e6e6',
            color: value === num ? '#222' : '#666',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            margin: '0 2px',
            boxShadow: value === num ? '0 2px 8px rgba(139,195,74,0.15)' : 'none',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          {num}
        </button>
      ))}
      <button type="button" onClick={() => setStart(Math.min(HOSTEL_MAX - hostelsPerPage + 1, start + hostelsPerPage))} disabled={!canNext} style={{ background: 'none', border: 'none', fontSize: 28, color: canNext ? GREEN_DARK : '#ccc', cursor: canNext ? 'pointer' : 'default' }}>&gt;</button>
    </div>
  );
}

export default function HostelPage({ onNext, formData }) {
  const [form, setForm] = useState({
    hostelNo: formData.hostelNo || 1,
  });
  const navigate = useNavigate();

  const handleHostel = num => setForm({ ...form, hostelNo: num });


  const handleSubmit = (e) => {
    e.preventDefault();
    if (onNext) onNext(form);

    // Append the submission to the Google Sheet (fire-and-forget: never blocks
    // navigation). Apps Script needs a "simple" request (text/plain) so the
    // browser skips the CORS preflight it can't answer; no-cors because we
    // don't need to read the response.
    if (SHEET_URL) {
      fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          hostelNo: form.hostelNo,
          userName: form.userName,
        }),
      }).catch(err => {
        console.warn('Could not save submission to sheet:', err.message);
      });
    }

    navigate('/energy');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="bg-overlay">
        <img src={logo} alt="Logo" className="logo-small" />
        <h2 style={{ fontSize: 36, fontWeight: 700, marginTop: 24, marginBottom: 12, textAlign: 'center' }}>Your Hostel</h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: 16, marginBottom: 32, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Select your hostel number to get started.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Hostel selector */}
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>In which hostel do you live?</div>
          <HostelSelector value={form.hostelNo} onChange={handleHostel} />

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
