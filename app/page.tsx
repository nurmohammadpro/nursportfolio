// app/page.tsx - Main Portfolio Page
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Services from "@/app/components/Services";
import Skills from "@/app/components/Skills";
import Projects from "@/app/components/Projects";
// import Experience from "@/app/components/Experience";
// import Testimonials from "@/app/components/Testimonials";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Skills />
        <Projects />
        {/* <Experience />
        <Testimonials /> */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
