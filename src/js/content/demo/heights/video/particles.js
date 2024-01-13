content.demo.heights.video.particles = (() => {
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
    vec4(hsv2rgb(vec3(hue, 0.5, 1.0)), 1.0),
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
  alpha = life;
  hue = perlin3d(
    (offset.x - camera.x) / 5.0,
    (offset.y - camera.y) / 5.0,
    u_time / 4.0
  ) * 3.0;
}
`

  let program

  function generateParticles(where, count) {
    for (let i = 0; i < count; i += 1) {
      particles.push({
        life: 1,
        rate: 1 / 120,
        velocity: engine.tool.vector3d.create({
          x: engine.fn.randomFloat(-3, 3),
          y: engine.fn.randomFloat(-3, 3),
          z: engine.fn.randomFloat(0, 3),
        }),
        x: where.x,
        y: where.y,
        z: where.z,
      })
    }
  }

  function updateParticles() {
    const camera = content.demo.heights.camera.vector(),
      delta = engine.loop.delta(),
      drawDistance2 = content.demo.heights.camera.drawDistance() * 2/8,
      lifes = [],
      offsets = [],
      wind = content.demo.heights.wind.vector(1/3).scale(1 * delta)

    particles = particles.reduce((particles, particle) => {
      particle.life -= delta * particle.rate

      if (particle.life < 0) {
        return particles
      }

      particle.velocity.x += wind.x
      particle.velocity.y += wind.y

      particle.x += particle.velocity.x * delta
      particle.y += particle.velocity.y * delta
      particle.z += particle.velocity.z * delta

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

      // Build particle data
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
    generate: generateParticles,
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

content.demo.heights.fairies.on('catch', (fairy) => {
  content.demo.heights.video.particles.generate(fairy, engine.fn.randomInt(200, 250))
})
