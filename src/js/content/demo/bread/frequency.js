content.demo.bread.frequency = (() => {
  const chords = [
    // Pentatonic major
    [
      60,63,65,67,70
    ],
    // Diatonic
    [
      60,62,63,65,67,68,70,
    ],
    // Pentatonic minor
    [
      60,62,63,67,68
    ],
    // Chromatic
    [
      60,61,62,63,64,65,66,67,68,69,70,71
    ],
  ].map((chord) => [
    ...chord.map((note) => note - (3 * 12)),
    ...chord.map((note) => note - (2 * 12)),
    ...chord.map((note) => note - (1 * 12)),
    ...chord.map((note) => note - (0 * 12)),
    ...chord.map((note) => note + (1 * 12)),
    ...chord.map((note) => note + (2 * 12)),
    //...chord.map((note) => note + (3 * 12)),
  ].map((note) => engine.fn.fromMidi(note)))

  let mode = 1

  return {
    get: (value) => engine.fn.choose(chords[mode], value),
    load: function () {
      mode = 1
      return this
    },
    setMode: function (value) {
      mode = engine.fn.clamp(value, 0, chords.length)
      return this
    },
    unload: function () {
      return this
    },
    update: function () {
      mode = content.demo.bread.input.mode() || mode

      return this
    },
  }
})()
