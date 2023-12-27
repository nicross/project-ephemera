content.demo.falls.audio.frequencies = (() => {
  const keyField = engine.fn.createNoise({
    octaves: 4,
    seed: ['falls', 'key'],
    type: '1d',
  })

  const major = [
    // Eb1
    //27,29,31,34,36,
    36,
    // Eb2
    39,41,43,46,48,
    // Eb3
    51,53,55,58,60,
    // Eb4
    63,65,67,70,72,
    // Eb5
    75,77,79,82,84,
    // Eb6
    87,89,91,94,//96,
    // Eb7
    //99,101,103,106,108,
  ].map(engine.fn.fromMidi)

  const minor = [
    // C1
    //24,26,27,31,32,
    // C2
    36,38,39,43,44,
    // C3
    48,50,51,55,56,
    // C4
    60,62,63,67,68,
    // C5
    72,74,75,79,80,
    // C6
    84,86,87,91,92,
    // C7
    //96,98,99,103,104,
  ].map(engine.fn.fromMidi)

  let keyValue

  return {
    choose: (value) => {
      const frequencies = Math.random() < keyValue ? major : minor
      return engine.fn.choose(frequencies, value)
    },
    load: function () {
      engine.ephemera.add(keyField)
      keyValue = keyField.value(0)

      return this
    },
    unload: function () {
      engine.ephemera.remove(keyField)

      return this
    },
    update: function () {
      const time = content.demo.falls.time.get()

      keyValue = keyField.value(time / 120)

      return this
    },
  }
})()
