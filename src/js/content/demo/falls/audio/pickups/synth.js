content.demo.falls.audio.pickups.synth = {}

content.demo.falls.audio.pickups.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.demo.falls.audio.pickups.synth.prototype = {
  construct: function ({
    pickup,
  } = {}) {
    const bus = content.demo.falls.audio.bus(),
      context = engine.context()

    this.rootFrequency = pickup.frequency
    this.pickup = pickup

    // Audio circuit: synth->filter->gain->panner->bus
    this.panner = context.createStereoPanner()
    this.panner.connect(bus)

    this.fader = context.createGain()
    this.fader.gain.value = engine.const.zeroGain
    this.fader.connect(this.panner)

    this.filter = context.createBiquadFilter()
    this.filter.frequency.value = engine.const.minFrequency
    this.filter.connect(this.fader)

    // Synthesis
    const gain = engine.fn.fromDb(-16.5)

    this.synth = engine.synth.am({
      carrierType: 'sawtooth',
      carrierFrequency: this.rootFrequency,
      carrierGain: 1 - engine.fn.fromDb(-4.5),
      gain: engine.const.zeroGain,
      modDepth: engine.fn.fromDb(-4.5),
      modFrequency: 1,
    }).shaped(
      engine.shape.noise4()
    ).connect(this.filter)

    engine.fn.rampLinear(this.synth.param.gain, gain, 1/16)

    return this
  },
  destroy: function () {
    delete this.pickup

    const release = 1/32
    engine.fn.rampLinear(this.fader.gain, engine.const.zeroGain, release)
    this.synth.stop(engine.time(release))

    return this
  },
  update: function () {
    // Panning, filtering, attenuating
    const relativeX = content.demo.falls.player.toRelativeX(this.pickup.x)

    const relative = {
      x: engine.fn.clamp(relativeX / 8, -1, 1),
      y: engine.fn.clamp(this.pickup.y),
    }

    const aheadRatio = engine.fn.clamp(
      engine.fn.scale(this.pickup.y, 1, 1 - content.demo.falls.pickups.threshold(), 0, 1)
    )

    const behindRatio = engine.fn.clamp(
      engine.fn.scale(this.pickup.y, 0, -content.demo.falls.pickups.threshold(), 1, 0)
    )

    const distance = engine.fn.clamp(engine.fn.distance(relative))

    // Gain, attenuate in center, fade out on exit
    engine.fn.setParam(
      this.fader.gain,
      engine.fn.fromDb(engine.fn.lerp(-3, 0, Math.abs(relative.x))) * aheadRatio * behindRatio
    )

    // Pan
    const pan = Math.cos(Math.atan2(relative.y, relative.x))

    engine.fn.setParam(
      this.panner.pan,
      pan
    )

    // Bright in center, attenuated behind enemies, fade out on exit
    const enemy = content.demo.falls.enemies.get(this.pickup.x)

    let color = engine.fn.lerp(6, 0.75, Math.abs(relative.x))
      * (enemy && enemy.y <= this.pickup.y ? 0.5 : 1)

    color = engine.fn.lerp(0.25, color, aheadRatio * behindRatio * (1 - content.demo.falls.player.isDeadAccelerated()))

    engine.fn.setParam(this.filter.frequency, this.rootFrequency * color)

    // Modulation
    engine.fn.setParam(
      this.synth.param.mod.frequency,
      engine.fn.lerpExp(16, 1, engine.fn.clamp(this.pickup.y), 0.5) * engine.fn.lerp(1, 0.5, relative.x)
    )

    return this
  },
}
