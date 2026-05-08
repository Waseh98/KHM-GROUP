import React, { useState, useEffect } from 'react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    try {
      const data = JSON.parse(localStorage.getItem('ktex_messages') || '[]');
      setMessages(data);
    } catch (e) {
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 34 }}>Messages</h1>
          <p style={{ margin: '6px 0 0', color: '#c9c6bf' }}>Customer inquiries from the Contact Us page.</p>
        </div>
      </div>

      <div style={{ border: '1px solid #1f1f1f', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ background: '#0d0d0d', padding: '12px 16px', borderBottom: '1px solid #1f1f1f', color: '#c9c6bf', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 12, display: 'flex', justifyContent: 'space-between' }}>
          <span>{messages.length} Messages</span>
        </div>

        {messages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#c9c6bf' }}>
            📬 No messages found. When customers use the contact form, their messages will appear here.
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto', background: '#0b0b0b' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 860 }}>
              <thead>
                <tr style={{ background: '#0b0b0b' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Sender</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Subject</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Message</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#c9c6bf', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid #1f1f1f', fontWeight: 900, whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(msg => (
                  <tr key={msg.id} style={{ borderTop: '1px solid #1f1f1f', backgroundColor: msg.status === 'unread' ? 'rgba(184,151,42,0.05)' : 'transparent' }}>
                    <td style={{ padding: '12px', color: '#c9c6bf', fontSize: 12, verticalAlign: 'top' }}>
                      {new Date(msg.date).toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '12px', color: '#fff', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 800 }}>{msg.name}</div>
                      <div style={{ color: '#c9c6bf', fontSize: 12 }}><a href={`mailto:${msg.email}`} style={{ color: '#4da6ff' }}>{msg.email}</a></div>
                      {msg.phone && <div style={{ color: '#c9c6bf', fontSize: 12 }}>{msg.phone}</div>}
                    </td>
                    <td style={{ padding: '12px', color: '#fff', verticalAlign: 'top', fontWeight: msg.status === 'unread' ? 700 : 400 }}>
                      {msg.subject}
                    </td>
                    <td style={{ padding: '12px', color: '#c9c6bf', verticalAlign: 'top', fontSize: 13, maxWidth: 300 }}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#fff', verticalAlign: 'top' }}>
                      <span style={{ 
                        padding: '4px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                        backgroundColor: msg.status === 'unread' ? 'rgba(184,151,42,0.2)' : 'rgba(255,255,255,0.1)',
                        color: msg.status === 'unread' ? '#d4af5a' : '#c9c6bf'
                      }}>
                        {msg.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {msg.status === 'unread' && (
                          <button onClick={() => markAsRead(msg.id)} style={{ color: '#4da6ff', border: '1px solid #4da6ff', background: 'transparent', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Mark Read</button>
                        )}
                        <button onClick={() => deleteMessage(msg.id)} style={{ color: '#ff4d4d', border: '1px solid #ff4d4d', background: 'transparent', padding: '4px 8px', borderRadius: 4, fontSize: 11, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
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
