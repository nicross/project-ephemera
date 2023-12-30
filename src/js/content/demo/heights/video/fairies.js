content.demo.heights.video.fairies = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

in float alertness;
in float alpha;
in float note;

out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d <= 0.0) {
    discard;
  }

  float hue = mix(2.0 / 12.0, 4.0 / 12.0, note);

  float oscillator = scale(
    sin((alertness >= 0.999 ? 4.0 : 1.0) * time * PI),
    -1.0, 1.0,
    0.0, 1.0
  );

  float saturation = mix(
    mix(0.5, 0.0, alertness),
    mix(1.0, 0.5, alertness),
    oscillator
  );

  color = mix(
    calculateSkyColor(),
    vec4(hsv2rgb(vec3(hue, saturation, 1.0)), 1.0),
    alpha * pow(d, 1.0 / 8.0)
  );

  float radius = mix(0.999, 0.99, oscillator);

  if (d < radius) {
    color.a *= d * d * 0.25;
  }
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in float alertness_in;
in float note_in;
in vec3 offset;
in vec3 vertex;

out float alertness;
out float alpha;
out float note;

void main(void) {
  gl_Position = u_projection * vec4(vertex + offset, 1.0);

  ${content.demo.heights.glsl.passUniforms()}
  alertness = alertness_in;
  alpha = scale(length(offset), 0.0, drawDistance, 1.0, 0.0);
  note = note_in;
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      // Build fairy data
      const camera = content.demo.heights.camera.vector()

      const fairies = content.demo.heights.fairies.nearby(
        content.demo.heights.camera.drawDistance()
      )

      const alertness = [],
        notes = [],
        offsets = []

      for (const fairy of fairies) {
        alertness.push(fairy.alertness)
        notes.push(fairy.note)

        offsets.push(
          fairy.x - camera.x,
          fairy.y - camera.y,
          fairy.z - camera.z,
        )
      }

      // Bind alertness
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(alertness), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.alertness_in)
      gl.vertexAttribPointer(program.attributes.alertness_in, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.alertness_in, 1)

      // Bind notes
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(notes), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.note_in)
      gl.vertexAttribPointer(program.attributes.note_in, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.note_in, 1)

      // Bind offsets
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/2,
        quaternion: content.demo.heights.camera.quaternion(),
        width: 1/2,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, fairies.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.alertness_in, 0)
      gl.vertexAttribDivisor(program.attributes.note_in, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.heights.glsl.attributeNames(),
          'alertness_in',
          'note_in',
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
