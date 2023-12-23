content.demo.falls.audio.enemyKill = (enemy) => {
  const relative = {
    x: engine.fn.clamp(content.demo.falls.player.toRelativeX(enemy.x) / 8, -1, 1),
    y: enemy.y,
  }

  const bus = content.demo.falls.audio.bus(),
    context = engine.context(),
    detune = engine.fn.randomFloat(-10, 10),
    duration = 2,
    rootFrequency = engine.fn.fromMidi(60)

  const synth = engine.synth.simple({
    detune,
    gain: engine.fn.fromDb(-12),
    frequency: rootFrequency,
    type: 'triangle',
  }).filtered({
    detune,
    frequency: rootFrequency,
  }).chainAssign(
    'panner', context.createStereoPanner()
  ).connect(bus)

  const now = engine.time()

  synth.panner.pan.value = Math.cos(Math.atan2(relative.y, relative.x))

  synth.filter.detune.linearRampToValueAtTime(detune + 1200, now + duration)
  synth.param.detune.linearRampToValueAtTime(detune - 3600, now + duration/8)
  synth.param.gain.linearRampToValueAtTime(engine.fn.fromDb(-18), now + duration/8)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)

  synth.stop(now + duration)
}

content.demo.falls.enemies.on('kill', ({enemy}) => content.demo.falls.audio.enemyKill(enemy))
