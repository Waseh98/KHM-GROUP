import { useEffect, useState, useCallback } from 'react';
import { getAdminToken } from './adminAuth';
import { API_BASE, getImageUrl } from '../utils/api';

const API = `${API_BASE}/api/page-subcategories`;

const PAGE_TYPES = [
  { value: 'Sale', label: '🏷️ Sale', path: '/sale' },
  { value: 'Men', label: '👔 Men', path: '/men' },
  { value: 'Women', label: '👗 Women', path: '/women' },
  { value: 'NewArrivals', label: '✨ New Arrivals', path: '/new-arrivals' },
  { value: 'Kids', label: '🧒 Kids', path: '/kids' },
];

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminToken()}`
  };
}

export default function AdminPageSubCategories() {
  const [activePage, setActivePage] = useState('Sale');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', order: 0, pageType: 'Sale' });

  const fetchItems = useCallback(async (pageType) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}?pageType=${pageType}`, { headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = {}; }
      if (data.success) setItems(data.data);
    } catch (e) {
      console.error('Failed to fetch page sub-categories', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(activePage);
  }, [activePage, fetchItems]);

  const openModal = (item = null) => {
    if (item) {
      setFormData({ name: item.name, image: item.image || '', order: item.order || 0, pageType: item.pageType });
    } else {
      setFormData({ name: '', image: '', order: 0, pageType: activePage });
    }
    setModal(item?._id || 'new');
  };

  const closeModal = () => {
    setModal(null);
    setFormData({ name: '', image: '', order: 0, pageType: activePage });
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 600, MAX_H = 600;
        let w = img.width, h = img.height;
        if (w > MAX_W || h > MAX_H) {
          const ratio = Math.min(MAX_W / w, MAX_H / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, image: compressed }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      const url = modal === 'new' ? API : `${API}/${modal}`;
      const method = modal === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, { method, headers: apiHeaders(), body: JSON.stringify({ ...formData, pageType: activePage }) });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      closeModal();
      localStorage.removeItem('ktex_page_subcategories_synced_at');
      localStorage.removeItem('ktex_page_subcategories');
      window.dispatchEvent(new CustomEvent('page-subcategories-updated', { detail: { pageType: activePage } }));
      fetchItems(activePage);
    } catch (e) {
      alert('Save failed: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sub-category?')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: apiHeaders() });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { message: text || `Server returned ${res.status}` }; }
      if (!res.ok) {
        alert('Error: ' + (data.message || `Server returned ${res.status}`));
        return;
      }
      localStorage.removeItem('ktex_page_subcategories_synced_at');
      localStorage.removeItem('ktex_page_subcategories');
      window.dispatchEvent(new CustomEvent('page-subcategories-updated', { detail: { pageType: activePage } }));
      fetchItems(activePage);
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Page Sub-Categories
          </h2>
          <p style={{ margin: '6px 0 0', color: '#666', fontSize: 13 }}>
            Add filter chips shown on each page (e.g. "Polo Sale" on the Sale page)
          </p>
        </div>
        <button onClick={() => openModal()} style={btnPrimaryStyle}>+ Add Sub-Category</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PAGE_TYPES.map(p => (
          <button key={p.value} onClick={() => setActivePage(p.value)}
            style={{
              padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 800,
              border: `2px solid ${activePage === p.value ? '#d4af5a' : 'rgba(255,255,255,0.1)'}`,
              background: activePage === p.value ? 'linear-gradient(135deg, rgba(212,175,90,0.2), rgba(212,175,90,0.05))' : 'transparent',
              color: activePage === p.value ? '#fff' : '#888',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <Th>Image</Th><Th>Name</Th><Th>Slug</Th><Th>Order</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>
                  No sub-categories yet for {activePage}. Click "+ Add Sub-Category" to create one.
                </td></tr>
              ) : (
                items.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: 12 }}>
                      {getImageUrl(item.image) ? (
                        <img src={getImageUrl(item.image)} alt={item.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 18 }}>🏷️</div>
                      )}
                    </td>
                    <td style={{ padding: 12, fontWeight: 700, color: '#d4af5a', fontSize: 14 }}>{item.name}</td>
                    <td style={{ padding: 12, color: '#888', fontSize: 12 }}>{item.slug}</td>
                    <td style={{ padding: 12, color: '#888', fontSize: 12 }}>{item.order}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => openModal(item)} style={actionBtn('#4da6ff')}>✏️</button>
                      <button onClick={() => handleDelete(item._id)} style={{ ...actionBtn('#ff4d4d'), marginLeft: 6 }}>🗑️</button>
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
          <div style={{ ...modalContent, maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#d4af5a', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {modal === 'new' ? `➕ Add Sub-Category to ${activePage}` : `✏️ Edit Sub-Category`}
            </h3>
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input required autoFocus type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} placeholder="e.g. Polo Sale, T-Shirt Sale" />
              </div>
              <div>
                <label style={labelStyle}>Image (optional)</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="url"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    style={{ ...inputStyle, flex: 1, width: '100%' }}
                    placeholder="Paste image URL or upload below"
                  />
                  <input
                    id="page-subcat-image-upload"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); e.target.value = ''; }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('page-subcat-image-upload').click()}
                    style={{
                      padding: '12px 16px', borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
                      color: '#d4af5a', cursor: 'pointer',
                      fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap',
                    }}
                  >
                    📤 Upload
                  </button>
                </div>
                {getImageUrl(formData.image) && (
                  <div style={{ marginTop: 8, position: 'relative', display: 'inline-block' }}>
                    <img src={getImageUrl(formData.image)} alt="preview" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(255,80,80,0.9)', color: '#fff',
                        border: 'none', cursor: 'pointer', fontSize: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, lineHeight: 1,
                      }}
                    >✕</button>
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} style={{ ...inputStyle, width: '100%' }} placeholder="0" />
                <p style={{ color: '#666', fontSize: 11, marginTop: 6 }}>Lower numbers appear first</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
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
