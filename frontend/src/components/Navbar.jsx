import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">TaskApp</div>
      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
      <div className="navbar-user">
        <Link to="/profile" className="navbar-avatar-link" title="<My Profile">
        <Avatar user={user} size={36}/>
        </Link>
        <span>{user?.name}</span>
        <button className="btn btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}