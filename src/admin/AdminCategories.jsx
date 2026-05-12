import { useState } from 'react';
import { categories as initialCategories } from '../data';

export default function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '', subtitle: '', image: '', tall: false
  });

  const saveCategories = (newList) => {
    setCategoriesList(newList);
    localStorage.setItem('ktex_categories', JSON.stringify(newList));
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '', subtitle: '', image: '', tall: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c) => {
    setEditingCategory(c);
    setFormData({
      name: c.name || '',
      subtitle: c.subtitle || '',
      image: c.image || '',
      tall: !!c.tall
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const newList = categoriesList.filter(c => c.id !== id);
      saveCategories(newList);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
    };

    if (editingCategory) {
      const newList = categoriesList.map(c => c.id === editingCategory.id ? { ...c, ...payload } : c);
      saveCategories(newList);
    } else {
      const newCategory = {
        ...payload,
        id: 'cat_' + Math.random().toString(36).substring(2, 9)
      };
      saveCategories([newCategory, ...categoriesList]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', padding: 24, borderRadius: 20, minHeight: '80vh', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Categories Management</h2>
        <button onClick={openAddModal} style={{ background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)', transition: 'all 0.3s ease' }}>+ Add Category</button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', minWidth: 700 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Image</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Name</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Subtitle</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Layout</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesList.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }}>
                <td style={{ padding: 14 }}><img src={c.image} alt={c.name} style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} /></td>
                <td style={{ padding: 14, fontWeight: 700, color: '#fff' }}>{c.name}</td>
                <td style={{ padding: 14, color: '#888' }}>{c.subtitle}</td>
                <td style={{ padding: 14 }}>{c.tall ? <span style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(52,152,219,0.15)', color: '#3498db', fontSize: 11, fontWeight: 700 }}>Tall (2x2)</span> : <span style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', color: '#888', fontSize: 11, fontWeight: 700 }}>Small (1x1)</span>}</td>
                <td style={{ padding: 14 }}>
                  <button onClick={() => openEditModal(c)} style={{ background: 'transparent', color: '#4da6ff', border: '1px solid #4da6ff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 8, transition: 'all 0.2s ease' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {categoriesList.length === 0 && (<tr><td colSpan="5" style={{ padding: 40, textAlign: 'center', color: '#666' }}>🏷️ No categories found.</td></tr>)}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)', padding: 32, borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212,175,42,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#d4af5a', fontSize: 22, fontWeight: 900, letterSpacing: '0.05em' }}>{editingCategory ? '✏️ Edit Category' : '➕ Add Category'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Category Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Subtitle</label><input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Image URL</label><input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} /></div>
              <div><label style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#888', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}><input type="checkbox" checked={formData.tall} onChange={e => setFormData({...formData, tall: e.target.checked})} style={{ width: 18, height: 18, accentColor: '#d4af5a' }} />Make this a Tall (2x2) Category Card</label></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '14px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Cancel</button>
                <button type="submit" style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>💾 Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
