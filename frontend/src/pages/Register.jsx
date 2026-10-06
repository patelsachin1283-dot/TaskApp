import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FieldError from '../components/FieldError';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p className="muted">Start managing your tasks</p>

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter you Name" />
          <FieldError errors={errors} name="name" />
        </div>

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

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeat password" />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="muted center">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}