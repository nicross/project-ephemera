content.demo.heights.audio.jump.end = ({
  velocity,
} = {}) => {
  const bus = content.demo.heights.audio.bus(),
    detune = engine.fn.randomFloat(-33, 33),
    rootFrequency = engine.fn.fromMidi(27)

  const synth = engine.synth.simple({
    detune: detune + engine.fn.lerp(0, 1200, velocity),
    frequency: rootFrequency,
    type: 'triangle',
  }).filtered({
    detune: detune + 1200,
    frequency: rootFrequency,
  }).connect(bus)

  const duration = 1/3,
    gain = engine.fn.fromDb(engine.fn.lerp(-9, -6, velocity)),
    now = engine.time()

  synth.filter.detune.linearRampToValueAtTime(detune, now + 1/32)
  synth.filter.detune.linearRampToValueAtTime(detune + 3600, now + duration)
  synth.param.detune.linearRampToValueAtTime(detune, now + duration/2)
  synth.param.gain.linearRampToValueAtTime(gain, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.heights.movement.on('jump-end', (e) => content.demo.heights.audio.jump.end(e))
