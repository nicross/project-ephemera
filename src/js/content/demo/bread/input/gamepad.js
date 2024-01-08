content.demo.bread.input.gamepad = (() => {
  const leftMappings = {
    touch: [
      4,
      10,
    ],
    touchAxis: 6,
    xAxis: 1,
    yAxis: 0,
  }

  const leftRotation = engine.tool.quaternion.fromEuler({
    yaw: engine.const.tau * 0.25,
  })

  const rightMappings = {
    touch: [
      5,
      11,
    ],
    touchAxis: 7,
    xAxis: 3,
    yAxis: 2,
  }

  const rightRotation = engine.tool.quaternion.fromEuler({
    yaw: -engine.const.tau * 0.25,
  })

  const modeMappings = {
    0: 12,
    1: 15,
    2: 13,
    3: 14,
  }

  let left,
    right

  function update(mappings, rotation, previous) {
    const isTouch = mappings.touch.reduce((previous, key) => previous || engine.input.gamepad.isDigital(key), false)
    const isAnalogTouch = engine.input.gamepad.getAnalog(mappings.touchAxis) > 0

    if (!isTouch && !isAnalogTouch) {
      return
    }

    const next = previous || {}

    next.depth = engine.input.gamepad.getAnalog(mappings.touchAxis)
    next.z = engine.input.gamepad.getAxis(mappings.xAxis)
    next.y = -engine.input.gamepad.getAxis(mappings.yAxis)
    next.x = 0

    const magnitude = engine.fn.distance(next)

    if (magnitude > 1) {
      next.z /= magnitude
      next.y /= magnitude
    }

    next.x = 1 - engine.fn.distance(next)

    const rotated = engine.tool.vector3d.create(next).rotateQuaternion(rotation)

    next.x = rotated.x
    next.y = rotated.y
    next.z = rotated.z

    return next
  }

  return {
    load: function () {
      engine.input.gamepad.setDeadzone(0.15)

      return this
    },
    mode: () => {
      for (const [mode, key] of Object.entries(modeMappings)) {
        if (engine.input.gamepad.isDigital(key)) {
          return mode
        }
      }
    },
    touches: () => {
      const touches = []

      if (left) {
        touches.push(left)
      }

      if (right) {
        touches.push(right)
      }

      return touches
    },
    unload: function () {
      left = undefined
      right = undefined

      return this
    },
    update: function () {
      left = update(leftMappings, leftRotation, left)
      right = update(rightMappings, rightRotation, right)

      return this
    },
  }
})()
