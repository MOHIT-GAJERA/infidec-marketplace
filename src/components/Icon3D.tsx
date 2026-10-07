import type { LucideIcon } from "lucide-react";

type Tone = "blue" | "violet" | "cyan";

const tones: Tone[] = ["blue", "violet", "cyan"];

/**
 * Glossy 3D icon tile in the logo palette: gradient face, bevel highlight,
 * solid base edge and a soft glow. Floats gently and tilts when its `.group`
 * parent is hovered (motion is disabled under prefers-reduced-motion).
 */
export function Icon3D({
  Icon,
  index = 0,
  tone,
  size = "md",
  className = "",
}: {
  Icon: LucideIcon;
  /** Position in a list: picks the tone (when not set) and staggers the float. */
  index?: number;
  tone?: Tone;
  size?: "md" | "lg";
  className?: string;
}) {
  const t = tone ?? tones[index % tones.length];
  return (
    <span aria-hidden="true" className={`icon3d-float ${className}`} style={{ animationDelay: `${(index % 6) * -0.6}s` }}>
      <span className={`icon3d icon3d--${t} icon3d--${size}`}>
        <Icon className="icon3d__glyph fill-white/20" strokeWidth={2.1} />
      </span>
    </span>
  );
}
