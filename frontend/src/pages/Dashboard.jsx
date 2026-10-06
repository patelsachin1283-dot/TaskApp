import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/tasks/stats').then((res) => setStats(res.data));
  }, []);

  const cards = [
    { label: 'Total Tasks', key: 'total', color: '#4f46e5' },
    { label: 'Pending', key: 'pending', color: '#f59e0b' },
    { label: 'In Progress', key: 'in_progress', color: '#0ea5e9' },
    { label: 'Completed', key: 'completed', color: '#10b981' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Hello, Mr. {user?.name}</h1>
          <p className="muted">Here is an overview of your tasks.</p>
        </div>
        <Link to="/tasks/create" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      <div className="stats-grid">
        {cards.map((c) => (
          <div key={c.key} className="card stat-card" style={{ borderTop: `4px solid ${c.color}` }}>
            <p className="muted">{c.label}</p>
            <h2>{stats ? stats[c.key] : '-'}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}