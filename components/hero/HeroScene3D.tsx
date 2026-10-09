"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// Helper to create crisp 2D canvas texture for 3D HUD metadata without troika-three-text
function createHudTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(5, 7, 12, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    ctx.font = "bold 32px monospace";
    ctx.fillStyle = "#00e5ff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Helper to create soft radial studio rim aura glow
function createAuraTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    grad.addColorStop(0, "rgba(0, 229, 255, 0.45)");
    grad.addColorStop(0.35, "rgba(255, 59, 30, 0.28)");
    grad.addColorStop(0.7, "rgba(0, 229, 255, 0.1)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// 1. Centerpiece Cutout displaying the isolated photographer with DSLR, fitted to screen
function CenterpiecePhotoFrame({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hudTexture, setHudTexture] = useState<THREE.CanvasTexture | null>(null);
  const [auraTexture, setAuraTexture] = useState<THREE.CanvasTexture | null>(null);
  const { viewport } = useThree();

  useEffect(() => {
    setHudTexture(createHudTexture("DSLR RIG // 50mm f/1.2 • ISO 100 • 1/250s • 4K RAW"));
    setAuraTexture(createAuraTexture());

    const loader = new THREE.TextureLoader();
    // Load transparent PNG cutout of person holding DSLR (new user-provided image)
    loader.load(
      "/photographer-hero.png",
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = true;
        setTexture(loadedTex);
      },
      undefined,
      () => {
        // Fallback to raw uploaded image
        loader.load("/photographer-hero-raw.png", (fallbackTex) => {
          fallbackTex.colorSpace = THREE.SRGBColorSpace;
          setTexture(fallbackTex);
        });
      }
    );
  }, []);

  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Heavy low-pass damping for silky smooth motion
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mousePosition.x, 0.035);
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mousePosition.y, 0.035);

    if (groupRef.current) {
      // Gentle cinematic 3D tilt tracking smoothed mouse
      const targetRotY = smoothMouse.current.x * 0.16 + Math.sin(t * 0.4) * 0.02;
      const targetRotX = -smoothMouse.current.y * 0.12 + Math.cos(t * 0.35) * 0.015;
      const targetPosY = Math.sin(t * 0.6) * 0.04;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.04
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetPosY,
        0.04
      );
    }
  });

  // Calculate size to make the person fit the screen prominently
  // The cutout image is 484 x 682 (aspect ratio ~0.7097)
  const isMobile = viewport.width < 7.2;
  const height = isMobile
    ? Math.min(viewport.height * 0.74, 3.4)
    : Math.min(viewport.height * 0.84, 3.8);
  const width = height * (484 / 682);

  // Position: Centered horizontally and vertically in the middle of the logos
  const posX = 0;
  const posY = -0.05;

  return (
    <group ref={groupRef} position={[posX, posY, 0]}>
      {/* Volumetric Studio Rim Light Aura Behind Person */}
      {auraTexture && (
        <mesh position={[0, 0.1, -0.06]} scale={[width * 1.45, height * 1.25, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={auraTexture}
            transparent
            opacity={0.75}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Anamorphic Cyan Rim Flare Streak */}
      <mesh position={[0, -0.05, -0.04]}>
        <planeGeometry args={[width * 2.1, 0.035]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main Photographic Cutout Plane (Isolated Person holding DSLR) */}
      <mesh position={[0, 0, 0.01]} renderOrder={2}>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.01}
            depthWrite={true}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            color="#141822"
            emissive="#ff3b1e"
            emissiveIntensity={0.2}
            roughness={0.4}
            metalness={0.8}
          />
        )}
      </mesh>

      {/* Viewfinder Target Reticle floating directly over DSLR camera lens */}
      <group position={[0, height * 0.14, 0.035]}>
        {/* Outer glowing target ring */}
        <mesh>
          <ringGeometry args={[0.16, 0.18, 32]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        {/* Inner center dot */}
        <mesh>
          <ringGeometry args={[0.05, 0.065, 16]} />
          <meshBasicMaterial color="#ff3b1e" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
        {/* Reticle tick crosshairs */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={8}
              array={new Float32Array([
                -0.22, 0, 0, -0.14, 0, 0,
                0.14, 0, 0, 0.22, 0, 0,
                0, -0.22, 0, 0, -0.14, 0,
                0, 0.14, 0, 0, 0.22, 0,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.65} />
        </lineSegments>
      </group>

      {/* Floating 3D Lens Specs Slate Below Person */}
      <mesh position={[0, -height / 2 - 0.14, 0.025]}>
        <planeGeometry args={[Math.min(width * 1.05, 2.5), 0.18]} />
        {hudTexture ? (
          <meshBasicMaterial map={hudTexture} transparent opacity={0.92} />
        ) : (
          <meshBasicMaterial color="#05070c" transparent opacity={0.85} />
        )}
      </mesh>
    </group>
  );
}

// 2. Individual Anti-Gravity Floating 3D Physics Mesh
interface AntiGravityItemProps {
  initialPos: [number, number, number];
  mousePosition: { x: number; y: number };
  children: React.ReactNode;
  repelFactor?: number;
  rotSpeed?: [number, number, number];
  floatSpeed?: number;
  frontFacing?: boolean;
  clusterOffset?: number;
}

function AntiGravityObject({
  initialPos,
  mousePosition,
  children,
  repelFactor = 1.0,
  rotSpeed = [0.08, 0.12, 0.04],
  floatSpeed = 0.8,
  frontFacing = false,
  clusterOffset = 0,
}: AntiGravityItemProps) {
  const meshRef = useRef<THREE.Group>(null!);
  const currentPos = useRef(new THREE.Vector3(...initialPos));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetHome = useMemo(() => new THREE.Vector3(...initialPos), [initialPos]);
  const smoothMouse = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Map mouse to 3D world space coordinates with smooth low-pass interpolation
    const targetWorldX = mousePosition.x * 3.4;
    const targetWorldY = mousePosition.y * 2.3;
    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, targetWorldX, 0.035);
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, targetWorldY, 0.035);

    // Vector from smoothed cursor (relative to cluster offset) to object
    const localMouseX = smoothMouse.current.x - clusterOffset;
    const diff = new THREE.Vector3(
      currentPos.current.x - localMouseX,
      currentPos.current.y - smoothMouse.current.y,
      currentPos.current.z
    );
    const dist2D = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
    const repelRadius = 2.6;

    const force = new THREE.Vector3(0, 0, 0);

    // Smooth, liquid-like anti-gravity repulsion with Hermite smoothstep falloff
    if (dist2D < repelRadius && dist2D > 0.01) {
      const norm = 1 - dist2D / repelRadius;
      const smoothFactor = norm * norm * (3 - 2 * norm); // Hermite easing: zero jerk
      const strength = smoothFactor * 0.07 * repelFactor; // Silky smooth force
      diff.normalize();
      force.x += diff.x * strength;
      force.y += diff.y * strength;
      // Dreamy zero-gravity vertical and outward lift
      force.z += strength * 0.35;
      force.y += strength * 0.22;
    }

    // Gentle floating spring restoration towards home position
    const springK = 0.018;
    const springForce = new THREE.Vector3()
      .subVectors(targetHome, currentPos.current)
      .multiplyScalar(springK);

    // Subtle zero-gravity autonomous organic oscillation
    const osc = new THREE.Vector3(
      Math.sin(t * floatSpeed * 0.6 + initialPos[0]) * 0.0016,
      Math.cos(t * floatSpeed * 0.8 + initialPos[1]) * 0.0018,
      Math.sin(t * floatSpeed * 0.7 + initialPos[2]) * 0.0014
    );

    // Viscous fluid damping (0.938) for buttery-smooth glide with zero jarring
    velocity.current.add(force);
    velocity.current.add(springForce);
    velocity.current.add(osc);
    velocity.current.multiplyScalar(0.938);

    // Update position
    currentPos.current.add(velocity.current);
    meshRef.current.position.copy(currentPos.current);

    if (frontFacing) {
      // FRONT SHOWN: At refresh and in rest, faces straight towards camera.
      // In motion, tilts reactively with cursor without tumbling backwards or upside-down.
      const targetRotY = smoothMouse.current.x * 0.38 + Math.sin(t * floatSpeed * 0.9 + initialPos[0]) * 0.05;
      const targetRotX = -smoothMouse.current.y * 0.3 + Math.cos(t * floatSpeed * 0.8 + initialPos[1]) * 0.04;
      const targetRotZ = -smoothMouse.current.x * 0.06 + Math.sin(t * floatSpeed * 0.7 + initialPos[2]) * 0.02;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotX,
        0.05
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotY,
        0.05
      );
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        targetRotZ,
        0.05
      );
    } else {
      // Continuous tumble for abstract 3D elements
      meshRef.current.rotation.x += delta * rotSpeed[0];
      meshRef.current.rotation.y += delta * rotSpeed[1];
      meshRef.current.rotation.z += delta * rotSpeed[2];
    }
  });

  return <group ref={meshRef}>{children}</group>;
}

// 3. Glowing Keyframe Diamond Mesh (After Effects / Premiere / Blender)
function KeyframeDiamond({ color = "#F5A623", scale = 0.32 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      {/* Solid Faceted Octahedron Core */}
      <mesh>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Glowing Wireframe Outer Diamond */}
      <mesh scale={1.12}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.7} />
      </mesh>
      {/* Point Glow */}
      <pointLight color={color} intensity={1.2} distance={3} />
    </group>
  );
}

// 4. 3D Camera Lens Mesh (Optics, Aperture, Barrel)
function CameraLens3D({ scale = 0.38 }: { scale?: number }) {
  return (
    <group scale={scale}>
      {/* Outer Titanium Barrel Cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 0.95, 1.2, 32]} />
        <meshStandardMaterial
          color="#161922"
          metalness={0.95}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Focus & Zoom Ribbed Grip Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.2]}>
        <torusGeometry args={[1.02, 0.06, 16, 32]} />
        <meshStandardMaterial color="#2a2e3d" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
        <torusGeometry args={[1.02, 0.06, 16, 32]} />
        <meshStandardMaterial color="#2a2e3d" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Front Optical Glass Element with Cyan/Magenta Anti-Reflective Reflection */}
      <mesh position={[0, 0, 0.6]}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshPhysicalMaterial
          color="#00e5ff"
          emissive="#ff3b1e"
          emissiveIntensity={0.15}
          roughness={0.05}
          metalness={0.2}
          transmission={0.85}
          ior={1.65}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Aperture Marking Ring Ring Accent */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
        <torusGeometry args={[0.98, 0.02, 16, 32]} />
        <meshBasicMaterial color="#ff3b1e" />
      </mesh>
    </group>
  );
}

// 5. 3D Render Cube / Node Mesh (Octane / Cycles / GPU Render)
function RenderIconCube({ scale = 0.35 }: { scale?: number }) {
  const innerRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 1.2;
      innerRef.current.rotation.x += delta * 0.8;
    }
  });

  return (
    <group scale={scale}>
      {/* Outer Wireframe Render Node Box */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.7} />
      </mesh>

      {/* Corner Vertex Glowing Spheres */}
      {[
        [-0.6, -0.6, -0.6],
        [0.6, -0.6, -0.6],
        [-0.6, 0.6, -0.6],
        [0.6, 0.6, -0.6],
        [-0.6, -0.6, 0.6],
        [0.6, -0.6, 0.6],
        [-0.6, 0.6, 0.6],
        [0.6, 0.6, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
      ))}

      {/* Spinning Internal Metallic Core */}
      <mesh ref={innerRef} scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#ff3b1e"
          emissive="#ff3b1e"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <pointLight color="#00e5ff" intensity={1.5} distance={3} />
    </group>
  );
}



// 9. Floating Cinema Dust Particles
function CinematicDustParticles({ count = 160 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color("#ff3b1e");
    const colorB = new THREE.Color("#00e5ff");
    const colorC = new THREE.Color("#f5a623");
    const colorD = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const r = Math.random();
      const c = r < 0.25 ? colorA : r < 0.5 ? colorB : r < 0.75 ? colorC : colorD;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.04;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Subtle global scene rig that applies a buttery-smooth gentle parallax tilt
function SmoothParallaxRig({
  mousePosition,
  children,
}: {
  mousePosition: { x: number; y: number };
  children: React.ReactNode;
}) {
  const rigRef = useRef<THREE.Group>(null!);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(() => {
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, mousePosition.x, 0.025);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, mousePosition.y, 0.025);

    if (rigRef.current) {
      rigRef.current.rotation.y = smooth.current.x * 0.04;
      rigRef.current.rotation.x = -smooth.current.y * 0.03;
      rigRef.current.position.x = smooth.current.x * 0.12;
      rigRef.current.position.y = smooth.current.y * 0.08;
    }
  });

  return <group ref={rigRef}>{children}</group>;
}

// Right-Side Cluster containing the Photographer Centerpiece and surrounding 3D accents
function HeroRightCluster({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 7.2;

  // On desktop/tablet, position the cluster on the right side of the screen
  const rightShiftX = isMobile ? 0 : Math.min(Math.max(viewport.width * 0.26, 1.8), 2.5);

  return (
    <group position={[rightShiftX, 0, 0]}>
      {/* CENTERPIECE: Photographer with DSLR Cutout Fitted to Screen */}
      <CenterpiecePhotoFrame mousePosition={mousePosition} />
    </group>
  );
}

// Main 3D Hero Scene with Centerpiece Photo and Anti-Gravity Surround Elements
export const HeroScene3D: React.FC<{ mousePosition: { x: number; y: number } }> = ({
  mousePosition,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />

        {/* Cinematic Studio Warm Key Light */}
        <pointLight position={[4.5, 3.5, 3.0]} intensity={3.2} color="#ff4d22" distance={14} />

        {/* Anamorphic Cyan Fill & Rim Backlight */}
        <pointLight position={[-1.5, -2.5, -2.0]} intensity={3.2} color="#00e5ff" distance={12} />

        {/* Top Crisp Specular Spot over Right Cluster */}
        <spotLight
          position={[2.0, 6, 4.5]}
          intensity={2.2}
          color="#ffffff"
          angle={0.6}
          penumbra={0.8}
        />

        <SmoothParallaxRig mousePosition={mousePosition}>
          <HeroRightCluster mousePosition={mousePosition} />
        </SmoothParallaxRig>

        {/* Cinematic Dust Particle Field */}
        <CinematicDustParticles count={150} />
      </Canvas>
    </div>
  );
};
