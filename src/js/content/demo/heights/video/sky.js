content.demo.heights.video.sky = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

out vec4 color;

void main() {
  color = calculateSkyColor();
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in vec3 vertex;

void main(void) {
  gl_Position = vec4(vertex, 1.0);

  ${content.demo.heights.glsl.passUniforms()}
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        [-1, 3, 1], [-1, -1, 1], [3, -1, 1],
      ].flat()), gl.STATIC_DRAW)

      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.TRIANGLES, 0, 3)

      return this
    },
    load: function () {
      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
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
