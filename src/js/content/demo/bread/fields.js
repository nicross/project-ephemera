content.demo.bread.fields = (() => {
  const fields = [],
    getters = {}

  for (let {
    key,
    octaves = 1,
    transform = (value) => value,
    tScale = 1,
    xScale = 1,
    yScale = 1,
    zScale = 1,
  } of [
    {
      key: 'carrierType',
      transform: (value) => engine.fn.choose([
        'sine',
        'triangle','square','sawtooth','square','triangle',
        'sine',
        'triangle','square','sawtooth','square','triangle',
        'sine',
      ], value),
    },
    {
      key: 'mainDetune',
      transform: (value) => engine.fn.lerp(-25, 25, value),
    },
    {
      key: 'rootFrequency',
      transform: (value) => engine.fn.lerp(128, 512, value),
    },
    {
      key: 'width',
      transform: (value) => engine.fn.lerp(1/9, 8/9, value),
    },
  ]) {
    const field = engine.fn.createNoise({
      octaves,
      seed: ['bread', key],
      type: 'simplex4d',
    })

    tScale /= engine.tool.simplex4d.prototype.skewFactor
    tScale /= 120
    xScale /= engine.tool.simplex4d.prototype.skewFactor
    yScale /= engine.tool.simplex4d.prototype.skewFactor
    zScale /= engine.tool.simplex4d.prototype.skewFactor

    getters[key] = ({
      depth = 0,
      x = 0,
      y = 0,
      z = 0,
    }) => transform(
      field.value(
        x * xScale,
        y * yScale,
        z * zScale,
        (content.demo.bread.time.get() + depth) * tScale
      )
    )

    fields.push(field)
  }

  return {
    ...getters,
    all: (...args) => {
      const parameters = {}

      for (const [key, getter] of Object.entries(getters)) {
        parameters[key] = getter(...args)
      }

      return parameters
    },
    load: function () {
      for (const field of fields) {
        engine.ephemera.add(field)
      }

      return this
    },
    unload: function () {
      for (const field of fields) {
        engine.ephemera.remove(field)
        field.reset()
      }

      return this
    },
    update: function () {
      return this
    },
  }
})()
