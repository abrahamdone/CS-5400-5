#version 300 es

in vec4 aPosition;
in vec4 aNormal;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform vec4 uMaterial;
uniform vec3 uRedLight;
uniform vec3 uGreenLight;
uniform vec3 uBlueLight;
out vec4 vColor;

void main() {
    mat4 transform = uView * uModel;
    vec4 position = transform * aPosition;

    vec4 N = transpose(inverse(transform)) * aNormal;
    float red = clamp(uMaterial.x * 1.0 * dot(N.xyz, normalize(uRedLight - position.xyz)), 0.0, 1.0);
    float green = clamp(uMaterial.y * 1.0 * dot(N.xyz, normalize(uGreenLight - position.xyz)), 0.0, 1.0);
    float blue = clamp(uMaterial.z * 1.0 * dot(N.xyz, normalize(uBlueLight - position.xyz)), 0.0, 1.0);
    vColor = vec4(red, green, blue, uMaterial.w);
//    vColor = transpose(inverse(transform)) * aNormal;
//    vColor = aNormal;

    gl_Position = uProjection * position;
}