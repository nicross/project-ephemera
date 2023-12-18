app.screen.boot = app.screenManager.invent({
  // Attributes
  id: 'boot',
  parentSelector: '.a-app--boot',
  rootSelector: '.a-boot',
  transitions: {
    done: function () {
      this.change('mainMenu')
    },
  },
  // Hooks
  onEnter: async function () {
    this.statusElement = this.rootElement.querySelector('.a-boot--status')

    this.playSwitch()

    await this.doDisclaimer()
    await this.doLogo()

    app.screenManager.dispatch('done')
  },
  // Sequence Steps
  doDisclaimer: async function () {
    await engine.fn.promise(1 * 1000)

    const text = 'For demonstration purposes only.'

    const disclaimer = document.createElement('div')
    disclaimer.classList.add('a-boot--disclaimer')
    disclaimer.innerHTML = text

    this.rootElement.appendChild(disclaimer)
    this.statusElement.innerHTML = text

    this.playDisclaimer()
  },
  doLogo: async function () {
    await engine.fn.promise(1 * 1000)

    const text = 'Ephemera'

    const logo = document.createElement('div')
    logo.classList.add('a-boot--logo')
    logo.setAttribute('aria-label', text)

    logo.innerHTML = text.split('').map(
      (letter) => `<span class="a-boot--logoLetter"><span class="a-boot--logoLetterInner">${letter}</span></span>`
    ).join('')

    this.rootElement.appendChild(logo)
    this.playLogo()

    await engine.fn.promise(1 * 1000)
    this.statusElement.innerHTML = text

    await engine.fn.promise(2.5 * 1000)
  },
  // Sounds
  playDisclaimer: function () {
    const bus = app.audio.bus()

    const play = ({
      color = 8,
      duration = 4,
      gain = engine.fn.fromDb(-3),
      frequency,
      when = engine.time(),
    }) => {
      const synth = engine.synth.mod({
        amodDepth: 0,
        amodFrequency: 4,
        amodType: 'sine',
        carrierGain: 1,
        carrierType: 'sine',
        carrierFrequency: frequency,
        fmodDepth: frequency / 2,
        fmodFrequency: frequency * 4,
        fmodType: 'square',
      }).filtered({
        detune: 0,
        frequency: frequency,
      }).connect(bus)

      synth.filter.detune.setValueAtTime(-1200, when)
      synth.filter.detune.linearRampToValueAtTime(color * 1200, when + duration*3/4)
      synth.filter.detune.linearRampToValueAtTime(0, when + duration)

      synth.param.gain.setValueAtTime(engine.const.zeroGain, when)
      synth.param.gain.exponentialRampToValueAtTime(gain, when + 1/32)
      synth.param.gain.linearRampToValueAtTime(gain/4, when + duration/8)
      synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

      synth.param.amod.depth.setValueAtTime(0, when)
      synth.param.amod.depth.linearRampToValueAtTime(1/8, when + duration)

      synth.param.amod.frequency.setValueAtTime(2, when)
      synth.param.amod.frequency.linearRampToValueAtTime(8, when + duration)

      synth.param.carrierGain.setValueAtTime(1, when)
      synth.param.carrierGain.linearRampToValueAtTime(7/8, when + duration)

      synth.stop(when + duration)
    }

    let time = engine.time()

    for (const note of [48, 56, 58, 63]) {
      play({
        frequency: engine.fn.fromMidi(note),
        when: time,
      })

      time += 1/16
    }
  },
  playLogo: function () {
    const bus = app.audio.bus()

    const play = ({
      color = 3,
      duration = 3,
      gain = engine.fn.fromDb(-6),
      frequency,
      when = engine.time(),
    }) => {
      const synth = engine.synth.fm({
        carrierType: 'sawtooth',
        carrierFrequency: frequency,
        modDepth: 0,
      }).filtered({
        detune: 0,
        frequency: frequency,
      }).connect(bus)

      synth.filter.detune.setValueAtTime(1200, when)
      synth.filter.detune.linearRampToValueAtTime(0, when + duration/16)
      synth.filter.detune.linearRampToValueAtTime(color * 1200, when + duration/2)
      synth.filter.detune.linearRampToValueAtTime(0, when + duration)

      synth.param.gain.setValueAtTime(engine.const.zeroGain, when)
      synth.param.gain.exponentialRampToValueAtTime(gain, when + 1/32)
      synth.param.gain.linearRampToValueAtTime(gain/4, when + duration/8)
      synth.param.gain.linearRampToValueAtTime(engine.const.zeroGain, when + duration)

      synth.stop(when + duration)
    }

    let time = engine.time()

    for (const note of [60, 63, 67, 70, 72, 75, 79, 82]) {
      play({
        frequency: engine.fn.fromMidi(note),
        when: time,
      })

      time += 1/16
    }
  },
  playSwitch: function () {
    const bus = app.audio.bus()

    const play = ({
      duration,
      gain = engine.fn.fromDb(-3),
      frequency,
      when = engine.time(),
    }) => {
      const synth = engine.synth.buffer({
        buffer: content.audio.buffer.whiteNoise.choose(),
      }).filtered({
        frequency,
      }).connect(bus)

      synth.filter.detune.linearRampToValueAtTime(-3600, when + duration)
      synth.param.gain.setValueAtTime(engine.const.zeroGain, when)
      synth.param.gain.exponentialRampToValueAtTime(gain, when + 1/32)
      synth.param.gain.exponentialRampToValueAtTime(engine.const.zeroGain, when + duration)

      synth.stop(when + duration)
    }

    play({
      duration: 1/8,
      frequency: 1500 + engine.fn.randomFloat(-50, 50),
      when: engine.time(),
    })

    play({
      duration: 1/4,
      frequency: 666 + engine.fn.randomFloat(-150, 150),
      when: engine.time(1/12),
    })
  }
})
