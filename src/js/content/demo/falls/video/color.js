content.demo.falls.video.color = (() => {
  const hueField = engine.fn.createNoise({
    octaves: 8,
    seed: ['falls', 'color', 'hue'],
    type: 'simplex2d',
  })

  const hueCenterField = engine.fn.createNoise({
    octaves: 8,
    seed: ['falls', 'color', 'hueCenter'],
    type: '1d',
  })

  const hueRangeField = engine.fn.createNoise({
    octaves: 8,
    seed: ['falls', 'color', 'hueRange'],
    type: '1d',
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
        hueField.value(x / (size/2), time / 30),
        hueField.value((x - (size/2)) / (size/2), time / 30),
        x / size
      )

      const center = engine.fn.lerp(0, 720, hueCenterField.value(time / 60)),
        range = engine.fn.lerp(0, 360, Math.abs((2 * hueRangeField.value(time / 60)) - 1))

      return center + (Math.sin(value * engine.const.tau) * range/2)
    },
    load: function () {
      engine.ephemera
        .add(hueField)
        .add(hueCenterField)
        .add(hueRangeField)
        .add(saturationField)

      return this
    },
    saturation: () => {
      const time = content.demo.falls.time.get()

      return engine.fn.lerp(
        0.25, 1,
        saturationField.value(time / 45)
      )
    },
    unload: function () {
      hueField.reset()
      hueCenterField.reset()
      hueRangeField.reset()
      saturationField.reset()

      engine.ephemera
        .remove(hueField)
        .remove(hueCenterField)
        .remove(hueRangeField)
        .remove(saturationField)

      return this
    },
  }
})()
