content.demo.bread.video.touches = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.bread.glsl.defineIns()}
${content.demo.bread.glsl.commonFragment()}

out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d <= 0.0) {
    discard;
  }

  float value = 0.5;

  color = vec4(value, value, value, value * pow(d, 1.0 / 10.0));
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
      const center = {x: 2, y: 0, z: 0},
        radius = 1,
        touches = content.demo.bread.input.touches()

      const offsets = []

      for (const touch of touches) {
        const magnitude = (1 - (touch.depth * 0.5)) * radius

        offsets.push(
          center.x - (touch.x * magnitude),
          center.y + (touch.y * magnitude),
          center.z + (touch.z * magnitude),
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
        height: 1/32,
        quaternion: engine.position.getQuaternion(),
        width: 1/32,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, touches.size)

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
