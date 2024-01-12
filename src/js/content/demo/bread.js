content.demo.bread = content.demo.register({
  id: 'bread',
  allowHum: true,
  enabled: true,
  description: 'Ephemeral object inspector.',
  name: 'Secret Bread',
  // Constants
  const: {},
  // Lifecycle
  load: function () {
    engine.seed.set(Math.random())

    this.time.load()

    this.fields.load()
    this.frequency.load()
    this.input.load()

    this.audio.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.frequency.unload()
    this.fields.unload()
    this.input.unload()
    this.time.unload()
    this.video.unload()
  },
  update: function () {
    this.time.update()
    this.fields.update()
    this.frequency.update()
    this.input.update()

    this.audio.update()
    this.buzz.update()
    this.video.update()
  },
})
