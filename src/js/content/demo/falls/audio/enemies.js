content.demo.falls.audio.enemies = (() => {
  const synths = new Map()

  return {
    load: function () {
      this.update()

      return this
    },
    unload: function () {
      for (const [enemy, synth] of synths) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
    update: function () {
      const enemies = new Set(
        content.demo.falls.enemies.nearby(8)
      )

      for (const [enemy, synth] of synths) {
        if (enemies.has(enemy)) {
          synth.update()
        } else {
          synth.destroy()
          synths.delete(enemy)
        }
      }

      for (const enemy of enemies) {
        if (synths.has(enemy)) {
          continue
        }

        const synth = content.demo.falls.audio.enemies.synth.create({enemy})
        synths.set(enemy, synth)
      }

      return this
    },
  }
})()
