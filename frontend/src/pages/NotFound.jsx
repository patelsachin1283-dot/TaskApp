import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="center-screen">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, margin: 0 }}>404</h1>
        <p className="muted">Page not found</p>
        <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
      </div>
    </div>
  );
}