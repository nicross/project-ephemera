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
    this.rootFrequency = 256

    const {
      color,
      pan,
    } = this.calculateParameters()

    this.synth = engine.synth.pwm({
      frequency: 128,
      gain: engine.fn.fromDb(-12),
      type: 'sawtooth',
      width: 0.5,
    }).filtered({
      frequency: this.rootFrequency * color,
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
      pan,
    } = this.calculateParameters()

    engine.fn.setParam(this.synth.filter.frequency, this.rootFrequency * color)
    engine.fn.setParam(this.synth.panner.pan, pan)

    return this
  },
  calculateParameters: function () {
    return {
      color: engine.fn.scale(this.touch.x, 1, -1, 16, 0.5),
      pan: -this.touch.y
    }
  },
}
