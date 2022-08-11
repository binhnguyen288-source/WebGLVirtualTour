#version 300 es
precision highp float;
 
out vec4 finalColor;

uniform mat3 Rot;
uniform float focal;

uniform vec2 canvasSize;
uniform sampler2D tex;

void main() {

    float aspectRatio = canvasSize.y / canvasSize.x;
    //float f           = tan(hfov / 2.0);

    float i = gl_FragCoord.x / canvasSize.x;
    float j = (canvasSize.y - gl_FragCoord.y) / canvasSize.y;

    float XonPlane = aspectRatio * focal * (2.0 * j - 1.0);
    float YonPlane =               focal * (2.0 * i - 1.0);
    float ZonPlane = 1.0;

    vec3 RotCoord = Rot * vec3(XonPlane, YonPlane, ZonPlane);
    int offset = 0;
    float x = RotCoord.x, y = RotCoord.y, z = RotCoord.z;

    if (abs(x) < abs(y)) {
        if (abs(y) < abs(z)) {
            //
            x = RotCoord.z;
            y = RotCoord.x;
            z = RotCoord.y;
            offset = 4;
        }
        else {
            x = RotCoord.y;
            y = RotCoord.x;
            z = RotCoord.z;
            offset = 2;
        }
    }
    else if (abs(x) < abs(z)) {
        x = RotCoord.z;
        y = RotCoord.x;
        z = RotCoord.y;
        offset = 4;
    }

    if (x < 0.0) 
        offset++;
    
    y /= abs(x);
    z /= abs(x);
    x /= abs(x);


    vec2 coord = vec2(
        float(offset % 3) + (1.0 + y) / 2.0,
        float(offset / 3) + (1.0 + z) / 2.0
    ) / vec2(3, 2);

    

    finalColor = texture(tex, coord);
}