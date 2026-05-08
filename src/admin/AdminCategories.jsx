import React, { useState } from 'react';
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
    <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", color: '#fff' }}>Categories Management</h2>
        <button 
          onClick={openAddModal}
          style={{
            backgroundColor: 'var(--gold)', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
          }}
        >
          + Add Category
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Subtitle</th>
              <th style={{ padding: '12px' }}>Layout Type</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categoriesList.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px' }}>
                  <img src={c.image} alt={c.name} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '12px', fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '12px', color: '#aaa' }}>{c.subtitle}</td>
                <td style={{ padding: '12px' }}>{c.tall ? <span style={{ color: '#4da6ff' }}>Tall (2x2)</span> : <span style={{ color: '#ccc' }}>Small (1x1)</span>}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => openEditModal(c)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {categoriesList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a', padding: '32px', borderRadius: '12px',
            width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid #333'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Category Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Image URL</label>
                <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ccc', fontSize: '14px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.tall} onChange={e => setFormData({...formData, tall: e.target.checked})} />
                  Make this a Tall (2x2) Category Card
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--gold)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
