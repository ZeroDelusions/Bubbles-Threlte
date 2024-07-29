uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float opacity;
uniform vec3 baseColor;
uniform vec3 borderColor;
uniform vec3 reflectionColor;
uniform float baseAlpha;
uniform float borderAlpha;
uniform vec3 fresnel;
uniform float fresnelStrength;
uniform float glowStrength;
uniform float gradientStrength;
uniform float gradientSpeed;

void main() {
    // Base color for the bubble
    vec3 color = baseColor;

    // Fresnel effect for the bubble surface
    float fresnel = pow(1.0 - dot(vNormal, fresnel), 1.0 / fresnelStrength);

    // Light deformation on the bubble border
    vec3 borderColor = borderColor * fresnel ;

    // Simulate internal reflections
    vec3 reflectColor = reflectionColor * fresnel;
    color = mix(color, reflectColor, fresnel * borderAlpha);

    // Adding transparency to the bubble
    float alpha = baseAlpha + fresnel * borderAlpha; // Higher alpha at the edges

    // Create a glow effect around the border
    float glow = smoothstep(0.0, 1.0, fresnel) * glowStrength;

    // Chromatic aberration (rainbow effect)
    float angle = atan(vPosition.y, vPosition.x) + time * gradientSpeed;
    vec3 rainbowColor = vec3(
        0.5 + 0.5 * sin(angle + 0.0 * 2.0 * 3.1415926 / 3.0),
        0.5 + 0.5 * sin(angle + 1.0 * 2.0 * 3.1415926 / 3.0),
        0.5 + 0.5 * sin(angle + 2.0 * 2.0 * 3.1415926 / 3.0)
    );

    // Combine rainbow effect with the base color
    color = mix(color, rainbowColor, fresnel * gradientStrength);

    // Final color with glow and transparency
    gl_FragColor = vec4(color + borderColor * glow, alpha * opacity);
}
