content.demo.bread.buzz = (() => {
  return {
    update: function () {
      const touches = [...content.demo.bread.input.touches()]

      const strong = touches.reduce(
        (value, touch) => Math.max(
          value,
          content.demo.bread.fields.buzzStrong(touch) * (1 - (touch.modifier ** 0.5)) * (1 - (Math.random() * content.demo.bread.fields.buzzStrongTexture(touch)))
        ),
        0
      )

      const weak = touches.reduce(
        (value, touch) => Math.max(
          value,
          content.demo.bread.fields.buzzWeak(touch) * (1 - (touch.modifier ** 0.5)) * (1 - (Math.random() * content.demo.bread.fields.buzzWeakTexture(touch)))
        ),
        0
      )

      // Set grain
      content.grain.set(engine.fn.clamp((weak + strong) * 0.5) ** (1/3))

      // Set haptics
      content.haptics.enqueue({
        duration: 1000 * engine.loop.delta(),
        strongMagnitude: (strong ** 2) * 0.5,
        weakMagnitude: (weak ** 2) * 0.5,
      })

      return this
    },
  }
})()
