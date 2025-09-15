import React from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Features from "./components/Features.jsx";
import CTA from "./components/CTA.jsx";
import Footer from "./components/Footer.jsx";

function mockConnect(){ alert("Here you can open Web3Modal / wagmi connect flow."); }

export default function App() {
  return (
    <>
      <Header />
      <Hero onConnect={mockConnect} />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
