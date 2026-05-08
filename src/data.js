const defaultProducts = [
  {
    id: "650000000000000000000001", name: "Classic Piqué Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#1a1a2e","#2d6a4f","#fff"],
    price: 2990, oldPrice: 3990, discount: 25,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000002", name: "Signature Striped Polo", badge: "HOT", badgeColor: "#e67e22",
    colors: ["var(--gold)","#fff","var(--black)"],
    price: 3490, oldPrice: 4490, discount: 22,
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000003", name: "Women's Slim Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#f5cba7","#d7bde2","#a9cce3"],
    price: 2490, oldPrice: 2990, discount: 17,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000004", name: "Summer Linen Polo", badge: "SALE", badgeColor: "var(--gold)",
    colors: ["#f0e6d3","#7fb3d3","#a8d5a2"],
    price: 1990, oldPrice: 3290, discount: 39,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    tag: "Sale", colorCount: 3
  },
  {
    id: "650000000000000000000005", name: "Corporate Classic Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#1a1a2e","#34495e","#7f8c8d"],
    price: 3990, oldPrice: 4990, discount: 20,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000006", name: "Women's Fitted Polo", badge: "HOT", badgeColor: "#e67e22",
    colors: ["var(--gold)","#2c3e50","#f5f5f5"],
    price: 2790, oldPrice: 3490, discount: 20,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000007", name: "Golf Edition Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#27ae60","#fff","#2c3e50"],
    price: 4490, oldPrice: 5990, discount: 25,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000008", name: "Premium Piqué Polo", badge: "SALE", badgeColor: "var(--gold)",
    colors: ["#8e44ad","#3498db","#e74c3c"],
    price: 2290, oldPrice: 3990, discount: 43,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    tag: "Sale", colorCount: 3
  },
];

const defaultCategories = [
  {
    id: "cat_001", name: "Classic Polo", subtitle: "Timeless essentials",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80", tall: true
  },
  {
    id: "cat_002", name: "Premium Piqué", subtitle: "Texture & refinement",
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80"
  },
  {
    id: "cat_003", name: "Corporate Wear", subtitle: "Office-ready looks",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80"
  },
  {
    id: "cat_004", name: "Summer Collection", subtitle: "Light & breathable",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80"
  },
  {
    id: "cat_005", name: "Golf Edition", subtitle: "Performance & style",
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80"
  },
];

export const getProducts = () => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('ktex_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse products from localStorage', e);
    }
  }
  return defaultProducts;
};

export const products = getProducts();

export const categories = (() => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('ktex_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse categories from localStorage', e);
    }
  }
  return defaultCategories;
})();
