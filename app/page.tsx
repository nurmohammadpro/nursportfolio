import Hero from "@/app/components/sections/Hero";
import About from "@/app/components/sections/About";
import Skills from "./components/sections/ Skills";
import Projects from "@/app/components/sections/Projects";
import Contact from "@/app/components/sections/Contact";
import ScrollToTop from "@/app/components/ScrollToTop"; // Import the new component

export default function Home() {
  return (
    <main className="flex flex-col w-full relative">
      <Hero />

      <div id="about">
        <About />
      </div>

      <div id="skills">
        <Skills />
      </div>

      <div id="projects">
        <Projects />
      </div>

      <div id="contact">
        <Contact />
      </div>

      {/* Floating Action Button */}
      <ScrollToTop />
    </main>
  );
}
