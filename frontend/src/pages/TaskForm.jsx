import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import FieldError from '../components/FieldError';

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/tasks/${id}`)
      .then((res) => {
        const t = res.data.data;
        setForm({
          title: t.title,
          description: t.description || '',
          status: t.status,
          due_date: t.due_date || '',
        });
      })
      .catch(() => navigate('/tasks'))
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      if (isEdit) {
        await api.put(`/tasks/${id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      navigate('/tasks');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Task' : 'Create Task'}</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} />
          <FieldError errors={errors} name="title" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
          <FieldError errors={errors} name="description" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <FieldError errors={errors} name="status" />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="due_date" value={form.due_date} onChange={handleChange} />
            <FieldError errors={errors} name="due_date" />
          </div>
        </div>

        <div className="form-actions">
          <Link to="/tasks" className="btn btn-outline">Cancel</Link>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}