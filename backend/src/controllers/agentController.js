const { runAgent } = require('../agent/agent');

// In-memory chat history per session (keyed by userId or sessionId)
const sessions = new Map();

exports.chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const key = sessionId || req.user?.id || 'anonymous';
    const history = sessions.get(key) || [];

    const reply = await runAgent(message, history);

    // Keep last 10 turns in history
    history.push({ role: 'human', content: message });
    history.push({ role: 'ai', content: reply });
    sessions.set(key, history.slice(-20));

    res.json({ reply, sessionId: key });
  } catch (err) {
    console.error('Agent error:', err.message);
    res.status(500).json({ message: 'Agent failed', error: err.message });
  }
};

exports.clearHistory = (req, res) => {
  const key = req.params.sessionId || req.user?.id;
  sessions.delete(key);
  res.json({ message: 'Conversation cleared' });
};
