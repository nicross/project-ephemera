content.demo.heights.terrain = (() => {
  const field0 = engine.fn.createNoise({
    octaves: 2,
    seed: ['heights', 'terrain', 0],
    type: 'simplex2d',
  })

  const field1 = engine.fn.createNoise({
    octaves: 2,
    seed: ['heights', 'terrain', 1],
    type: 'simplex2d',
  })

  const field2 = engine.fn.createNoise({
    octaves: 2,
    seed: ['heights', 'terrain', 2],
    type: 'simplex2d',
  })

  const field3 = engine.fn.createNoise({
    octaves: 2,
    seed: ['heights', 'terrain', 3],
    type: 'simplex2d',
  })

  return {
    load: function () {
      engine.ephemera
        .add(field0)
        .add(field1)
        .add(field2)
        .add(field3)

      return this
    },
    value: function ({x, y} = engine.position.getVector()) {
      const skew = engine.tool.simplex3d.prototype.skewFactor,
        slope = x / 4

      return slope
        + (field0.value(x / 280 * skew, y / 280 * skew) * 40)
        + (field1.value(x / 120 * skew, y / 120 * skew) * 20)
        + (field2.value(x / 50 * skew, y / 50 * skew) * 10)
        + (field3.value(x / 4 * skew, y / 4 * skew) * 1)
    },
    unload: function () {
      engine.ephemera
        .remove(field0)
        .remove(field1)
        .remove(field2)
        .remove(field3)

      return this
    },
  }
})()
