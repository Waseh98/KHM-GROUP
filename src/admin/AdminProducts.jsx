import { useEffect, useState, useCallback } from 'react';
import { getAdminToken } from './adminAuth';

const API_PROD = '/api/products';
const API_CATS = '/api/categories';
const PAGES = ['Men', 'Women', 'Kids'];

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getAdminToken()}`
  };
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, minPrice: 0, maxPrice: 0, totalStock: 0, lowStock: 0 });

  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [subFilter, setSubFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editId, setEditId] = useState(null);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function emptyForm() {
    return {
      name: '', pageType: 'Men', subCategory: '', price: '', discountPrice: '',
      stock: '', sku: '', description: '', images: ['', '', '', ''], productStatus: 'active'
    };
  }

  const fetchSubcategories = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(API_CATS, { headers: apiHeaders(), signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success) setSubcategories(data.data);
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Failed to load subcategories', e);
      // Use cached categories from localStorage
      try {
        const cached = localStorage.getItem('ktex_categories');
        if (cached) setSubcategories(JSON.parse(cached));
      } catch { /* ignore */ }
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (pageFilter) params.set('pageType', pageFilter);
      if (subFilter) params.set('subCategory', subFilter);
      if (stockFilter) params.set('stockStatus', stockFilter);
      if (sortBy) params.set('sort', sortBy);
      params.set('page', page);
      params.set('limit', '12');
      params.set('compact', 'true');

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${API_PROD}?${params}`, { headers: apiHeaders(), signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Server ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages || 1);
        if (data.data.length > 0) {
          const prices = data.data.map(p => p.price).filter(p => p > 0);
          setStats({
            total: data.total || data.data.length,
            minPrice: prices.length ? Math.min(...prices) : 0,
            maxPrice: prices.length ? Math.max(...prices) : 0,
            totalStock: data.data.reduce((s, p) => s + (p.stock || 0), 0),
            lowStock: data.data.filter(p => p.stock > 0 && p.stock <= 5).length
          });
        } else {
          setStats({ total: 0, minPrice: 0, maxPrice: 0, totalStock: 0, lowStock: 0 });
        }
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        setError('Backend server is taking too long. Try refreshing.');
      } else {
        setError(e.message);
      }
      // Fallback: try to load from cached products in localStorage
      try {
        const cached = localStorage.getItem('ktex_products');
        if (cached && !products.length) {
          const parsed = JSON.parse(cached);
          setProducts(parsed.slice(0, 20));
          setStats({ total: parsed.length, minPrice: 0, maxPrice: 0, totalStock: 0, lowStock: 0 });
        }
      } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }, [search, pageFilter, subFilter, stockFilter, sortBy, page]);

  useEffect(() => { fetchSubcategories(); }, [fetchSubcategories]);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAddModal = () => {
    setModal('add');
    setFormData(emptyForm());
    setEditId(null);
  };

  const openEditModal = (p) => {
    setModal('edit');
    setEditId(p._id);
    const existingImages = (p.images || []).map(img => img.url || img || '').slice(0, 4);
    while (existingImages.length < 4) existingImages.push('');
    setFormData({
      name: p.name || '',
      pageType: p.pageType || p.mainCategory || 'Men',
      subCategory: p.subCategory || '',
      price: p.price || '',
      discountPrice: p.discountPrice || '',
      stock: p.stock || '',
      sku: p.sku || '',
      images: existingImages,
      description: p.description || '',
      productStatus: p.productStatus || 'active'
    });
  };

  const closeModal = () => { setModal(null); setEditId(null); setFormData(emptyForm()); setSaving(false); setError(''); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.pageType) return;
    setSaving(true);
    setError('');

    const validImages = formData.images.filter(img => img && img.trim() !== '');
    const payload = {
      name: formData.name.trim(),
      pageType: formData.pageType,
      mainCategory: formData.pageType,
      category: formData.pageType,
      subCategory: formData.subCategory || undefined,
      price: Number(formData.price) || 0,
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(formData.stock) || 0,
      sku: formData.sku || undefined,
      productStatus: formData.productStatus,
      images: validImages.map(url => ({ url })),
      description: formData.description || 'Product description'
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      let res;
      if (modal === 'edit') {
        res = await fetch(`${API_PROD}/${editId}`, { method: 'PUT', headers: apiHeaders(), body: JSON.stringify(payload), signal: controller.signal });
      } else {
        res = await fetch(API_PROD, { method: 'POST', headers: apiHeaders(), body: JSON.stringify(payload), signal: controller.signal });
      }
      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Error ${res.status}`);
      }
      setSaving(false);
      closeModal();
      // Refresh list silently — don't show fetch errors over save success
      fetchProducts().catch(() => {});
    } catch (e) {
      setSaving(false);
      if (e.name === 'AbortError') {
        setError('Save timed out. Product may still have been saved — check the list.');
      } else {
        setError(e.message);
      }
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      const res = await fetch(`${API_PROD}/${p._id}`, { method: 'DELETE', headers: apiHeaders() });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      fetchProducts();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleImageUpload = (index, file) => {
    if (!file) return;
    // Resize and compress image before base64 encoding
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_W = 400;
        const MAX_H = 533;
        let w = img.width;
        let h = img.height;
        if (w > MAX_W || h > MAX_H) {
          const ratio = Math.min(MAX_W / w, MAX_H / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        const updated = [...formData.images];
        updated[index] = compressed;
        setFormData({ ...formData, images: updated });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (index, url) => {
    const updated = [...formData.images];
    updated[index] = url;
    setFormData({ ...formData, images: updated });
  };

  const removeImage = (index) => {
    const updated = [...formData.images];
    updated[index] = '';
    setFormData({ ...formData, images: updated });
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Products Management
          </h2>
          <p style={{ margin: '6px 0 0', color: '#666', fontSize: 13 }}>{stats.total} products</p>
        </div>
        <button onClick={openAddModal} style={btnPrimaryStyle}>+ Add Product</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
        <StatCard label="Total" value={stats.total} color="#d4af5a" />
        <StatCard label="Min Price" value={`Rs. ${stats.minPrice.toLocaleString()}`} color="#2ecc71" />
        <StatCard label="Max Price" value={`Rs. ${stats.maxPrice.toLocaleString()}`} color="#e74c3c" />
        <StatCard label="Total Stock" value={stats.totalStock} color="#3498db" />
        <StatCard label="Low Stock" value={stats.lowStock} color="#f39c12" />
      </div>

      {/* Filters */}
      <div style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', padding: 14, marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <input type="text" placeholder="Search name or SKU..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ ...inputStyle, flex: '1 1 180px' }} />
        <select value={pageFilter} onChange={e => { setPageFilter(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="">All Pages</option>
          {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={subFilter} onChange={e => { setSubFilter(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="">All Subcategories</option>
          {subcategories.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
        </select>
        <select value={stockFilter} onChange={e => { setStockFilter(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={inputStyle}>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
        </select>
      </div>

      {error && <div style={{ marginBottom: 16, padding: 14, borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', fontWeight: 600, fontSize: 13 }}>{error}</div>}

      {/* Table */}
      <div style={{ background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', minWidth: 950 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <Th>Image</Th><Th>Name / SKU</Th><Th>Page</Th><Th>Subcategory</Th><Th>Price</Th><Th>Disc.</Th><Th>Stock</Th><Th>Status</Th><Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: 'center', color: '#666' }}>No products found.</td></tr>
              ) : (
                products.map(p => {
                  const ss = p.stock <= 0 ? 'out' : p.stock <= 5 ? 'low' : 'in';
                  const sc = { in: '#2ecc71', low: '#f39c12', out: '#e74c3c' };
                  const sl = { in: 'In Stock', low: 'Low Stock', out: 'Out of Stock' };
                  return (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: 10 }}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(p.images || []).slice(0, 4).map((img, i) => {
                            const src = img?.url || img || '';
                            if (!src || src.endsWith('...')) return null;
                            return (
                              <img key={i} src={src} alt={`${p.name} ${i + 1}`}
                                style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            );
                          })}
                          {(p.images || []).length === 0 && (
                            <div style={{ width: 36, height: 36, borderRadius: 6, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>📷</div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: 10 }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{p.name}</div>
                        <div style={{ color: '#666', fontSize: 10, marginTop: 2 }}>{p.sku || '—'}</div>
                      </td>
                      <td style={{ padding: 10 }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(212,175,42,0.12)', color: '#d4af5a', fontSize: 11, fontWeight: 700 }}>
                          {p.pageType || p.mainCategory || '—'}
                        </span>
                      </td>
                      <td style={{ padding: 10, color: '#aaa', fontSize: 12, fontWeight: 600 }}>{p.subCategory || '—'}</td>
                      <td style={{ padding: 10, fontWeight: 800, color: '#d4af5a', fontSize: 13 }}>Rs. {p.price?.toLocaleString()}</td>
                      <td style={{ padding: 10, color: '#888', fontSize: 12 }}>
                        {p.discountPrice > 0 ? `Rs. ${p.discountPrice.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: 10, fontWeight: 700, color: sc[ss] }}>{p.stock || 0}</td>
                      <td style={{ padding: 10 }}>
                        <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${sc[ss]}15`, color: sc[ss], border: `1px solid ${sc[ss]}30`, whiteSpace: 'nowrap' }}>
                          {sl[ss]}
                        </span>
                      </td>
                      <td style={{ padding: 10 }}>
                        <button onClick={() => openEditModal(p)} style={actionBtn('#4da6ff')}>✏️</button>
                        <button onClick={() => handleDelete(p)} style={{ ...actionBtn('#ff4d4d'), marginLeft: 4 }}>🗑️</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{ ...pageBtn, opacity: page <= 1 ? 0.4 : 1 }}>◀ Prev</button>
            <span style={{ color: '#888', fontSize: 13, fontWeight: 600 }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ ...pageBtn, opacity: page >= totalPages ? 0.4 : 1 }}>Next ▶</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={modalOverlay} onClick={closeModal}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#d4af5a', fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
              {modal === 'edit' ? '✏️ Edit Product' : '➕ Add Product'}
            </h3>
            {error && <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: '1px solid rgba(255,100,100,0.3)', background: 'rgba(255,100,100,0.1)', color: '#ff6b6b', fontWeight: 600, fontSize: 12 }}>{error}</div>}
            <form onSubmit={handleSave} style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={labelStyle}>Product Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
              </div>

              <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Page *</label>
                  <select required value={formData.pageType} onChange={e => setFormData({ ...formData, pageType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                    {PAGES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Subcategory</label>
                  <select value={formData.subCategory} onChange={e => setFormData({ ...formData, subCategory: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                    <option value="">None</option>
                    {subcategories
                      .filter(s => !formData.pageType || !s.pageTypes || s.pageTypes.length === 0 || s.pageTypes.includes(formData.pageType))
                      .map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Price (Rs.) *</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div>
                  <label style={labelStyle}>Disc. Price</label>
                  <input type="number" min="0" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div>
                  <label style={labelStyle}>Stock Qty</label>
                  <input type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                </div>
              </div>

              <div className="admin-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="Auto-generated" style={{ ...inputStyle, width: '100%' }} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={formData.productStatus} onChange={e => setFormData({ ...formData, productStatus: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Product Images (up to 4)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{
                      border: '2px dashed rgba(255,255,255,0.15)',
                      borderRadius: 12,
                      padding: 8,
                      textAlign: 'center',
                      background: img ? 'rgba(212,175,42,0.05)' : 'transparent',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}>
                      {img ? (
                        <>
                          <img src={img} alt={`Product ${idx + 1}`} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }} />
                          <button type="button" onClick={() => removeImage(idx)}
                            style={{
                              position: 'absolute', top: 12, right: 12,
                              width: 22, height: 22, borderRadius: '50%',
                              background: 'rgba(255,80,80,0.9)', color: '#fff',
                              border: 'none', cursor: 'pointer', fontSize: 12,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, lineHeight: 1,
                            }}
                          >✕</button>
                        </>
                      ) : (
                        <div style={{ aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
                          onClick={() => document.getElementById(`img-upload-${idx}`).click()}>
                          <span style={{ fontSize: 24, opacity: 0.5 }}>📷</span>
                          <span style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>Image {idx + 1}</span>
                        </div>
                      )}
                      <input
                        id={`img-upload-${idx}`}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={e => { if (e.target.files?.[0]) handleImageUpload(idx, e.target.files[0]); }}
                      />
                      <input
                        type="url"
                        value={img}
                        onChange={e => handleImageUrlChange(idx, e.target.value)}
                        placeholder="Or paste URL..."
                        style={{
                          ...inputStyle, width: '100%', marginTop: 6,
                          fontSize: 10, padding: '6px 8px', borderRadius: 8,
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={closeModal} style={btnSecondaryStyle}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...btnPrimaryStyle, opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving...' : '💾 Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 600px) {
          .admin-form-row-2,
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Th({ children }) {
  return <th style={{ textAlign: 'left', padding: '10px 14px', color: '#666', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{children}</th>;
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '12px 16px', background: 'linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(15,15,15,0.95) 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 40, height: 40, borderRadius: '50%', background: `${color}12` }} />
      <div style={{ color: '#666', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
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
  padding: '5px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600
});
const pageBtn = {
  padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
  background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 12
};
const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
  display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)'
};
const modalContent = {
  background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
  padding: 28, borderRadius: 20, width: '100%',   maxWidth: 660,
  maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212,175,42,0.3)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
};
const labelStyle = { display: 'block', marginBottom: 6, color: '#888', fontSize: 12, fontWeight: 600 };
