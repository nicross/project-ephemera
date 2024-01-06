content.demo.bread = content.demo.register({
  id: 'bread',
  enabled: true,
  description: 'Ephemeral object inspector.',
  name: 'Secret Bread',
  // Constants
  const: {},
  // Lifecycle
  load: function () {
    this.time.load()

    this.fields.load()
    this.input.load()

    this.audio.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.fields.unload()
    this.input.unload()
    this.time.unload()
    this.video.unload()
  },
  update: function () {
    this.time.update()
    this.fields.update()
    this.input.update()

    this.audio.update()
    this.video.update()
  },
})
