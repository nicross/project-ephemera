app.audio.ui = {}

app.audio.ui.click = ({
  enabled,
  strength,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/8, 1/6),
    frequency = engine.fn.fromMidi(enabled ? 43 : 44),
    now = engine.time()

  const synth = engine.synth.fm({
    carrierFrequency: frequency,
    carrierDetune: engine.fn.randomFloat(-10, 10),
    carrierType: enabled ? 'sine' : 'sawtooth',
    modDetune: engine.fn.randomFloat(-10, 10),
    modDepth: frequency * (enabled ? 2 : 0.5),
    modFrequency: enabled ? frequency * 7 : 8,
    modType: 'sine',
  }).filtered({
    frequency: frequency * engine.fn.lerp(1, 3, strength) * (enabled ? 1 : 0.75),
  }).connect(bus)

  synth.param.detune.linearRampToValueAtTime(enabled ? 1200 : 0, now + duration/4)
  synth.param.mod.detune.linearRampToValueAtTime(enabled ? 1200 : 0, now + duration)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

app.audio.ui.focus = ({
  enabled,
  strength,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/4, 1/2),
    frequency = engine.fn.fromMidi(enabled ? 48 : 42),
    now = engine.time()

  const synth = engine.synth.fm({
    carrierFrequency: frequency,
    carrierDetune: engine.fn.randomFloat(-10, 10),
    carrierType: enabled ? 'square' : 'sawtooth',
    modDetune: engine.fn.randomFloat(-10, 10),
    modDepth: frequency * (enabled ? 2 : 0.5),
    modFrequency: enabled ? frequency : 8,
    modType: 'triangle',
  }).filtered({
    frequency: frequency * engine.fn.lerp(1, 4, strength),
  }).connect(bus)

  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.exponentialRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

app.audio.ui.value = ({
  enabled,
  strength,
}) => {
  const bus = app.audio.bus(),
    duration = engine.fn.randomFloat(1/12, 1/8),
    frequency = engine.fn.fromMidi(enabled ? 55 : 49),
    now = engine.time()

  const synth = engine.synth.fm({
    carrierDetune: engine.fn.randomFloat(-10, 10),
    carrierFrequency: frequency,
    carrierType: enabled ? 'triangle' : 'sawtooth',
    modDetune: engine.fn.randomFloat(-10, 10),
    modDepth: frequency * engine.fn.lerp(0.5, 2, strength),
    modFrequency: engine.fn.lerpExp(8, frequency * 5, strength, 2),
    modType: 'triangle',
  }).filtered({
    frequency: frequency * (enabled ? 1 : 2),
  }).connect(bus)

  synth.param.detune.linearRampToValueAtTime(engine.fn.lerp(-1200, 1200, strength), now + duration/2)
  synth.param.gain.exponentialRampToValueAtTime(1, now + 1/32)
  synth.param.gain.linearRampToValueAtTime(engine.const.zero, now + duration)

  synth.stop(now + duration)
}

// Clicking
document.addEventListener('click', (e) => {
  if (!e.target.matches('.c-menuButton, .c-menuButton *, .c-toggle, .c-toggle *')) {
    return
  }

  if (e.target.matches('.c-toggle, .c-toggle *')) {
    const button = e.target.closest('.c-toggle').querySelector('.c-toggle--button')

    return app.audio.ui.value({
      enabled: !button.hasAttribute('aria-disabled'),
      strength: button.getAttribute('aria-checked') == 'true' ? 1 : 0,
    })
  }

  const button = e.target.closest('.c-menuButton')

  app.audio.ui.click({
    enabled: !button.hasAttribute('aria-disabled'),
    strength: button.hasAttribute('aria-disabled') ? 0 : 1,
  })
})

// Focusing
document.addEventListener('focusin', (e) => {
  if (e.target.matches('.a-app--screen') || !e.target.closest('.a-app--screen-os')) {
    return
  }

  app.audio.ui.focus({
    enabled: e.target.matches('.c-menuButton, .c-slider, .c-slider *, .c-toggle, .c-toggle *') && !e.target.hasAttribute('aria-disabled'),
    strength: e.target.matches('.c-menuButton') ? 1 : 0,
  })
})

// Sliders
document.addEventListener('input', (e) => {
  if (!e.target.matches('.c-slider input')) {
    return
  }

  app.audio.ui.value({
    enabled: true,
    strength: engine.fn.scale(e.target.value, e.target.min, e.target.max, 0, 1),
  })
})
