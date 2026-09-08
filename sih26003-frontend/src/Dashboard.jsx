import React from 'react';

export default function Dashboard({ userRole = 'student', onLogout }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '240px', background: '#0f172a', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid #334155', marginBottom: '20px' }}>
            <span style={{ fontSize: '10px', background: '#312e81', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
              SIH26003
            </span>
            <h2 style={{ fontSize: '20px', margin: '8px 0 0 0', color: '#f8fafc' }}>SIH Portal</h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#overview" style={{ padding: '10px 12px', background: '#1e293b', color: '#38bdf8', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
              📊 Overview
            </a>
            <a href="#requests" style={{ padding: '10px 12px', color: '#94a3b8', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
              📁 Applications
            </a>
            <a href="#analytics" style={{ padding: '10px 12px', color: '#94a3b8', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
              📈 Analytics
            </a>
            <a href="#settings" style={{ padding: '10px 12px', color: '#94a3b8', borderRadius: '6px', textDecoration: 'none', fontSize: '14px' }}>
              ⚙️ Settings
            </a>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          style={{ padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', color: '#0f172a', margin: '0 0 4px 0' }}>
              Welcome back, User! 👋
            </h1>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Logged in as: <strong style={{ textTransform: 'capitalize', color: '#2563eb' }}>{userRole}</strong>
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', background: '#e0e7ff', color: '#3730a3', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
              Status: Active
            </span>
          </div>
        </header>

        {/* Metrics Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>Total Submissions</p>
            <h3 style={{ fontSize: '28px', color: '#0f172a', margin: 0 }}>24</h3>
          </div>
          
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>Pending Approvals</p>
            <h3 style={{ fontSize: '28px', color: '#d97706', margin: 0 }}>05</h3>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>Completed Tasks</p>
            <h3 style={{ fontSize: '28px', color: '#16a34a', margin: 0 }}>19</h3>
          </div>
        </section>

        {/* Recent Activity Table */}
        <section style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '16px' }}>Recent Activity Logs</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>Activity ID</th>
                <th style={{ padding: '12px' }}>Module</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>#ACT-8091</td>
                <td style={{ padding: '12px' }}>User Authentication</td>
                <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>Success</td>
                <td style={{ padding: '12px', color: '#64748b' }}>Just now</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>#ACT-8088</td>
                <td style={{ padding: '12px' }}>Profile Verification</td>
                <td style={{ padding: '12px', color: '#d97706', fontWeight: 'bold' }}>Pending</td>
                <td style={{ padding: '12px', color: '#64748b' }}>2 hours ago</td>
              </tr>
            </tbody>
          </table>
        </section>

      </main>
    </div>
  );
}