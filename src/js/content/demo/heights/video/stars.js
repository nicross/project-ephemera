content.demo.heights.video.stars = (() => {
  const count = 1000
  let data = {}

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
    vec4(hsv2rgb(vec3(hue, 0.25, 1.0)), 1.0),
    alpha * pow(d, 1.0 / 8.0)
  );
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

in float hue_in;
in vec3 offset;
in float scale_in;
in float twinkle;
in vec3 vertex;

out float alpha;
out float hue;

void main(void) {
  vec4 v = vec4(offset * (u_drawDistance * 2.0 - 10.0), 1.0);
  v += vec4(vertex * scale_in, 0.0);

  gl_Position = u_projection * v;

  ${content.demo.heights.glsl.passUniforms()}
  alpha = scale(cos(twinkle * PI * u_time), -1.0, 1.0, 0.5, 1.0);
  alpha *= pow(sin(atan(offset.z, 1.0)), 1.5);
  hue = hue_in;
}
`

  let program

  function generate() {
    const srand = engine.fn.srand('heights', 'stars')

    const hues = [],
      offsets = [],
      scales = [],
      twinkles = []

    for (let i = 0; i < count; i += 1) {
      const vector = engine.tool.vector3d.create({
        x: srand(-1, 1),
        y: (srand() > 0.5 ? 1 : -1) * (srand() ** 3),
        z: srand(0, 1),
      }).normalize()

      const hue = engine.fn.wrap(srand(-1/3, 1/3), 0, 1),
        scale = 1 /engine.fn.lerpExp(3, 1, srand(), 2),
        twinkle = 11 / engine.fn.choose([5,7,11,13,17], srand())

      hues.push(hue)
      offsets.push(vector.x, vector.y, vector.z)
      scales.push(scale)
      twinkles.push(twinkle)
    }

    data.hues = new Float32Array(hues)
    data.offsets = new Float32Array(offsets)
    data.scales = new Float32Array(scales)
    data.twinkles = new Float32Array(twinkles)
  }

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      // Bind mesh
      const mesh = content.gl.createQuad({
        height: 5,
        quaternion: content.demo.heights.camera.quaternion(),
        width: 5,
      })

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.vertex)
      gl.vertexAttribPointer(program.attributes.vertex, 3, gl.FLOAT, false, 0, 0)

      // Bind hues
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, data.hues, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.hue_in)
      gl.vertexAttribPointer(program.attributes.hue_in, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.hue_in, 1)

      // Bind offsets
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, data.offsets, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.offset)
      gl.vertexAttribPointer(program.attributes.offset, 3, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 1)

      // Bind scales
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, data.scales, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.scale_in)
      gl.vertexAttribPointer(program.attributes.scale_in, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.scale_in, 1)

      // Bind twinkle frequencies
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
      gl.bufferData(gl.ARRAY_BUFFER, data.twinkles, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(program.attributes.twinkle)
      gl.vertexAttribPointer(program.attributes.twinkle, 1, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(program.attributes.twinkle, 1)

      // Draw instances
      gl.drawArraysInstanced(gl.TRIANGLES, 0, mesh.length / 3, count)

      // Reset divisors
      gl.vertexAttribDivisor(program.attributes.hue_in, 0)
      gl.vertexAttribDivisor(program.attributes.offset, 0)
      gl.vertexAttribDivisor(program.attributes.scale_in, 0)
      gl.vertexAttribDivisor(program.attributes.twinkle, 0)

      return this
    },
    load: function () {
      generate()

      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [
          ...content.demo.heights.glsl.attributeNames(),
          'hue_in',
          'offset',
          'scale_in',
          'twinkle',
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
      data = {}

      return this
    },
  }
})()
