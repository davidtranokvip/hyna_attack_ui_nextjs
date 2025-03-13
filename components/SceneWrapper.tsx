// 'use client';
// import React, { useRef, useEffect } from 'react';
// import Scene from '@/components/threejs/Scene';

// interface SceneWrapperProps {
//   myClass?: string;
// }
// const SceneWrapper: React.FC<SceneWrapperProps> = ({myClass}) => {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   useEffect(() => {
//     const resizeObserver = new ResizeObserver(entries => {
//       for (const entry of entries) {
//         if (containerRef.current) {
//           const width = entry.contentRect.width;
//           const height = entry.contentRect.height;
          
//           containerRef.current.style.width = `${Math.max(width, 300)}px`;
//           containerRef.current.style.height = `${Math.max(height, 300)}px`;
          
//           window.dispatchEvent(new Event('resize'));
//         }
//       }
//     });

//     if (containerRef.current) {
//       resizeObserver.observe(containerRef.current);
//     }

//     return () => resizeObserver.disconnect();
//   }, []);

//   return (
//     <div 
//       ref={containerRef} 
//       className={`${myClass} w-full relative`}
//     >
//       <Scene />
//     </div>
//   );
// };

// export default React.memo(SceneWrapper);

'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to ensure three.js only loads on client
const Scene = dynamic(() => import('@/components/threejs/Scene'), { ssr: false });

interface SceneWrapperProps {
  myClass?: string;
}

const SceneWrapper: React.FC<SceneWrapperProps> = ({ myClass }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Setup resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (containerRef.current) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          
          containerRef.current.style.width = `${Math.max(width, 300)}px`;
          containerRef.current.style.height = `${Math.max(height, 300)}px`;
          
          // Dispatch resize event to notify three.js
          window.dispatchEvent(new Event('resize'));
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions while client-side code is loading
    return (
      <div 
        ref={containerRef} 
        className={`${myClass} w-full h-64 bg-gray-100 flex items-center justify-center`}
      >
        <div className="text-gray-400">Loading 3D scene...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`${myClass || ''} w-full h-96 relative`}
    >
      <Scene />
    </div>
  );
};

export default React.memo(SceneWrapper);