import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Volume2, VolumeX, Eye, Coffee, Play, CheckCircle2 } from 'lucide-react';
import { CapsuleItem } from '../types/kanu';

interface Capsule3DViewerProps {
  selectedCapsule: CapsuleItem;
  onSelectCapsule: (capsule: CapsuleItem) => void;
  allCapsules: CapsuleItem[];
  onAddToCart: (capsule: CapsuleItem) => void;
}

export const Capsule3DViewer: React.FC<Capsule3DViewerProps> = ({
  selectedCapsule,
  onSelectCapsule,
  allCapsules,
  onAddToCart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [addedToast, setAddedToast] = useState(false);
  const [viewAngle, setViewAngle] = useState<'front' | 'angle' | 'top'>('angle');

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const capsuleGroupRef = useRef<THREE.Group | null>(null);
  const shadowPlaneRef = useRef<THREE.Mesh | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const foilMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const rimMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Interaction & auto-rotation refs
  const isAutoRotatingRef = useRef(true);
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.006 });
  const pointerTargetRef = useRef({ x: 0, y: 0 });

  // Web Audio Context for coffee extraction sound synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthesized espresso extraction sound
  const playExtractionAudio = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. Pre-infusion steam hiss (filtered noise)
      const bufferSize = ctx.sampleRate * 4.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 1.2);
      filter.Q.value = 3.0;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4.2);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start();

      // 2. Low-frequency extraction pump hum (9.5 bar pump)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      oscGain.gain.setValueAtTime(0.08, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4.2);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // Handle Extraction Trigger
  const handleStartExtraction = () => {
    if (isExtracting) return;
    setIsExtracting(true);
    setExtractionProgress(0);
    playExtractionAudio();

    const duration = 4000;
    const interval = 40;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setExtractionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsExtracting(false), 1200);
          return 100;
        }
        return Math.min(prev + step, 100);
      });
    }, interval);
  };

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera (Centered on capsule origin with comfortable framing)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.95, 6.4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambientLight);

    // Warm Key Light (Top-Right)
    const keyLight = new THREE.DirectionalLight(0xffecd0, 2.6);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Cool Rim Light (Back-Left for crisp metallic silhouette)
    const rimLight = new THREE.DirectionalLight(0x70a0ff, 2.0);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Bottom Bounce Light (Warm tone for under-capsule reflection)
    const bounceLight = new THREE.DirectionalLight(0xc5a059, 0.9);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 5. Build KANU Capsule 3D Model
    const capsuleGroup = new THREE.Group();
    capsuleGroup.position.set(0, 0.08, 0);

    // Create Foil Texture Canvas for authentic micro-brushed look
    const foilCanvas = document.createElement('canvas');
    foilCanvas.width = 512;
    foilCanvas.height = 512;
    const fCtx = foilCanvas.getContext('2d');
    if (fCtx) {
      fCtx.fillStyle = '#ffffff';
      fCtx.fillRect(0, 0, 512, 512);

      // Concentric circular brush lines
      fCtx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      fCtx.lineWidth = 1.5;
      for (let r = 20; r < 250; r += 8) {
        fCtx.beginPath();
        fCtx.arc(256, 256, r, 0, Math.PI * 2);
        fCtx.stroke();
      }

      // KANU Logo on Foil Top
      fCtx.fillStyle = '#111111';
      fCtx.font = 'bold 44px sans-serif';
      fCtx.textAlign = 'center';
      fCtx.textBaseline = 'middle';
      fCtx.fillText('KANU', 256, 230);

      fCtx.font = '16px sans-serif';
      fCtx.letterSpacing = '3px';
      fCtx.fillText('BARISTA CAPSULE', 256, 280);
    }
    const foilTexture = new THREE.CanvasTexture(foilCanvas);
    foilTexture.generateMipmaps = true;

    // Body Material
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedCapsule.colorHex),
      metalness: 0.65,
      roughness: 0.28,
      envMapIntensity: 1.5,
    });
    bodyMaterialRef.current = bodyMaterial;

    // Foil Top Seal Material
    const foilMaterial = new THREE.MeshStandardMaterial({
      map: foilTexture,
      color: new THREE.Color(selectedCapsule.accentHex),
      metalness: 0.88,
      roughness: 0.22,
    });
    foilMaterialRef.current = foilMaterial;

    // Rim Flange Material
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedCapsule.accentHex),
      metalness: 0.9,
      roughness: 0.2,
    });
    rimMaterialRef.current = rimMaterial;

    // Mesh 1: Tapered Cup Body (Smooth cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(1.45, 0.95, 2.3, 64, 4, false);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = 0;
    capsuleGroup.add(bodyMesh);

    // Mesh 2: Bottom chamfered dome base
    const baseGeometry = new THREE.CylinderGeometry(0.95, 0.8, 0.22, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, bodyMaterial);
    baseMesh.position.y = -1.25;
    capsuleGroup.add(baseMesh);

    // Mesh 3: Flanged Top Rim Lip (Distinctive capsule edge)
    const rimGeometry = new THREE.CylinderGeometry(1.65, 1.65, 0.08, 64);
    const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
    rimMesh.position.y = 1.15;
    rimMesh.castShadow = true;
    capsuleGroup.add(rimMesh);

    // Mesh 4: Top Foil Membrane Lid
    const foilGeometry = new THREE.CylinderGeometry(1.52, 1.52, 0.04, 64);
    const foilMesh = new THREE.Mesh(foilGeometry, foilMaterial);
    foilMesh.position.y = 1.18;
    capsuleGroup.add(foilMesh);

    // Mesh 5: Embossed Gold Band Accent around upper body
    const bandGeometry = new THREE.CylinderGeometry(1.36, 1.34, 0.16, 64);
    const bandMesh = new THREE.Mesh(bandGeometry, rimMaterial);
    bandMesh.position.y = 0.7;
    capsuleGroup.add(bandMesh);

    // Gentle Shadow Plane under capsule
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.65;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowPlaneRef.current = shadowPlane;

    // Default angle: tilt slightly towards camera to show both body and top foil
    capsuleGroup.rotation.x = 0.35;
    capsuleGroup.rotation.y = 0.5;
    scene.add(capsuleGroup);
    capsuleGroupRef.current = capsuleGroup;

    // 6. Animation Loop
    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      if (capsuleGroupRef.current) {
        // Handle auto-rotation using ref so toggle updates take effect immediately
        if (isAutoRotatingRef.current && !isDraggingRef.current) {
          capsuleGroupRef.current.rotation.y += delta * 0.9;
        }

        // Apply drag inertia decay
        if (!isDraggingRef.current) {
          capsuleGroupRef.current.rotation.y += rotationVelocityRef.current.y;
          capsuleGroupRef.current.rotation.x += rotationVelocityRef.current.x;

          // Clamp X rotation so it doesn't flip completely upside down
          capsuleGroupRef.current.rotation.x = Math.max(
            -0.3,
            Math.min(1.2, capsuleGroupRef.current.rotation.x)
          );

          // Friction damping
          rotationVelocityRef.current.y *= 0.94;
          rotationVelocityRef.current.x *= 0.94;
        }

        // Smooth left/right & subtle vertical movement following mouse pointer
        const targetPosX = pointerTargetRef.current.x * 0.85;
        const targetFloatY = 0.08 + pointerTargetRef.current.y * 0.16 + Math.sin(currentTime * 0.002) * 0.07;
        const targetTiltZ = -pointerTargetRef.current.x * 0.12;

        capsuleGroupRef.current.position.x += (targetPosX - capsuleGroupRef.current.position.x) * 0.08;
        capsuleGroupRef.current.position.y += (targetFloatY - capsuleGroupRef.current.position.y) * 0.12;
        capsuleGroupRef.current.rotation.z += (targetTiltZ - capsuleGroupRef.current.rotation.z) * 0.08;

        if (shadowPlaneRef.current) {
          shadowPlaneRef.current.position.x = capsuleGroupRef.current.position.x;
        }
      }

      renderer.render(scene, camera);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    // 7. Window & Container Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Keep auto-rotation ref synchronized with React state
  useEffect(() => {
    isAutoRotatingRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Update materials when selected capsule changes
  useEffect(() => {
    if (!bodyMaterialRef.current || !foilMaterialRef.current || !rimMaterialRef.current) return;

    // Smooth color change
    const targetBodyColor = new THREE.Color(selectedCapsule.colorHex);
    const targetAccentColor = new THREE.Color(selectedCapsule.accentHex);

    bodyMaterialRef.current.color.copy(targetBodyColor);
    foilMaterialRef.current.color.copy(targetAccentColor);
    rimMaterialRef.current.color.copy(targetAccentColor);

    // Adjust roughness & metalness based on roast profile
    if (selectedCapsule.roastCategory === 'dark') {
      bodyMaterialRef.current.roughness = 0.22;
      bodyMaterialRef.current.metalness = 0.75;
    } else if (selectedCapsule.roastCategory === 'light') {
      bodyMaterialRef.current.roughness = 0.35;
      bodyMaterialRef.current.metalness = 0.55;
    } else {
      bodyMaterialRef.current.roughness = 0.28;
      bodyMaterialRef.current.metalness = 0.65;
    }
  }, [selectedCapsule]);

  // Pointer / Drag Event Handlers for 3D rotation & left/right mouse tracking
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerTargetRef.current = {
        x: Math.max(-1, Math.min(1, normX)),
        y: Math.max(-1, Math.min(1, normY)),
      };
    }

    if (!isDraggingRef.current || !capsuleGroupRef.current) return;

    const deltaX = e.clientX - previousPointerPositionRef.current.x;
    const deltaY = e.clientY - previousPointerPositionRef.current.y;

    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.007;
    capsuleGroupRef.current.rotation.y += deltaX * sensitivity;
    capsuleGroupRef.current.rotation.x += deltaY * sensitivity;
    capsuleGroupRef.current.rotation.x = Math.max(
      -0.3,
      Math.min(1.2, capsuleGroupRef.current.rotation.x)
    );

    // Record velocity for release momentum
    rotationVelocityRef.current = {
      x: deltaY * sensitivity * 0.4,
      y: deltaX * sensitivity * 0.4,
    };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    pointerTargetRef.current = { x: 0, y: 0 };
  };

  // Preset Angle Switches
  const setCameraPreset = (angle: 'front' | 'angle' | 'top') => {
    setViewAngle(angle);
    if (!capsuleGroupRef.current) return;

    if (angle === 'front') {
      capsuleGroupRef.current.rotation.x = 0.05;
      capsuleGroupRef.current.rotation.y = 0;
    } else if (angle === 'angle') {
      capsuleGroupRef.current.rotation.x = 0.38;
      capsuleGroupRef.current.rotation.y = 0.65;
    } else if (angle === 'top') {
      capsuleGroupRef.current.rotation.x = 1.05;
      capsuleGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <section id="capsules-3d" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-2 text-xs tracking-widest text-[#c5a059] uppercase mb-3 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Capsule Studio</span>
          <span aria-hidden="true">·</span>
          <span>360° Real-time Inspection</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-2xl text-balance">
          카누 캡슐 3D 에디션
        </h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl">
          마우스로 직접 드래그하여 360° 모든 각도에서 세밀한 알루미늄 마감과 황금빛 로스팅 링을 확인하고,
          가상 에스프레소 추출을 경험해 보세요.
        </p>
      </div>

      {/* Main 3D Studio Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121316] border border-white/10 rounded-2xl p-4 sm:p-8 relative overflow-hidden shadow-2xl">
        {/* Subtle Background Radial Glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-20"
          style={{ backgroundColor: selectedCapsule.colorHex }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-15"
          style={{ backgroundColor: selectedCapsule.accentHex }}
        />

        {/* Left Column: 3D Canvas Viewport (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center relative">
          {/* Canvas Container */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            className="w-full h-[400px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing touch-none select-none relative rounded-xl overflow-hidden"
            title="마우스 이동으로 좌우 움직임 · 드래그하여 360° 회전"
          >
            {/* Dedicated Three.js Canvas Mount */}
            <div ref={mountRef} className="w-full h-full" />

            {/* Subtle Interaction Guide */}
            {!isExtracting && (
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm border border-white/10 text-[11px] text-zinc-400 whitespace-nowrap">
                마우스 이동: 좌우 움직임 · 드래그: 360° 회전
              </div>
            )}

            {/* Extraction Simulation Visual Overlay */}
            {isExtracting && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-8 bg-black/35 backdrop-blur-[2px] transition-all duration-300">
                {/* Extraction Flow Stream */}
                <div className="w-1.5 h-36 bg-gradient-to-b from-[#d4af37] via-[#85512b] to-[#3a1d0d] animate-pulse rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]" />

                {/* Glass Cup filling simulation */}
                <div className="w-28 h-32 border-2 border-white/40 rounded-b-2xl relative overflow-hidden bg-white/5 backdrop-blur-sm mt-1 shadow-inner">
                  {/* Crema & Coffee Liquid Filling */}
                  <div
                    className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#25130b] via-[#482816] to-[#c59847] transition-all duration-100 ease-out flex items-start justify-center"
                    style={{ height: `${extractionProgress}%` }}
                  >
                    {/* Golden Crema Head */}
                    <div className="w-full h-3 bg-[#e8be6b] opacity-90 shadow-sm" />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#c5a059] tracking-wider uppercase">
                  <span>9.5 Bar 고압 추출 중 · {Math.round(extractionProgress)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive 3D Control Bar Overlay */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 px-2 pt-3 border-t border-white/5 text-xs text-zinc-400">
            {/* Camera Angle Presets */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
              <span className="text-[11px] px-2 text-zinc-500 uppercase tracking-wider font-mono">Angle</span>
              <button
                type="button"
                onClick={() => setCameraPreset('front')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  viewAngle === 'front' ? 'bg-[#c5a059] text-black font-semibold' : 'hover:text-white'
                }`}
              >
                정면
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('angle')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  viewAngle === 'angle' ? 'bg-[#c5a059] text-black font-semibold' : 'hover:text-white'
                }`}
              >
                사선 3D
              </button>
              <button
                type="button"
                onClick={() => setCameraPreset('top')}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  viewAngle === 'top' ? 'bg-[#c5a059] text-black font-semibold' : 'hover:text-white'
                }`}
              >
                상단 씰
              </button>
            </div>

            {/* Quick Actions (Auto-Spin & Audio Toggle) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
                  isAutoRotating
                    ? 'bg-white/10 text-white border-white/20'
                    : 'text-zinc-400 border-white/5 hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                <span>{isAutoRotating ? '360° 회전 중' : '회전 멈춤'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg border border-white/5 text-zinc-400 hover:text-white transition-colors"
                title={soundEnabled ? '사운드 켜짐' : '사운드 꺼짐'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#c5a059]" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Capsule Intelligence & Flavor Notes (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          {/* Capsule Header Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-[#c5a059] font-medium">
                {selectedCapsule.nameEn}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                강도 Intensity <strong className="text-white text-sm">{selectedCapsule.intensity}</strong> / 12
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {selectedCapsule.nameKo}
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed">
              {selectedCapsule.description}
            </p>
          </div>

          {/* Tasting Note Chips (Clean unboxed tags) */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              주요 아로마 노트 Aroma Notes
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {selectedCapsule.tastingNotes.map((note, idx) => (
                <div
                  key={note}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-zinc-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedCapsule.accentHex }} />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sensory Radar Bar Metrics */}
          <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              풍미 밸런스 Flavor Balance
            </h4>

            {/* Acidity */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 w-16">산미 Acidity</span>
              <div className="flex-1 mx-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c5a059] rounded-full transition-all duration-500"
                  style={{ width: `${(selectedCapsule.acidity / 5) * 100}%` }}
                />
              </div>
              <span className="text-zinc-300 font-mono w-6 text-right">{selectedCapsule.acidity.toFixed(1)}</span>
            </div>

            {/* Body */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 w-16">바디 Body</span>
              <div className="flex-1 mx-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c5a059] rounded-full transition-all duration-500"
                  style={{ width: `${(selectedCapsule.body / 5) * 100}%` }}
                />
              </div>
              <span className="text-zinc-300 font-mono w-6 text-right">{selectedCapsule.body.toFixed(1)}</span>
            </div>

            {/* Roast Level */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 w-16">로스팅 Roast</span>
              <div className="flex-1 mx-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c5a059] rounded-full transition-all duration-500"
                  style={{ width: `${(selectedCapsule.roastLevel / 5) * 100}%` }}
                />
              </div>
              <span className="text-zinc-300 font-mono w-6 text-right">{selectedCapsule.roastLevel.toFixed(1)}</span>
            </div>

            {/* Recommended Cup */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>추천 추출 용량</span>
              <span className="text-white font-medium">{selectedCapsule.recommendedCup}</span>
            </div>
          </div>

          {/* Capsule Selection Pill Switcher */}
          <div>
            <div className="text-xs text-zinc-400 mb-2 font-medium">다른 캡슐 선택하기 (Select Capsule):</div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {allCapsules.map((capsule) => {
                const isSelected = capsule.id === selectedCapsule.id;
                return (
                  <button
                    key={capsule.id}
                    type="button"
                    onClick={() => onSelectCapsule(capsule)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                        : 'border-white/5 bg-black/20 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full mb-1 shadow-sm border border-white/20"
                      style={{ backgroundColor: capsule.colorHex }}
                    />
                    <span className="text-[11px] font-medium text-white truncate w-full">
                      {capsule.nameKo.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Lv.{capsule.intensity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/* Extract Simulation Trigger */}
            <button
              type="button"
              disabled={isExtracting}
              onClick={handleStartExtraction}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all shadow-md ${
                isExtracting
                  ? 'bg-amber-700/50 text-amber-200 cursor-wait'
                  : 'bg-gradient-to-r from-[#c5a059] to-[#dfba77] text-black hover:brightness-110 active:scale-[0.99]'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{isExtracting ? '에스프레소 추출 중...' : '에스프레소 추출 시뮬레이션'}</span>
            </button>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={() => {
                onAddToCart(selectedCapsule);
                setAddedToast(true);
                setTimeout(() => setAddedToast(false), 2400);
              }}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-colors whitespace-nowrap"
            >
              {addedToast ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">담기 완료!</span>
                </>
              ) : (
                <span>₩{selectedCapsule.price.toLocaleString()} 담기</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
