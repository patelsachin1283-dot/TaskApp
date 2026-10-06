import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks', { params: { page, search, status } });
      setTasks(res.data.data);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300); 
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Tasks</h1>
        <Link to="/tasks/create" className="btn btn-primary">
          + New Task
        </Link>
      </div>

      <div className="card filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="card table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Due Date</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="center">Loading...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="4" className="center">No tasks found.</td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    {task.description && <div className="muted small">{task.description.slice(0, 80)}</div>}
                  </td>
                  <td>
                    <span className={`badge badge-${task.status}`}>{statusLabels[task.status]}</span>
                  </td>
                  <td>{task.due_date || '-'}</td>
                  <td>
                    <Link to={`/tasks/${task.id}/edit`} className="btn btn-small btn-outline">Edit</Link>{' '}
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {meta && meta.last_page > 1 && (
        <div className="pagination">
          <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Prev
          </button>
          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>
          <button className="btn btn-outline" disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}