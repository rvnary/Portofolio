import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate blur amount based on scroll (0 to 5px blur for subtle effect)
  const blurAmount = Math.min(scrollY / 150, 5);
  // Calculate opacity for fade effect
  const opacity = Math.max(1 - scrollY / 800, 0);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Fixed with dynamic blur */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://github.com/rvnary/Portofolio/blob/main/justintano/mockup%20business%20card.webp?raw=true"
          alt="Hero background"
          className="w-full h-full object-cover"
          style={{ filter: `blur(${blurAmount}px)` }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content - Fixed with dynamic blur and fade */}
      <div 
        className="fixed inset-0 z-10 flex items-center justify-center text-center px-6"
        style={{ 
          filter: `blur(${blurAmount}px)`,
          opacity: opacity
        }}
      >
        <div>
          <div className="mb-8 inline-block">
            <div className="w-32 h-32 flex items-center justify-center">
              <img src="https://raw.githubusercontent.com/rvnary/Portofolio/refs/heads/main/justintano/g_logo.svg" alt="logo"></img>
            </div>
          </div>
          <h1 className="text-white mb-4">
            Jerryo Pradnatan
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Currently refining my skills and expanding my design capabilities
          </p>
        </div>
      </div>
    </section>
  );
}
