content.demo.bread.audio.touches = (() => {
  const synths = new Map()

  return {
    load: function () {
      return this
    },
    unload: function () {
      for (const [touch, synth] of synths) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
    update: function () {
      const touches = content.demo.bread.input.touches()

      // Update or destroy current synths
      for (const [touch, synth] of synths) {
        if (touches.has(touch)) {
          synth.update()
        } else {
          synth.destroy()
          synths.delete(touch)
        }
      }

      // Create new synths
      for (const touch of touches) {
        if (!synths.has(touch)) {
          synths.set(touch, this.synth.create({
            touch,
          }))
        }
      }

      return this
    },
  }
})()
