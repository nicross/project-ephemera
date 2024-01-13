content.demo.heights.buzz = (() => {
  let touch = 0

  return {
    catch: function () {
      touch = engine.fn.clamp(touch + engine.fn.randomFloat(0.75, 1))

      return this
    },
    load: function () {
      return this
    },
    unload: function () {
      touch = 0

      return this
    },
    update: function () {
      const fairies = content.demo.heights.fairies.nearby(20),
        position = engine.position.getVector()

      const value = fairies.reduce(
        (value, fairy) => Math.max(
          fairy.alertness * ((1 - engine.fn.clamp(position.distance(fairy) / 20)) ** 1.5),
          value
        ),
        0
      )

      // Accelerate touch to zero
      touch = engine.fn.accelerateValue(touch, 0, 1)

      // Set grain
      content.grain.set(
        engine.fn.clamp(value + touch)
      )

      // Set haptics
      content.haptics.enqueue({
        duration: 1000 * engine.loop.delta(),
        strongMagnitude: (value ** 2) * 1/4 * Math.random(),
        weakMagnitude: (value ** 2) * 1/4 * Math.random(),
      })

      return this
    },
  }
})()

engine.ready(() => {
  content.demo.heights.fairies.on('catch', () => content.demo.heights.buzz.catch())
})
