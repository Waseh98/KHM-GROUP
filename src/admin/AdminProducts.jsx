import React, { useState } from 'react';
import { getProducts } from '../data';

export default function AdminProducts() {
  const [productsList, setProductsList] = useState(() => getProducts());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', price: '', oldPrice: '', discount: '',
    images: ['', '', '', ''], 
    colors: ['#000000', '#ffffff', '#ff0000', '#0000ff'],
    tag: 'Men', badge: '', badgeColor: '#000000'
  });

  const saveProducts = (newList) => {
    try {
      localStorage.setItem('ktex_products', JSON.stringify(newList));
      setProductsList(newList);
    } catch (e) {
      alert("Error saving! The images might be too large. Try uploading smaller images.");
      console.error("Storage error:", e);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '', price: '', oldPrice: '', discount: '',
      images: ['', '', '', ''], 
      colors: ['#000000', '#ffffff', '#ff0000', '#0000ff'],
      tag: 'Men', badge: '', badgeColor: '#000000'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      price: p.price || '',
      oldPrice: p.oldPrice || '',
      discount: p.discount || '',
      images: p.images || [p.image || '', '', '', ''],
      colors: p.colors || ['#000000', '#ffffff', '#ff0000', '#0000ff'],
      tag: p.tag || 'Men',
      badge: p.badge || '',
      badgeColor: p.badgeColor || '#000000'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const newList = productsList.filter(p => p.id !== id);
      saveProducts(newList);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      image: formData.images[0], // fallback for main image
      price: Number(formData.price),
      oldPrice: Number(formData.oldPrice) || undefined,
      discount: Number(formData.discount) || undefined,
      colors: formData.colors, // use selected colors
      colorCount: formData.colors.filter((c, i) => formData.images[i] !== '').length || 1
    };

    if (editingProduct) {
      const newList = productsList.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p);
      saveProducts(newList);
    } else {
      const newProduct = {
        ...payload,
        id: [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') // valid 24-char hex ObjectId
      };
      saveProducts([newProduct, ...productsList]);
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_DIM = 600; // Resize to max 600px to save space
          
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => {
            const newImg = [...prev.images];
            newImg[index] = dataUrl;
            return { ...prev, images: newImg };
          });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: '#111', padding: '24px', borderRadius: '12px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", color: '#fff' }}>Products Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={openAddModal}
            style={{
              backgroundColor: 'var(--gold)', color: '#fff', border: 'none',
              padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <th style={{ padding: '12px' }}>Image</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Price</th>
              <th style={{ padding: '12px' }}>Tag</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '12px', fontWeight: 500 }}>{p.name} {p.badge && <span style={{ fontSize: '10px', backgroundColor: p.badgeColor, padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>{p.badge}</span>}</td>
                <td style={{ padding: '12px' }}>Rs. {p.price?.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>{p.tag}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => openEditModal(p)} style={{ background: 'transparent', color: '#4da6ff', border: 'none', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', color: '#ff4d4d', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
            {productsList.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No products found.</td>
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
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            border: '1px solid #333'
          }}>
            <h3 style={{ marginTop: 0, color: '#fff' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Price (Rs.)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Old Price (Optional)</label>
                  <input type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>
                      <span>Image {i + 1} {i === 0 ? '(Main)' : '(Optional)'}</span>
                      <span>Color Picker</span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {formData.images[i] && <img src={formData.images[i]} alt={`Img ${i + 1}`} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                      <input 
                        type="color" 
                        value={formData.colors[i] || '#000000'} 
                        onChange={e => {
                          const newColors = [...formData.colors];
                          newColors[i] = e.target.value;
                          setFormData({...formData, colors: newColors});
                        }} 
                        style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }} 
                        title={`Select color for Image ${i + 1}`} 
                      />
                    </div>
                    <input required={i === 0 && !formData.images[0]} type="file" accept="image/*" onChange={e => handleImageUpload(i, e)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Category Tag</label>
                  <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Sale">Sale</option>
                    <option value="Collections">Collections</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Badge (Optional)</label>
                  <input type="text" placeholder="e.g. NEW, HOT, SALE" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', color: '#fff', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontSize: '14px' }}>Badge Color</label>
                  <input type="color" value={formData.badgeColor.startsWith('var') ? '#000000' : formData.badgeColor} onChange={e => setFormData({...formData, badgeColor: e.target.value})} style={{ width: '100%', height: '38px', padding: '2px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0d0d0d', cursor: 'pointer', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #444', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--gold)', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
