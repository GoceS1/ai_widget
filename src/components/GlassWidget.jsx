import { GLASS_WIDGET_STYLES } from './glass-widget-styles';
import React, { useState } from 'react';

export function GlassWidget({ onClick, style }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        zIndex: 10000,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ...style,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {/* Main glass widget */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          ...GLASS_WIDGET_STYLES.mainGlass,
          boxShadow: isHovered ? GLASS_WIDGET_STYLES.mainGlass.hoverBoxShadow : GLASS_WIDGET_STYLES.mainGlass.boxShadow,
          transition: 'box-shadow 0.3s ease',
        }}
      />
      
      {/* Chromatic aberration layer */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          ...GLASS_WIDGET_STYLES.chromaticAberration
        }}
      />
      
      {/* Distortion effect overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          ...GLASS_WIDGET_STYLES.distortionEffect
        }}
      />
      
      {/* Volumetric highlight */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          ...GLASS_WIDGET_STYLES.volumetricHighlight
        }}
      />
      
      {/* Refractive edge highlight */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: '50%',
          pointerEvents: 'none',
          ...GLASS_WIDGET_STYLES.refractiveEdge
        }}
      />
    </div>
  );
}
