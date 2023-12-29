content.demo.heights.video.stars = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

out vec4 color;

void main() {
  color = vec4(1.0, 1.0, 1.0, 1.0);
}
`

  const vertexShader = `#version 300 es

void main(void) {

}
`

  let program

  function generate() {

  }

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)

      return this
    },
    load: function () {
      generate()

      const gl = content.demo.heights.video.context()

      program = content.gl.createProgram({
        attributes: [],
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
        uniforms: [],
      })

      return this
    },
    unload: function () {
      return this
    },
  }
})()
