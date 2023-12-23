content.demo.falls.audio.playerMove = () => {
  const bus = content.demo.falls.audio.bus(),
    context = engine.context(),
    moveDirection = content.demo.falls.input.moveDirection()

  const synth = engine.synth.amBuffer({
    buffer: content.audio.buffer.brownNoise.choose(),
    carrierGain: 0.5,
    modDepth: 0.5,
    modFrequency: engine.fn.randomFloat(8, 16),
    playbackRate: engine.fn.randomFloat(0.5, 1),
  }).filtered({
    frequency: engine.fn.randomFloat(750, 1500),
  }).chainAssign(
    'panner', context.createStereoPanner()
  ).connect(bus)

  const detune = engine.fn.randomFloat(-10, 10),
    duration = 1/8,
    gain = engine.fn.fromDb(engine.fn.randomFloat(-12.5, -11.5)),
    now = engine.time()

  synth.panner.pan.linearRampToValueAtTime(-moveDirection, now + duration)

  synth.param.gain.linearRampToValueAtTime(gain, now + 1/64)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.falls.player.on('move', () => content.demo.falls.audio.playerMove())
