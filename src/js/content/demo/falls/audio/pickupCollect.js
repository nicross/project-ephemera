content.demo.falls.audio.pickupCollect = (pickup) => {
  const relative = {
    x: engine.fn.clamp(content.demo.falls.player.toRelativeX(pickup.x) / 8, -1, 1),
    y: pickup.y,
  }

  const bus = content.demo.falls.audio.bus(),
    context = engine.context(),
    detune = engine.fn.randomFloat(-10, 10),
    duration = 2,
    rootFrequency = pickup.frequency

  const synth = engine.synth.fm({
    gain: engine.fn.fromDb(-9),
    carrierDetune: detune,
    carrierFrequency: rootFrequency,
    carrierType: 'triangle',
    modDepth: rootFrequency * Math.PI/2,
    modDetune: detune,
    modFrequency: rootFrequency * Math.PI/2,
  }).filtered({
    detune,
    frequency: rootFrequency,
  }).chainAssign(
    'panner', context.createStereoPanner()
  ).connect(bus)

  const now = engine.time()

  synth.panner.pan.value = Math.cos(Math.atan2(relative.y, relative.x))

  synth.param.detune.linearRampToValueAtTime(detune - 4800, now + duration/16)
  synth.param.detune.linearRampToValueAtTime(detune - 3600, now + duration)
  synth.param.gain.linearRampToValueAtTime(engine.fn.fromDb(-15), now + duration/16)
  synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, now + duration)

  synth.stop(now + duration)
}

content.demo.falls.pickups.on('collect', ({pickup}) => content.demo.falls.audio.pickupCollect(pickup))
