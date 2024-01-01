content.demo.heights.audio.trail.sound = engine.sound.extend({
  filterModel: engine.ear.filterModel.musical.extend({
    defaults: {
      coneRadius: engine.const.tau * 0.25,
      maxColor: 8,
      minColor: 0,
      power: 2,
    },
  }),
  gainModel: engine.ear.gainModel.realisticHorizon.extend({
    defaults: {
      horizonPower: 1/2,
      maxDistance: 250,
      minDistance: 1,
      power: 1/2,
    },
  }),
  reverb: false,
  // Lifecycle
  onConstruct: function ({
    manager,
    step,
  }) {
    this.manager = manager
    this.step = step

    this.step.audio = 1
    this.manager.add(this.step)

    this.rootFrequency = engine.fn.fromMidi(
      engine.fn.choose([
        // Eb3
        51,53,55,58,60,
        // Eb4
        63,65,67,70,72,
      ], Math.random())
    )

    this.synth = engine.synth.pwm({
      frequency: this.rootFrequency,
      type: engine.fn.choose(['sine','triangle','square','sawtooth'], Math.random()),
      width: 0.5,
    }).filtered({
      frequency: this.rootFrequency * 2,
    }).connect(this.output)

    this.filterModel.options.frequency = this.rootFrequency

    const gain = engine.fn.fromDb(-15),
      now = engine.time()

    this.synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
    this.synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + 1)
    this.synth.stop(now + 1)

    setTimeout(() => this.destroy(), 1000)
  },
  onDestroy: function () {
    this.step.audio = 0
    this.manager.delete(this.step)
  },
  onUpdate: function () {
    this.step.audio = engine.fn.accelerateValue(this.step.audio, 0, 1)
  },
})
