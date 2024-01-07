content.demo.bread.input.gamepad = (() => {
  const leftMappings = {
    depth: 6,
    touch: [
      4,
      10,
    ],
    xAxis: 1,
    yAxis: 0,
  }

  const rightMappings = {
    depth: 7,
    touch: [
      5,
      11,
    ],
    xAxis: 3,
    yAxis: 2,
  }

  const modeMappings = {
    0: 12,
    1: 15,
    2: 13,
    3: 14,
  }

  let left,
    right

  function update(mappings, previous) {
    const isTouch = mappings.touch.reduce((previous, key) => previous || engine.input.gamepad.isDigital(key), false)

    if (!isTouch) {
      return
    }

    const next = previous || {}

    next.depth = engine.input.gamepad.getAnalog(mappings.depth)
    next.z = -engine.input.gamepad.getAxis(mappings.xAxis)
    next.y = -engine.input.gamepad.getAxis(mappings.yAxis)
    next.x = 0

    const magnitude = engine.fn.distance(next)

    if (magnitude > 1) {
      next.z /= magnitude
      next.y /= magnitude
    }

    next.x = 1 - engine.fn.distance(next)

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
      left = update(leftMappings, left)
      right = update(rightMappings, right)

      return this
    },
  }
})()
