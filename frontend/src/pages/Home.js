import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={styles.hero}>
      <h1 style={styles.heading}>Find Your Dream Property with AI</h1>
      <p style={styles.sub}>Just describe what you're looking for — our AI assistant does the rest.</p>
      <div style={styles.actions}>
        <Link to="/chat" style={styles.primaryBtn}>Talk to AI Assistant</Link>
        <Link to="/properties" style={styles.secondaryBtn}>Browse Properties</Link>
      </div>
      <div style={styles.examples}>
        <p style={styles.exLabel}>Try asking:</p>
        {[
          '"Show me 2BHK apartments in Hyderabad under ₹40 lakhs near a metro"',
          '"3BHK villa in Bangalore with gym and parking under ₹1.2 crore"',
          '"Best value apartments in Pune under 60 lakhs"',
        ].map((ex, i) => (
          <p key={i} style={styles.exItem}>{ex}</p>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero: { minHeight: 'calc(100vh - 64px)', background: '#1a1a2e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' },
  heading: { fontSize: '2.5rem', marginBottom: '1rem', maxWidth: '700px' },
  sub: { fontSize: '1.1rem', color: '#ccc', marginBottom: '2rem' },
  actions: { display: 'flex', gap: '1rem', marginBottom: '3rem' },
  primaryBtn: { background: '#e94560', color: '#fff', padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem' },
  secondaryBtn: { background: 'transparent', color: '#fff', padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none', border: '2px solid #fff', fontSize: '1rem' },
  examples: { background: 'rgba(255,255,255,0.05)', padding: '1.5rem 2rem', borderRadius: '8px', maxWidth: '600px' },
  exLabel: { color: '#aaa', marginBottom: '0.5rem' },
  exItem: { color: '#e94560', fontStyle: 'italic', margin: '0.3rem 0' },
};
