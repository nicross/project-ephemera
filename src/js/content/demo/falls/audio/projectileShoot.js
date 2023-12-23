content.demo.falls.audio.projectileShoot = () => {
  const bus = content.demo.falls.audio.bus(),
    rootFrequency = engine.fn.fromMidi(36)

  const synth = engine.synth.fm({
    carrierFrequency: rootFrequency,
    carrierType: 'square',
    modDepth: rootFrequency,
    modFrequency: engine.fn.randomFloat(8, 16),
    modType: 'sine',
  }).filtered({
    frequency: rootFrequency * 4,
  }).connect(bus)

  const detune = engine.fn.randomFloat(-10, 10),
    duration = 1/8,
    gain = engine.fn.fromDb(engine.fn.randomFloat(-12.5, -11.5)),
    now = engine.time()

  synth.param.detune.linearRampToValueAtTime(2400 + detune, now + 1/64)
  synth.param.detune.linearRampToValueAtTime(detune, now + duration)

  synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.falls.projectiles.on('shoot', () => content.demo.falls.audio.projectileShoot())
