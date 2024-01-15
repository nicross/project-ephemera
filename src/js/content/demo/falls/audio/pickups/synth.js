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

    this.occlusion = this.calculateOcclusion()

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
    const gain = engine.fn.fromDb(-15)

    this.synth = engine.synth.mod({
      amodDepth: engine.fn.fromDb(-3),
      amodFrequency: 1,
      carrierType: 'sawtooth',
      carrierFrequency: this.rootFrequency,
      carrierGain: 1 - engine.fn.fromDb(-3),
      gain: engine.const.zeroGain,
      fmodFrequency: this.rootFrequency * 2/Math.PI,
      fmodDepth: 0,
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
    this.occlusion = engine.fn.accelerateValue(this.occlusion, this.calculateOcclusion(), 8)

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
      * engine.fn.lerp(1, 0.25, this.occlusion)

    color = engine.fn.lerp(0.25, color, aheadRatio * behindRatio * (1 - content.demo.falls.player.isDeadAccelerated()))

    engine.fn.setParam(this.filter.frequency, this.rootFrequency * color)

    // AM
    engine.fn.setParam(
      this.synth.param.amod.frequency,
      engine.fn.lerpExp(16, 1, engine.fn.clamp(this.pickup.y), 0.5) * engine.fn.lerp(1, 0.5, Math.abs(relative.x))
    )

    // FM
    engine.fn.setParam(
      this.synth.param.fmod.depth,
      engine.fn.lerpExp(0, Math.PI/2, this.occlusion, 2) * this.rootFrequency
    )

    return this
  },
  // Methods
  calculateOcclusion: function () {
    const playerX = content.demo.falls.player.x(),
      relativeX = content.demo.falls.player.toRelativeX(this.pickup.x),
      threshold = content.demo.falls.pickups.threshold()

    // Prevent divide by zero
    if (relativeX == 0) {
      const enemy = content.demo.falls.enemies.get(playerX)
      return enemy && enemy.y <= this.pickup.y ? 1 : 0
    }

    // Check each nearby enemy against a raycast
    const slope = engine.fn.clamp(this.pickup.y) / engine.fn.clamp(relativeX / 8, -1, 1)

    return content.demo.falls.enemies.nearby(8).reduce((value, enemy) => {
      const enemyX = content.demo.falls.player.toRelativeX(enemy.x)

      // Filter out enemies that aren't between player and pickup
      const isBetween = engine.fn.between(enemyX, 0, relativeX)

      if (!isBetween || value == 1) {
        return value
      }

      // Calculate the projected y-value at x
      const projection = engine.fn.clamp(enemyX / 8, -1, 1) * slope

      // Skip ahead if fully occluded
      if (engine.fn.between(projection, enemy.y + threshold/2, enemy.y + enemy.height - threshold/2)) {
        return 1
      }

      // Apply some attenuation based on area on screen
      const enemyAmount = (engine.fn.clamp(enemy.y + enemy.height) - engine.fn.clamp(enemy.y))
        * (1 - engine.fn.clamp(enemy.y))
        * (enemy.y > this.pickup.y ? 0 : 1)

      // Occlusion from bottom
      if (engine.fn.between(projection, enemy.y, enemy.y + threshold/2)) {
        return Math.max(
          value,
          enemyAmount,
          engine.fn.scale(projection, enemy.y, enemy.y + threshold/2, 0, 1),
        )
      }

      // Occlusion from top
      if (engine.fn.between(projection, enemy.y + enemy.height - threshold/2, enemy.y + enemy.height)) {
        return Math.max(
          value,
          enemyAmount,
          engine.fn.scale(projection, enemy.y + enemy.height - threshold/2, enemy.y + enemy.height, 1, 0),
        )
      }

      // Not occluded, use previous value
      return Math.max(value, enemyAmount)
    }, 0)
  },
}
