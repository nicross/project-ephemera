content.demo.bread.glsl = {}

content.demo.bread.glsl.commonFragment = () => `
${content.gl.sl.common()}
`

content.demo.bread.glsl.commonVertex = () => `
${content.gl.sl.common()}
`

content.demo.bread.glsl.attributeNames = () => [
  'quadCoordinates_in',
]

content.demo.bread.glsl.bindUniforms = (gl, program) => {
  // Bind quadCoordinates_in
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
    content.gl.quadTextureCoordinates()
  ), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(program.attributes.quadCoordinates_in)
  gl.vertexAttribPointer(program.attributes.quadCoordinates_in, 2, gl.FLOAT, false, 0, 0)

  // Bind u_projection
  gl.uniformMatrix4fv(program.uniforms.u_projection, false, content.demo.bread.video.projection().elements)

  // Bind u_resolution
  gl.uniform2fv(program.uniforms.u_resolution, [gl.canvas.width, gl.canvas.height])

  // Bind u_time
  gl.uniform1f(program.uniforms.u_time, content.demo.bread.time.get())
}

content.demo.bread.glsl.defineIns = () => `
in mat4 projection;
in vec2 quadCoordinates;
in vec2 resolution;
in highp float time;
`

content.demo.bread.glsl.defineOuts = () => `
out mat4 projection;
out vec2 quadCoordinates;
out vec2 resolution;
out float time;
`

content.demo.bread.glsl.defineUniforms = () => `
in vec2 quadCoordinates_in;
uniform mat4 u_projection;
uniform vec2 u_resolution;
uniform highp float u_time;
`

content.demo.bread.glsl.passUniforms = () => `
projection = u_projection;
quadCoordinates = quadCoordinates_in;
resolution = u_resolution;
time = u_time;
`

content.demo.bread.glsl.uniformNames = () => [
  'u_projection',
  'u_resolution',
  'u_time',
]
