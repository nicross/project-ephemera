content.demo.bread.audio.touches.synth = {}

content.demo.bread.audio.touches.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.demo.bread.audio.touches.synth.prototype = {
  construct: function ({
    touch,
  }) {
    const bus = content.demo.bread.audio.bus(),
      context = engine.context()

    this.touch = touch

    const {
      amDepth,
      amFrequency,
      baseGain,
      carrierGain,
      carrierType,
      colorDepth,
      colorFrequency,
      filterFrequency,
      fmDepth,
      fmFrequency,
      fmType,
      mainDetune,
      rootFrequency,
      pan,
      width,
    } = this.calculateParameters()

    this.rootFrequency = rootFrequency

    this.synth = engine.synth.pwm({
      detune: mainDetune,
      frequency: rootFrequency,
      gain: baseGain * carrierGain,
      type: carrierType,
      width,
    }).filtered({
      detune: mainDetune,
      frequency: filterFrequency,
    }).chainAssign(
      'panner', context.createStereoPanner(),
    ).chainAssign(
      'fader', context.createGain(),
    ).connect(bus)

    // AM
    this.synth.assign('amod', engine.synth.lfo({
      depth: baseGain * amDepth,
      frequency: amFrequency,
    }))

    this.synth.chainStop(this.synth.amod)
    this.synth.amod.connect(this.synth.param.gain)

    // Color modulation
    this.synth.assign('cmod', engine.synth.lfo({
      depth: colorDepth,
      frequency: colorFrequency,
    }))

    this.synth.chainStop(this.synth.cmod)
    this.synth.cmod.connect(this.synth.filter.detune)

    // FM
    this.synth.assign('fmod', engine.synth.lfo({
      depth: rootFrequency * fmDepth,
      detune: mainDetune,
      frequency: rootFrequency * fmFrequency,
      type: fmType,
    }))

    this.synth.chainStop(this.synth.fmod)
    this.synth.fmod.connect(this.synth.param.frequency)

    this.synth.fader.gain.value = 0
    this.synth.panner.pan.value = pan

    const attack = 1/32
    engine.fn.rampLinear(this.synth.fader.gain, 1, attack)

    return this
  },
  destroy: function () {
    const now = engine.time(),
      release = 1/16

    engine.fn.rampLinear(this.synth.fader.gain, 0, release)
    this.synth.stop(now + release)

    return this
  },
  update: function () {
    const {
      amDepth,
      amFrequency,
      baseGain,
      carrierGain,
      colorDepth,
      colorFrequency,
      filterFrequency,
      fmDepth,
      fmFrequency,
      mainDetune,
      pan,
      rootFrequency,
      width,
    } = this.calculateParameters()

    this.rootFrequency = rootFrequency

    engine.fn.setParam(this.synth.filter.detune, mainDetune)
    engine.fn.setParam(this.synth.filter.frequency, filterFrequency)
    engine.fn.setParam(this.synth.panner.pan, pan)
    engine.fn.setParam(this.synth.param.amod.depth, baseGain * amDepth)
    engine.fn.setParam(this.synth.param.amod.frequency, amFrequency)
    engine.fn.setParam(this.synth.param.cmod.depth, colorDepth)
    engine.fn.setParam(this.synth.param.cmod.frequency, colorFrequency)
    engine.fn.setParam(this.synth.param.detune, mainDetune)
    engine.fn.setParam(this.synth.param.fmod.depth, rootFrequency * fmDepth)
    engine.fn.setParam(this.synth.param.fmod.detune, mainDetune)
    engine.fn.setParam(this.synth.param.fmod.frequency, rootFrequency * fmFrequency)
    engine.fn.setParam(this.synth.param.frequency, rootFrequency)
    engine.fn.setParam(this.synth.param.gain, baseGain * carrierGain)
    engine.fn.setParam(this.synth.param.width, width)

    return this
  },
  calculateParameters: function () {
    const all = content.demo.bread.fields.all(this.touch)

    return {
      ...all,
      baseGain: engine.fn.fromDb(-6) * (1 - (this.touch.modifier ** 2)),
      carrierGain: 1 - all.amDepth,
      filterFrequency: engine.fn.clamp(
        all.rootFrequency * engine.fn.scale(this.touch.x, 1, -1, 16, 1),
        engine.const.minFrequency,
        engine.const.maxFrequency,
      ),
      pan: -this.touch.y,
    }
  },
}
