import { useState, useEffect } from 'react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    try {
      const data = JSON.parse(localStorage.getItem('ktex_messages') || '[]');
      setMessages(data);
    } catch {
      setMessages([]);
    }
  };

  const markAsRead = (id) => {
    const updated = messages.map(msg => 
      msg.id === id ? { ...msg, status: 'read' } : msg
    );
    setMessages(updated);
    localStorage.setItem('ktex_messages', JSON.stringify(updated));
  };

  const deleteMessage = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter(msg => msg.id !== id);
      setMessages(updated);
      localStorage.setItem('ktex_messages', JSON.stringify(updated));
    }
  };

  useEffect(() => { loadMessages(); }, []);

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Messages</h1>
          <p style={{ margin: '8px 0 0', color: '#888', fontSize: 'clamp(12px, 2vw, 14px)' }}>Customer inquiries from the Contact Us page.</p>
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#888', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span>💬 {messages.length} Messages</span>
        </div>

        {messages.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>📭 No messages found. When customers use the contact form, their messages will appear here.</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <Th>Date</Th><Th>Sender</Th><Th>Subject</Th><Th>Message</Th><Th>Status</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: msg.status === 'unread' ? 'rgba(212,175,42,0.03)' : 'transparent' }}>
                    <Td>{new Date(msg.date).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</Td>
                    <Td>
                      <div style={{ fontWeight: 800, color: '#fff' }}>{msg.name}</div>
                      <div style={{ color: '#666', fontSize: 12 }}><a href={`mailto:${msg.email}`} style={{ color: '#4da6ff' }}>{msg.email}</a></div>
                      {msg.phone && <div style={{ color: '#666', fontSize: 12 }}>{msg.phone}</div>}
                    </Td>
                    <Td style={{ fontWeight: msg.status === 'unread' ? 700 : 400, color: '#fff' }}>{msg.subject}</Td>
                    <Td style={{ color: '#888', fontSize: 13, maxWidth: 300 }}><div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div></Td>
                    <Td><span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', backgroundColor: msg.status === 'unread' ? 'rgba(212,175,42,0.2)' : 'rgba(255,255,255,0.08)', color: msg.status === 'unread' ? '#d4af5a' : '#888' }}>{msg.status}</span></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {msg.status === 'unread' && (<button onClick={() => markAsRead(msg.id)} style={{ color: '#4da6ff', border: '1px solid #4da6ff', background: 'transparent', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✓ Mark Read</button>)}
                        <button onClick={() => deleteMessage(msg.id)} style={{ color: '#ff4d4d', border: '1px solid #ff4d4d', background: 'transparent', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>🗑️ Delete</button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th style={{ textAlign: 'left', padding: '14px 16px', color: '#666', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 800, whiteSpace: 'nowrap' }}>{children}</th>;
}
function Td({ children, style }) {
  return <td style={{ padding: '14px 16px', color: '#fff', verticalAlign: 'top', ...style }}>{children}</td>;
}
