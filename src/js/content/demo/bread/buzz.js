content.demo.bread.buzz = (() => {
  return {
    update: function () {
      const touches = [...content.demo.bread.input.touches()]

      const strong = touches.reduce(
        (value, touch) => Math.max(value, content.demo.bread.fields.buzzStrong(touch) * (1 - (touch.modifier ** 0.5))),
        0
      )

      const weak = touches.reduce(
        (value, touch) => Math.max(value, content.demo.bread.fields.buzzWeak(touch) * (1 - (touch.modifier ** 0.5))),
        0
      )

      // Set grain
      content.grain.set(engine.fn.clamp((weak * 0.666) + (strong * 0.666)))

      // Set haptics
      content.haptics.enqueue({
        duration: 1000 * engine.loop.delta(),
        strongMagnitude: (strong ** 2) * 1/3,
        weakMagnitude: (weak ** 2) * 1/3,
      })

      return this
    },
  }
})()
