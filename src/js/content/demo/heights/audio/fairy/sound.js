content.demo.heights.audio.fairies.sound = engine.sound.extend({
  fadeInDuration: 1,
  fadeOutDuration: 1,
  filterModel: engine.ear.filterModel.musical.extend({
    defaults: {
      coneRadius: engine.const.tau * 0.25,
      maxColor: 8,
      minColor: 0.5,
      power: 2,
    },
  }),
  gainModel: engine.ear.gainModel.realisticHorizon.extend({
    defaults: {
      horizonPower: 1/2,
      maxDistance: 1000,
      minDistance: 1,
      power: 1,
    },
  }),
  reverb: false,
  // Lifecycle
  onConstruct: function ({
    fairy,
  }) {
    const context = engine.context()

    this.fairy = fairy

    this.rootFrequency = engine.fn.fromMidi(
      engine.fn.choose([
        // Eb2
        48,
        // Eb3
        51,53,55,58,60,
        // Eb4
        63,65,67,70,72,
        // Eb5
        75,
      ], fairy.note)
    )

    this.synth = engine.synth.pwm({
      frequency: this.rootFrequency,
      type: engine.fn.choose(['sine','triangle','square','sawtooth'], fairy.timidity),
      width: 0.5,
    }).filtered({
      detune: 1200 * 2,
      frequency: this.rootFrequency,
    }).connect(this.output)

    this.lfo = engine.synth.lfo({
      depth: 0,
      frequency: 0,
    }).connect(this.synth.param.width)

    this.filterModel.options.frequency = this.rootFrequency
  },
  onDestroy: function () {
    this.lfo.stop()
    this.synth.stop()
  },
  onUpdate: function () {
    // Sync position
    this.vector.x = this.fairy.x
    this.vector.y = this.fairy.y
    this.vector.z = this.fairy.z

    // Update synth
    const amodFrequency = 1 / engine.fn.fromDb(engine.fn.lerp(8, 2, this.fairy.amodFrequency)),
      character = engine.fn.lerp(3/4, 5/4, 1 - this.fairy.timidity),
      time = content.demo.heights.time.get()

    const amod = engine.fn.lerp(
      engine.fn.fromDb(Math.sin(time * Math.PI * amodFrequency) * engine.fn.lerp(0, 6, this.fairy.amodDepth)),
      1,
      this.fairy.alertness
    )

    engine.fn.setParam(this.synth.filter.detune, 1200 * engine.fn.lerp(1, 6, this.fairy.alertness) * character)
    engine.fn.setParam(this.synth.param.gain, engine.fn.fromDb(engine.fn.lerp(-9, -12, this.fairy.alertness)) * amod)
    engine.fn.setParam(this.lfo.param.depth, engine.fn.lerp(1/12, 1/3, this.fairy.alertness) * character)
    engine.fn.setParam(this.lfo.param.frequency, engine.fn.lerp(1/2, 16, this.fairy.alertness) * character)
  },
})
