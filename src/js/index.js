import * as THREE from "three";
import ImageHover from "./ImageHover";
import ImageScroll from "./ImageScroll";

let target = 0;
let current = 0;
let ease = 0.075;

class EffectShell {
    constructor() {
        this.scrollContainer = document.querySelector(".scroll-container");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            (180 * (2 * Math.atan(window.innerHeight / 2 / 1000))) / Math.PI,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.init();
    }

    init() {
        this.camera.position.z = 1000;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        this.addEventListeners();
        this.render();
    }

    addEventListeners() {
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    render() {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const effectShell = new EffectShell();

new ImageHover(document.querySelectorAll(".hoverable"), effectShell.scene);

document.querySelectorAll(".scrollable").forEach((element) => {
    new ImageScroll(element, effectShell.scene);
});
