#version 300 es

in vec4 aPosition;
in vec4 aNormal;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform vec4 uColor;
out vec4 vColor;

void main() {
    vec4 position = uView * uModel * aPosition;
    gl_Position = uProjection * position;
    vColor = uColor;
}