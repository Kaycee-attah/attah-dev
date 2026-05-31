import About from "@/components/sections/About";
import Achievements from "@/components/sections/Achievements";
import Blog from "@/components/sections/Blog";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Achievements />
      <Blog />
    </main>
  )
}