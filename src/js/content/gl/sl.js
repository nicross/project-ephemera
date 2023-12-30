content.gl.sl = {}

content.gl.sl.common = () => `
${content.gl.sl.definePi()}
${content.gl.sl.circle()}
${content.gl.sl.hsv2rgb()}
${content.gl.sl.rand()}
${content.gl.sl.scale()}
${content.gl.sl.perlin3d()}
`

content.gl.sl.circle = (prefix = '') => `
// https://webgl2fundamentals.org/webgl/webgl-qna-the-fastest-way-to-draw-many-circles-example-5.html
float circle(vec2 st, float radius) {
  vec2 dist = st - vec2(0.5);

  return 1.0 - smoothstep(
     0.0,
     radius,
     dot(dist, dist) * 4.0
  );
}
`

content.gl.sl.definePi = () => `
#define PI 3.1415926535897932384626433832795
`

content.gl.sl.hsv2rgb = () => `
// Function from Iñigo Quiles
// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(
    abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
    0.0,
    1.0
  );
  rgb = rgb*rgb*(3.0-2.0*rgb);
  return c.z * mix(vec3(1.0), rgb, c.y);
}
`

content.gl.sl.perlin3d = () => `
float perlin3d(float x, float y, float z) {
  float x0 = floor(x);
  float x1 = x0 + 1.0;
  float y0 = floor(y);
  float y1 = y0 + 1.0;
  float z0 = floor(z);
  float z1 = z0 + 1.0;

  float dx = x - x0;
  float dy = y - y0;
  float dz = z - z0;

  float v0 = rand(vec2(x0 + z0, y0 + z0));
  float v1 = rand(vec2(x0 + z0, y1 + z0));
  float v2 = rand(vec2(x1 + z0, y0 + z0));
  float v3 = rand(vec2(x1 + z0, y1 + z0));
  float v4 = rand(vec2(x0 + z1, y0 + z1));
  float v5 = rand(vec2(x0 + z1, y1 + z1));
  float v6 = rand(vec2(x1 + z1, y0 + z1));
  float v7 = rand(vec2(x1 + z1, y1 + z1));

  return mix(
    mix(
      mix(v0, v1, dy),
      mix(v2, v3, dy),
      dx
    ),
    mix(
      mix(v4, v5, dy),
      mix(v6, v7, dy),
      dx
    ),
    dz
  );
}
`

content.gl.sl.rand = () => `
float rand(vec2 co) {
  float a = 12.9898;
  float b = 78.233;
  float c = 43758.5453;
  float dt= dot(co.xy ,vec2(a,b));
  float sn= mod(dt,3.14);
  return fract(sin(sn) * c);
}
`

content.gl.sl.scale = () => `
float scale(float value, float min, float max, float a, float b) {
  return a + (((value - min) / (max - min)) * (b - a));
}
`
