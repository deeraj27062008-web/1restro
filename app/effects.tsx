"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function Effects() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    let id: number;
    function raf(time: number) {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    }
    id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}