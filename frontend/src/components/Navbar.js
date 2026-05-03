import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>AI Real Estate</Link>
      <div style={styles.links}>
        <Link to="/properties" style={styles.link}>Properties</Link>
        <Link to="/chat" style={styles.link}>AI Assistant</Link>
        {user ? (
          <>
            <span style={styles.user}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  user: { color: '#ccc' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' },
};
