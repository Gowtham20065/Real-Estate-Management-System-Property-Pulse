import React, { useState, useRef, useEffect } from 'react';
import { agentAPI } from '../services/api';

const SESSION_KEY = 're_session_' + Math.random().toString(36).slice(2);

const SUGGESTIONS = [
  '2BHK apartment in Hyderabad under ₹40 lakhs near metro',
  '3BHK villa in Bangalore with gym under ₹1.2 crore',
  'Best value flats in Pune under 60 lakhs',
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your AI real estate assistant. Tell me what you\'re looking for and I\'ll find the best properties for you.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const res = await agentAPI.chat(msg, SESSION_KEY);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>AI Property Assistant</h2>
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, ...(m.role === 'user' ? styles.userBubble : styles.aiBubble) }}>
            <strong style={styles.role}>{m.role === 'user' ? 'You' : 'AI Assistant'}</strong>
            <p style={styles.text}>{m.text}</p>
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubble, ...styles.aiBubble }}>
            <p style={styles.text}>Searching properties...</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={styles.suggestions}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} style={styles.suggestion} onClick={() => sendMessage(s)}>{s}</button>
        ))}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about properties..."
        />
        <button style={styles.sendBtn} onClick={() => sendMessage()} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' },
  heading: { color: '#1a1a2e', marginBottom: '1rem' },
  chatBox: { flex: 1, overflowY: 'auto', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  bubble: { padding: '1rem', borderRadius: '8px', maxWidth: '85%' },
  userBubble: { background: '#1a1a2e', color: '#fff', alignSelf: 'flex-end' },
  aiBubble: { background: '#fff', border: '1px solid #ddd', alignSelf: 'flex-start' },
  role: { fontSize: '0.75rem', opacity: 0.7 },
  text: { margin: '0.3rem 0 0', whiteSpace: 'pre-wrap', lineHeight: '1.5' },
  suggestions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  suggestion: { background: '#fff', border: '1px solid #e94560', color: '#e94560', padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' },
  inputRow: { display: 'flex', gap: '0.5rem' },
  input: { flex: 1, padding: '0.7rem 1rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  sendBtn: { background: '#e94560', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
};
