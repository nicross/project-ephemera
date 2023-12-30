content.demo.heights.video.moon = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d == 0.0) {
    discard;
  }

  float c = circle(quadCoordinates + vec2(-0.05, -0.05), 1.0);
  float value = pow(d, 1.0 / 8.0) * (1.0 - pow(c, 1.0 / 8.0));

  color = mix(
    calculateSkyColor(),
    vec4(hsv2rgb(vec3(11.0 / 12.0, 0.875, 1.0)), 1.0),
    value
  );
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in vec3 vertex;

void main(void) {
  gl_Position = u_projection * vec4(vertex + u_moon, 1.0);

  ${content.demo.heights.glsl.passUniforms()}
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 100,
        quaternion: content.demo.heights.camera.quaternion(),
        width: 100,
      })

      const vertexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, 6)

      return this
    },
    load: function () {
      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.heights.glsl.attributeNames(),
          'vertex',
        ],
        context: gl,
        shaders: [
          {
            source: fragmentShader,
            type: gl.FRAGMENT_SHADER,
          },
          {
            source: vertexShader,
            type: gl.VERTEX_SHADER,
          },
        ],
        uniforms: [
          ...content.demo.heights.glsl.uniformNames(),
        ],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
