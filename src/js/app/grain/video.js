app.grain.video = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

in float time;
in float value;
out vec4 color;

${content.gl.sl.rand()}

void main() {
  vec2 co0 = vec2(gl_FragCoord.xy * (time + 0.0));
  vec2 co1 = vec2(gl_FragCoord.yx * (time + 1.0));

  float lightness = round(rand(co0));
  float opacity = mix(rand(co1), 1.0, value) / mix(20.0, 4.0, sqrt(rand(co1)) * value);

  color = vec4(lightness, lightness, lightness, opacity);
}
`

  const vertexShader = `#version 300 es

in vec3 position;
out float time;
out float value;
uniform float u_time;
uniform float u_value;

void main(void) {
  gl_Position = vec4(position, 1.0);
  time = u_time;
  value = u_value;
}
`

  let canvas,
    gl,
    height,
    program,
    root,
    width

  engine.ready(() => {
    canvas = document.querySelector('.a-app--grain')
    gl = canvas.getContext('webgl2')

    window.addEventListener('orientationchange', recalculate)
    window.addEventListener('resize', recalculate)
    recalculate()

    if (!gl) {
      return
    }

    // Initialize GL
    gl.depthFunc(gl.LEQUAL)
    gl.enable(gl.DEPTH_TEST)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Create program
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
        'u_time',
        'u_value',
      ],
    })

    return this
  })

  function draw(value) {
    // Use program
    gl.useProgram(program.program)

    // Bind u_time (mod highly-composite number to prevent precision issues)
    gl.uniform1f(program.uniforms.u_time, engine.time() % 360)

    // Bind u_value
    gl.uniform1f(program.uniforms.u_value, value)

    // Bind position
    // https://stackoverflow.com/questions/55197347/webgl-full-screen-quad-or-triangle-for-invoking-fragment-shader-for-every-pixel
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      [-1, 3, -1], [-1, -1, -1], [3, -1, -1],
    ].flat()), gl.STATIC_DRAW)

    gl.enableVertexAttribArray(program.attributes.position)
    gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0)

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function recalculate() {
    height = canvas.clientHeight
    width = canvas.clientWidth

    canvas.height = height
    canvas.width = width

    if (gl) {
      gl.viewport(0, 0, width, height)
    }
  }

  return {
    activate: function (value) {
      canvas.classList.add('a-app--grain-active')
      draw(value)

      return this
    },
    update: function (value) {
      if (gl) {
        draw(value)
      }

      return this
    },
  }
})()
