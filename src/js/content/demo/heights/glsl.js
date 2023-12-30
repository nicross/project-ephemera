content.demo.heights.glsl = {}

content.demo.heights.glsl.commonFragment = () => `
${content.gl.sl.common()}
${content.demo.heights.glsl.calculateSkyColor()}
`

content.demo.heights.glsl.commonVertex = () => `
${content.gl.sl.common()}
`

content.demo.heights.glsl.calculateSkyColor = () => `
vec4 calculateSkyColor() {
  float value = gl_FragCoord.y / resolution.y;

  vec3 toppest = vec3(0.0, 0.0, 0.0);
  vec3 bottomest = hsv2rgb(vec3(2.0 / 3.0, 1.0, 1.0 / 16.0));

  vec3 top = mix(
    bottomest,
    toppest,
    clamp(scale(look, -1.0, 0.0, 0.0, 1.0), 0.0, 1.0)
  );

  vec3 bottom = mix(
    bottomest,
    toppest,
    clamp(scale(look, 0.0, 1.0, 0.0, 1.0), 0.0, 1.0)
  );

  // Moon glow
  vec3 moonColor = hsv2rgb(vec3(11.0 / 12.0, 0.75, 1.0 / 4.0));

  float moonRatio = distance(gl_FragCoord.xy / resolution.xy, ((moon.xy / resolution.xy) + 1.0) / 2.0);
  moonRatio = 1.0 - clamp(moonRatio, 0.0, 1.0);
  moonRatio *= 1.0 - (0.25 * rand(vec2(gl_FragCoord.xy + time)));
  moonRatio *= clamp(moon.z / drawDistance, 0.0, 1.0);

  bottom = mix(bottom, moonColor, moonRatio);
  top = mix(top, moonColor, moonRatio);

  // Dithering
  value = clamp(
    value + (0.1 - (rand(gl_FragCoord.xy * time) * 0.2)),
    0.0, 1.0
  );

  return vec4(mix(bottom, top, value), 1.0);
}
`

content.demo.heights.glsl.attributeNames = () => [
  'quadCoordinates_in',
]

content.demo.heights.glsl.bindUniforms = (gl, program) => {
  const drawDistance = content.demo.heights.camera.drawDistance()

  // Bind quadCoordinates_in
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    content.gl.quadTextureCoordinates()
  ), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(program.attributes.quadCoordinates_in)
  gl.vertexAttribPointer(program.attributes.quadCoordinates_in, 2, gl.FLOAT, false, 0, 0)

  // Bind u_camera
  const camera = content.demo.heights.camera.vector()
  gl.uniform3fv(program.uniforms.u_camera, [camera.x, camera.y, camera.z])

  // Bind u_drawDistance
  gl.uniform1f(program.uniforms.u_drawDistance, drawDistance)

  // Bind u_look
  gl.uniform1f(program.uniforms.u_look, content.demo.heights.camera.look() / engine.const.tau * 4)

  // Bind u_moon
  const moon = engine.tool.vector3d.unitX().inverse()
    .rotateEuler({pitch: -engine.const.tau / 24})
    .scale(drawDistance * 1.5)

  gl.uniform3fv(program.uniforms.u_moon, [moon.x, moon.y, moon.z])

  // Bind u_projection
  gl.uniformMatrix4fv(program.uniforms.u_projection, false, content.demo.heights.camera.projection().elements)

  // Bind u_resolution
  gl.uniform2fv(program.uniforms.u_resolution, [gl.canvas.width, gl.canvas.height])

  // Bind u_time
  gl.uniform1f(program.uniforms.u_time, content.demo.heights.time.get())
}

content.demo.heights.glsl.defineIns = () => `
in vec3 camera;
in float drawDistance;
in float look;
in vec4 moon;
in mat4 projection;
in vec2 quadCoordinates;
in vec2 resolution;
in highp float time;
`

content.demo.heights.glsl.defineOuts = () => `
out vec3 camera;
out float drawDistance;
out float look;
out vec4 moon;
out mat4 projection;
out vec2 quadCoordinates;
out vec2 resolution;
out float time;
`

content.demo.heights.glsl.defineUniforms = () => `
in vec2 quadCoordinates_in;
uniform vec3 u_camera;
uniform float u_drawDistance;
uniform float u_look;
uniform vec3 u_moon;
uniform mat4 u_projection;
uniform vec2 u_resolution;
uniform highp float u_time;
`

content.demo.heights.glsl.passUniforms = () => `
camera = u_camera;
drawDistance = u_drawDistance;
look = u_look;
moon = u_projection * vec4(u_moon, 1.0);
projection = u_projection;
quadCoordinates = quadCoordinates_in;
resolution = u_resolution;
time = u_time;
`

content.demo.heights.glsl.uniformNames = () => [
  'u_camera',
  'u_drawDistance',
  'u_look',
  'u_moon',
  'u_projection',
  'u_resolution',
  'u_time',
]
