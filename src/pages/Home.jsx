import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import NewArrivals from '../components/NewArrivals';
import SummerSaleBanner from '../components/SummerSaleBanner';
import TrustBadges from '../components/TrustBadges';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <SummerSaleBanner />
      <Testimonials />
      <TrustBadges />
      <Newsletter />
    </main>
  );
}
