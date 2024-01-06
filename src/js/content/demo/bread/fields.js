content.demo.bread.fields = (() => {
  const fields = [],
    getters = {}

  for (const {
    key,
    octaves = 1,
    value = (field, x, y, z, t) => field.value(x, y, z, t),
  } of [
    {
      key: 'example',
    },
  ]) {
    const field = engine.fn.createNoise({
      octaves,
      seed: ['bread', key],
      type: 'simplex4d',
    })

    getters[key] = (x, y, z, t) => value(field, x, y, z, t)
    fields.push(field)
  }

  return {
    ...getters,
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
