content.demo.heights.audio.jump.start = () => {
  const bus = content.demo.heights.audio.bus(),
    detune = engine.fn.randomFloat(-33, 33),
    rootFrequency = engine.fn.fromMidi(51)

  const synth = engine.synth.fm({
    carrierDetune: detune,
    carrierFrequency: rootFrequency,
    carrierType: 'triangle',
    modDepth: 0,
    modFrequency: 0,
    modtype: 'sine',
  }).filtered({
    detune: 4800 + detune,
    frequency: rootFrequency,
  }).connect(bus)

  const duration = 1/3,
    gain = engine.fn.fromDb(-12),
    now = engine.time()

  synth.filter.detune.linearRampToValueAtTime(detune, now + 1/24)
  synth.filter.detune.linearRampToValueAtTime(detune + 2400, now + duration)
  synth.param.detune.linearRampToValueAtTime(detune + 1200, now + duration*2/3)
  synth.param.gain.linearRampToValueAtTime(gain, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)
  synth.param.mod.depth.linearRampToValueAtTime(rootFrequency * engine.fn.randomFloat(0.25, 1), now + duration)
  synth.param.mod.frequency.linearRampToValueAtTime(engine.fn.randomFloat(6, 12), now + duration)

  synth.stop(now + duration)
}

content.demo.heights.movement.on('jump-start', () => content.demo.heights.audio.jump.start())
