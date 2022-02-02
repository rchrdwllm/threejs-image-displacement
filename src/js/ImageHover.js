import * as THREE from "three";
import images from "./images";
import vertexShader from "../shaders/ImageHover/vertexShader.glsl";
import fragmentShader from "../shaders/ImageHover/fragmentShader.glsl";

export default class ImageHover {
    constructor(elements, scene) {
        this.elements = elements.length ? [...elements] : [elements];
        this.textureLoader = new THREE.TextureLoader();
        this.scene = scene;
        this.textures = this.elements.map((element) =>
            this.textureLoader.load(images[element.dataset.img])
        );
        this.uniforms = {
            uAlpha: { value: 0.0 },
            uTexture: { value: this.textures[0] },
            uDisplacement: {
                value: this.textureLoader.load(images.displacement),
            },
            uMouseOffset: { value: new THREE.Vector2(0.0, 0.0) },
        };
        this.isHovered = false;
        this.targetX = 0;
        this.targetY = 0;
        this.mouseOffset = new THREE.Vector2(0.0, 0.0);

        this.init();
    }

    init() {
        this.addEventListeners();
        this.createMesh();
        this.render();
    }

    addEventListeners() {
        window.addEventListener("mousemove", this.onMouseMove.bind(this));

        this.elements.forEach((element, index) => {
            element.addEventListener("mouseover", () =>
                this.onMouseOver(index)
            );
            element.addEventListener(
                "mouseleave",
                this.onMouseLeave.bind(this)
            );
        });
    }

    createMesh() {
        const geometry = new THREE.PlaneBufferGeometry(
            2048 / 3.5,
            1366 / 3.5,
            20,
            20
        );
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);

        this.scene.add(this.mesh);
    }

    render() {
        this.mouseOffset.set(
            THREE.MathUtils.lerp(this.mouseOffset.x, this.targetX, 0.1),
            THREE.MathUtils.lerp(this.mouseOffset.y, this.targetY, 0.1)
        );
        this.mesh.position.set(
            this.mouseOffset.x - window.innerWidth / 2,
            -this.mouseOffset.y + window.innerHeight / 2,
            0
        );
        this.uniforms.uAlpha.value = this.isHovered
            ? THREE.MathUtils.lerp(this.uniforms.uAlpha.value, 1.0, 0.1)
            : THREE.MathUtils.lerp(this.uniforms.uAlpha.value, 0.0, 0.1);
        this.uniforms.uMouseOffset.value.x =
            (this.targetX - this.mouseOffset.x) * 0.005;
        this.uniforms.uMouseOffset.value.y =
            -(this.targetY - this.mouseOffset.y) * 0.005;

        requestAnimationFrame(this.render.bind(this));
    }

    onMouseMove(e) {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
    }

    onMouseOver(index) {
        this.isHovered = true;

        this.uniforms.uTexture.value = this.textures[index];
    }

    onMouseLeave() {
        this.isHovered = false;
    }
}
