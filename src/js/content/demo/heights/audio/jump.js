content.demo.heights.audio.jump = (() => {
  let lastNote,
    rootFrequency,
    synth

  function calculateParameters() {
    if (!content.demo.heights.movement.isJump()) {
      return {
        gain: 0,
      }
    }

    const position = engine.position.getVector()

    const value = engine.fn.clamp(
      (position.z - content.demo.heights.terrain.value(position)) / 10
    )

    return {
      color: engine.fn.lerp(engine.const.zero, 10, value),
      gain: engine.fn.fromDb(-16.5),
    }
  }

  function createSynth({
    color,
    gain,
  }) {
    const bus = content.demo.heights.audio.bus()

    const note = engine.fn.choose(
      [
        36,39,41,43,46
      ].filter(
        (note) => note != lastNote
      ),
      Math.random()
    )

    rootFrequency = engine.fn.fromMidi(note)
    lastNote = note

    synth = engine.synth.simple({
      frequency: rootFrequency,
      gain,
      type: 'sawtooth',
    }).filtered({
      frequency: rootFrequency * color,
    }).connect(bus)
  }

  function destroySynth() {
    const release = 1/16

    engine.fn.rampLinear(synth.param.gain, engine.const.zeroGain, release)
    synth.stop(engine.time() + release)
    synth = undefined
  }

  function updateSynth({
    color,
    gain,
  }) {
    engine.fn.setParam(synth.filter.frequency, color * rootFrequency)
    engine.fn.setParam(synth.param.gain, gain)
  }

  return {
    load: function () {
      return this
    },
    unload: function () {
      if (synth) {
        destroySynth()
      }

      return this
    },
    update: function () {
      const parameters = calculateParameters()

      if (parameters.gain) {
        if (!synth) {
          createSynth(parameters)
        } else {
          updateSynth(parameters)
        }
      } else if (synth) {
        destroySynth()
      }

      return this
    },
  }
})()
