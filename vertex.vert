#version 300 es

layout(location = 0) in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0, 1.0);
}
