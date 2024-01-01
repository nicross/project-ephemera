content.demo.heights.video.footsteps = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

in float alpha;
in float hue;
in float saturation;

out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d == 0.0) {
    discard;
  }

  color = mix(
    calculateSkyColor(),
    vec4(hsv2rgb(vec3(hue, saturation, 1.0)), 1.0),
    pow(d, 1.0 / 4.0)
  );

  color.a = alpha;
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in float audio;
in vec3 offset;
in vec3 vertex;

out float alpha;
out float hue;
out float saturation;

void main(void) {
  gl_Position = u_projection * vec4(vertex + offset + vec3(0.0, 0.0, 0.5), 1.0);

  ${content.demo.heights.glsl.passUniforms()}
  alpha = clamp(scale(length(offset), 2.0, 3.0, 0.0, 1.0), 0.0, 1.0);
  hue = (perlin3d(
    (offset.x + u_camera.x) / 30.0,
    (offset.y + u_camera.y) / 30.0,
    u_time / 60.0
  ) * 0.5) + (perlin3d(
    (offset.x + u_camera.x) / 20.0,
    (offset.y + u_camera.y) / 20.0,
    u_time / 30.0
  ) * 0.5) + (perlin3d(
    (offset.x + u_camera.x) / 10.0,
    (offset.y + u_camera.y) / 10.0,
    u_time / 15.0
  ) * 0.5) + (perlin3d(
    (offset.x + u_camera.x) / 5.0,
    (offset.y + u_camera.y) / 5.0,
    u_time / 7.5
  ) * 0.5) + (u_time / 60.0);

  saturation = mix(0.25, 1.0, audio);
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      // build data
      const camera = content.demo.heights.camera.vector()

      const footsteps = content.demo.heights.footsteps.nearby(
        content.demo.heights.camera.drawDistance()
      )

      const audios = [],
        offsets = []

      for (const footstep of footsteps) {
        audios.push(footstep.audio)

        offsets.push(
          footstep.x - camera.x,
          footstep.y - camera.y,
          footstep.z - camera.z,
        )
      }

      // Bind audio
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(audios), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.audio)
      gl.vertexAttribPointer(program.attributes.audio, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.audio, 1)

      // Bind offset
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/16,
        quaternion: content.demo.heights.camera.quaternion(),
        width: 1/16,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, footsteps.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.audio, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.heights.glsl.attributeNames(),
          'audio',
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
