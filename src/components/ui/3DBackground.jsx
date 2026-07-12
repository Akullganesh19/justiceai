import React, { useRef, useEffect } from 'react';

/**
 * 3D Animated Background Component
 * Creates an immersive 3D particle field with mouse parallax effect
 */
export default function Background3D({ particleCount = 50 }) {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const rotateY = (clientX / innerWidth - 0.5) * 20;
      const rotateX = (clientY / innerHeight - 0.5) * -20;

      container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate random particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
  }, [particleCount]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease-out',
      }}
    >
      {/* Floating 3D Particles */}
      {particlesRef.current.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background:
              i % 2 === 0
                ? `rgba(225, 29, 72, ${Math.random() * 0.4 + 0.2})`
                : `rgba(37, 99, 235, ${Math.random() * 0.4 + 0.2})`,
            boxShadow:
              i % 2 === 0
                ? `0 0 ${particle.size * 6}px rgba(225, 29, 72, 0.4)`
                : `0 0 ${particle.size * 6}px rgba(37, 99, 235, 0.4)`,
            transform: `translateZ(${particle.z}px)`,
            animation: `float3d ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
          }}
        />
      ))}

      {/* 3D Grid Floor */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '200%',
          height: '200%',
          background: `
            linear-gradient(rgba(225, 29, 72, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(225, 29, 72, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: 'rotateX(60deg) translateZ(-100px)',
          transformOrigin: 'center bottom',
        }}
      />

      {/* Ambient Light Orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(225, 29, 72, 0.08), transparent 70%)',
          top: '10%',
          left: '20%',
          animation: 'float3d 15s ease-in-out 0s infinite',
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-[100px]"
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08), transparent 70%)',
          top: '60%',
          right: '15%',
          animation: 'float3d 18s ease-in-out 3s infinite',
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05), transparent 70%)',
          bottom: '20%',
          left: '40%',
          animation: 'float3d 12s ease-in-out 5s infinite',
        }}
      />
    </div>
  );
}
