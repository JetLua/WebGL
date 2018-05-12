attribute vec4 aPosition;
attribute vec2 aCoord;
varying vec2 vCoord;
uniform mat4 uMatrix;

void main() {
    gl_Position = uMatrix * aPosition;
    vCoord = aCoord;
}