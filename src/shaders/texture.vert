attribute vec4 aPosition;
attribute vec2 aCoord;
varying vec2 vCoord;
uniform mat4 pMatrix;
uniform mat4 vMatrix;
uniform mat4 rMatrix;

void main() {
    gl_Position = pMatrix * vMatrix * rMatrix * aPosition;
    vCoord = aCoord;
}