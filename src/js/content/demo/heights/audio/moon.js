content.demo.heights.audio.moon = (() => {
  const rootFrequency = engine.fn.fromMidi(28)

  const amodDepthField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights', 'moon', 'amodDepth'],
    type: '1d',
  })

  const colorField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights', 'moon', 'color'],
    type: '1d',
  })

  const fmodDepthField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights', 'moon', 'fmodDepth'],
    type: '1d',
  })

  const fmodDetuneField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights', 'moon', 'fmodDetune'],
    type: '1d',
  })

  const gainField = engine.fn.createNoise({
    octaves: 8,
    seed: ['heights', 'moon', 'gain'],
    type: '1d',
  })

  let binaural,
    synth

  function calculateParameters() {
    const time = content.demo.heights.time.get()
    const amodDepth = amodDepthField.value(time / 16) * 0.5

    return {
      amodDepth,
      carrierGain: 1 - amodDepth,
      color: engine.fn.lerp(2, 8, colorField.value(time / 17)),
      fmodDepth: fmodDepthField.value(time / 18) * rootFrequency * 2,
      fmodDetune: engine.fn.lerp(-200, 200, fmodDetuneField.value(time / 19)),
      gain: engine.fn.fromDb(-21) * engine.fn.fromDb(engine.fn.lerp(-3, 0, gainField.value(time / 20))),
      vector: content.demo.heights.moonVector().rotateQuaternion(
        engine.position.getQuaternion().conjugate()
      ),
    }
  }

  function createSynth() {
    const context = engine.context()

    const {
      amodDepth,
      carrierGain,
      color,
      fmodDepth,
      fmodDetune,
      gain,
      vector,
    } = calculateParameters()

    synth = engine.synth.mod({
      amodDepth,
      amodFrequency: rootFrequency * 2,
      amodType: 'sawtooth',
      carrierGain,
      carrierFrequency: rootFrequency,
      carrierType: 'sawtooth',
      fmodDepth,
      fmodDetune,
      fmodFrequency: rootFrequency * 6,
      fmodType: 'sawtooth',
      gain,
    }).filtered({
      frequency: rootFrequency * color,
    }).chainAssign(
      'fader', context.createGain()
    )

    binaural = engine.ear.binaural.create({
      filterModel: engine.ear.filterModel.musical.instantiate({
        coneRadius: engine.const.tau * 0.25,
        frequency: rootFrequency,
        minColor: 2,
        maxColor: 8,
        power: 2,
      }),
      gainModel: engine.ear.gainModel.normalize,
      ...vector,
    }).from(synth).to(
      content.demo.heights.audio.bus()
    )

    synth.fader.gain.value = engine.const.zeroGain
    engine.fn.rampLinear(synth.fader.gain, 1, 1/8)
  }

  async function destroySynth() {
    const release = 1/8

    synth.stop(engine.time() + release)
    engine.fn.rampLinear(synth.fader.gain, release)

    await engine.fn.promise(release * 1000)
    binaural.destroy()
  }

  function updateSynth() {
    const {
      amodDepth,
      carrierGain,
      color,
      fmodDepth,
      fmodDetune,
      gain,
      vector,
    } = calculateParameters()

    engine.fn.setParam(synth.param.amod.depth, amodDepth)
    engine.fn.setParam(synth.param.carrierGain, carrierGain)
    engine.fn.setParam(synth.filter.frequency, rootFrequency * color)
    engine.fn.setParam(synth.param.fmod.depth, fmodDepth)
    engine.fn.setParam(synth.param.fmod.detune, fmodDetune)
    engine.fn.setParam(synth.param.gain, gain)

    binaural.update(vector)
  }

  return {
    load: function () {
      engine.ephemera
        .add(amodDepthField)
        .add(colorField)
        .add(fmodDepthField)
        .add(fmodDetuneField)
        .add(gainField)

      createSynth()

      return this
    },
    unload: function () {
      amodDepthField.reset()
      colorField.reset()
      fmodDepthField.reset()
      fmodDetuneField.reset()
      gainField.reset()

      engine.ephemera
        .remove(amodDepthField)
        .remove(colorField)
        .remove(fmodDepthField)
        .remove(fmodDetuneField)
        .remove(gainField)

      destroySynth()

      return this
    },
    update: function () {
      updateSynth()

      return this
    },
  }
})()
