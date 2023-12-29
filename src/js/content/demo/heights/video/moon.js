content.demo.heights.video.moon = (() => {
  const fragmentShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineIns()}
${content.demo.heights.glsl.commonFragment()}

out vec4 color;

void main() {
  color = vec4(0.0, 0.0, 0.0, 1.0);
}
`

  const vertexShader = `#version 300 es

precision highp float;

${content.demo.heights.glsl.defineOuts()}
${content.demo.heights.glsl.defineUniforms()}
${content.demo.heights.glsl.commonVertex()}

void main(void) {
  ${content.demo.heights.glsl.passUniforms()}
}
`

  let program

  return {
    draw: function () {
      const gl = content.demo.heights.video.context()

      gl.useProgram(program.program)
      content.demo.heights.glsl.bindUniforms(gl, program)

      return this
    },
    load: function () {
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
