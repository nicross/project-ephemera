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

    // Audio circuit: synth->filter->gain->panner->bus
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

    engine.fn.setParam(this.synth.param.width, this.synth.param.width.value)
    this.synth.param.width.linearRampToValueAtTime(0.5, now + 1/32)
    this.synth.param.width.linearRampToValueAtTime(0.5 + (engine.fn.randomSign() * engine.fn.randomFloat(0.0625, 0.25)), now + 1/4)
  },
  update: function () {
    // Retrigger synth
    const index = Math.round(engine.fn.clamp(this.enemy.y) * 25) / 25

    if (index !== this.lastIndex) {
      this.lastIndex = index
      this.retrigger()
    }

    // Panning, filtering, attenuating
    const relativeX = content.demo.falls.player.toRelativeX(this.enemy.x)

    const relative = {
      x: engine.fn.clamp(relativeX / 8, -1, 1),
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

    // Bright in center
    let color = 8

    // Attenuate away, with brighter walls
    if (relativeX != 0) {
      color = engine.fn.lerpExp(
        // Wall color
        engine.fn.lerpExp(
          1, 8,
          engine.fn.scale(
            Math.abs(relativeX),
            1, 8,
            1, 0
          ),
          3
        ),
        // Normal color
        engine.fn.lerpExp(5, 1, Math.abs(relative.x), 0.75),
        relative.y,
        0.125
      )
    }

    color = engine.fn.lerp(color, 1, content.demo.falls.player.isDeadAccelerated())

    engine.fn.setParam(this.filter.frequency, this.rootFrequency * color)

    return this
  },
}
