#version 300 es

in vec4 aPosition;
out vec4 vColor;
uniform mat4 uProjection;
uniform mat4 uMove;
uniform vec4 uColor;

void main() {
    gl_Position = aPosition;
    vColor = uColor;
}