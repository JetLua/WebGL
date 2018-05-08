precision highp float;
uniform sampler2D uSampler;
varying vec2 vCoord;

void main() {
    gl_FragColor = texture2D(uSampler, vCoord);
}