content.demo.heights.movement = (() => {
  const lateralAcceleration = 8,
    maxAngularVelocity = engine.const.tau / 4,
    maxLateralVelocity = 4

  let velocity = engine.tool.vector3d.create()

  function calculateTerrainPitch() {
    const run = maxLateralVelocity,
      start = engine.position.getVector()

    const stop = start.add(
      engine.position.getQuaternion().forward().scale(run)
    )

    const rise = content.demo.heights.terrain.value(stop)
      - content.demo.heights.terrain.value(start)

    return Math.atan(rise / run)
  }

  function move() {
    // Calculate target velocity
    const targetVelocity = engine.tool.vector3d.create({
      x: content.demo.heights.input.x(),
      y: content.demo.heights.input.y(),
    }).rotateQuaternion(
      engine.position.getQuaternion().multiply(
        engine.tool.quaternion.fromEuler({
          pitch: calculateTerrainPitch(),
        })
      )
    ).scale(maxLateralVelocity)

    // Accelerate toward target velocity
    velocity = engine.fn.accelerateVector(velocity, targetVelocity, lateralAcceleration)

    // Calculate next position
    const delta = engine.loop.delta(),
      position = engine.position.getVector()

    const nextPosition = position.add(
      velocity.scale(delta)
    )

    nextPosition.z = content.demo.heights.terrain.value(nextPosition)

    // Set next position
    engine.position.setVector(nextPosition)
  }

  function turn() {
    const delta = engine.loop.delta(),
      value = content.demo.heights.input.turn()

    // Get current yaw
    let {yaw} = engine.position.getEuler()

    // Calculate next yaw
    yaw += value * maxAngularVelocity * delta
    yaw %= engine.const.tau

    // Set next yaw
    engine.position.setEuler({
      yaw,
    })
  }

  return {
    load: function () {
      return this
    },
    unload: function () {
      engine.position.reset()
      velocity = engine.tool.vector3d.create()

      return this
    },
    update: function () {
      turn()
      move()

      return this
    },
    velocity: () => velociy.clone(),
  }
})()
