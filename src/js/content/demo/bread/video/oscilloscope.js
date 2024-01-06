content.demo.bread.video.oscilloscope = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineIns()}
${content.demo.bread.glsl.commonFragment()}

out vec4 color;

void main() {
  color = vec4(0.0, 0.0, 0.0, 1.0);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineOuts()}
${content.demo.bread.glsl.defineUniforms()}
${content.demo.bread.glsl.commonVertex()}

in vec3 vertex;

void main(void) {
  gl_Position = vec4(vertex, 1.0);

  ${content.demo.bread.glsl.passUniforms()}
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.bread.video.context()

      gl.useProgram(program.program)
      content.demo.bread.glsl.bindUniforms(gl, program)

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
      const gl = content.demo.bread.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.bread.glsl.attributeNames(),
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
          ...content.demo.bread.glsl.uniformNames(),
        ],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
