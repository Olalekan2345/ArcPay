import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import ProductPreview from '@/components/landing/ProductPreview'
import FeatureSlideshow from '@/components/landing/Testimonials'
import AIAgent from '@/components/landing/AIAgent'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="bg-[#05060f] text-white">
      <Navbar />
      <Hero />
      <Features />
      <ProductPreview />
      <FeatureSlideshow />
      <AIAgent />
      <FAQ />
      <Footer />
    </main>
  )
}
