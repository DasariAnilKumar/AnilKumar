import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import Products from "./components/Products";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Timeline />
        <Skills />
        <Products />
        <Certifications />
        <Contact />
      </main>
    </>
  );
}
