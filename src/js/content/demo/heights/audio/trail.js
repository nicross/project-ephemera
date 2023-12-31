content.demo.heights.audio.trail = (() => {
  const manager = new Set(),
    maxSounds = 8

  return {
    load: function () {
      return this
    },
    unload: function () {
      manager.clear()

      return this
    },
    update: function () {
      // Limit maximum sound count
      if (manager.size >= maxSounds) {
        return this
      }

      // Roll the dice
      if (Math.random() > maxSounds / engine.performance.fps()) {
        return this
      }

      // Find potential locations
      const steps = content.demo.heights.footsteps.nearby(250)

      if (!steps.length) {
        return this
      }

      const step = engine.fn.choose(steps, Math.random())

      if (engine.position.getVector().distance(step) < 1) {
        return this
      }

      if (manager.has(step)) {
        return this
      }

      content.demo.heights.audio.trail.sound.instantiate({
        destination: content.demo.heights.audio.bus(),
        manager,
        step,
        x: step.x,
        y: step.y,
        z: step.z,
      })

      return this
    },
  }
})()
