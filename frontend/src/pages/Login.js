import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button style={styles.btn} type="submit">Login</button>
        <p style={styles.link}>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', background: '#f8f9fa' },
  form: { background: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' },
  title: { margin: 0, color: '#1a1a2e', textAlign: 'center' },
  input: { padding: '0.7rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  error: { color: '#e94560', margin: 0 },
  link: { textAlign: 'center', margin: 0 },
};
