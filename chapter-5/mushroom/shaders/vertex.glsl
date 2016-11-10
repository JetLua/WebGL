attribute vec4 aPos;
attribute vec2 aCoord;

uniform mat4 uViewMatrix;

varying vec2 vCoord;

void main() {
    gl_Position = uViewMatrix * aPos;
    vCoord = aCoord;
}