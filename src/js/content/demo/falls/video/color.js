content.demo.falls.video.color = (() => {
  const hueField = engine.fn.createNoise({
    octaves: 4,
    seed: ['falls', 'color', 'hue'],
    type: 'simplex2d',
  })

  const saturationField = engine.fn.createNoise({
    octaves: 8,
    seed: ['falls', 'color', 'saturation'],
    type: '1d',
  })

  return {
    hue: (x) => {
      const size = content.demo.falls.const.stageSize,
        time = content.demo.falls.time.get()

      const value = engine.fn.lerp(
        hueField.value(x / size * 4, time / 60),
        hueField.value((x - size) / size * 4, time / 60),
        x / size
      )

      return engine.fn.wrap(
        720 * value,
        0, 360
      )
    },
    load: function () {
      engine.ephemera
        .add(hueField)
        .add(saturationField)

      return this
    },
    saturation: () => {
      const time = content.demo.falls.time.get()

      return engine.fn.lerp(
        0.5, 1,
        saturationField.value(time / 120)
      )
    },
    unload: function () {
      engine.ephemera
        .add(hueField)
        .add(saturationField)

      return this
    },
  }
})()
