content.demo.heights.video.terrain = (() => {
  const maxParticles = 15000
  let particles = []

  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

in float alpha;
in float hue;

out vec4 color;

void main() {
  float d = circle(quadCoordinates, 1.0);

  if (d == 0.0) {
    discard;
  }

  color = mix(
    calculateSkyColor(),
    vec4(hsv2rgb(vec3(hue, 1.0, 1.0)), 1.0),
    alpha * pow(d, 1.0 / 8.0)
  );
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in float life;
in vec3 offset;
in vec3 vertex;

out float alpha;
out float hue;

void main(void) {
  gl_Position = u_projection * vec4(vertex + offset, 1.0);

  ${content.demo.heights.glsl.passUniforms()}
  alpha = sin(life * PI);
  hue = mix(
    6.0,
    11.0,
    pow(cos(perlin3d(
      (offset.x - camera.x) / 5.0,
      (offset.y - camera.y) / 5.0,
      u_time / 4.0
    ) * PI * 0.5), 1.0 / 2.0)
  ) / 12.0;
}
`

  let program

  function generateParticles() {
    const count = Math.min(
      maxParticles / engine.performance.fps(),
      Math.max(0, maxParticles - particles.length)
    )

    const drawDistance = content.demo.heights.camera.drawDistance() / 4,
      position = engine.position.getVector()

    for (let i = 0; i < count; i += 1) {
      const vector = position.add(
        engine.tool.vector2d.unitX()
          .scale(Math.random() * drawDistance)
          .rotate(Math.random() * 3 * engine.const.tau)
      )

      particles.push({
        life: 1,
        rate: 1 / engine.fn.randomFloat(0.5, 2),
        x: vector.x,
        y: vector.y,
        z: content.demo.heights.terrain.value(vector),
      })
    }
  }

  function updateParticles() {
    const camera = content.demo.heights.camera.vector(),
      delta = engine.loop.delta(),
      drawDistance2 = content.demo.heights.camera.drawDistance() * 2/8,
      lifes = [],
      offsets = []

    particles = particles.reduce((particles, particle) => {
      particle.life -= delta * particle.rate

      if (particle.life < 0) {
        return particles
      }

      const oldX = particle.x,
        oldY = particle.y

      particle.x = camera.x + ((particle.x - camera.x) % drawDistance2)
      particle.y = camera.y + ((particle.y - camera.y) % drawDistance2)

      if (particle.x != oldX || particle.y != oldY) {
        particle.z = content.demo.heights.terrain.value(particle)
      }

      lifes.push(particle.life)

      offsets.push(
        particle.x - camera.x,
        particle.y - camera.y,
        particle.z - camera.z,
      )

      particles.push(particle)

      return particles
    }, [])

    return {
      lifes,
      offsets,
    }
  }

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      // Update and analyze particles
      generateParticles()

      const {
        lifes,
        offsets,
      } = updateParticles()

      // Bind life
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifes), gl.STATIC_DRAW)

      gl.enableVertexAttribArray(program.attributes.life)
      gl.vertexAttribPointer(program.attributes.life, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.life, 1)

      // Bind offset
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(offsets), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 1/48,
        quaternion: content.demo.heights.camera.quaternion(),
        width: 1/48,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, particles.length)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.life, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 0)

      return this
    },
    load: function () {
      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.heights.glsl.attributeNames(),
          'life',
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
      particles.length = 0

      return this
    },
  }
})()
