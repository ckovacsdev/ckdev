import {
	CanvasTexture,
	CustomBlending,
	Mesh,
	MeshBasicMaterial,
	OneFactor,
	OneMinusSrcAlphaFactor,
	PerspectiveCamera,
	PlaneGeometry,
	SRGBColorSpace,
	Scene,
	WebGLRenderer,
} from 'three';
import { GROUND_UNITS, HERO_U, buildLayers, type LayerArt } from './skyline-art';

/*
 * 2.5D parallax skyline: each art layer is a textured plane at its own depth. The mouse shifts
 * layers by their parallax factor (far moves least), scrolling the hero away drifts them at
 * different rates, and on load the layers rise into place far to near. The render loop only
 * runs while something is still easing, and never while the hero is off screen.
 */

type LayerSpec = {
	z: number;
	parallax: number;   // world units of shift per unit of mouse travel
	scrollY: number;    // world units of drift as the hero scrolls away (negative = sinks)
	minFrac: number;    // minimum plane height as a fraction of the visible height (narrow screens)
	resolution: number; // texture resolution relative to the near layer
};

// Back to front, matching buildLayers()
const SPECS: LayerSpec[] = [
	{ z: -3, parallax: 0.03, scrollY: -1.5, minFrac: 1.0, resolution: 0.6 },
	{ z: -1.5, parallax: 0.08, scrollY: -0.8, minFrac: 0.44, resolution: 0.8 },
	{ z: 0, parallax: 0.15, scrollY: -0.15, minFrac: 0.44, resolution: 1 },
];

const FOV = 45;
const CAMERA_Z = 5;
const OVERSCAN = 1.2;   // planes extend past the screen edges so parallax never shows a gap
const EASE = 0.065;
const SCROLL_EASE = 0.06;
const LEAN_Y = 0.018;
const LEAN_X = 0.012;
const RISE_MS = 1700;
const RISE_STAGGER_MS = 240;
const SETTLED = 0.0005;

const rasterize = (art: LayerArt, width: number) => new Promise<HTMLCanvasElement>((resolve, reject) => {
	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(width);
		canvas.height = Math.round((width * art.height) / art.width);
		canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
		resolve(canvas);
	};
	img.onerror = reject;
	img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(art.svg)}`;
});

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

export const supportsWebGL = () => {
	try {
		const canvas = document.createElement('canvas');
		return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
	} catch {
		return false;
	}
};

/** Builds the scene inside the container. Returns a cleanup function. */
export const mountSkyline = (container: HTMLElement, onReady: () => void) => {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let disposed = false;
	let cleanup = () => {};

	(async () => {
		const canvas = document.createElement('canvas');
		canvas.className = 'skyline-canvas';
		const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.outputColorSpace = SRGBColorSpace;

		// Texture width: enough for crisp hairlines on the near layer, capped for mobile memory
		const maxTex = Math.min(renderer.capabilities.maxTextureSize, window.innerWidth < 700 ? 3072 : 4096);
		const nearWidth = Math.min(maxTex, Math.max(2400, window.innerWidth * renderer.getPixelRatio() * 1.6));
		const arts = buildLayers();
		const canvases = await Promise.all(arts.map((art, i) => rasterize(art, nearWidth * SPECS[i].resolution)));
		if (disposed) {
			renderer.dispose();
			return;
		}

		const scene = new Scene();
		const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
		camera.position.z = CAMERA_Z;
		const geometry = new PlaneGeometry(1, 1);

		const layers = canvases.map((source, i) => {
			const texture = new CanvasTexture(source);
			texture.colorSpace = SRGBColorSpace;
			// Canvas pixels are already premultiplied. Uploading them as-is (and blending them as
			// premultiplied) avoids the light halos that un-premultiplying leaves on silhouette edges.
			texture.premultiplyAlpha = true;
			texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
			const material = new MeshBasicMaterial({
				map: texture,
				transparent: true,
				depthWrite: false,
				depthTest: false,
				blending: CustomBlending,
				blendSrc: OneFactor,
				blendDst: OneMinusSrcAlphaFactor,
				blendSrcAlpha: OneFactor,
				blendDstAlpha: OneMinusSrcAlphaFactor,
			});
			const mesh = new Mesh(geometry, material);
			mesh.renderOrder = i;
			scene.add(mesh);
			return { mesh, texture, material, spec: SPECS[i], art: arts[i], baseX: 0, baseY: 0, height: 0 };
		});

		// Fit each plane to the screen at its depth: bottom-anchored, covering the width with
		// overscan, and keeping the hero tower at a fixed screen position.
		const layout = () => {
			const w = container.clientWidth;
			const h = container.clientHeight;
			if (!w || !h) {
				return;
			}
			renderer.setSize(w, h, false);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();

			const anchorX = w < 700 ? 0.78 : 0.72;
			for (const layer of layers) {
				const { z, minFrac } = layer.spec;
				const visH = 2 * Math.tan((FOV * Math.PI) / 360) * (CAMERA_Z - z);
				const visW = visH * camera.aspect;
				let pw = visW * OVERSCAN;
				let ph = (pw * layer.art.height) / layer.art.width;
				if (ph < visH * minFrac) {
					ph = visH * minFrac;
					pw = (ph * layer.art.width) / layer.art.height;
				}
				let x = (anchorX - 0.5) * visW - (HERO_U - 0.5) * pw;
				const half = (visW * OVERSCAN) / 2;
				x = Math.max(half - pw / 2, Math.min(-half + pw / 2, x));
				// Sink the solid ground strip below the screen edge
				const ground = (GROUND_UNITS / layer.art.height) * ph;
				layer.mesh.scale.set(pw, ph, 1);
				layer.baseX = x;
				layer.baseY = -visH / 2 + ph / 2 - ground * 0.75;
				layer.height = ph;
			}
		};

		// Mouse, scroll and load-in state
		let tX = 0, tY = 0, cX = 0, cY = 0;
		let scrollTarget = 0, scrollCurrent = 0;
		const start = performance.now();
		let rising = !reducedMotion;
		let frame = 0;
		let onScreen = true;

		const readScroll = () => {
			const rect = container.getBoundingClientRect();
			const vh = window.innerHeight;
			const mid = rect.top + rect.height / 2;
			scrollTarget = Math.max(-1.4, Math.min(1.4, (vh / 2 - mid) / (vh / 2 + rect.height / 2)));
		};

		const render = (now: number) => {
			frame = 0;
			cX += (tX - cX) * EASE;
			cY += (tY - cY) * EASE;
			scrollCurrent += (scrollTarget - scrollCurrent) * SCROLL_EASE;

			camera.rotation.y = cX * LEAN_Y;
			camera.rotation.x = cY * LEAN_X;

			let stillRising = false;
			layers.forEach((layer, i) => {
				let rise = 0;
				if (rising) {
					const t = Math.min(1, Math.max(0, (now - start - i * RISE_STAGGER_MS) / RISE_MS));
					rise = 1 - easeOutCubic(t);
					stillRising ||= t < 1;
				}
				const { parallax, scrollY } = layer.spec;
				layer.mesh.position.set(
					layer.baseX + cX * parallax,
					layer.baseY + cY * parallax + scrollY * scrollCurrent - rise * layer.height * 0.55,
					layer.spec.z,
				);
			});
			rising = stillRising;
			renderer.render(scene, camera);

			const moving = rising
				|| Math.abs(tX - cX) > SETTLED || Math.abs(tY - cY) > SETTLED
				|| Math.abs(scrollTarget - scrollCurrent) > SETTLED;
			if (moving && onScreen && !reducedMotion) {
				frame = requestAnimationFrame(render);
			}
		};

		const kick = () => {
			if (!frame && onScreen) {
				frame = requestAnimationFrame(render);
			}
		};

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType === 'touch' || reducedMotion) {
				return;
			}
			tX = (e.clientX / window.innerWidth - 0.5) * 2;
			tY = -(e.clientY / window.innerHeight - 0.5) * 2;
			kick();
		};

		const onScroll = () => {
			if (reducedMotion) {
				return;
			}
			readScroll();
			kick();
		};

		const resizeObserver = new ResizeObserver(() => {
			layout();
			kick();
		});
		const visibility = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
			if (onScreen) {
				readScroll();
				kick();
			}
		});

		container.appendChild(canvas);
		layout();
		readScroll();
		scrollCurrent = reducedMotion ? 0 : scrollTarget;
		resizeObserver.observe(container);
		visibility.observe(container);
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });
		render(performance.now());
		onReady();

		cleanup = () => {
			if (frame) {
				cancelAnimationFrame(frame);
			}
			resizeObserver.disconnect();
			visibility.disconnect();
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('scroll', onScroll);
			for (const layer of layers) {
				layer.texture.dispose();
				layer.material.dispose();
			}
			geometry.dispose();
			renderer.dispose();
			canvas.remove();
		};
	})();

	return () => {
		disposed = true;
		cleanup();
	};
};
