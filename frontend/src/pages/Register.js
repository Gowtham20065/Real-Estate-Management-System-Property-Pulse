import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await authAPI.register(form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <select style={styles.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button style={styles.btn} type="submit">Register</button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
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
