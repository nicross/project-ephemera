content.demo.heights.wind = (() => {
  const directionField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','direction'],
    type: '1d',
  })

  const directionOffsetField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','direction', 'offset'],
    type: '1d',
  })

  const velocityField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','velocity'],
    type: '1d',
  })

  const velocityOffsetField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','velocity', 'offset'],
    type: '1d',
  })

  let direction = engine.const.tau / 4,
    directionOffset = 0,
    velocity = 0,
    velocityOffset = 0

  return {
    direction: (offsetStrength = 0) => (direction * (1 - offsetStrength)) + (directionOffset * offsetStrength),
    load: function () {
      engine.ephemera
        .add(directionField)
        .add(directionOffsetField)
        .add(velocityField)
        .add(velocityOffsetField)

      this.update()

      return this
    },
    unload: function () {
      directionField.reset()
      directionOffsetField.reset()
      velocityField.reset()
      velocityOffsetField.reset()

      engine.ephemera
        .remove(directionField)
        .remove(directionOffsetField)
        .remove(velocityField)
        .remove(velocityOffsetField)

      return this
    },
    update: function () {
      const time = content.demo.heights.time.get()

      direction = engine.fn.lerp(-1/8, 1/8, directionField.value(time / 29)) * engine.const.tau
      directionOffset = engine.fn.lerp(-1/8, 1/8, directionOffsetField.value(time)) * engine.const.tau
      velocity = velocityField.value(time / 31)
      velocityOffset = velocityOffsetField.value(time)

      return this
    },
    vector: function (offsetStrength = 0) {
      return engine.tool.vector2d.unitX().rotate(
        this.direction(offsetStrength)
      ).scale(
        this.velocity(offsetStrength)
      )
    },
    velocity: (offsetStrength = 0) => (velocity * (1 - offsetStrength)) + (velocityOffset * offsetStrength),
  }
})()
