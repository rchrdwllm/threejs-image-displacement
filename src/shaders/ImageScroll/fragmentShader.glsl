varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uScrollOffset;
uniform float uProgress;

void main() {
    vec4 displacement = texture2D(uDisplacement, vUv.yx);

    vec2 offset = vec2(vUv.x, vUv.y + displacement.r);

    offset.y = mix(vUv.y, displacement.r, (uProgress) - (uScrollOffset.y * 30.0));

    float r = texture2D(uTexture, offset + uScrollOffset.y * 0.2 + (uProgress * 0.01)).r;
    float g = texture2D(uTexture, offset).g;
    float b = texture2D(uTexture, offset).b;

    gl_FragColor = vec4(r, g, b, 1.0);
}