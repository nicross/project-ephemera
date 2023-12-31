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
    engine.position.setEuler({yaw: engine.const.tau * 7/16})

    this.camera.load()
    this.fairies.load()
    this.footsteps.load()
    this.input.load()
    this.movement.load()
    this.terrain.load()
    this.time.load()
    this.wind.load()

    this.audio.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.camera.unload()
    this.fairies.unload()
    this.footsteps.unload()
    this.input.unload()
    this.movement.unload()
    this.terrain.unload()
    this.time.unload()
    this.video.unload()
    this.wind.unload()
  },
  update: function () {
    this.input.update()
    this.time.update()

    this.movement.update()
    this.footsteps.update()
    this.camera.update()
    this.fairies.update()
    this.wind.update()

    this.audio.update()
    this.video.update()
  },
  // Methods
  moonVector: () => engine.tool.vector3d.unitX().inverse().rotateEuler({pitch: -engine.const.tau / 24}),
})
