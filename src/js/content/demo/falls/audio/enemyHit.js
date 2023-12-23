content.demo.falls.audio.enemyHit = (enemy) => {
  const relative = {
    x: engine.fn.clamp(content.demo.falls.player.toRelativeX(enemy.x) / 8, -1, 1),
    y: enemy.y,
  }

  const bus = content.demo.falls.audio.bus(),
    context = engine.context(),
    distance = engine.fn.clamp(engine.fn.distance(relative)),
    rootFrequency = content.demo.falls.audio.frequencies.choose(enemy.y)

  const synth = engine.synth.simple({
    frequency: rootFrequency,
    type: 'square',
  }).filtered({
    frequency: rootFrequency * engine.fn.lerp(3, 1, distance),
  }).chainAssign(
    'panner', context.createStereoPanner()
  ).connect(bus)

  synth.panner.pan.value = Math.cos(Math.atan2(relative.y, relative.x))

  const detune = engine.fn.randomFloat(-10, 10),
    duration = 1/8,
    gain = engine.fn.fromDb(engine.fn.lerpExp(-6, -18, distance, 0.75)),
    now = engine.time()

  synth.param.detune.setValueAtTime(detune, now + duration/4)
  synth.param.detune.linearRampToValueAtTime(detune + 1200, now + duration/2)

  synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.falls.enemies.on('hit', ({enemy}) => content.demo.falls.audio.enemyHit(enemy))
