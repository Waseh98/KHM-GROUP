import { useEffect, useState, useCallback } from 'react';
import { getAdminToken } from './adminAuth';
import { API_BASE, getImageUrl } from '../utils/api';
import { UPLOAD_FOLDERS } from '../utils/upload';
import ImageUploadField from '../components/ImageUploadField';

const API = `${API_BASE}/api/categories`;

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminToken()}`
  };
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', pageTypes: ['Men'] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
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
        setCategories(data.data);
      } else {
        console.error('Fetch categories failed:', data.message || `Status ${res.status}`);
      }
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Failed to fetch categories', e);
      // Fallback to cached
      try {
        const cached = localStorage.getItem('ktex_categories');
        if (cached) setCategories(JSON.parse(cached));
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openModal = (cat = null) => {
    setFormData(cat
      ? { name: cat.name, image: cat.image || '', pageTypes: cat.pageTypes || ['Men'] }
      : { name: '', image: '', pageTypes: ['Men'] }
    );
    setModal(cat?._id || 'new');
  };

  const closeModal = () => {
    setModal(null);
    setFormData({ name: '', image: '', pageTypes: ['Men'] });
    setSaving(false);
    setError('');
  };

  const togglePageType = (page) => {
    setFormData(prev => {
      const types = prev.pageTypes.includes(page)
        ? prev.pageTypes.filter(p => p !== page)
        : [...prev.pageTypes, page];
      return { ...prev, pageTypes: types };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (formData.image?.startsWith('data:image/')) {
      setError('Please wait for the image upload to finish before saving.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const url = modal === 'new' ? API : `${API}/${modal}`;
      const method = modal === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: apiHeaders(), body: JSON.stringify(formData) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        setError(data.message || `Server returned ${res.status}`);
        return;
      }
      closeModal();
      localStorage.removeItem('ktex_categories_synced_at');
      localStorage.removeItem('ktex_categories');
      window.dispatchEvent(new Event('categories-updated'));
      fetchCategories();
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      // Clear cached categories so frontend gets fresh data
      localStorage.removeItem('ktex_categories_synced_at');
      localStorage.removeItem('ktex_categories');
      // Notify other tabs/components to refresh
      window.dispatchEvent(new Event('categories-updated'));
      fetchCategories();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('Seed default subcategories?')) return;
    try {
      const res = await fetch(`${API}/seed`, { headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      alert(data.message || 'Done');
      fetchCategories();
    } catch (e) {
      alert('Seed failed: ' + e.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Subcategories
          </h2>
          <p style={{ margin: '6px 0 0', color: '#666', fontSize: 13 }}>Subcategories work across all pages (Men, Women, Kids)</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSeed} style={{ ...btnSecondaryStyle, borderColor: 'rgba(77,166,255,0.4)', color: '#4da6ff' }}>🌱 Seed Defaults</button>
          <button onClick={() => openModal()} style={btnPrimaryStyle}>+ Add Subcategory</button>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <Th>Image</Th><Th>Subcategory</Th><Th>Pages</Th><Th>Slug</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>
                  No subcategories yet. <button onClick={handleSeed} style={{ background: 'transparent', color: '#d4af5a', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Seed defaults</button>
                </td></tr>
              ) : (
                categories.map(c => (
                  <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: 12 }}>
                      {getImageUrl(c.image) ? <img src={getImageUrl(c.image)} alt={c.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} /> : <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 18 }}>🏷️</div>}
                    </td>
                    <td style={{ padding: 12, fontWeight: 700, color: '#d4af5a', fontSize: 14 }}>{c.name}</td>
                    <td style={{ padding: 12, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {(c.pageTypes || ['Men']).map(pt => (
                        <span key={pt} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                          background: pt === 'Men' ? 'rgba(77,166,255,0.15)' : pt === 'Women' ? 'rgba(255,105,180,0.15)' : 'rgba(46,204,113,0.15)',
                          color: pt === 'Men' ? '#4da6ff' : pt === 'Women' ? '#ff69b4' : '#2ecc71',
                          border: `1px solid ${pt === 'Men' ? 'rgba(77,166,255,0.3)' : pt === 'Women' ? 'rgba(255,105,180,0.3)' : 'rgba(46,204,113,0.3)'}`,
                        }}>{pt}</span>
                      ))}
                    </td>
                    <td style={{ padding: 12, color: '#888', fontSize: 12 }}>{c.slug}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openModal(c)} style={actionBtn('#4da6ff')}>✏️</button>
                      <button onClick={() => handleDelete(c._id)} style={{ ...actionBtn('#ff4d4d'), marginLeft: 6 }}>🗑️</button>
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
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#d4af5a', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {modal === 'new' ? '➕ Add Subcategory' : '✏️ Edit Subcategory'}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input required autoFocus type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Polo, T-Shirts..." />
              </div>
              <div>
                <label style={labelStyle}>Assign to Pages</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['Men', 'Women', 'Kids'].map(page => (
                    <label key={page} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px', borderRadius: 12,
                      border: `2px solid ${formData.pageTypes.includes(page) ? '#d4af5a' : 'rgba(255,255,255,0.1)'}`,
                      background: formData.pageTypes.includes(page) ? 'rgba(212,175,90,0.1)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      color: formData.pageTypes.includes(page) ? '#fff' : '#666',
                      fontWeight: 700, fontSize: 13,
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.pageTypes.includes(page)}
                        onChange={() => togglePageType(page)}
                        style={{ accentColor: '#d4af5a' }}
                      />
                      {page}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <ImageUploadField
                  label="Category Image (optional)"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder={UPLOAD_FOLDERS.categories}
                  token={getAdminToken()}
                  previewHeight={100}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                {modal !== 'new' && (
                  <button type="button" onClick={() => { closeModal(); handleDelete(modal); }} style={{ ...btnSecondaryStyle, color: '#ff4d4d', borderColor: '#ff4d4d', marginRight: 'auto' }}>Delete</button>
                )}
                <button type="button" onClick={closeModal} style={btnSecondaryStyle}>Cancel</button>
                {error && <p style={{ color: '#ff6b6b', fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>}
                <button type="submit" disabled={saving} style={{ ...btnPrimaryStyle, opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving...' : '💾 Save'}
                </button>
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
