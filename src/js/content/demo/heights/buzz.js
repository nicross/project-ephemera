content.demo.heights.buzz = (() => {
  return {
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

      // Set grain
      content.grain.set(value)

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
