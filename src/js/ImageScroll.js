import * as THREE from "three";
import images from "./images";
import scroll from "./scroll";
import vertexShader from "../shaders/ImageScroll/vertexShader.glsl";
import fragmentShader from "../shaders/ImageScroll/fragmentShader.glsl";

export default class ImageScroll {
    constructor(element, scene) {
        this.element = element;
        this.textureLoader = new THREE.TextureLoader();
        this.scene = scene;
        this.isHovered = false;
        this.uniforms = {
            uTexture: {
                value: this.textureLoader.load(
                    images[this.element.dataset.img]
                ),
            },
            uScrollOffset: {
                value: new THREE.Vector2(0, 0),
            },
            uDisplacement: {
                value: this.textureLoader.load(images.displacement),
            },
            uProgress: {
                value: 0.0,
            },
        };
        this.target = 0;
        this.current = 0;
        this.scrollOffset = new THREE.Vector2(0.0, 0.0);

        this.init();
    }

    init() {
        this.addEventListeners();
        this.createMeshes();
        this.render();
    }

    addEventListeners() {
        this.element.addEventListener("mouseover", () => {
            this.isHovered = true;
        });
        this.element.addEventListener("mouseleave", () => {
            this.isHovered = false;
        });

        scroll.on("scroll", this.onScroll.bind(this));
    }

    getDimensions() {
        const { width, height, top, left } =
            this.element.getBoundingClientRect();

        this.scrollOffset.set(
            left - window.innerWidth / 2 + width / 2,
            -top + window.innerHeight / 2 - height / 2
        );

        return { width, height, top, left };
    }

    createMeshes() {
        const geometry = new THREE.PlaneBufferGeometry(1, 1, 20, 20);
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
        });
        this.mesh = new THREE.Mesh(geometry, material);

        const { width, height } = this.getDimensions();

        this.mesh.scale.set(width, height, 1);

        this.scene.add(this.mesh);
    }

    render() {
        this.getDimensions();

        this.mesh.position.set(this.scrollOffset.x, this.scrollOffset.y, 0);
        this.uniforms.uScrollOffset.value.set(
            0.0,
            -(this.target - this.current) * 0.0003
        );
        this.uniforms.uProgress.value = this.isHovered
            ? THREE.MathUtils.lerp(this.uniforms.uProgress.value, 1.0, 0.1)
            : THREE.MathUtils.lerp(this.uniforms.uProgress.value, 0.0, 0.1);

        requestAnimationFrame(this.render.bind(this));
    }

    onScroll({ scroll }) {
        this.target = scroll.y;
        this.current = THREE.MathUtils.lerp(this.current, this.target, 0.1);
        this.uniforms.uScrollOffset.value.set(
            0.0,
            -(this.target - this.current) * 0.0003
        );
    }
}
