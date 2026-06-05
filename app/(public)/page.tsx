import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import ProductIQBanner from "@/components/sections/ProductIQBanner";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductIQBanner />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Achievements />
      <Blog />
      <Contact />
    </main>
  )
}