import { useEffect, useState, useCallback } from 'react';
import { getAdminToken } from './adminAuth';
import { API_BASE, getImageUrl } from '../utils/api';

const API = `${API_BASE}/api/collections`;
const CAT_API = `${API_BASE}/api/categories`;

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminToken()}`
  };
}

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', description: '', categories: [] });

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(API, { headers: apiHeaders(), signal: controller.signal });
      clearTimeout(timeout);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = {}; }
      if (data.success) {
        setCollections(data.data);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Failed to fetch collections', e);
      try {
        const cached = localStorage.getItem('ktex_collections');
        if (cached) setCollections(JSON.parse(cached));
      } catch { }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(CAT_API, { headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = {}; }
      if (data.success) {
        setAllCategories(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
    fetchCategories();
  }, [fetchCollections, fetchCategories]);

  const openModal = (col = null) => {
    if (col) {
      const catIds = (col.categories || []).map(c => typeof c === 'object' ? c._id : c);
      setFormData({ name: col.name, image: col.image || '', description: col.description || '', categories: catIds });
    } else {
      setFormData({ name: '', image: '', description: '', categories: [] });
    }
    setModal(col?._id || 'new');
  };

  const closeModal = () => {
    setModal(null);
    setFormData({ name: '', image: '', description: '', categories: [] });
  };

  const toggleCategory = (catId) => {
    setFormData(prev => {
      const cats = prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId];
      return { ...prev, categories: cats };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      const url = modal === 'new' ? API : `${API}/${modal}`;
      const method = modal === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: apiHeaders(), body: JSON.stringify(formData) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      closeModal();
      localStorage.removeItem('ktex_collections_synced_at');
      localStorage.removeItem('ktex_collections');
      window.dispatchEvent(new Event('collections-updated'));
      fetchCollections();
    } catch (e) {
      alert('Save failed: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      // Clear cached collections so frontend gets fresh data
      localStorage.removeItem('ktex_collections_synced_at');
      localStorage.removeItem('ktex_collections');
      // Notify other tabs/components to refresh
      window.dispatchEvent(new Event('collections-updated'));
      fetchCollections();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Collections
          </h2>
          <p style={{ margin: '6px 0 0', color: '#666', fontSize: 13 }}>Manage collections with linked categories</p>
        </div>
        <button onClick={() => openModal()} style={btnPrimaryStyle}>+ Add Collection</button>
      </div>

      <div style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <Th>Image</Th><Th>Collection</Th><Th>Categories</Th><Th>Slug</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : collections.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>
                  No collections yet. Click "+ Add Collection" to create one.
                </td></tr>
              ) : (
                collections.map(col => (
                  <tr key={col._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: 12 }}>
                      {getImageUrl(col.image) ? (
                        <img src={getImageUrl(col.image)} alt={col.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 18 }}>📁</div>
                      )}
                    </td>
                    <td style={{ padding: 12, fontWeight: 700, color: '#d4af5a', fontSize: 14 }}>{col.name}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(col.categories || []).map(c => {
                          const catName = typeof c === 'object' ? c.name : c;
                          return (
                            <span key={typeof c === 'object' ? c._id : c} style={{
                              padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                              background: 'rgba(212,175,90,0.15)', color: '#d4af5a',
                              border: '1px solid rgba(212,175,90,0.3)',
                            }}>{catName}</span>
                          );
                        })}
                        {(!col.categories || col.categories.length === 0) && (
                          <span style={{ color: '#666', fontSize: 12 }}>No categories</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12, color: '#888', fontSize: 12 }}>{col.slug}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openModal(col)} style={actionBtn('#4da6ff')}>✏️</button>
                      <button onClick={() => handleDelete(col._id)} style={{ ...actionBtn('#ff4d4d'), marginLeft: 6 }}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={{ ...modalContent, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#d4af5a', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {modal === 'new' ? '➕ Add Collection' : '✏️ Edit Collection'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input required autoFocus type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Summer Collection" />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, width: '100%', minHeight: 60, resize: 'vertical' }} placeholder="Short description..." />
              </div>
              <div>
                <label style={labelStyle}>Image URL</label>
                <input type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="https://..." />
                {getImageUrl(formData.image) && <img src={getImageUrl(formData.image)} alt="preview" style={{ marginTop: 8, width: 80, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />}
              </div>
              <div>
                <label style={labelStyle}>Linked Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                  {allCategories.length === 0 ? (
                    <span style={{ color: '#666', fontSize: 13 }}>No categories available. Create categories first.</span>
                  ) : (
                    allCategories.map(cat => {
                      const selected = formData.categories.includes(cat._id);
                      return (
                        <label key={cat._id} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '8px 14px', borderRadius: 10,
                          border: `2px solid ${selected ? '#d4af5a' : 'rgba(255,255,255,0.1)'}`,
                          background: selected ? 'rgba(212,175,90,0.1)' : 'transparent',
                          cursor: 'pointer', transition: 'all 0.2s ease',
                          color: selected ? '#fff' : '#666',
                          fontWeight: 700, fontSize: 12,
                        }}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCategory(cat._id)}
                            style={{ accentColor: '#d4af5a' }}
                          />
                          {cat.name}
                        </label>
                      );
                    })
                  )}
                </div>
                {formData.categories.length > 0 && (
                  <p style={{ color: '#888', fontSize: 11, marginTop: 6 }}>
                    {formData.categories.length} categor{formData.categories.length === 1 ? 'y' : 'ies'} linked
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                {modal !== 'new' && (
                  <button type="button" onClick={() => { closeModal(); handleDelete(modal); }} style={{ ...btnSecondaryStyle, color: '#ff4d4d', borderColor: '#ff4d4d', marginRight: 'auto' }}>Delete</button>
                )}
                <button type="button" onClick={closeModal} style={btnSecondaryStyle}>Cancel</button>
                <button type="submit" style={btnPrimaryStyle}>💾 Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({ children }) {
  return <th style={{ textAlign: 'left', padding: '12px 16px', color: '#666', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{children}</th>;
}

const inputStyle = {
  padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
  background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff',
  fontSize: 13, fontWeight: 600, outline: 'none', boxSizing: 'border-box'
};
const btnPrimaryStyle = {
  padding: '12px 24px', borderRadius: 12, border: 'none',
  background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff',
  cursor: 'pointer', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em',
  boxShadow: '0 4px 15px rgba(212,175,90,0.3)'
};
const btnSecondaryStyle = {
  padding: '12px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)',
  background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 13
};
const actionBtn = (color) => ({
  background: 'transparent', color, border: `1px solid ${color}40`,
  padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600
});
const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
  display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)'
};
const modalContent = {
  background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
  padding: 32, borderRadius: 20, width: '100%', maxWidth: 460,
  maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212,175,42,0.3)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
};
const labelStyle = { display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 };
