import { useState } from 'react';
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
    <div style={{ background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', padding: 24, borderRadius: 20, minHeight: '80vh', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #d4af5a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Products Management</h2>
        <button onClick={openAddModal} style={{ background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: 13, boxShadow: '0 4px 15px rgba(212,175,90,0.3)', transition: 'all 0.3s ease' }}>+ Add Product</button>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', minWidth: 700 }}>
          <thead>
            <tr style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111 100%)' }}>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Image</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Name</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Price</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Tag</th>
              <th style={{ padding: '14px 16px', color: '#666', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }}>
                <td style={{ padding: 14 }}>
                  <img src={p.image} alt={p.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                </td>
                <td style={{ padding: 14, fontWeight: 600 }}><span style={{ color: '#fff' }}>{p.name}</span> {p.badge && <span style={{ fontSize: 10, background: p.badgeColor.startsWith('var') ? '#d4af5a' : p.badgeColor, padding: '3px 8px', borderRadius: 6, marginLeft: 8, fontWeight: 700, color: '#fff' }}>{p.badge}</span>}</td>
                <td style={{ padding: 14, fontWeight: 800, color: '#d4af5a' }}>Rs. {p.price?.toLocaleString()}</td>
                <td style={{ padding: 14 }}><span style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(212,175,42,0.15)', color: '#d4af5a', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{p.tag}</span></td>
                <td style={{ padding: 14 }}>
                  <button onClick={() => openEditModal(p)} style={{ background: 'transparent', color: '#4da6ff', border: '1px solid #4da6ff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, marginRight: 8, transition: 'all 0.2s ease' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s ease' }}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
            {productsList.length === 0 && (
              <tr><td colSpan="5" style={{ padding: 40, textAlign: 'center', color: '#666' }}>📦 No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)', padding: 32, borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(212,175,42,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#d4af5a', fontSize: 22, fontWeight: 900, letterSpacing: '0.05em' }}>{editingProduct ? '✏️ Edit Product' : '➕ Add Product'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Price (Rs.)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Old Price (Optional)</label>
                  <input type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}><span>Image {i + 1} {i === 0 ? '(Main)' : ''}</span><span>🎨</span></label>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {formData.images[i] && <img src={formData.images[i]} alt={`Img ${i + 1}`} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }} />}
                      <input type="color" value={formData.colors[i] || '#000000'} onChange={e => { const newColors = [...formData.colors]; newColors[i] = e.target.value; setFormData({...formData, colors: newColors}); }} style={{ width: 44, height: 44, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', marginLeft: 'auto' }} title={`Color for Image ${i + 1}`} />
                    </div>
                    <input required={i === 0 && !formData.images[0]} type="file" accept="image/*" onChange={e => handleImageUpload(i, e)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#888', boxSizing: 'border-box', fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Category Tag</label>
                  <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }}>
                    <option value="Men">Men</option><option value="Women">Women</option><option value="Sale">Sale</option><option value="Collections">Collections</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Badge (Optional)</label>
                  <input type="text" placeholder="NEW, HOT, SALE" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} style={{ width: '100%', padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', color: '#fff', boxSizing: 'border-box', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13, fontWeight: 600 }}>Badge Color</label>
                  <input type="color" value={formData.badgeColor.startsWith('var') ? '#d4af5a' : formData.badgeColor} onChange={e => setFormData({...formData, badgeColor: e.target.value})} style={{ width: '100%', height: 44, padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)', cursor: 'pointer', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '14px 24px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#888', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Cancel</button>
                <button type="submit" style={{ padding: '14px 28px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #d4af5a 0%, #a08040 100%)', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 13, letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(212,175,90,0.3)' }}>💾 Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
