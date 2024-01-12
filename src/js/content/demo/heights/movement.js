content.demo.heights.movement = (() => {
  const gravity = 10,
    lateralAcceleration = 8,
    maxAngularVelocity = engine.const.tau / 4,
    maxLateralVelocity = 4,
    pubsub = engine.tool.pubsub.create()

  let isJump = false,
    jumpTimer = 0,
    velocity = engine.tool.vector3d.create()

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
    const delta = engine.loop.delta()

    // Calculate target velocity
    const intendedVelocity = engine.tool.vector3d.create({
      x: content.demo.heights.input.x(),
      y: content.demo.heights.input.y(),
    }).rotateQuaternion(
      engine.position.getQuaternion().multiply(
        isJump
          ? engine.tool.quaternion.identity()
          : engine.tool.quaternion.fromEuler({
              pitch: calculateTerrainPitch(),
            })
      )
    ).scale(maxLateralVelocity)

    intendedVelocity.z = 0

    const targetVelocity = isJump
      ? (intendedVelocity.isZero() ? velocity : engine.fn.centroid(intendedVelocity, {x: velocity.x, y: velocity.y}))
      : intendedVelocity

    targetVelocity.z = velocity.z

    // Accelerate toward target velocity
    velocity = engine.fn.accelerateVector(velocity, targetVelocity, lateralAcceleration)
    velocity.z -= gravity * delta

    // Calculate next position
    const nextPosition = engine.position.getVector().add(
      velocity.scale(delta)
    )

    // Glue to surface when not jumping
    const terrain = content.demo.heights.terrain.value(nextPosition)

    if (nextPosition.z <= terrain) {
      isJump = false
      pubsub.emit('jump-end')
    }

    if (!isJump) {
      nextPosition.z = terrain
      velocity.z = 0
    }

    // Set next position
    engine.position.setVector(nextPosition)
  }

  function jump() {
    const delta = engine.loop.delta(),
      input = content.demo.heights.input.jump()

    if (!input) {
      jumpTimer = 0
      return
    }

    if (isJump) {
      jumpTimer = engine.fn.accelerateValue(jumpTimer, 0, 2)
      velocity.z += 3 * gravity * jumpTimer * delta
      return
    }

    isJump = true
    jumpTimer = 1
    pubsub.emit('jump-start')
    velocity.z += 0.5 * gravity
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

  return pubsub.decorate({
    isJump: () => isJump,
    load: function () {
      return this
    },
    unload: function () {
      engine.position.reset()

      isJump = false
      jumpTimer = 0
      velocity = engine.tool.vector3d.create()

      return this
    },
    update: function () {
      turn()
      jump()
      move()

      return this
    },
    velocity: () => velociy.clone(),
    velocityRatio: () => engine.fn.clamp(velocity.distance() / maxLateralVelocity),
  })
})()
