import React from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import NewArrivals from '../components/NewArrivals';
import PromotionalBanner from '../components/PromotionalBanner';
import TrustBadges from '../components/TrustBadges';

export default function Home({ onAddToCart }) {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <NewArrivals onAddToCart={onAddToCart} />
      <PromotionalBanner />
      <TrustBadges />
    </main>
  );
}
