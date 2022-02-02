varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform float uAlpha;
uniform vec2 uMouseOffset;

void main() {
    vec4 displacement = texture2D(uDisplacement, vUv.yx);

    vec2 offset = vec2(vUv.x, vUv.y + displacement.r);

    offset.y = mix(vUv.y, displacement.r, 1.0 - uAlpha + uMouseOffset.x);

    float r = texture2D(uTexture, offset + uMouseOffset * 0.075).r;
    float g = texture2D(uTexture, offset).g;
    float b = texture2D(uTexture, offset).b;

    gl_FragColor = vec4(r, g, b, uAlpha);
}