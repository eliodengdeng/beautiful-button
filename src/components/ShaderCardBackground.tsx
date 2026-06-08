import { lazy, memo, Suspense, useEffect, useRef, useState } from "react";

const ShaderSurface = lazy(async () => {
  const { ShaderGradient, ShaderGradientCanvas } = await import("@shadergradient/react");

  return {
    default: ({ reduceMotion }: { reduceMotion: boolean }) => (
      <ShaderGradientCanvas
        className="shader-card-canvas"
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={0.8}
        fov={45}
        pointerEvents="none"
        powerPreference="low-power"
      >
        <ShaderGradient
          control="props"
          type="plane"
          shader="defaults"
          animate={reduceMotion ? "off" : "on"}
          color1="#ff8709"
          color2="#ff5cd6"
          color3="#f7bdf8"
          uSpeed={0.18}
          uStrength={2.6}
          uDensity={1.35}
          uFrequency={4.4}
          positionX={-1.2}
          positionY={0}
          positionZ={0}
          rotationX={0}
          rotationY={10}
          rotationZ={42}
          cAzimuthAngle={180}
          cPolarAngle={92}
          cDistance={3.4}
          lightType="3d"
          brightness={1.15}
          grain="on"
        />
      </ShaderGradientCanvas>
    ),
  };
});

function ShaderCardBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="shader-card-background" aria-hidden="true">
      {isNearViewport && (
        <Suspense fallback={null}>
          <ShaderSurface reduceMotion={reduceMotion} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(ShaderCardBackground);
