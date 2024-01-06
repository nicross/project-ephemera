content.demo.bread.video.touches = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineIns()}
${content.demo.bread.glsl.commonFragment()}

out vec4 color;

void main() {
  color = vec4(1.0, 1.0, 1.0, 1.0);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineOuts()}
${content.demo.bread.glsl.defineUniforms()}
${content.demo.bread.glsl.commonVertex()}

in vec3 offset;
in vec3 vertex;

void main(void) {
  gl_Position = u_projection * vec4(vertex + offset, 1.0);

  ${content.demo.bread.glsl.passUniforms()}
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.bread.video.context()

      gl.useProgram(program.program)
      content.demo.bread.glsl.bindUniforms(gl, program)

      // Build touch data
      const touches = content.demo.bread.input.touches()

      const offsets = []

      for (const touch of touches) {
        offsets.push(
          touch.x,
          touch.y,
          touch.z,
        )
      }

      // Bind offsets
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/4,
        width: 1/4,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, touches.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.demo.bread.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.bread.glsl.attributeNames(),
          'offset',
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
