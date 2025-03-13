import React, { useEffect } from 'react';

const ParticlesAnimation: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
    script.async = true;
    
    script.onload = () => {
      const particlesJS = (window as any).particlesJS;
      
      if (particlesJS) {
        particlesJS('particles-js', {
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#00ff00"
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: "#00ff00"
              },
              polygon: {
                nb_sides: 5
              },
              image: {
                width: 100,
                height: 100
              }
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 5,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#00ff00",
              opacity: 0.4,
              width: 1
            },
            move: {
              enable: true,
              speed: 6,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse"
              },
              onclick: {
                enable: true,
                mode: "push"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1
                }
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
              },
              repulse: {
                distance: 200
              },
              push: {
                particles_nb: 4
              },
              remove: {
                particles_nb: 2
              }
            }
          },
          retina_detect: true
        });
      }
    };
    
    document.body.appendChild(script);
    
    // Clean up on component unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  // CSS styles properly typed
  const styles: Record<string, React.CSSProperties> = {
    particlesContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0
    }
  };
  
  // Apply the styles to the document body
  useEffect(() => {
    // Explicitly type the style properties
    const bodyStyles: React.CSSProperties = {
      height: '100%',
      backgroundRepeat: 'no-repeat',
      backgroundImage: 'linear-gradient(rgb(12, 97, 33), rgb(104, 145, 162))',
      position: 'relative',
      margin: 0,
      padding: 0
    };
    
    Object.assign(document.body.style, bodyStyles);
    
    document.documentElement.style.height = '100%';
    
    return () => {
      document.body.style.cssText = '';
      document.documentElement.style.height = '';
    };
  }, []);
  
  return (
    <div id="particles-js" style={styles.particlesContainer}></div>
  );
};

export default ParticlesAnimation;