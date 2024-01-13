content.demo.heights.audio.fairies.catch = () => {
  const bus = content.demo.heights.audio.bus(),
    detune = engine.fn.randomFloat(-10, 10),
    rootFrequency = engine.fn.fromMidi(51)

  const high = engine.synth.simple({
    detune: detune,
    frequency: rootFrequency,
    type: 'triangle',
  }).filtered({
    detune: detune + 700,
    frequency: rootFrequency,
  }).connect(bus)

  const low = engine.synth.simple({
    detune: detune,
    frequency: rootFrequency,
    type: 'sawtooth',
  }).filtered({
    detune: detune + 1200,
    frequency: rootFrequency,
  }).connect(bus)

  const duration = 1,
    gain = engine.fn.fromDb(-6),
    now = engine.time()

  high.param.detune.linearRampToValueAtTime(detune + 2400, now + duration/8)
  low.filter.detune.linearRampToValueAtTime(detune, now + duration)
  low.param.detune.linearRampToValueAtTime(detune - 2400, now + duration/4)

  high.param.gain.linearRampToValueAtTime(gain, now + 1/32)
  high.param.gain.linearRampToValueAtTime(gain/8, now + duration/2)
  high.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  low.param.gain.linearRampToValueAtTime(gain, now + 1/32)
  low.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  high.stop(now + duration)
  low.stop(now + duration)
}

content.demo.heights.fairies.on('catch', () => content.demo.heights.audio.fairies.catch())
