content.demo.falls.audio.playerKill = () => {
  const bus = content.demo.falls.audio.bus(),
    duration = 1,
    now = engine.time(),
    rootFrequency = engine.fn.fromMidi(60)

  const synth = engine.synth.simple({
    gain: engine.fn.fromDb(-12),
    frequency: rootFrequency,
    type: 'sawtooth',
  }).shaped(
    engine.shape.distort()
  ).filtered({
    frequency: rootFrequency,
  }).connect(bus)

  synth.filter.detune.linearRampToValueAtTime(2400, now + duration)
  synth.param.detune.linearRampToValueAtTime(-3600, now + duration/4)
  synth.param.gain.linearRampToValueAtTime(engine.fn.fromDb(-18), now + duration/4)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.falls.player.on('kill', () => content.demo.falls.audio.playerKill())
