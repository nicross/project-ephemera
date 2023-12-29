content.demo.heights = content.demo.register({
  id: 'heights',
  enabled: true,
  description: 'Under construction.',
  name: 'Melody Heights',
  // Constants
  const: {},
  // Lifecycle
  load: function () {
    engine.seed.set(Math.random())

    this.audio.load()
    this.camera.load()
    this.footsteps.load()
    this.input.load()
    this.movement.load()
    this.terrain.load()
    this.time.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.camera.unload()
    this.footsteps.unload()
    this.input.unload()
    this.movement.unload()
    this.terrain.unload()
    this.time.unload()
    this.video.unload()
  },
  update: function () {
    this.input.update()
    this.time.update()

    this.movement.update()
    this.footsteps.update()
    this.camera.update()

    this.audio.update()
    this.video.update()
  },
})
