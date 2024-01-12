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
    // Static fields
    {
      key: 'rootFrequency',
      octaves: 8,
      transform: (value) => content.demo.bread.frequency.get(value),
      tScale: 0,
    },
    {
      key: 'carrierType',
      transform: (value) => engine.fn.choose([
        'sine','triangle','square','sawtooth',
      ], value),
      tScale: 0,
    },
    {
      key: 'fmType',
      transform: (value) => engine.fn.choose([
        'sine','triangle','square','sawtooth',
      ], value),
      tScale: 0,
    },
    // Dynamic fields
    {
      key: 'amDepth',
      transform: (value) => engine.fn.fromDb(engine.fn.lerp(-9, -3, value)),
    },
    {
      key: 'amFrequency',
      transform: (value) => engine.fn.lerpExp(1/8, 8, value, 3),
    },
    {
      key: 'buzzStrong',
      transform: (value) => (Math.abs((value * 2) - 1) ** 2),
    },
    {
      key: 'buzzWeak',
      transform: (value) => Math.abs((value * 2) - 1),
    },
    {
      key: 'colorDepth',
      transform: (value) => engine.fn.lerpExp(0, 1200, value, 2),
    },
    {
      key: 'colorFrequency',
      transform: (value) => engine.fn.lerpExp(1/8, 8, value, 3),
    },
    {
      key: 'fmDepth',
      transform: (value) => value > 2/5 ? engine.fn.scale(value, 2/5, 1, 0, 1) : 0,
    },
    {
      key: 'fmFrequency',
      transform: (value) => engine.fn.lerpExp(1/4, 4, value, 2),
    },
    {
      key: 'mainDetune',
      transform: (value) => engine.fn.lerp(-25, 25, value),
    },
    {
      key: 'pwmDepth',
      transform: (value) => value,
    },
    {
      key: 'pwmFrequency',
      transform: (value) => engine.fn.lerp(1/8, 8, value, 2),
    },
    {
      key: 'vibratoDepth',
      transform: (value) => engine.fn.lerp(0, 25, value),
    },
    {
      key: 'vibratoFrequency',
      transform: (value) => engine.fn.lerp(1/8, 8, value, 2),
    },
    {
      key: 'width',
      transform: (value) => value,
    },
  ]) {
    const field = engine.fn.createNoise({
      octaves,
      seed: ['bread', key],
      type: 'simplex4d',
    })

    tScale *= engine.tool.simplex4d.prototype.skewFactor
    xScale *= engine.tool.simplex4d.prototype.skewFactor
    yScale *= engine.tool.simplex4d.prototype.skewFactor
    zScale *= engine.tool.simplex4d.prototype.skewFactor

    tScale *= 1/30
    xScale *= 1
    yScale *= 1
    zScale *= 1

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
        (content.demo.bread.time.get() * tScale) - (depth * 1/10)
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
