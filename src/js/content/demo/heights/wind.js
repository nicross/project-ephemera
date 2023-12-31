content.demo.heights.wind = (() => {
  const directionField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','direction'],
    type: '1d',
  })

  const velocityField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights','wind','velocity'],
    type: '1d',
  })

  let direction = engine.const.tau / 4,
    velocity = 0

  return {
    direction: () => direction,
    load: function () {
      engine.ephemera
        .add(directionField)
        .add(velocityField)

      this.update()

      return this
    },
    unload: function () {
      directionField.reset()
      velocityField.reset()

      engine.ephemera
        .remove(directionField)
        .remove(velocityField)

      return this
    },
    update: function () {
      const time = content.demo.heights.time.get()

      direction = engine.fn.lerp(-1/8, 1/8, directionField.value(time)) * engine.const.tau
      velocity = velocityField.value(time * 0.99)

      return this
    },
    vector: () => engine.tool.vector2d.unitX().rotate(direction).scale(velocity),
    velocity: () => velocity,
  }
})()
