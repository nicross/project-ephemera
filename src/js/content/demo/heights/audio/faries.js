content.demo.heights.audio.fairies = (() => {
  const sounds = new Map()

  return {
    load: function () {
      this.update()

      return this
    },
    unload: function () {
      for (const [fairy, sound] of sounds) {
        sound.destroy()
      }

      sounds.clear()

      return this
    },
    update: function () {
      const audible = new Set(
        content.demo.heights.fairies.closest(1000, 7)
      )

      // Destroy inaudible sounds
      for (const [fairy, sound] of sounds) {
        if (!audible.has(fairy)) {
          sounds.delete(fairy)
          delete fairy.sound
          sound.destroy()
        }
      }

      // Create newly audible sounds
      for (const fairy of audible) {
        if (sounds.has(fairy)) {
          continue
        }

        const sound = this.sound.instantiate({
          destination: content.demo.heights.audio.bus(),
          fairy,
          x: fairy.x,
          y: fairy.y,
          z: fairy.z,
        })

        sounds.set(fairy, sound)
        fairy.sound = sound
      }

      return this
    },
  }
})()
