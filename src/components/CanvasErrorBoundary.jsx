import { Component } from "react";

/**
 * Keeps a 3D scene from taking the whole page down with it.
 *
 * A canvas can throw while rendering if the browser can't create a WebGL context
 * (GPU disabled or blocklisted, common on locked-down work laptops), if its chunk
 * or model fails to download, or on a driver bug. With no boundary React unmounts
 * the entire app and the visitor sees a blank page. This renders `fallback`
 * (nothing by default) in the canvas's place instead, and the rest of the site
 * carries on normally.
 */
class CanvasErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        console.warn("3D scene disabled:", error);
    }

    render() {
        return this.state.hasError ? (this.props.fallback ?? null) : this.props.children;
    }
}

export default CanvasErrorBoundary;
