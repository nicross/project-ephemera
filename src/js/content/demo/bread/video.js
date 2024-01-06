content.demo.bread.video = (() => {
  let context,
    projection = engine.tool.matrix4d.identity()

  function buildProjection() {
    const canvas = content.video.canvas()

    // Calculate perspective
    const aspect = canvas.width / canvas.height,
      fov = (engine.const.tau * 75/360) / aspect

    const far = 10,
      near = 0.1

    const top = near * Math.tan(fov / 2)
    const bottom = -top
    const right = top * aspect
    const left = -right

    // Calculate frustum from perspective
    const sx = 2 * near / (right - left),
      sy = 2 * near / (top - bottom)

    var c2 = -(far + near) / (far - near),
      c1 = 2 * near * far / (near - far)

    const tx = -near * (left + right) / (right - left),
      ty = -near * (bottom + top) / (top - bottom)

    const base = engine.tool.matrix4d.create([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, c2, -1,
      tx, ty, c1, 0,
    ])

    // Swapper (rotate from Z-up to Y-up)
    const swapper = engine.tool.matrix4d.create([
      0, 0, -1, 0,
      -1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 0, 1,
    ])

    // Putting it all together
    return base.multiply(swapper)
  }

  return {
    context: () => context,
    load: function () {
      if (!content.video.isActive()) {
        return this
      }

      context = content.video.canvas().getContext('webgl2')

      context.depthFunc(context.LEQUAL)
      context.enable(context.DEPTH_TEST)

      context.enable(context.BLEND)
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)

      projection = buildProjection()

      this.oscilloscope.load()
      this.touches.load()

      return this
    },
    projection: () => projection,
    unload: function () {
      context = undefined
      projection = engine.tool.matrix4d.identity()

      this.oscilloscope.unload()
      this.touches.unload()

      return this
    },
    update: function () {
      if (!context) {
        return this
      }

      const canvas = content.video.canvas()
      context.viewport(0, 0, canvas.width, canvas.height)

      projection = buildProjection()

      this.oscilloscope.draw()
      this.touches.draw()

      return this
    },
  }
})()
