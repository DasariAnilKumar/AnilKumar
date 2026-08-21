import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Timeline from "./components/Timeline";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Timeline />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
