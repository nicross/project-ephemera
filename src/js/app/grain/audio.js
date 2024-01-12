app.grain.audio = (() => {
  const bus = app.audio.bus(),
    context = engine.context(),
    rootFrequency = engine.fn.fromMidi(36)

  const amodDepthNoise = engine.fn.createNoise({
    octaves: 8,
    seed: ['hum', 'amodDepth'],
    type: '1d',
  })

  const colorNoise = engine.fn.createNoise({
    octaves: 8,
    seed: ['hum', 'color'],
    type: '1d',
  })

  const fmodDepthNoise = engine.fn.createNoise({
    octaves: 8,
    seed: ['hum', 'fmodDepth'],
    type: '1d',
  })

  const fmodDetuneNoise = engine.fn.createNoise({
    octaves: 8,
    seed: ['hum', 'fmodDetune'],
    type: '1d',
  })

  const widthNoise = engine.fn.createNoise({
    octaves: 4,
    seed: ['hum', 'width'],
    type: '1d',
  })

  let synth

  engine.ephemera
    .add(amodDepthNoise)
    .add(colorNoise)
    .add(fmodDepthNoise)
    .add(fmodDetuneNoise)
    .add(widthNoise)

  function calculateParameters(value) {
    const time = engine.time()

    const amodDepth = engine.fn.fromDb(
      engine.fn.lerp(-9, -3, amodDepthNoise.value(time))
    )

    const parameters = {
      amodDepth,
      carrierGain: 1 - amodDepth,
      color: engine.fn.lerp(3, 9, amodDepthNoise.value(time)),
      fmodDepth: engine.fn.lerp(0, rootFrequency, fmodDepthNoise.value(time)),
      fmodDetune: engine.fn.lerp(5, 7, fmodDetuneNoise.value(time)) * 1200,
      gain: engine.fn.fromDb(-24),
      width: engine.fn.lerp(0, 0.875, widthNoise.value(time)),
    }

    parameters.color = engine.fn.lerp(parameters.color, 32, value)
    parameters.fmodDepth = engine.fn.lerp(parameters.fmodDepth, rootFrequency, value)
    parameters.fmodDetune = engine.fn.lerp(parameters.fmodDetune, 0, value)
    parameters.gain = engine.fn.lerp(parameters.gain, engine.fn.fromDb(-21), value)
    parameters.width = engine.fn.lerp(parameters.width, 0.5, value)

    return parameters
  }

  /**
   * PWM -> Gain -> Filter
   * ^      ^
   * FM     |
   * AM ----|
   */
  function createSynth(value, attack) {
    const {
      amodDepth,
      carrierGain,
      color,
      fmodDepth,
      fmodDetune,
      gain,
      width,
    } = calculateParameters(value)

    synth = engine.synth.pwm({
      frequency: rootFrequency,
      gain,
      type: 'square',
    }).connect(bus)

    // AM
    synth.assign('amod', engine.synth.lfo({
      detune: 0,
      depth: amodDepth,
      frequency: 30,
      type: 'square',
    })).chainStop(synth.amod)

    synth.chainAssign('carrierGain', context.createGain())
    synth.carrierGain.gain.value = carrierGain
    synth.amod.connect(synth.carrierGain.gain)

    // FM
    synth.assign('fmod', engine.synth.lfo({
      depth: fmodDepth,
      detune: fmodDetune,
      frequency: rootFrequency,
      type: 'square',
    })).chainStop(synth.fmod)

    synth.fmod.connect(synth.param.frequency)

    // Filter
    synth.filtered({
      frequency: rootFrequency * color,
    })

    // Fader
    synth.chainAssign('fader', context.createGain())
    synth.fader.gain.value = 0
    engine.fn.rampLinear(synth.fader.gain, 1, attack)
  }

  function destroySynth(release) {
    engine.fn.rampLinear(synth.filter.frequency, engine.const.zero, release)
    engine.fn.rampLinear(synth.param.gain, engine.const.zero, release)
    synth.stop(engine.time() + release)

    synth = undefined
  }

  function updateSynth(value) {
    const {
      amodDepth,
      carrierGain,
      color,
      fmodDepth,
      fmodDetune,
      gain,
      width,
    } = calculateParameters(value)

    engine.fn.setParam(synth.carrierGain.gain, carrierGain)
    engine.fn.setParam(synth.filter.frequency, rootFrequency * color)
    engine.fn.setParam(synth.param.amod.depth, amodDepth)
    engine.fn.setParam(synth.param.fmod.depth, fmodDepth)
    engine.fn.setParam(synth.param.fmod.detune, fmodDetune)
    engine.fn.setParam(synth.param.gain, gain)
    engine.fn.setParam(synth.param.width, width)
  }

  return {
    activate: function (value) {
      if (!synth) {
        createSynth(value, 1/2)
      }

      return this
    },
    duck: function (value) {
      if (synth) {
        destroySynth(1/2)
      }

      return this
    },
    unduck: function () {
      if (!synth) {
        createSynth(app.grain.value(), 1/8)
      }

      return this
    },
    update: function (value) {
      if (synth) {
        updateSynth(value)
      }

      return this
    },
  }
})()
