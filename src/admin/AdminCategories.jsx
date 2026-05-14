import { useState } from 'react';
import { categories as initialCategories } from '../data';

export default function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [tab, setTab] = useState('parents'); // 'parents' or 'subs'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  const [formData, setFormData] = useState({ name: '', subtitle: '', image: '', tall: false });
  const [subForm, setSubForm] = useState({ name: '', parentId: '', image: '' });
  const subFileRef = useState(null);

  const saveCategories = (newList) => {
    setCategoriesList(newList);
    localStorage.setItem('ktex_categories', JSON.stringify(newList));
  };

  // ── Parent Category CRUD ──
  const openAddParent = () => {
    setEditingCategory(null);
    setFormData({ name: '', subtitle: '', image: '', tall: false });
    setIsModalOpen(true);
  };

  const openEditParent = (c) => {
    setEditingCategory(c);
    setFormData({ name: c.name || '', subtitle: c.subtitle || '', image: c.image || '', tall: !!c.tall });
    setIsModalOpen(true);
  };

  const handleDeleteParent = (id) => {
    if (window.confirm("Delete this category and ALL its sub-categories?")) {
      saveCategories(categoriesList.filter(c => c.id !== id));
    }
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      saveCategories(categoriesList.map(c => c.id === editingCategory.id ? { ...c, ...formData, subcategories: c.subcategories || [] } : c));
    } else {
      saveCategories([{ ...formData, id: 'cat_' + Math.random().toString(36).substring(2, 9), subcategories: [] }, ...categoriesList]);
    }
    setIsModalOpen(false);
  };

  // ── Sub-Category CRUD ──
  const getAllSubs = () => {
    const subs = [];
    for (const cat of categoriesList) {
      for (const sub of (cat.subcategories || [])) {
        subs.push({ ...sub, parentName: cat.name, parentId: cat.id });
      }
    }
    return subs;
  };

  const openAddSub = () => {
    setEditingSub(null);
    setSubForm({ name: '', parentId: categoriesList[0]?.id || '', image: '' });
    setIsSubModalOpen(true);
  };

  const openEditSub = (sub) => {
    setEditingSub(sub);
    setSubForm({ name: sub.name, parentId: sub.parentId, image: sub.image || '' });
    setIsSubModalOpen(true);
  };

  const handleSubImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const MAX = 400;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        setSubForm(prev => ({ ...prev, image: canvas.toDataURL('image/jpeg', 0.6) }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubSave = () => {
    if (!subForm.name.trim() || !subForm.parentId) return;

    if (editingSub) {
      // Remove from old parent, add to new (or same) parent
      const newList = categoriesList.map(c => {
        let subs = (c.subcategories || []).filter(s => s.id !== editingSub.id);
        if (c.id === subForm.parentId) {
        subs = [...subs, { id: editingSub.id, name: subForm.name.trim(), image: subForm.image || '' }];
      }
      return { ...c, subcategories: subs };
    });
    saveCategories(newList);
  } else {
    saveCategories(categoriesList.map(c => {
      if (c.id !== subForm.parentId) return c;
      return { ...c, subcategories: [...(c.subcategories || []), { id: 'sub_' + Math.random().toString(36).substring(2, 9), name: subForm.name.trim(), image: subForm.image || '' }] };
      }));
    }
    setIsSubModalOpen(false);
  };

  const handleSubDelete = (sub) => {
    if (window.confirm(`Delete sub-category "${sub.name}"?`)) {
      saveCategories(categoriesList.map(c => ({
        ...c,
        subcategories: (c.subcategories || []).filter(s => s.id !== sub.id)
      })));
    }
  };

  const allSubs = getAllSubs();

  return (
    <div style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', padding: 24, borderRadius: 20, minHeight: '80vh', border: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Header + Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Categories Management
          </h2>
          <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
            <button
              onClick={() => setTab('parents')}
              style={{
                padding: '8px 20px', borderRadius: '8px 0 0 8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: tab === 'parents' ? 'rgba(212,175,90,0.15)' : 'transparent',
                color: tab === 'parents' ? '#d4af5a' : '#666',
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              Parent Categories ({categoriesList.length})
            </button>
            <button
              onClick={() => setTab('subs')}
              style={{
                padding: '8px 20px', borderRadius: '0 8px 8px 0',
                border: '1px solid rgba(255,255,255,0.1)',
                background: tab === 'subs' ? 'rgba(212,175,90,0.15)' : 'transparent',
                color: tab === 'subs' ? '#d4af5a' : '#666',
                fontWeight: 700, fontSize: 12, cursor: 'pointer',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                transition: 'all 0.2s ease',
              }}
            >
              Sub-Categories ({allSubs.length})
            </button>
          </div>
        </div>
        {tab === 'parents' ? (
          <button onClick={openAddParent} style={{ background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>+ Add Category</button>
        ) : (
          <button onClick={openAddSub} style={{ background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>+ Add Sub-Category</button>
        )}
      </div>

      {/* ── PARENT CATEGORIES TABLE ── */}
      {tab === 'parents' && (
        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Image</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Name</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Subtitle</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Sub-Categories</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoriesList.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 14 }}>
                    <img src={c.image} alt={c.name} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                  </td>
                  <td style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{c.name}</div>
                    {c.tall && <span style={{ fontSize: 10, color: '#3498db', background: 'rgba(52,152,219,0.12)', padding: '2px 8px', borderRadius: 8 }}>Tall</span>}
                  </td>
                  <td style={{ padding: 14, color: '#888', fontSize: 12 }}>{c.subtitle}</td>
                  <td style={{ padding: 14 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {(c.subcategories || []).map(s => (
                        <span key={s.id} style={{ padding: '4px 10px', background: 'rgba(212,175,42,0.1)', color: '#d4af5a', borderRadius: 12, fontSize: 11, fontWeight: 600 }}>{s.name}</span>
                      ))}
                      {(!c.subcategories || c.subcategories.length === 0) && (
                        <span style={{ color: '#555', fontSize: 11, fontStyle: 'italic' }}>No sub-categories</span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: 14 }}>
                    <button onClick={() => openEditParent(c)} style={{ background: 'transparent', color: '#4da6ff', border: '1px solid #4da6ff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 8 }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteParent(c.id)} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              {categoriesList.length === 0 && <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center', color: '#666' }}>No categories yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* ── SUB-CATEGORIES TABLE ── */}
      {tab === 'subs' && (
        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Image</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Sub-Category Name</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Belongs To</th>
                <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allSubs.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 14 }}>
                    {sub.image ? (
                      <img src={sub.image} alt={sub.name} style={{ width: 50, height: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />
                    ) : (
                      <div style={{ width: 50, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', fontSize: 10 }}>No img</div>
                    )}
                  </td>
                  <td style={{ padding: 14, fontWeight: 600, color: '#d4af5a', fontSize: 14 }}>{sub.name}</td>
                  <td style={{ padding: 14 }}>
                    <span style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: '#aaa', fontSize: 12, fontWeight: 600 }}>{sub.parentName}</span>
                  </td>
                  <td style={{ padding: 14 }}>
                    <button onClick={() => openEditSub(sub)} style={{ background: 'transparent', color: '#4da6ff', border: '1px solid #4da6ff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 8 }}>✏️ Edit</button>
                    <button onClick={() => handleSubDelete(sub)} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
              {allSubs.length === 0 && <tr><td colSpan="4" style={{ padding: 40, textAlign: 'center', color: '#666' }}>No sub-categories yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Parent Category Modal ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)', padding: 32, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212,175,42,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#d4af5a', fontSize: 22, fontWeight: 900 }}>{editingCategory ? '✏️ Edit Category' : '➕ Add Category'}</h3>
            <form onSubmit={handleParentSubmit} style={{ display: 'grid', gap: 18 }}>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Subtitle</label><input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Image URL</label><input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#888', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><input type="checkbox" checked={formData.tall} onChange={e => setFormData({...formData, tall: e.target.checked})} style={{ width: 18, height: 18, accentColor: '#d4af5a' }} />Tall (2x2) Card</label></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '14px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Cancel</button>
                <button type="submit" style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>💾 Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sub-Category Modal ── */}
      {isSubModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)', padding: 28, borderRadius: 20, width: '100%', maxWidth: 420, border: '1px solid rgba(212,175,42,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#d4af5a', fontSize: 19, fontWeight: 900 }}>{editingSub ? '✏️ Edit Sub-Category' : '➕ Add Sub-Category'}</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Sub-Category Name</label>
              <input autoFocus type="text" value={subForm.name} onChange={e => setSubForm({...subForm, name: e.target.value})} onKeyDown={e => { if (e.key === 'Enter') handleSubSave(); }} placeholder="e.g. Polo Shirts, Tops..." style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {subForm.image && <img src={subForm.image} alt="Preview" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />}
                <input type="file" accept="image/*" onChange={handleSubImageUpload} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#888', fontSize: 12 }} />
              </div>
              <input type="url" value={subForm.image} onChange={e => setSubForm({...subForm, image: e.target.value})} placeholder="Or paste image URL..." style={{ width: '100%', marginTop: 8, padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 13 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Belongs To (Parent Category)</label>
              <select value={subForm.parentId} onChange={e => setSubForm({...subForm, parentId: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: '#0d0d0d', color: '#fff', boxSizing: 'border-box', fontSize: 14 }}>
                {categoriesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setIsSubModalOpen(false)} style={{ padding: '12px 22px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Cancel</button>
              <button onClick={handleSubSave} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>{editingSub ? '💾 Update' : '💾 Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
