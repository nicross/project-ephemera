content.demo.falls.audio.pickups = (() => {
  const synths = new Map()

  return {
    load: function () {
      this.update()

      return this
    },
    unload: function () {
      for (const [pickup, synth] of synths) {
        synth.destroy()
      }

      synths.clear()

      return this
    },
    update: function () {
      const pickups = new Set(
        content.demo.falls.pickups.nearby(8)
      )

      for (const [pickup, synth] of synths) {
        if (pickups.has(pickup)) {
          synth.update()
        } else {
          synth.destroy()
          synths.delete(pickup)
        }
      }

      for (const pickup of pickups) {
        if (synths.has(pickup)) {
          continue
        }

        const synth = content.demo.falls.audio.pickups.synth.create({pickup})
        synths.set(pickup, synth)
      }

      return this
    },
  }
})()
