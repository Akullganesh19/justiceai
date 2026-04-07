import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultSlides = [
  {
    img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070&auto=format&fit=crop',
    text: ['TRUTH IN', 'EVIDENCE'],
  },
  {
    img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop',
    text: ['SILENCE IN', 'REBUTTAL'],
  },
  {
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop',
    text: ['JUSTICE IN', 'CLARITY'],
  },
];

interface SlideshowProps {
  slides?: typeof defaultSlides;
  autoPlay?: boolean;
  interval?: number;
}

export default function Slideshow({
  slides = defaultSlides,
  autoPlay = true,
  interval = 5000,
}: SlideshowProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        <div key={current} className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slides[current].img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </AnimatePresence>

      <div className="relative z-10 text-center space-y-4 px-6 select-none">
        <AnimatePresence mode="wait">
          <div key={current} className="flex flex-col items-center justify-center gap-2">
            <motion.div initial="hidden" animate="visible" exit="hidden">
              <div className="flex flex-col items-center gap-2">
                {slides[current].text.map((t, j) => (
                  <motion.span
                    key={j}
                    variants={{
                      hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { delay: j * 0.1, duration: 0.6 },
                      },
                    }}
                  >
                    <span className="text-5xl md:text-8xl font-display font-black text-white italic tracking-tighter drop-shadow-2xl inline-block">
                      {t}
                    </span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 z-20 flex items-center justify-between p-6 pointer-events-none">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-4 rounded-full bg-void/5 border border-white/10 text-white/50 hover:text-white hover:bg-purple/20 hover:border-purple/30 transition-all pointer-events-auto active:scale-95 group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-4 rounded-full bg-void/5 border border-white/10 text-white/50 hover:text-white hover:bg-purple/20 hover:border-purple/30 transition-all pointer-events-auto active:scale-95 group"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Counter */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'h-1 transition-all duration-500 rounded-full cursor-pointer',
                i === current ? 'w-12 bg-purple' : 'w-4 bg-void/20 hover:bg-void/40',
              )}
            />
          ))}
        </div>
        <div className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">
          0{current + 1} / 0{slides.length}
        </div>
      </div>

      {/* Decorative Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[url('https://grain-y.com/assets/images/grain.png')] mix-blend-overlay" />
    </div>
  );
}
