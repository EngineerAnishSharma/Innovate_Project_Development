"use client"

import HeroSection from "@/components/landing/HeroSection"
import AboutSection from "@/components/landing/AboutSection"
import Footer from "@/components/landing/Footer"
// import ContactSection from "@/components/landing/ContactSection"

export default function Home() {


  return (
    <div className="min-h-screen text-gray-900 dark:text-white relative">
      <div className="relative z-10">
        <main className="container mx-auto px-4">
          <HeroSection />
          <AboutSection />
          {/* <ContactSection /> */}
        </main>
        <Footer />

      </div>
    </div>
  )
}

