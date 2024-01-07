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
      carrierType,
      color,
      mainDetune,
      rootFrequency,
      pan,
      width,
    } = this.calculateParameters()

    this.rootFrequency = rootFrequency

    this.synth = engine.synth.pwm({
      detune: mainDetune,
      frequency: rootFrequency,
      gain: engine.fn.fromDb(-12),
      type: carrierType,
      width,
    }).filtered({
      frequency: rootFrequency * color,
    }).chainAssign(
      'panner', context.createStereoPanner(),
    ).chainAssign(
      'fader', context.createGain(),
    ).connect(bus)

    this.synth.fader.gain.value = 0
    this.synth.panner.pan.value = pan

    const attack = 1/32
    engine.fn.rampLinear(this.synth.fader.gain, 1, attack)

    return this
  },
  destroy: function () {
    const now = engine.time(),
      release = 1/32

    engine.fn.rampLinear(this.synth.param.gain, 0, release)
    this.synth.stop(now + release)

    return this
  },
  update: function () {
    const {
      color,
      mainDetune,
      pan,
      rootFrequency,
      width,
    } = this.calculateParameters()

    this.rootFrequency = rootFrequency

    engine.fn.setParam(this.synth.filter.frequency, this.rootFrequency * color)
    engine.fn.setParam(this.synth.panner.pan, pan)
    engine.fn.setParam(this.synth.param.detune, mainDetune)
    engine.fn.setParam(this.synth.param.frequency, rootFrequency)
    engine.fn.setParam(this.synth.param.width, width)

    return this
  },
  calculateParameters: function () {
    const all = content.demo.bread.fields.all(this.touch)

    return {
      ...all,
      color: engine.fn.scale(this.touch.x, 1, -1, 16, 0.5),
      pan: -this.touch.y,
    }
  },
}
