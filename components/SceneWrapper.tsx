'use client';
import React, { useRef, useEffect } from 'react';
import Scene from '@/components/threejs/Scene';

interface SceneWrapperProps {
  myClass?: string;
}
const SceneWrapper: React.FC<SceneWrapperProps> = ({myClass}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (containerRef.current) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          
          containerRef.current.style.width = `${Math.max(width, 300)}px`;
          containerRef.current.style.height = `${Math.max(height, 300)}px`;
          
          window.dispatchEvent(new Event('resize'));
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`${myClass} w-full relative`}
    >
      <Scene />
    </div>
  );
};

export default React.memo(SceneWrapper);