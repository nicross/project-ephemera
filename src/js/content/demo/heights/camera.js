content.demo.heights.camera = (() => {
  const drawDistance = 1000,
    height = 1.75,
    lookMaxVelocity = engine.const.tau / 4,
    lookRange = engine.const.tau * 63/256

  let look = 0,
    projection = engine.tool.matrix4d.identity(),
    quaternion = engine.tool.vector3d.unitX().quaternion(),
    vector = engine.tool.vector3d.create()

  function updateLook() {
    const value = content.demo.heights.input.look()

    const target = lookRange * Math.sign(value),
      velocity = lookMaxVelocity * Math.abs(value)

    look = engine.fn.accelerateValue(look, target, velocity)
  }

  function updateProjection() {
    const canvas = content.video.canvas()

    // Calculate perspective
    // Twice as far to support layering of background elements
    const aspect = canvas.width / canvas.height,
      fov = (engine.const.tau / 4) / aspect

    const far = drawDistance * 2,
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

    // Camera rotation
    const rotation = engine.tool.matrix4d.fromQuaternion(
      quaternion.conjugate()
    ).transpose()

    // Putting it all together
    projection = base.multiply(swapper).multiply(rotation)
  }

  return {
    drawDistance: () => drawDistance,
    load: function () {
      this.update()

      return this
    },
    look: () => look,
    projection: () => projection,
    unload: function () {
      look = 0

      return this
    },
    update: function () {
      updateLook()

      vector = engine.position.getVector().add({
        z: height,
      })

      quaternion = engine.position.getQuaternion().multiply(
        engine.tool.quaternion.fromEuler({
          pitch: look,
        })
      )

      updateProjection()

      return this
    },
    vector: () => vector.clone(),
  }
})()
