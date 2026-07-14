// The 3D LENS DIVE (George, 2026-07-14): after the 2D write-on, the camera
// travels THROUGH an actual lens barrel — machined rings with knurling,
// glass elements flashing past, a real 8-blade aperture that swings open as
// you reach it — and at the far end of the barrel the SHOWREEL is playing.
// The dive ends by flying into the reel. Built in three.js, loaded
// dynamically so the bundle only pays for it on the loading screen.

import type {
  Group,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Sprite,
  WebGLRenderer,
} from "three";

export interface LensDive {
  /** drive the dive: p 0 → 1 (eased by the caller), renders the frame */
  apply: (p: number) => void;
  /** start the showreel texture playing, time-synced to the hero if possible */
  begin: () => void;
  dispose: () => void;
}

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// a soft radial glow, drawn once — used for the flare sprites
function flareTexture(hex: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, hex);
  grad.addColorStop(0.35, hex.slice(0, 7) + "55");
  grad.addColorStop(1, hex.slice(0, 7) + "00");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return c;
}

export async function createLensDive(canvas: HTMLCanvasElement): Promise<LensDive | null> {
  let T: typeof import("three");
  try {
    T = await import("three");
  } catch {
    return null;
  }

  let renderer: WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene: Scene = new T.Scene();
  scene.fog = new T.FogExp2(0x000000, 0.055);

  const cam: PerspectiveCamera = new T.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 220);
  cam.position.z = 4;

  // ── lighting: a cool key that rides with the camera + the brand-gold
  // glint sitting at the aperture housing
  scene.add(new T.AmbientLight(0xffffff, 0.32));
  const key = new T.PointLight(0xdfe6ff, 46, 34, 1.6);
  key.position.set(0.6, 0.8, 3.2);
  scene.add(key);
  const APERTURE_Z = -16;
  const gold = new T.PointLight(0xc9a96a, 26, 14, 1.5);
  gold.position.set(0, 0, APERTURE_Z + 1.4);
  scene.add(gold);

  const metal = new T.MeshStandardMaterial({ color: 0x17171a, metalness: 0.92, roughness: 0.38 });
  const bladeMat = new T.MeshStandardMaterial({ color: 0x0c0c0e, metalness: 0.85, roughness: 0.45, side: T.DoubleSide });

  // ── the barrel: machined rings receding down −z, tapering gently
  const RING_N = 12;
  const SPACING = 3.2;
  for (let i = 0; i < RING_N; i++) {
    const r = 3.5 - (i / RING_N) * 0.9;
    const tube = i % 3 === 0 ? 0.3 : 0.15;
    const ring = new T.Mesh(new T.TorusGeometry(r, tube, 16, 72), metal);
    ring.position.z = -i * SPACING;
    scene.add(ring);
    // knurling on every third ring — the focus-grip texture of a real lens
    if (i % 3 === 1) {
      const grip = new T.InstancedMesh(new T.BoxGeometry(0.08, 0.24, 0.12), metal, 48);
      const m = new T.Matrix4();
      const q = new T.Quaternion();
      const axis = new T.Vector3(0, 0, 1);
      for (let k = 0; k < 48; k++) {
        const a = (k / 48) * Math.PI * 2;
        q.setFromAxisAngle(axis, a);
        m.makeRotationFromQuaternion(q);
        m.setPosition(Math.cos(a) * (r + 0.12), Math.sin(a) * (r + 0.12), -i * SPACING);
        grip.setMatrixAt(k, m);
      }
      scene.add(grip);
    }
  }

  // ── glass elements: faint blue discs with a bright rim — they flash as
  // the camera passes through them
  const flareGold = new T.CanvasTexture(flareTexture("#c9a96aff"));
  const flareWhite = new T.CanvasTexture(flareTexture("#fff6e0ff"));
  for (const z of [-9, -27]) {
    const glass = new T.Mesh(
      new T.CircleGeometry(2.9, 48),
      new T.MeshBasicMaterial({ color: 0x9db8ff, transparent: true, opacity: 0.045, blending: T.AdditiveBlending, depthWrite: false }),
    );
    glass.position.z = z;
    scene.add(glass);
    const rim = new T.Mesh(
      new T.RingGeometry(2.72, 2.9, 64),
      new T.MeshBasicMaterial({ color: 0xfff2d8, transparent: true, opacity: 0.12, blending: T.AdditiveBlending, depthWrite: false }),
    );
    rim.position.z = z;
    scene.add(rim);
  }

  // ── the APERTURE: 8 blades pivoted on the housing ring, swinging open
  const housing = new T.Mesh(new T.TorusGeometry(2.85, 0.22, 16, 72), metal.clone());
  (housing.material as typeof metal).emissive = new T.Color(0xc9a96a);
  (housing.material as typeof metal).emissiveIntensity = 0.22;
  housing.position.z = APERTURE_Z;
  scene.add(housing);

  const blades: Group[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const g = new T.Group();
    g.position.set(Math.cos(a) * 2.7, Math.sin(a) * 2.7, APERTURE_Z);
    g.rotation.z = a;
    const blade: Mesh = new T.Mesh(new T.PlaneGeometry(2.6, 2.4), bladeMat);
    blade.position.x = -1.55; // reaches in toward the bore — closed iris
    g.add(blade);
    scene.add(g);
    blades.push(g);
  }
  const apertureFlare: Sprite = new T.Sprite(
    new T.SpriteMaterial({ map: flareGold, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false }),
  );
  apertureFlare.scale.setScalar(5);
  apertureFlare.position.z = APERTURE_Z - 0.4;
  scene.add(apertureFlare);

  // ── dust catching the light — sells the speed of the travel
  const P_N = 260;
  const pos = new Float32Array(P_N * 3);
  for (let i = 0; i < P_N; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.9 + Math.random() * 1.6;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.sin(a) * r;
    pos[i * 3 + 2] = 2 - Math.random() * 40;
  }
  const pGeo = new T.BufferGeometry();
  pGeo.setAttribute("position", new T.BufferAttribute(pos, 3));
  const pMat: PointsMaterial = new T.PointsMaterial({
    color: 0xfff6e0, size: 0.05, transparent: true, opacity: 0,
    map: flareWhite, // soft round motes, not hard squares
    blending: T.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const dust: Points = new T.Points(pGeo, pMat);
  scene.add(dust);

  // ── the far end of the barrel: the SHOWREEL, playing
  const vid = document.createElement("video");
  vid.src = "/videos/showreel-full.mp4";
  vid.muted = true;
  vid.playsInline = true;
  vid.loop = true;
  vid.preload = "auto";
  vid.load();
  const reelTex = new T.VideoTexture(vid);
  reelTex.colorSpace = T.SRGBColorSpace;
  const REEL_Z = -40;
  const reel = new T.Mesh(
    new T.PlaneGeometry(8, 4.5),
    new T.MeshBasicMaterial({ map: reelTex, toneMapped: false }),
  );
  reel.position.z = REEL_Z;
  scene.add(reel);
  const endGlow: Sprite = new T.Sprite(
    new T.SpriteMaterial({ map: flareWhite, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false }),
  );
  endGlow.scale.setScalar(13);
  endGlow.position.z = REEL_Z + 0.5;
  scene.add(endGlow);

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);

  const apply = (p: number) => {
    // travel: ends 2.6 units in front of the reel, where it fills the frame
    cam.position.z = 4 - 41.4 * p;
    const settle = 1 - p;
    cam.position.x = Math.sin(p * Math.PI * 2) * 0.12 * settle;
    cam.position.y = Math.cos(p * Math.PI * 1.5) * 0.08 * settle;
    cam.rotation.z = Math.sin(p * Math.PI) * 0.14;
    key.position.set(cam.position.x + 0.6, cam.position.y + 0.8, cam.position.z - 0.8);

    // the aperture swings open AS YOU CLOSE IN (camera reaches it at
    // p≈0.48) — the swing plays big on screen through the approach
    const open = smooth(0.26, 0.5, p);
    blades.forEach((g, i) => {
      g.rotation.z = (i / 8) * Math.PI * 2 + open * 1.35;
    });
    (apertureFlare.material as { opacity: number }).opacity =
      smooth(0.1, 0.34, p) * (1 - smooth(0.42, 0.6, p)) * 0.85;

    // dust bright through the middle of the run, gone at the landing
    pMat.opacity = smooth(0.05, 0.25, p) * (1 - smooth(0.8, 0.95, p)) * 0.55;

    // the fog lifts so the reel arrives clean; the end-glow gives way to it
    (scene.fog as { density: number }).density = 0.055 * (1 - 0.85 * p);
    (endGlow.material as { opacity: number }).opacity = 0.5 * (1 - smooth(0.6, 0.9, p));

    renderer.render(scene, cam);
  };

  const begin = () => {
    try {
      const hero = document.querySelector<HTMLVideoElement>(".hero-bg");
      if (hero && Number.isFinite(hero.currentTime) && vid.readyState >= 1) {
        vid.currentTime = vid.duration ? hero.currentTime % vid.duration : hero.currentTime;
      }
    } catch {
      /* sync is best-effort — the dive works from frame 0 too */
    }
    vid.play().catch(() => {});
  };

  const dispose = () => {
    window.removeEventListener("resize", onResize);
    vid.pause();
    vid.removeAttribute("src");
    scene.traverse((o) => {
      const m = o as Partial<Mesh>;
      if (m.geometry) m.geometry.dispose();
      const mat = (m as Mesh).material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else if (mat) mat.dispose();
    });
    reelTex.dispose();
    renderer.dispose();
  };

  apply(0); // first frame ready before the fade-in
  return { apply, begin, dispose };
}
