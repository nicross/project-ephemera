content.demo.heights.audio.windDirectional = (() => {
  const offsetStrength = 0.25,
    rootFrequency = engine.fn.fromMidi(36)

  let binaural,
    synth

  function calculateParameters() {
    const velocity = content.demo.heights.wind.velocity(offsetStrength)

    return {
      color: engine.fn.lerpExp(1, 4, velocity, 2),
      gain: engine.fn.fromDb(-13.5) * engine.fn.fromDb(engine.fn.lerp(0, -4.5, velocity)),
      playbackRate: velocity,
      vector: content.demo.heights.wind.vector(offsetStrength).rotate(
        engine.position.getEuler().yaw
      ),
    }
  }

  function createSynth() {
    const context = engine.context()

    const {
      color,
      gain,
      playbackRate,
      vector,
    } = calculateParameters()

    synth = engine.synth.buffer({
      buffer: content.audio.buffer.brownNoise.get(0),
      gain,
      playbackRate,
    }).filtered({
      frequency: rootFrequency * color,
    }).chainAssign(
      'fader', context.createGain()
    )

    binaural = engine.ear.binaural.create({
      filterModel: engine.ear.filterModel.musical.instantiate({
        coneRadius: engine.const.tau * 0.25,
        frequency: rootFrequency,
        minColor: 0.5,
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
      color,
      gain,
      playbackRate,
      vector,
    } = calculateParameters()

    engine.fn.setParam(synth.filter.frequency, rootFrequency * color)
    engine.fn.setParam(synth.param.gain, gain)
    engine.fn.setParam(synth.param.playbackRate, playbackRate)

    binaural.update(vector)
  }

  return {
    load: function () {
      createSynth()

      return this
    },
    unload: function () {
      destroySynth()

      return this
    },
    update: function () {
      updateSynth()

      return this
    },
  }
})()
