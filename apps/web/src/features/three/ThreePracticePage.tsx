'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type GeometryKind = 'icosahedron' | 'torus-knot' | 'dodecahedron';
type MaterialKind = 'energy' | 'wireframe' | 'glass';

const geometryLabels: Readonly<Record<GeometryKind, string>> = {
  icosahedron: 'Icosahedron',
  'torus-knot': 'Torus knot',
  dodecahedron: 'Dodecahedron',
};

const geometryConstructors: Readonly<Record<GeometryKind, string>> = {
  icosahedron: 'IcosahedronGeometry',
  'torus-knot': 'TorusKnotGeometry',
  dodecahedron: 'DodecahedronGeometry',
};

const materialLabels: Readonly<Record<MaterialKind, string>> = {
  energy: 'Energy surface',
  wireframe: 'Wireframe',
  glass: 'Glass shell',
};

function createGeometry(kind: GeometryKind): THREE.BufferGeometry {
  if (kind === 'torus-knot') {
    return new THREE.TorusKnotGeometry(1.05, 0.34, 180, 24, 2, 3);
  }

  if (kind === 'dodecahedron') {
    return new THREE.DodecahedronGeometry(1.35, 2);
  }

  return new THREE.IcosahedronGeometry(1.42, 4);
}

function createMaterial(kind: MaterialKind): THREE.Material {
  if (kind === 'wireframe') {
    return new THREE.MeshBasicMaterial({
      color: '#8cf7ff',
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
  }

  if (kind === 'glass') {
    return new THREE.MeshPhysicalMaterial({
      color: '#b5c8ff',
      emissive: '#342c7c',
      emissiveIntensity: 0.45,
      metalness: 0.05,
      roughness: 0.08,
      transmission: 0.72,
      thickness: 1.4,
      transparent: true,
      opacity: 0.9,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: '#765cff',
    emissive: '#25145d',
    emissiveIntensity: 0.7,
    metalness: 0.55,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
}

function ThreeStage({
  geometryKind,
  materialKind,
  speed,
  paused,
}: Readonly<{
  geometryKind: GeometryKind;
  materialKind: MaterialKind;
  speed: number;
  paused: boolean;
}>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof globalThis.WebGLRenderingContext === 'undefined') {
      return;
    }

    const container = canvas.parentElement;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050509', 0.075);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, 6.3);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const group = new THREE.Group();
    scene.add(group);

    const geometry = createGeometry(geometryKind);
    const material = createMaterial(materialKind);
    const object = new THREE.Mesh(geometry, material);
    group.add(object);

    const edgeGeometry = new THREE.EdgesGeometry(geometry, 22);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: '#d9ff57',
      transparent: true,
      opacity: materialKind === 'wireframe' ? 0.18 : 0.38,
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.scale.setScalar(1.006);
    group.add(edges);

    const orbitGeometry = new THREE.TorusGeometry(2.12, 0.012, 8, 180);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: '#ff6542',
      transparent: true,
      opacity: 0.72,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.set(1.08, 0.2, 0.4);
    group.add(orbit);

    const secondOrbit = orbit.clone();
    secondOrbit.scale.setScalar(0.83);
    secondOrbit.rotation.set(0.35, 1.1, 0.2);
    group.add(secondOrbit);

    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(900 * 3);
    let seed = 1837;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let index = 0; index < positions.length; index += 3) {
      const radius = 5 + random() * 11;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[index] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = radius * Math.cos(phi);
    }

    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    const starsMaterial = new THREE.PointsMaterial({
      color: '#aeb9ff',
      opacity: 0.64,
      size: 0.028,
      sizeAttenuation: true,
      transparent: true,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    scene.add(new THREE.HemisphereLight('#b8c8ff', '#100520', 2.1));

    const keyLight = new THREE.PointLight('#8b72ff', 48, 18, 2);
    keyLight.position.set(3.5, 2.8, 4.4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#d9ff57', 32, 15, 2);
    rimLight.position.set(-4, -1.2, 2.5);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight('#ff6542', 25, 13, 2);
    warmLight.position.set(1, -4, -1);
    scene.add(warmLight);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    );
    let animationFrame = 0;
    let isVisible = true;
    let previousTime = performance.now();

    const resize = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.render(scene, camera);
    };

    const renderFrame = (time: number) => {
      animationFrame = 0;
      const delta = Math.min(0.04, (time - previousTime) / 1000);
      previousTime = time;

      pointer.lerp(pointerTarget, 0.055);
      camera.position.x = pointer.x * 0.42;
      camera.position.y = 0.15 + pointer.y * 0.28;
      camera.lookAt(0, 0, 0);

      if (!paused && !reducedMotion?.matches) {
        group.rotation.y += delta * speed * 0.48;
        group.rotation.x += delta * speed * 0.11;
        orbit.rotation.z -= delta * speed * 0.22;
        secondOrbit.rotation.z += delta * speed * 0.18;
        stars.rotation.y -= delta * 0.012;
      }

      renderer.render(scene, camera);
      if (isVisible) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointerTarget.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };

    const handlePointerLeave = () => pointerTarget.set(0, 0);
    const handleMotionChange = () => renderer.render(scene, camera);
    const visibilityObserver =
      typeof globalThis.IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? true;

              if (!isVisible && animationFrame) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = 0;
              } else if (isVisible && !animationFrame) {
                previousTime = performance.now();
                animationFrame = window.requestAnimationFrame(renderFrame);
              }
            },
            { rootMargin: '180px 0px' },
          );

    resize();
    animationFrame = window.requestAnimationFrame(renderFrame);
    visibilityObserver?.observe(canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    reducedMotion?.addEventListener('change', handleMotionChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      reducedMotion?.removeEventListener('change', handleMotionChange);
      visibilityObserver?.disconnect();

      geometry.dispose();
      material.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
    };
  }, [geometryKind, materialKind, paused, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full touch-none"
      aria-label={`Interactive Three.js ${geometryLabels[geometryKind]} scene using ${materialLabels[materialKind]}`}
      role="img"
    />
  );
}

function LabSelect<T extends string>({
  label,
  value,
  options,
  labels,
  onChange,
}: Readonly<{
  label: string;
  value: T;
  options: readonly T[];
  labels: Readonly<Record<T, string>>;
  onChange: (value: T) => void;
}>) {
  return (
    <label className="grid gap-2 font-mono text-[0.63rem] font-black tracking-[0.15em] text-white/55 uppercase">
      {label}
      <select
        className="h-12 cursor-pointer rounded-none border border-white/25 bg-[#11101b] px-3 text-sm font-bold tracking-normal text-white normal-case"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option]}
          </option>
        ))}
      </select>
    </label>
  );
}

const sceneGraph = [
  {
    number: '01',
    title: 'Scene',
    copy: 'The container for every mesh, light, particle, and helper.',
    code: 'new THREE.Scene()',
  },
  {
    number: '02',
    title: 'Camera',
    copy: 'A perspective view that turns 3D coordinates into a framed image.',
    code: 'PerspectiveCamera(42, aspect)',
  },
  {
    number: '03',
    title: 'Renderer',
    copy: 'The WebGL bridge that paints the scene into a canvas each frame.',
    code: 'renderer.render(scene, camera)',
  },
  {
    number: '04',
    title: 'Mesh',
    copy: 'Geometry defines the shape. Material defines how light meets it.',
    code: 'new THREE.Mesh(geometry, material)',
  },
] as const;

export function ThreePracticePage() {
  const [geometryKind, setGeometryKind] = useState<GeometryKind>('icosahedron');
  const [materialKind, setMaterialKind] = useState<MaterialKind>('energy');
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#07070b] text-[#f4f2ea]">
      <header className="sticky top-0 z-50 flex min-h-[68px] items-center justify-between border-b border-white/15 bg-[#07070b]/84 px-[4vw] backdrop-blur-xl">
        <Link
          className="text-sm font-black tracking-[-0.03em] text-white no-underline"
          href="/"
          aria-label="On T React Lab home"
        >
          ON T <span className="font-semibold text-white/45">/ THREE LAB</span>
        </Link>
        <nav
          className="flex items-center gap-5 text-[0.68rem] font-black tracking-[0.1em] uppercase sm:gap-8"
          aria-label="Three.js practice sections"
        >
          <a
            className="hidden text-white hover:text-[#d9ff57] sm:block"
            href="#scene"
          >
            Scene
          </a>
          <a
            className="hidden text-white hover:text-[#d9ff57] sm:block"
            href="#lab"
          >
            Lab
          </a>
          <a
            className="hidden text-white hover:text-[#d9ff57] md:block"
            href="#pipeline"
          >
            Pipeline
          </a>
          <Link className="text-[#d9ff57]" href="/motion">
            Motion lab
          </Link>
        </nav>
      </header>

      <section className="relative min-h-[calc(100svh-68px)] overflow-hidden border-b border-white/15">
        <ThreeStage
          geometryKind={geometryKind}
          materialKind={materialKind}
          speed={speed}
          paused={paused}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,transparent_0,transparent_24%,rgba(7,7,11,0.3)_54%,#07070b_92%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

        <div className="pointer-events-none relative z-10 flex min-h-[calc(100svh-68px)] flex-col justify-between px-[4vw] py-10 md:py-14">
          <div className="flex items-start justify-between gap-8">
            <p className="font-mono text-[0.66rem] font-black tracking-[0.18em] text-[#d9ff57] uppercase">
              Three.js · Practice 004
            </p>
            <p className="hidden max-w-48 text-right font-mono text-[0.6rem] leading-5 tracking-widest text-white/40 uppercase sm:block">
              Move your pointer
              <br />
              to shift the camera
            </p>
          </div>

          <div>
            <h1 className="max-w-[8ch] text-[clamp(4.2rem,11vw,11rem)] leading-[0.78] font-black tracking-[-0.09em]">
              Shape the invisible.
            </h1>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
              <p className="max-w-xl text-base leading-7 text-white/62 md:text-xl md:leading-8">
                Build a scene from coordinates, light, and time. Then change one
                parameter and watch the whole system respond.
              </p>
              <a
                className="pointer-events-auto inline-flex min-h-13 min-w-56 items-center justify-between border border-white/25 bg-white px-4 text-xs font-black tracking-widest text-[#07070b] uppercase transition-all duration-300 hover:min-w-64 hover:bg-[#d9ff57]"
                href="#lab"
              >
                Enter the lab <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 z-20 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-[#d9ff57]" />
      </section>

      <section
        className="scroll-mt-[68px] border-b border-white/15 px-[4vw] py-24 lg:py-36"
        id="scene"
      >
        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-[0.66rem] font-black tracking-[0.18em] text-[#ff6542] uppercase">
              The scene graph
            </p>
            <h2 className="max-w-[10ch] text-[clamp(3.2rem,7vw,7rem)] leading-[0.88] font-black tracking-[-0.075em]">
              Four pieces. One world.
            </h2>
          </div>
          <p className="max-w-xl leading-7 text-white/52">
            Three.js is a hierarchy. Objects inherit transforms from their
            parents, cameras decide what is visible, and the renderer resolves
            it all into pixels.
          </p>
        </div>

        <ol className="grid gap-px border border-white/15 bg-white/15 md:grid-cols-2 xl:grid-cols-4">
          {sceneGraph.map((item) => (
            <li
              className="flex min-h-[22rem] flex-col bg-[#0d0c14] p-7 transition-colors duration-300 hover:bg-[#151222]"
              key={item.number}
            >
              <span className="font-mono text-xs font-black text-[#8b72ff]">
                {item.number}
              </span>
              <h3 className="mt-16 text-4xl font-black tracking-[-0.06em]">
                {item.title}
              </h3>
              <p className="mt-4 leading-6 text-white/50">{item.copy}</p>
              <code className="mt-auto border-t border-white/15 pt-5 text-[0.66rem] leading-5 text-[#d9ff57]">
                {item.code}
              </code>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="scroll-mt-[68px] border-b border-white/15 bg-[#0d0c14] px-[4vw] py-24 lg:py-36"
        id="lab"
      >
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="mb-5 font-mono text-[0.66rem] font-black tracking-[0.18em] text-[#d9ff57] uppercase">
              Live parameter lab
            </p>
            <h2 className="text-[clamp(3.2rem,7vw,7rem)] leading-[0.88] font-black tracking-[-0.075em]">
              Change the system.
            </h2>
          </div>
          <p className="max-w-md leading-7 text-white/52">
            Every control rebuilds or updates part of the same Three.js scene.
            Pause before comparing silhouettes and surface response.
          </p>
        </div>

        <div className="grid border border-white/15 bg-white/15 lg:grid-cols-[0.72fr_1.28fr] lg:gap-px">
          <div className="grid content-start gap-7 bg-[#11101b] p-6 md:p-9">
            <LabSelect
              label="Geometry"
              value={geometryKind}
              options={['icosahedron', 'torus-knot', 'dodecahedron']}
              labels={geometryLabels}
              onChange={setGeometryKind}
            />
            <LabSelect
              label="Material"
              value={materialKind}
              options={['energy', 'wireframe', 'glass']}
              labels={materialLabels}
              onChange={setMaterialKind}
            />

            <label className="grid gap-3 font-mono text-[0.63rem] font-black tracking-[0.15em] text-white/55 uppercase">
              <span className="flex justify-between">
                Rotation speed <output>{speed.toFixed(1)}×</output>
              </span>
              <input
                aria-label="Rotation speed"
                className="h-2 w-full cursor-pointer accent-[#d9ff57]"
                type="range"
                min="0.2"
                max="2.4"
                step="0.1"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
              />
            </label>

            <button
              className="min-h-13 border border-white/25 bg-[#d9ff57] px-5 text-xs font-black tracking-widest text-[#07070b] uppercase transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0_#8b72ff]"
              type="button"
              onClick={() => setPaused((current) => !current)}
            >
              {paused ? 'Resume animation' : 'Pause animation'}
            </button>

            <div className="border-l-4 border-[#8b72ff] bg-[#090810] p-4">
              <span className="font-mono text-[0.58rem] font-black tracking-widest text-white/40 uppercase">
                Current construction
              </span>
              <code className="mt-3 block text-xs leading-6 text-[#a99bff]">
                new THREE.{geometryConstructors[geometryKind]}()
                <br />
                {materialKind === 'wireframe'
                  ? 'MeshBasicMaterial({ wireframe: true })'
                  : materialKind === 'glass'
                    ? 'MeshPhysicalMaterial({ transmission: .72 })'
                    : 'MeshPhysicalMaterial({ clearcoat: 1 })'}
              </code>
            </div>
          </div>

          <div className="relative min-h-[38rem] overflow-hidden bg-[#050509]">
            <ThreeStage
              geometryKind={geometryKind}
              materialKind={materialKind}
              speed={speed}
              paused={paused}
            />
            <span className="pointer-events-none absolute top-5 left-5 font-mono text-[0.58rem] font-black tracking-widest text-white/35 uppercase">
              Live WebGL viewport
            </span>
            <div className="pointer-events-none absolute right-5 bottom-5 flex gap-2">
              <span className="border border-white/20 px-2 py-1 font-mono text-[0.55rem] text-white/45">
                900 POINTS
              </span>
              <span className="border border-white/20 px-2 py-1 font-mono text-[0.55rem] text-white/45">
                3 LIGHTS
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="grid scroll-mt-[68px] border-b border-white/15 lg:grid-cols-[0.8fr_1.2fr]"
        id="pipeline"
      >
        <div className="bg-[#765cff] px-[4vw] py-24 text-[#090810] lg:py-32">
          <p className="mb-5 font-mono text-[0.66rem] font-black tracking-[0.18em] uppercase">
            The render loop
          </p>
          <h2 className="max-w-[8ch] text-[clamp(3.2rem,6vw,6rem)] leading-[0.88] font-black tracking-[-0.075em]">
            Time changes the frame.
          </h2>
          <p className="mt-8 max-w-md leading-7 text-[#221951]">
            Update state, render once, then ask the browser for the next frame.
            Delta time keeps movement stable across different refresh rates.
          </p>
        </div>

        <div className="flex items-center bg-[#050509] p-6 md:p-12 lg:p-16">
          <pre className="w-full overflow-x-auto border border-white/15 bg-[#0d0c14] p-6 text-[0.72rem] leading-7 text-white/72 md:p-10 md:text-sm">
            <code>
              <span className="text-[#ff6542]">function</span>{' '}
              <span className="text-[#d9ff57]">animate</span>(time) {'{'}
              {'\n'} const delta = clock.getDelta();
              {'\n'} mesh.rotation.y += delta * speed;
              {'\n'} camera.position.x = pointer.x * 0.42;
              {'\n'}
              {'\n'} renderer.render(scene, camera);
              {'\n'} requestAnimationFrame(animate);
              {'\n'}
              {'}'}
            </code>
          </pre>
        </div>
      </section>

      <section className="grid gap-12 px-[4vw] py-24 lg:grid-cols-[0.75fr_1.25fr] lg:py-32">
        <div>
          <p className="mb-5 font-mono text-[0.66rem] font-black tracking-[0.18em] text-[#ff6542] uppercase">
            Performance rules
          </p>
          <h2 className="max-w-[8ch] text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.9] font-black tracking-[-0.07em]">
            Keep every frame affordable.
          </h2>
        </div>

        <ol className="m-0 border-t border-white/20 p-0">
          {[
            [
              'Dispose resources',
              'Release geometries, materials, and the renderer during cleanup.',
            ],
            [
              'Cap pixel ratio',
              'Use at most 2× density so high-DPI screens do not multiply GPU work.',
            ],
            [
              'Reuse objects',
              'Update transforms in the loop instead of rebuilding scene objects every frame.',
            ],
            [
              'Respect motion settings',
              'Stop decorative rotation when the user prefers reduced motion.',
            ],
          ].map(([title, copy], index) => (
            <li
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-white/20 py-6"
              key={title}
            >
              <span className="font-mono text-xs font-black text-[#8b72ff]">
                0{index + 1}
              </span>
              <div>
                <strong className="text-xl tracking-[-0.03em]">{title}</strong>
                <p className="mt-2 leading-6 text-white/48">{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="flex min-h-44 flex-col items-start justify-between gap-8 border-t border-white/15 bg-[#d9ff57] px-[4vw] py-10 text-[#07070b] sm:flex-row sm:items-center">
        <div>
          <strong className="text-sm font-black">ON T / THREE LAB</strong>
          <p className="mt-2 text-sm text-[#414b17]">
            Create the scene. Move the camera. Render the next frame.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-xs font-black uppercase">
          <Link className="underline underline-offset-4" href="/">
            React lab
          </Link>
          <Link className="underline underline-offset-4" href="/web3">
            Web3 lab
          </Link>
          <Link className="underline underline-offset-4" href="/motion">
            Motion lab
          </Link>
        </div>
      </footer>
    </main>
  );
}
