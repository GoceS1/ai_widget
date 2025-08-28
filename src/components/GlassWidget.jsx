import { GLASS_WIDGET_STYLES } from './glass-widget-styles';

export function GlassWidget({ onClick, style }) {
  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        zIndex: 10000,
        ...style
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
          ...GLASS_WIDGET_STYLES.mainGlass
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
