import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FieldError from '../components/FieldError';
import Avatar from '../components/Avatar';

export default function Profile() {
  const { user, setUser } = useAuth();

  // ---- Profile ફોર્મ ----
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ---- ફોટો ----
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoErrors, setPhotoErrors] = useState({});
  const [photoMessage, setPhotoMessage] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setMessage('');
    try {
      const res = await api.put('/profile', form);
      setUser(res.data.user);
      setMessage(res.data.message);
      setForm({ ...form, password: '', password_confirmation: '' });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setPhotoErrors({});
    setPhotoMessage('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setPhotoLoading(true);
    setPhotoErrors({});
    setPhotoMessage('');

    const data = new FormData();
    data.append('image', file);

    try {
      const res = await api.post('/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(res.data.user);
      setPhotoMessage(res.data.message);
      setFile(null);
      setPreview(null);
    } catch (err) {
      if (err.response?.status === 422) {
        setPhotoErrors(err.response.data.errors);
      }
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Remove your photo?')) return;
    setPhotoLoading(true);
    setPhotoMessage('');
    try {
      const res = await api.delete('/profile/photo');
      setUser(res.data.user);
      setPhotoMessage(res.data.message);
    } finally {
      setPhotoLoading(false);
    }
  };

   return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-grid">
        {/* ડાબી બાજુ: Name, Email, Password */}
        <form className="card profile-card" onSubmit={handleSubmit}>
          {message && <div className="alert-success">{message}</div>}

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} />
            <FieldError errors={errors} name="name" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            <FieldError errors={errors} name="email" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>New Password (optional)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
              <FieldError errors={errors} name="password" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* જમણી બાજુ: ફોટો */}
        <div className="card profile-card photo-side">
          <Avatar
            user={preview ? { name: user?.name, photo_url: preview } : user}
            size={130}
          />

          {photoMessage && <div className="alert-success">{photoMessage}</div>}
          <FieldError errors={photoErrors} name="image" />

          <div className="photo-buttons">
            <label htmlFor="photo-input" className="btn btn-outline">
              Choose Photo
            </label>
            <input
              id="photo-input"
              type="file"
              hidden
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={!file || photoLoading}
            >
              {photoLoading ? 'Uploading...' : 'Upload'}
            </button>

            {user?.photo_url && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRemove}
                disabled={photoLoading}
              >
                Remove
              </button>
            )}
          </div>

          {file && <p className="muted small">{file.name}</p>}
        </div>
      </div>
    </div>
  );
}