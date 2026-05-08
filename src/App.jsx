import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PromoBar from './components/PromoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Men from './pages/Men';
import Product from './pages/Product';
import Checkout from './pages/Checkout';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <Router>
      <PromoBar />
      <Navbar cartCount={cartCount} />
      
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
        <Route path="/men" element={<Men onAddToCart={handleAddToCart} />} />
        <Route path="/product/:id" element={<Product onAddToCart={handleAddToCart} />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
