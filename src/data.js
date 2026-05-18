const defaultProducts = [
  // Classic Polo - Men
  {
    id: "650000000000000000000001", name: "Classic Piqué Polo - Navy", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#1a1a2e","#2d6a4f","#fff"],
    price: 2990, oldPrice: 3990, discount: 25,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000002", name: "Classic Piqué Polo - White", badge: "HOT", badgeColor: "#e67e22",
    colors: ["var(--gold)","#fff","var(--black)"],
    price: 2990, oldPrice: 3990, discount: 25,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000003", name: "Classic Piqué Polo - Black", badge: "", badgeColor: "var(--black)",
    colors: ["#000","#fff","#1a1a2e"],
    price: 2990, oldPrice: 3990, discount: 25,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // Premium Piqué - Men
  {
    id: "650000000000000000000004", name: "Signature Striped Polo", badge: "HOT", badgeColor: "#e67e22",
    colors: ["var(--gold)","#fff","var(--black)"],
    price: 3490, oldPrice: 4490, discount: 22,
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000005", name: "Premium Mesh Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#2c3e50","#3498db","#fff"],
    price: 3990, oldPrice: 4990, discount: 20,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000006", name: "Luxury Cotton Polo", badge: "PREMIUM", badgeColor: "var(--gold)",
    colors: ["#8e44ad","#27ae60","#fff"],
    price: 4490, oldPrice: 5990, discount: 25,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // Corporate Wear - Men
  {
    id: "650000000000000000000007", name: "Corporate Classic Polo", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#1a1a2e","#34495e","#7f8c8d"],
    price: 3990, oldPrice: 4990, discount: 20,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000008", name: "Executive Polo - White", badge: "", badgeColor: "var(--black)",
    colors: ["#fff","#1a1a2e","#7f8c8d"],
    price: 3990, oldPrice: 4990, discount: 20,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000009", name: "Business Casual Polo", badge: "OFFICE", badgeColor: "#2c3e50",
    colors: ["#34495e","#fff","#1a1a2e"],
    price: 3490, oldPrice: 4490, discount: 22,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // Summer Collection - Men & Women
  {
    id: "650000000000000000000010", name: "Summer Linen Polo - Blue", badge: "SALE", badgeColor: "var(--gold)",
    colors: ["#5dade2","#fff","#f8f9fa"],
    price: 1990, oldPrice: 3290, discount: 39,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000011", name: "Summer Linen Polo - White", badge: "SUMMER", badgeColor: "#27ae60",
    colors: ["#fff","#f8f9fa","#5dade2"],
    price: 1990, oldPrice: 3290, discount: 39,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000012", name: "Breathable Mesh Polo", badge: "COOL", badgeColor: "#3498db",
    colors: ["#fff","#5dade2","#f8f9fa"],
    price: 2490, oldPrice: 3490, discount: 29,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // Golf Edition - Men
  {
    id: "650000000000000000000013", name: "Golf Edition Polo - Green", badge: "GOLF", badgeColor: "#27ae60",
    colors: ["#27ae60","#fff","#2c3e50"],
    price: 4490, oldPrice: 5990, discount: 25,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000014", name: "Golf Performance Polo", badge: "SPORT", badgeColor: "#2980b9",
    colors: ["#2980b9","#fff","#1a1a2e"],
    price: 4990, oldPrice: 6490, discount: 23,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000015", name: "Pro Golf Polo", badge: "PRO", badgeColor: "var(--black)",
    colors: ["#000","#fff","#27ae60"],
    price: 5490, oldPrice: 6990, discount: 21,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // Women's Collection
  {
    id: "650000000000000000000016", name: "Women's Slim Polo - Pink", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#f5cba7","#d7bde2","#a9cce3"],
    price: 2490, oldPrice: 2990, discount: 17,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000017", name: "Women's Fitted Polo", badge: "HOT", badgeColor: "#e67e22",
    colors: ["var(--gold)","#2c3e50","#f5f5f5"],
    price: 2790, oldPrice: 3490, discount: 20,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000018", name: "Ladies Classic Polo", badge: "", badgeColor: "var(--black)",
    colors: ["#fff","#d7bde2","#a9cce3"],
    price: 2690, oldPrice: 3290, discount: 18,
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80",
    tag: "Women", colorCount: 3
  },

  // Sale Items
  {
    id: "650000000000000000000019", name: "Premium Piqué Sale", badge: "SALE", badgeColor: "var(--gold)",
    colors: ["#8e44ad","#3498db","#e74c3c"],
    price: 2290, oldPrice: 3990, discount: 43,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    tag: "Sale", colorCount: 3
  },
  {
    id: "650000000000000000000020", name: "Polo Mega Sale", badge: "SALE", badgeColor: "#e74c3c",
    colors: ["#e74c3c","#fff","#8e44ad"],
    price: 1990, oldPrice: 3490, discount: 43,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    tag: "Sale", colorCount: 3
  },
  {
    id: "650000000000000000000021", name: "Clearance Polo", badge: "CLEARANCE", badgeColor: "#e74c3c",
    colors: ["#3498db","#fff","#e74c3c"],
    price: 1490, oldPrice: 2990, discount: 50,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80",
    tag: "Sale", colorCount: 3
  },

  // T-Shirts - Men
  {
    id: "650000000000000000000101", name: "Premium Cotton T-Shirt - Black", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#000","#fff","#2c3e50"],
    price: 1990, oldPrice: 2990, discount: 33,
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },
  {
    id: "650000000000000000000102", name: "Heavyweight Drop-Shoulder Tee", badge: "HOT", badgeColor: "#e67e22",
    colors: ["#fff","#1a1a2e","#95a5a6"],
    price: 2290, oldPrice: 3490, discount: 34,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },
  {
    id: "650000000000000000000103", name: "Classic Fit Crew Tee - White", badge: "ESSENTIAL", badgeColor: "#2c3e50",
    colors: ["#fff","#f5f5f5","#1a1a2e"],
    price: 1790, oldPrice: 2490, discount: 28,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },
  {
    id: "650000000000000000000104", name: "Slim Fit Stretch T-Shirt", badge: "FIT", badgeColor: "var(--gold)",
    colors: ["#1a1a2e","#c0392b","#fff"],
    price: 2490, oldPrice: 3490, discount: 29,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },
  {
    id: "650000000000000000000105", name: "Graphic Print Tee - Grey", badge: "ART", badgeColor: "#8e44ad",
    colors: ["#7f8c8d","#fff","#2c3e50"],
    price: 1990, oldPrice: 2790, discount: 29,
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },
  {
    id: "650000000000000000000106", name: "Oversized Box Tee - Navy", badge: "TREND", badgeColor: "#2980b9",
    colors: ["#1a1a2e","#fff","#95a5a6"],
    price: 2190, oldPrice: 3190, discount: 31,
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&q=80",
    tag: "T-Shirt", colorCount: 3
  },

  // Round Neck - Men
  {
    id: "650000000000000000000201", name: "Cotton Round Neck - Maroon", badge: "COMFORT", badgeColor: "#c0392b",
    colors: ["#c0392b","#1a1a2e","#fff"],
    price: 1890, oldPrice: 2690, discount: 30,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },
  {
    id: "650000000000000000000202", name: "Ribbed Round Neck Tee - Olive", badge: "TEXTURE", badgeColor: "#27ae60",
    colors: ["#2d6a4f","#fff","#1a1a2e"],
    price: 2390, oldPrice: 3490, discount: 32,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },
  {
    id: "650000000000000000000203", name: "Everyday Round Neck - Charcoal", badge: "BASIC", badgeColor: "var(--black)",
    colors: ["#34495e","#fff","#7f8c8d"],
    price: 1590, oldPrice: 2290, discount: 31,
    image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },
  {
    id: "650000000000000000000204", name: "Pima Cotton Round Neck", badge: "LUXE", badgeColor: "var(--gold)",
    colors: ["var(--gold)","#fff","#1a1a2e"],
    price: 2890, oldPrice: 3990, discount: 28,
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },
  {
    id: "650000000000000000000205", name: "Athletic Round Neck - Blue", badge: "SPORT", badgeColor: "#2980b9",
    colors: ["#2980b9","#fff","#1a1a2e"],
    price: 2090, oldPrice: 2990, discount: 30,
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },
  {
    id: "650000000000000000000206", name: "Classic Round Neck - Cream", badge: "CLEAN", badgeColor: "#e67e22",
    colors: ["#f5f5dc","#1a1a2e","#fff"],
    price: 1790, oldPrice: 2590, discount: 31,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    tag: "Round-Neck", colorCount: 3
  },

  // ─── Men's Extended Collection ────────────────────────────
  {
    id: "650000000000000000000301", name: "K-TEX Signature Polo - Black Gold", badge: "SIGNATURE", badgeColor: "var(--gold)",
    colors: ["#000","#B8972A","#fff"],
    price: 4990, oldPrice: 6990, discount: 29,
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000302", name: "Slim Fit Polo - Burgundy", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#722f37","#1a1a2e","#fff"],
    price: 3290, oldPrice: 4490, discount: 27,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000303", name: "Henley Neck Tee - Olive", badge: "STYLE", badgeColor: "#27ae60",
    colors: ["#556b2f","#fff","#2c3e50"],
    price: 2190, oldPrice: 3190, discount: 31,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000304", name: "V-Neck Premium Tee - Grey", badge: "MINIMAL", badgeColor: "#7f8c8d",
    colors: ["#95a5a6","#fff","#2c3e50"],
    price: 2490, oldPrice: 3490, discount: 29,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000305", name: "Striped Rugby Polo - Navy", badge: "CLASSIC", badgeColor: "#2c3e50",
    colors: ["#1a1a2e","#fff","#c0392b"],
    price: 3790, oldPrice: 4990, discount: 24,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000306", name: "Long Sleeve Polo - Charcoal", badge: "WINTER", badgeColor: "#34495e",
    colors: ["#34495e","#fff","#1a1a2e"],
    price: 3590, oldPrice: 4790, discount: 25,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000307", name: "Pocket Tee - White", badge: "ESSENTIAL", badgeColor: "#e67e22",
    colors: ["#fff","#f5f5f5","#1a1a2e"],
    price: 1690, oldPrice: 2490, discount: 32,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    tag: "Men", colorCount: 3
  },
  {
    id: "650000000000000000000308", name: "Color Block Polo - Red Navy", badge: "TREND", badgeColor: "#c0392b",
    colors: ["#c0392b","#1a1a2e","#fff"],
    price: 3490, oldPrice: 4490, discount: 22,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80",
    tag: "Men", colorCount: 3
  },

  // ─── Women's Extended Collection ─────────────────────────
  {
    id: "650000000000000000000401", name: "Women's Polo - Dusty Rose", badge: "NEW", badgeColor: "var(--black)",
    colors: ["#dcae96","#fff","#d7bde2"],
    price: 2690, oldPrice: 3490, discount: 23,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000402", name: "Cropped Polo - Lavender", badge: "TREND", badgeColor: "#8e44ad",
    colors: ["#d7bde2","#fff","#a9cce3"],
    price: 2490, oldPrice: 3290, discount: 24,
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000403", name: "Oversized Tee - Sage Green", badge: "COMFY", badgeColor: "#27ae60",
    colors: ["#8fbc8f","#fff","#2d6a4f"],
    price: 1990, oldPrice: 2790, discount: 29,
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000404", name: "Fitted V-Neck Tee - Black", badge: "SLIM", badgeColor: "var(--black)",
    colors: ["#000","#fff","#722f37"],
    price: 2290, oldPrice: 3190, discount: 28,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000405", name: "Striped Polo - Pink White", badge: "CUTE", badgeColor: "#e91e63",
    colors: ["#f5cba7","#fff","#e91e63"],
    price: 2790, oldPrice: 3690, discount: 24,
    image: "https://images.unsplash.com/photo-1625910513648-77e8b62a8e6c?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000406", name: "Athletic Polo - Coral", badge: "ACTIVE", badgeColor: "#e67e22",
    colors: ["#ff7f50","#fff","#1a1a2e"],
    price: 2990, oldPrice: 3990, discount: 25,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000407", name: "Round Neck Basic - White", badge: "BASIC", badgeColor: "#95a5a6",
    colors: ["#fff","#f5f5f5","#e0e0e0"],
    price: 1490, oldPrice: 2290, discount: 35,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    tag: "Women", colorCount: 3
  },
  {
    id: "650000000000000000000408", name: "Premium Polo - Midnight Blue", badge: "PREMIUM", badgeColor: "var(--gold)",
    colors: ["#191970","#fff","#B8972A"],
    price: 3490, oldPrice: 4990, discount: 30,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    tag: "Women", colorCount: 3
  },
];

const defaultCategories = [
  {
    id: "cat_men", name: "Men", subtitle: "Premium clothing for the modern gentleman",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80", tall: true,
    subcategories: [
      { id: "sub_men_polo", name: "Polo Shirts", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80" },
      { id: "sub_men_tshirt", name: "T-Shirts", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80" },
      { id: "sub_men_roundneck", name: "Round Neck", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80" },
    ]
  },
  {
    id: "cat_women", name: "Women", subtitle: "Elegance & comfort for every occasion",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80", tall: true,
    subcategories: [
      { id: "sub_women_polo", name: "Polo Tops", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
      { id: "sub_women_tees", name: "T-Shirts", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80" },
      { id: "sub_women_tops", name: "Elegant Tops", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80" },
    ]
  },
  {
    id: "cat_001", name: "Classic Polo", subtitle: "Timeless essentials for every wardrobe",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=85", tall: true,
    subcategories: []
  },
  {
    id: "cat_002", name: "Premium Piqué", subtitle: "Luxury texture & refinement",
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=85",
    subcategories: []
  },
  {
    id: "cat_003", name: "Corporate Wear", subtitle: "Office-ready professional looks",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=85",
    subcategories: []
  },
  {
    id: "cat_004", name: "Summer Collection", subtitle: "Light & breathable comfort",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=85",
    subcategories: []
  },
  {
    id: "cat_005", name: "Golf Edition", subtitle: "Performance meets style",
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=85",
    subcategories: []
  },
  {
    id: "cat_006", name: "Women's Collection", subtitle: "Elegant femininity redefined",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=85",
    subcategories: []
  },
  {
    id: "cat_007", name: "Sale", subtitle: "Up to 50% off on selected items",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=85",
    subcategories: []
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

function transformProduct(p) {
  const hasDiscount = p.discountPrice > 0;
  return {
    id: p._id,
    name: p.name,
    description: p.description || '',
    price: hasDiscount ? p.discountPrice : p.price,
    oldPrice: hasDiscount ? p.price : undefined,
    discount: hasDiscount ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : undefined,
    image: p.images?.[0]?.url || '',
    images: (p.images || []).map(img => img.url),
    tag: p.pageType || p.mainCategory || p.category || 'Men',
    pageType: p.pageType,
    subCategory: p.subCategory,
    mainCategory: p.mainCategory,
    colors: (p.colors || []).map(c => c.hexCode).filter(Boolean),
    colorNames: (p.colors || []).map(c => c.name).filter(Boolean),
    badge: '',
    badgeColor: '#000000',
    colorCount: (p.colors || []).length || 1,
    sku: p.sku,
    stock: p.stock,
    fabric: p.fabric || '',
    brand: p.brand || 'K-TEX',
    sizes: (p.sizes || []).map(s => ({ size: s.size || s, stock: s.stock })),
    ratings: p.ratings || 0,
    numOfReviews: p.numOfReviews || 0,
    isNewArrival: p.isNewArrival || false,
    tags: p.tags || [],
  };
}

function transformCategory(c) {
  return {
    id: c._id,
    name: c.name,
    slug: c.slug,
    subtitle: '',
    image: c.image || '',
    pageTypes: c.pageTypes || ['Men'],
    tall: true,
    subcategories: (c.subCategories || []).map(s => ({
      id: s._id,
      name: s.name,
      image: s.image || ''
    }))
  };
}

export async function syncProductsFromBackend() {
  if (typeof window === 'undefined') return;
  // Only sync if last sync was > 5 minutes ago
  const lastSync = localStorage.getItem('ktex_products_synced_at');
  if (lastSync && Date.now() - parseInt(lastSync) < 300000) return;
  try {
    const res = await fetch('/api/products?limit=200&sort=newest');
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && json.data) {
      const transformed = json.data.map(transformProduct);
      const existing = json.data.length > 0 ? transformed : getProducts();
      localStorage.setItem('ktex_products', JSON.stringify(existing));
      localStorage.setItem('ktex_products_synced_at', Date.now().toString());
    }
  } catch (e) {
    console.warn('Product sync from backend failed, using cache', e.message);
  }
}

export async function syncCategoriesFromBackend() {
  if (typeof window === 'undefined') return;
  const lastSync = localStorage.getItem('ktex_categories_synced_at');
  if (lastSync && Date.now() - parseInt(lastSync) < 300000) return;
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      const transformed = json.data.map(transformCategory);
      localStorage.setItem('ktex_categories', JSON.stringify(transformed));
      localStorage.setItem('ktex_categories_synced_at', Date.now().toString());
    }
  } catch (e) {
    console.warn('Category sync from backend failed, using cache', e.message);
  }
}

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
