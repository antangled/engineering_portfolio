import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { MotionValue } from "motion/react";
import { ECCENTRICITY, KINEMA_MODEL, LABELS, LABEL_ANCHORS, PARTS, RATIO, SPAN } from "@/data/kinema";
import { cn } from "@/lib/utils";

/**
 * Phase 3b: Kinema's cycloidal drive in 3D (three.js via react-three-fiber).
 *
 * - `explode` 0..1 separates the parts along the axis (a MotionValue for
 *   scroll-driven use on the home card, or a number to ease toward on the
 *   project page's toggle).
 * - The drive runs for real: the eccentric shaft turns, both discs orbit the
 *   1 mm offset 180° apart while counter-rotating at 1/10, and the output
 *   plates follow at 1/10.
 * - Labels are DOM, positioned from projected 3D anchors every frame (no React
 *   renders in the loop).
 */

export type KinemaViewerProps = {
  explode: MotionValue<number> | number;
  /** Extra input-shaft angle (radians), e.g. from scroll. */
  turn?: MotionValue<number>;
  /** Extra yaw (radians), e.g. a slow drift with scroll. */
  yaw?: MotionValue<number>;
  /** Input-shaft speed when idle, rad/s. 0 = still. */
  speed?: number;
  /** Drag to rotate, hover to name a part. */
  interactive?: boolean;
  /** Pause rendering (scrolled away / covered). */
  active?: boolean;
  /** Render once (reduced motion): no loop, no drive. */
  still?: boolean;
  /**
   * Pose the first frame is drawn in (it matches a still image shown before the
   * model loads); the model then eases from it to the live scroll pose, so the
   * swap from still to canvas is seamless even after the user has scrolled.
   */
  startPose?: { explode: number; yaw: number; turn: number };
  onReady?: () => void;
  className?: string;
};

const MATS: Record<string, THREE.MeshStandardMaterialParameters> = {
  grey: { color: "#9aa1aa", metalness: 0.55, roughness: 0.36 },
  white: { color: "#eceef1", metalness: 0, roughness: 0.5 },
  black: { color: "#2b2e34", metalness: 0.25, roughness: 0.45 },
  orange: { color: "#ff5a1f", metalness: 0.05, roughness: 0.42 },
};

const SCALE = 10; // model is in metres; work in decimetres so the camera numbers stay sane
const BASE_YAW = -0.5;
const BASE_PITCH = 0.32;
/** screen roll, so the exploded axis runs corner to corner like a drawing */
const ROLL = -0.36;
const FOV = 26;
const DIAMETER = 106; // mm
// how much of the frame the model may use (labels need the rest)
const MARGIN_X = 0.84;
const MARGIN_Y = 0.74;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Shared = {
  drag: { yaw: number; pitch: number; yawNow: number; pitchNow: number };
  hovered: string | null;
  labels: Map<string, HTMLDivElement>;
  wrap: HTMLDivElement | null;
};

const isMV = (v: unknown): v is MotionValue<number> => typeof v === "object" && v !== null && "get" in v;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => x * x * (3 - 2 * x);
const damp = (cur: number, target: number, k: number, dt: number) => cur + (target - cur) * (1 - Math.exp(-k * dt));

type Part = {
  node: THREE.Object3D;
  name: string;
  def: (typeof PARTS)[string];
  /** disc centre at θ = 0 (x, y), metres */
  c0: [number, number];
  delay: number;
  mats: THREE.MeshStandardMaterial[];
};

function useEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
}

function Model({
  explode,
  turn,
  yaw,
  speed = 0,
  still,
  startPose,
  interactive,
  shared,
  onReady,
}: KinemaViewerProps & { shared: Shared }) {
  useEnvironment();
  const gltf = useLoader(GLTFLoader, KINEMA_MODEL, (loader) => {
    (loader as GLTFLoader).setMeshoptDecoder(MeshoptDecoder);
  });
  const root = useRef<THREE.Group>(null);
  const center = useRef<THREE.Group>(null);
  const widths = useRef(new Map<string, number>());
  const { camera, size, invalidate } = useThree();

  // Own copy of the scene + materials so highlight state never leaks between viewers.
  const { scene, parts, anchors } = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.updateMatrixWorld(true);
    const parts: Part[] = [];
    const maxOff = Math.max(...Object.values(PARTS).map((p) => Math.abs(p.explode)));
    for (const node of [...scene.children]) {
      const def = PARTS[node.name];
      if (!def) continue;
      const mats: THREE.MeshStandardMaterial[] = [];
      node.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const src = mesh.material as THREE.Material;
        const m = new THREE.MeshStandardMaterial({ ...(MATS[src.name] ?? MATS.grey), side: THREE.DoubleSide });
        m.emissive = new THREE.Color("#ff5a1f");
        m.emissiveIntensity = 0;
        mesh.material = m;
        mesh.userData.part = node.name;
        mats.push(m);
      });
      const phase = def.phase ?? 0;
      parts.push({
        node,
        name: node.name,
        def,
        c0: def.role === "disc" ? [ECCENTRICITY * Math.cos(phase), ECCENTRICITY * Math.sin(phase)] : [0, 0],
        // the parts that travel furthest leave first
        delay: 0.22 * (1 - Math.abs(def.explode) / maxOff),
        mats,
      });
    }
    // Label anchors: the part's axial centre, at its rim on the label's side.
    const anchors = new Map<string, { pos: THREE.Vector3; part: Part; side: 1 | -1 }>();
    for (const g of LABELS) {
      const a = LABEL_ANCHORS[g.id];
      const part = parts.find((p) => p.name === a.part);
      if (!part) continue;
      const box = new THREE.Box3().setFromObject(part.node);
      const pos = new THREE.Vector3(0, a.side > 0 ? box.max.y : box.min.y, (box.min.z + box.max.z) / 2);
      anchors.set(g.id, { pos, part, side: a.side });
    }
    return { scene, parts, anchors };
  }, [gltf]);

  useEffect(
    () => () => {
      for (const p of parts) for (const m of p.mats) m.dispose();
    },
    [parts]
  );

  const state = useRef({
    t: isMV(explode) ? explode.get() : explode,
    theta: 0,
    glow: new Map<string, number>(),
    ready: false,
    settle: 0,
    // catch-up from startPose to the live pose; `hold` keeps the first pose a
    // moment so the canvas is shown (and the still removed) before anything moves
    catchUp: startPose ? { ...startPose, hold: 0.12, on: true } : null,
  });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const s = state.current;
    let target = isMV(explode) ? explode.get() : explode;
    let yawNow = yaw?.get() ?? 0;
    let turnNow = turn?.get() ?? 0;
    const c = s.catchUp;
    if (c?.on) {
      if (!s.ready || c.hold > 0) {
        c.hold -= s.ready ? dt : 0;
      } else {
        c.explode = damp(c.explode, target, 4, dt);
        c.yaw = damp(c.yaw, yawNow, 4, dt);
        c.turn = damp(c.turn, turnNow, 4, dt);
        c.on = Math.abs(c.explode - target) > 0.002 || Math.abs(c.yaw - yawNow) > 0.002 || Math.abs(c.turn - turnNow) > 0.01;
      }
      if (c.on) {
        target = c.explode;
        yawNow = c.yaw;
        turnNow = c.turn;
      }
    }
    s.t = still || isMV(explode) ? target : damp(s.t, target, 5, dt);
    // no idle spin on the first frame, so it matches the still exactly
    if (!still && s.ready) s.theta += speed * dt;
    const theta = s.theta + turnNow;
    const alpha = -theta / RATIO;
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    for (const p of parts) {
      const local = smooth(clamp01((s.t - p.delay) / (1 - 0.22)));
      const z = (p.def.explode / 1000) * local;
      const n = p.node;
      if (p.def.role === "shaft") {
        n.position.set(0, 0, z);
        n.rotation.z = theta;
      } else if (p.def.role === "output") {
        n.position.set(0, 0, z);
        n.rotation.z = alpha;
      } else if (p.def.role === "disc") {
        const ph = p.def.phase ?? 0;
        const cx = ECCENTRICITY * Math.cos(theta + ph);
        const cy = ECCENTRICITY * Math.sin(theta + ph);
        // rotate about the disc's own centre, then carry it round the eccentric
        n.rotation.z = alpha;
        n.position.set(cx - (ca * p.c0[0] - sa * p.c0[1]), cy - (sa * p.c0[0] + ca * p.c0[1]), z);
      } else {
        n.position.set(0, 0, z);
      }
      // hover glow (eased)
      const want = shared.hovered && p.def.group === shared.hovered ? 0.08 : 0;
      const g = damp(s.glow.get(p.name) ?? 0, want, 10, dt);
      s.glow.set(p.name, g);
      for (const m of p.mats) m.emissiveIntensity = g;
    }

    // orientation: base 3/4 view + drag + scroll drift
    const d = shared.drag;
    d.yawNow = damp(d.yawNow, d.yaw, 6, dt);
    d.pitchNow = damp(d.pitchNow, d.pitch, 6, dt);
    if (root.current) {
      root.current.rotation.set(BASE_PITCH + d.pitchNow, Math.PI / 2 + BASE_YAW + d.yawNow + yawNow, 0);
    }

    // centre the current stack, and fit its projected length into the frame
    const e = smooth(clamp01(s.t));
    const lo = lerp(SPAN.assembled[0], SPAN.exploded[0], e);
    const hi = lerp(SPAN.assembled[1], SPAN.exploded[1], e);
    if (center.current) center.current.position.z = -((lo + hi) / 2) / 1000;
    // Exact fit: for points round the rim at each end of the stack, the camera distance
    // that puts it at the frame margin; take the furthest. (Camera looks down -z.)
    const aspect = size.width / Math.max(1, size.height);
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const r = DIAMETER / 2000;
    let fit = 0;
    if (center.current) {
      center.current.updateWorldMatrix(true, false);
      for (const cz of [lo / 1000, hi / 1000])
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          tmp.set(r * Math.cos(a), r * Math.sin(a), cz).applyMatrix4(center.current.matrixWorld);
          fit = Math.max(fit, tmp.z + Math.abs(tmp.x) / (tan * aspect * MARGIN_X), tmp.z + Math.abs(tmp.y) / (tan * MARGIN_Y));
        }
    }
    camera.position.set(0, 0, fit || 4);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    // labels: project anchors to pixels and write straight to the DOM
    if (center.current) {
      center.current.updateMatrixWorld(true);
      for (const [id, a] of anchors) {
        const el = shared.labels.get(id);
        if (!el) continue;
        const local = smooth(clamp01((s.t - a.part.delay) / (1 - 0.22)));
        tmp.copy(a.pos);
        tmp.z += (a.part.def.explode / 1000) * local;
        tmp.applyMatrix4(center.current.matrixWorld).project(camera);
        const x = (tmp.x * 0.5 + 0.5) * size.width;
        const y = (-tmp.y * 0.5 + 0.5) * size.height;
        const i = LABELS.findIndex((l) => l.id === id);
        const hov = !!interactive && shared.hovered === id;
        const show = hov ? 1 : clamp01((s.t - 0.62 - i * 0.025) / 0.2);
        // the detail line shows only on the hovered part (attribute write only on change)
        if (el.dataset.hover !== String(hov)) {
          el.dataset.hover = String(hov);
          el.style.zIndex = hov ? "2" : "1";
        }
        // keep the pill inside the frame (widths measured once, not every frame)
        let lw = widths.current.get(id);
        if (lw == null) {
          lw = el.offsetWidth;
          widths.current.set(id, lw);
        }
        const half = lw / 2 + 10;
        const cx = Math.min(size.width - half, Math.max(half, x));
        el.style.transform = `translate3d(${cx.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = show.toFixed(3);
      }
    }

    if (!s.ready) {
      s.ready = true;
      requestAnimationFrame(() => onReady?.());
    }
    // still mode renders on demand: a few frames after load/changes so labels settle
    if (still && s.settle-- > 0) invalidate();
  });

  // still mode: re-render when a prop changes (e.g. the Explode toggle)
  useEffect(() => {
    state.current.settle = 3;
    invalidate();
  }, [explode, still, size.width, size.height, invalidate]);

  // hover: name the part under the pointer
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    const name = e.object.userData.part as string | undefined;
    const group = name ? PARTS[name]?.group ?? null : null;
    shared.hovered = group;
    if (shared.wrap) shared.wrap.style.cursor = group ? "pointer" : "grab";
  };
  const onOut = () => {
    if (!interactive) return;
    shared.hovered = null;
    if (shared.wrap) shared.wrap.style.cursor = "grab";
  };

  return (
    <group rotation={[0, 0, ROLL]}>
      <group ref={root} scale={SCALE}>
        <group ref={center}>
          <primitive object={scene} onPointerMove={onMove} onPointerOut={onOut} />
        </group>
      </group>
    </group>
  );
}

export default function KinemaViewer(props: KinemaViewerProps) {
  const { interactive, active = true, still, className } = props;
  const shared = useRef<Shared>({
    drag: { yaw: 0, pitch: 0, yawNow: 0, pitchNow: 0 },
    hovered: null,
    labels: new Map(),
    wrap: null,
  }).current;

  // drag to rotate (pointer capture; vertical page scroll on touch still works)
  const dragFrom = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragFrom.current = { x: e.clientX, y: e.clientY, yaw: shared.drag.yaw, pitch: shared.drag.pitch };
    if (shared.wrap) shared.wrap.style.cursor = "grabbing";
  };
  const onDrag = (e: React.PointerEvent) => {
    const f = dragFrom.current;
    if (!f) return;
    shared.drag.yaw = f.yaw + (e.clientX - f.x) * 0.008;
    shared.drag.pitch = Math.max(-0.7, Math.min(0.9, f.pitch + (e.clientY - f.y) * 0.006));
  };
  const onUp = () => {
    dragFrom.current = null;
    if (shared.wrap) shared.wrap.style.cursor = "grab";
  };

  return (
    <div
      ref={(el) => {
        shared.wrap = el;
      }}
      className={cn("relative h-full w-full", interactive && "cursor-grab touch-pan-y select-none", className)}
      onPointerDown={onDown}
      onPointerMove={onDrag}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <Canvas
        // idle = "demand", not "never": the mount effect's invalidate() still draws
        // one frame off screen, so the model is uploaded and ready before it's seen
        frameloop={still ? "demand" : active ? "always" : "demand"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: FOV, near: 0.1, far: 50, position: [0, 0, 4] }}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 5, 4]} intensity={1.7} />
        <directionalLight position={[-5, 1.5, -5]} intensity={3} color="#ff5a1f" />
        <directionalLight position={[-3, -3, 3]} intensity={0.35} />
        <Model {...props} shared={shared} />
      </Canvas>

      {/* part names, positioned by the scene each frame */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((l) => {
          const side = LABEL_ANCHORS[l.id].side;
          return (
            <div
              key={l.id}
              ref={(el) => {
                if (el) shared.labels.set(l.id, el);
                else shared.labels.delete(l.id);
              }}
              className="group/label absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <div
                className={cn(
                  "flex -translate-x-1/2 flex-col items-center",
                  side > 0 ? "-translate-y-full flex-col-reverse" : ""
                )}
              >
                <span className="h-2 w-2 rounded-full bg-signal ring-4 ring-signal/20" />
                <span className={cn("h-5 w-px bg-white/35", side > 0 ? "mb-0" : "mt-0")} />
                <span className="whitespace-nowrap rounded-xl bg-black/75 px-3 py-1.5 text-center font-mono text-[11px] uppercase tracking-wider text-white ring-1 ring-white/10">
                  {l.label}
                  {interactive && l.detail && (
                    <span className="hidden normal-case tracking-normal text-white/60 group-data-[hover=true]/label:block">
                      {l.detail}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* screen-reader summary of what the picture shows */}
      <p className="sr-only">
        3D model of Kinema&apos;s cycloidal actuator. Parts: {LABELS.map((l) => l.label).join(", ")}.
      </p>
    </div>
  );
}
