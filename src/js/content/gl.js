content.gl = {}

content.gl.createProgram = function ({
  context: gl = this.context(),
  attributes = [],
  shaders = [],
  uniforms = [],
} = {}) {
  const program = gl.createProgram()

  for (const {source, type} of shaders) {
    const shader = gl.createShader(type)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error((type == gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT') + ' SHADER:\n' + gl.getShaderInfoLog(shader))
    }
  }

  gl.linkProgram(program)

  return {
    attributes: attributes.reduce((hash, name) => {
      hash[name] = gl.getAttribLocation(program, name)
      return hash
    }, {}),
    destroy: function () {
      gl.deleteProgram(program)
      return this
    },
    program,
    uniforms: uniforms.reduce((hash, name) => {
      hash[name] = gl.getUniformLocation(program, name)
      return hash
    }, {}),
  }
}
