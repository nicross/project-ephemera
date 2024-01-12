content.demo.heights.audio.footsteps = (() => {
  const context = engine.context()

  const rootFrequency = engine.fn.fromMidi(24)

  const amodDepthField = engine.fn.createNoise({
    octaves: 4,
    seed: ['heights', 'footsteps', 'amodDepth'],
    type: 'simplex2d',
  })

  const amodFrequencyField = engine.fn.createNoise({
    octaves: 4,
    seed: ['heights', 'footsteps', 'amodFrequency'],
    type: 'simplex2d',
  })

  const colorField = engine.fn.createNoise({
    octaves: 4,
    seed: ['heights', 'footsteps', 'color'],
    type: 'simplex2d',
  })

  const fmodDepthField = engine.fn.createNoise({
    octaves: 4,
    seed: ['heights', 'footsteps', 'fmodDepth'],
    type: 'simplex2d',
  })

  let isLeft = false

  return {
    load: function () {
      engine.ephemera
        .add(amodDepthField)
        .add(amodFrequencyField)
        .add(colorField)
        .add(fmodDepthField)

      return this
    },
    trigger: function ({
      strength,
    }) {
      const bus = content.demo.heights.audio.bus()
      const {x, y} = engine.position.getVector()

      const amodDepth = amodDepthField.value(x / 20, y / 20) * 0.5,
        detune = engine.fn.randomFloat(-25, 25),
        gain = engine.fn.fromDb(-9 + engine.fn.lerp(-4.5, 0, strength))

      const synth = engine.synth.mod({
        amodDepth,
        amodFrequency: engine.fn.lerp(4, 16, amodFrequencyField.value(x / 20, y / 20)),
        amodType: 'sine',
        carrierDetune: detune,
        carrierFrequency: rootFrequency,
        carrierGain: 1 - amodDepth,
        carrierType: 'sawtooth',
        fmodDepth: fmodDepthField.value(x / 20, y / 20) * rootFrequency,
        fmodFrequency: rootFrequency * 4,
        fmodType: 'triangle',
      }).filtered({
        frequency: engine.fn.lerp(3, 6, colorField.value(x / 20, y / 20)) * rootFrequency,
      }).chainAssign(
        'panner', context.createStereoPanner()
      ).connect(bus)

      synth.panner.pan.value = 1/3 * (isLeft ? -1 : 1)
      isLeft = !isLeft

      const duration = 1/4,
        now = engine.time()

      synth.param.gain.linearRampToValueAtTime(gain, now + 1/32)
      synth.param.gain.linearRampToValueAtTime(gain/2, now + 1/16)
      synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, now + duration)

      synth.stop(now + duration)

      return this
    },
    unload: function () {
      amodDepthField.reset()
      amodFrequencyField.reset()
      colorField.reset()
      fmodDepthField.reset()

      engine.ephemera
        .remove(amodDepthField)
        .remove(amodFrequencyField)
        .remove(colorField)
        .remove(fmodDepthField)

      return this
    },
  }
})()

content.demo.heights.footsteps.on('step', (e) => {
  if (!content.demo.heights.movement.isJump()) {
    content.demo.heights.audio.footsteps.trigger(e)
  }
})
