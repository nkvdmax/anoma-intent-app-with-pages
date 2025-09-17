import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import CrossChain from "./pages/CrossChain";
import Success from "./pages/Success";

export default function App() {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  let page = (<><Hero /><Features /></>);

  if (hash.startsWith("#/pay")) page = <CrossChain />;
  if (hash.startsWith("#/success")) page = <Success />;

  return (<><Header />{page}<Footer /></>);
}
