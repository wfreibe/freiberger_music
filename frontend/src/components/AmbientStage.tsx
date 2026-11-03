import { currentPlaceAmbient } from '../player/playerStore';

export function AmbientStage() {
  const place = currentPlaceAmbient.value;

  // Compute dynamic glow style depending on hovered/active place
  const accentColor = place?.accent_color || '#387780';

  const glowStyle = {
    background: `radial-gradient(
      ellipse at center,
      ${accentColor}40 0%,
      rgba(43, 92, 125, 0.25) 45%,
      rgba(11, 12, 14, 0) 75%
    )`
  };

  return (
    <div class="ambient-container" aria-hidden="true">
      <div class="ambient-glow" style={glowStyle} />
      <div class="ambient-horizon" />
      <div class="ambient-noise" />
    </div>
  );
}
