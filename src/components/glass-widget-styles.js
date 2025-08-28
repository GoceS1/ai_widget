export const GLASS_WIDGET_STYLES = {
  mainGlass: {
    background: `
      radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(120, 119, 198, 0.5) 0%, transparent 50%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%)
    `,
    backdropFilter: 'blur(4px) saturate(1.2)',
    filter: 'contrast(1.2) brightness(1.1)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 8px 24px rgba(0, 0, 0, 0.1),
      inset 0 2px 0 rgba(255, 255, 255, 0.5),
      inset 0 -2px 0 rgba(0, 0, 0, 0.15)
    `
  },
  
  chromaticAberration: {
    background: `
      radial-gradient(circle at center, 
        rgba(255, 0, 0, 0.1) 0%, 
        rgba(0, 255, 0, 0.1) 33%, 
        rgba(0, 0, 255, 0.1) 66%, 
        transparent 100%
      )
    `,
    filter: 'blur(1px)',
    mixBlendMode: 'screen',
    transform: 'translate(1px, 1px)'
  },
  
  distortionEffect: {
    background: `
      conic-gradient(from 0deg at center, 
        rgba(255, 255, 255, 0.1) 0deg,
        rgba(255, 255, 255, 0.05) 90deg,
        rgba(255, 255, 255, 0.1) 180deg,
        rgba(255, 255, 255, 0.05) 270deg,
        rgba(255, 255, 255, 0.1) 360deg
      )
    `,
    filter: 'blur(0.5px)',
    animation: 'glass-distortion 6s ease-in-out infinite'
  },
  
  volumetricHighlight: {
    background: `radial-gradient(ellipse at 25% 25%, rgba(255, 255, 255, 0.6) 0%, transparent 40%)`,
    filter: 'blur(2px)',
    animation: 'glass-volumetric 4s ease-in-out infinite alternate'
  },
  
  refractiveEdge: {
    background: 'transparent',
    border: '1px solid transparent',
    backgroundImage: `
      linear-gradient(45deg, 
        rgba(255, 255, 255, 0.8) 0%, 
        rgba(255, 255, 255, 0.2) 25%, 
        transparent 50%, 
        rgba(255, 255, 255, 0.2) 75%, 
        rgba(255, 255, 255, 0.8) 100%
      )
    `,
    backgroundOrigin: 'border-box',
    backgroundClip: 'border-box',
    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor',
    animation: 'glass-refraction 8s linear infinite'
  }
};
