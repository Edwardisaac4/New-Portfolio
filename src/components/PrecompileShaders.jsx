import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Material, Mesh, Object3D, PlaneGeometry, Scene, Texture, WebGLRenderTarget } from "three";

/**
 * Collects every material a post-processing pass renders with, including the ones
 * inside its effects and their own sub-passes (blur, luminance, depth masks...).
 */
const collectMaterials = (node, found = new Set(), seen = new Set(), depth = 0) => {
    if (!node || typeof node !== "object" || seen.has(node) || depth > 4) return found;
    seen.add(node);
    if (node instanceof Material) {
        found.add(node);
        return found;
    }
    // Scenes, textures, targets and the renderer hold no pass materials worth walking
    if (node instanceof Object3D || node instanceof Texture || node.isWebGLRenderTarget || node.isWebGLRenderer) {
        return found;
    }
    // A pass keeps its main material behind a getter, which Object.values() skips
    if (node.fullscreenMaterial instanceof Material) found.add(node.fullscreenMaterial);
    for (const value of Object.values(node)) collectMaterials(value, found, seen, depth + 1);
    return found;
};

/** Compiles `materials` in the background as if drawn into `target` (null = the canvas). */
const compileMaterialsAsync = (gl, camera, materials, target) => {
    if (materials.length === 0) return Promise.resolve();
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    for (const material of materials) scene.add(new Mesh(geometry, material));
    return compileAsyncInto(gl, scene, camera, target).finally(() => geometry.dispose());
};

/**
 * three.js picks shader variants (output colour space, tone mapping) from the
 * render target bound at compile time, so bind the one the scene will really
 * be drawn into.
 */
const compileAsyncInto = (gl, scene, camera, target) => {
    const previousTarget = gl.getRenderTarget();
    gl.setRenderTarget(target);
    const compiling = gl.compileAsync(scene, camera);
    gl.setRenderTarget(previousTarget);
    return compiling;
};

/**
 * Compiles every shader the scene needs before the first frame is drawn.
 *
 * Without this, the first render compiles and links each shader program
 * synchronously, freezing the main thread for hundreds of milliseconds on slower
 * GPUs (it was the single longest task on page load). `compileAsync` uses the
 * KHR_parallel_shader_compile extension, so the GPU driver does that work in the
 * background and the page stays responsive.
 *
 * Mount it inside the same <Suspense> as the models (after them and after any
 * <EffectComposer>), so it runs once their geometry, textures and passes exist,
 * and keep the canvas's `frameloop` at "never" until `onReady` fires.
 *
 * @param {object} props
 * @param {(ready: boolean) => void} props.onReady Called with `true` once the shaders are ready.
 * @param {React.RefObject} [props.composer] Ref to the <EffectComposer>, when one draws the scene.
 *   The composer renders the scene into an offscreen target (which needs different shader
 *   variants than drawing to the canvas) and adds its own passes, so both get precompiled.
 */
const PrecompileShaders = ({ onReady, composer }) => {
    const get = useThree((state) => state.get);

    useEffect(() => {
        let mounted = true;
        const { gl, scene, camera } = get();

        // three.js checks each shader for errors the first time it's used, with
        // synchronous calls to the GPU process that add up to a long freeze on the
        // first frame. The three.js docs recommend turning this off in production;
        // it stays on in development so shader errors are still reported there.
        gl.debug.checkShaderErrors = import.meta.env.DEV;

        const passes = composer?.current?.passes ?? [];
        const offscreenTarget = passes.length > 0 ? new WebGLRenderTarget(1, 1) : null;

        // Post-processing materials: only the final pass's own material draws to the
        // canvas. Everything else, including the sub-passes inside that pass's
        // effects (blur, luminance...), renders offscreen. (The scene itself is
        // compiled separately below.)
        const toCanvas = new Set();
        const offscreen = new Set();
        for (const pass of passes) {
            collectMaterials(pass, offscreen);
            if (pass.renderToScreen && pass.fullscreenMaterial) toCanvas.add(pass.fullscreenMaterial);
        }
        for (const material of toCanvas) offscreen.delete(material);

        Promise.all([
            compileAsyncInto(gl, scene, camera, offscreenTarget),
            compileMaterialsAsync(gl, camera, [...offscreen], offscreenTarget),
            compileMaterialsAsync(gl, camera, [...toCanvas], null),
        ])
            .catch(() => {}) // If it fails, shaders still compile on the first frame as before
            .finally(() => {
                offscreenTarget?.dispose();
                if (mounted) onReady(true);
            });

        return () => {
            mounted = false;
        };
    }, [get, onReady, composer]);

    return null;
};

export default PrecompileShaders;
