export const GLASS_WIDGET_STYLES = {
  mainGlass: {
    background: `
      radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(0, 0, 0, 0.1) 100%)
    `,
    backdropFilter: 'blur(3px) saturate(1.0)',
    filter: 'contrast(1.1) brightness(1.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `
      0 2px 8px rgba(0, 0, 0, 0.1),
      0 4px 16px rgba(0, 0, 0, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
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
    mixBlendMode: 'screen' as const,
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
    backgroundOrigin: 'border-box' as const,
    backgroundClip: 'border-box' as const,
    mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
    maskComposite: 'xor' as const,
    animation: 'glass-refraction 8s linear infinite'
  }
};