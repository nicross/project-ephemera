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
      console.error(
        (type == gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT') + ' SHADER:\n' + gl.getShaderInfoLog(shader)
      )
    }
  }

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      gl.getProgramInfoLog(program)
    );
  }

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

content.gl.createQuad = ({
  height = 1,
  origin = engine.tool.vector3d.create(), // center of the quad
  quaternion = engine.tool.quaternion.identity(),
  rotate = engine.tool.quaternion.identity(),
  translate = engine.tool.vector3d.create(),
  width = 1,
} = {}) => {
  const corners = [
    engine.tool.vector3d.create({y: -width, z: -height}) // right bottom
      .add(origin)
      .rotateQuaternion(rotate)
      .rotateQuaternion(quaternion).add(translate),
    engine.tool.vector3d.create({y: -width, z: height}) // right top
      .add(origin)
      .rotateQuaternion(rotate)
      .rotateQuaternion(quaternion).add(translate),
    engine.tool.vector3d.create({y: width, z: -height}) // left bottom
      .add(origin)
      .rotateQuaternion(rotate)
      .rotateQuaternion(quaternion).add(translate),
    engine.tool.vector3d.create({y: width, z: height}) // left top
      .add(origin)
      .rotateQuaternion(rotate)
      .rotateQuaternion(quaternion).add(translate),
  ]

  return [
    corners[0].x, corners[0].y, corners[0].z, // right bottom
    corners[1].x, corners[1].y, corners[1].z, // right top
    corners[2].x, corners[2].y, corners[2].z, // left bottom
    corners[1].x, corners[1].y, corners[1].z, // right top
    corners[2].x, corners[2].y, corners[2].z, // left bottom
    corners[3].x, corners[3].y, corners[3].z, // left top
  ]
}

content.gl.quadTextureCoordinates = () => [
  1, 1,
  1, 0,
  0, 1,
  1, 0,
  0, 1,
  0, 0,
]
