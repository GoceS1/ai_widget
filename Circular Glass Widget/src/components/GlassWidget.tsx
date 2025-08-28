import { GLASS_WIDGET_STYLES } from './glass-widget-styles';

export function GlassWidget() {
  return (
    <div className="relative w-[30px] h-[30px]">
      {/* Main glass widget */}
      <div 
        className="absolute inset-0 rounded-full glass-widget-main"
        style={GLASS_WIDGET_STYLES.mainGlass}
      />
      
      {/* Chromatic aberration layer */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={GLASS_WIDGET_STYLES.chromaticAberration}
      />
      
      {/* Distortion effect overlay */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={GLASS_WIDGET_STYLES.distortionEffect}
      />
      
      {/* Volumetric highlight */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={GLASS_WIDGET_STYLES.volumetricHighlight}
      />
      
      {/* Refractive edge highlight */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={GLASS_WIDGET_STYLES.refractiveEdge}
      />
    </div>
  );
}