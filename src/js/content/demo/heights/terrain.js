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
        slope = x / 3

      return slope
        + (field0.value(x / 250 * skew, y / 250 * skew) * 50)
        + (field1.value(x / 100 * skew, y / 100 * skew) * 20)
        + (field2.value(x / 50 * skew, y / 50 * skew) * 10)
        + (field3.value(x / 5 * skew, y / 5 * skew) * 1)
    },
    unload: function () {
      field0.reset()
      field1.reset()
      field2.reset()
      field3.reset()

      engine.ephemera
        .remove(field0)
        .remove(field1)
        .remove(field2)
        .remove(field3)

      return this
    },
  }
})()
