import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FieldError from '../components/FieldError';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ email: ['Something went wrong. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Login to your account</p>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter you Email Id" />
          <FieldError errors={errors} name="email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your Password" />
          <FieldError errors={errors} name="password" />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="muted center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}