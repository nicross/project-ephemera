content.demo.falls.audio.enemies.synth = {}

content.demo.falls.audio.enemies.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.demo.falls.audio.enemies.synth.prototype = {
  construct: function ({
    enemy,
  } = {}) {
    const bus = content.demo.falls.audio.bus(),
      context = engine.context()

    this.enemy = enemy

    // Audio circuit: filter->gain->panner
    this.panner = context.createStereoPanner()
    this.panner.connect(bus)

    this.fader = context.createGain()
    this.fader.gain.value = engine.const.zeroGain
    this.fader.connect(this.panner)

    this.filter = context.createBiquadFilter()
    this.filter.frequency.value = engine.const.minFrequency
    this.filter.connect(this.fader)

    // Force retrigger
    this.update()

    return this
  },
  destroy: function () {
    delete this.enemy

    if (this.synth) {
      const release = 1/32
      engine.fn.rampLinear(this.fader.gain, engine.const.zeroGain, release)
      this.synth.stop(engine.time(release))
    }

    return this
  },
  retrigger: function () {
    this.rootFrequency = content.demo.falls.audio.frequencies.choose(this.enemy.y)

    if (!this.synth) {
      this.synth = engine.synth.pwm({
        frequency: this.rootFrequency,
        type: 'sawtooth',
        width: 0.5,
      }).connect(this.filter)
    }



    const now = engine.time()

    engine.fn.setParam(this.synth.param.frequency, this.rootFrequency)

    engine.fn.setParam(this.synth.param.gain, engine.fn.fromDb(-6))
    this.synth.param.gain.linearRampToValueAtTime(1, now + 1/32)
    this.synth.param.gain.linearRampToValueAtTime(engine.fn.fromDb(-6), now + 1/4)
  },
  update: function () {
    // Retrigger synth
    const index = Math.round(engine.fn.clamp(this.enemy.y) * 25) / 25

    if (index !== this.lastIndex) {
      this.lastIndex = index
      this.retrigger()
    }

    // Panning, filtering, attenuating
    const relative = {
      x: engine.fn.clamp(content.demo.falls.player.toRelativeX(this.enemy.x) / 8, -1, 1),
      y: engine.fn.clamp(this.enemy.y),
    }

    const distance = engine.fn.clamp(engine.fn.distance(relative))

    engine.fn.setParam(
      this.fader.gain,
      (1/17) * engine.fn.fromDb(engine.fn.lerp(0, -12, distance))
    )

    const pan = Math.cos(Math.atan2(relative.y, relative.x))

    engine.fn.setParam(
      this.panner.pan,
      pan
    )

    engine.fn.setParam(
      this.filter.frequency,
      this.rootFrequency * (
        (relative.x == 0 || relative.y == 0)
          ? engine.fn.lerpExp(8, 1, Math.abs(relative.x), 0.5)
          : engine.fn.lerpExp(4, 0.5, Math.abs(relative.x), 0.5)
      )
    )

    return this
  },
}
