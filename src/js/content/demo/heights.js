content.demo.heights = content.demo.register({
  id: 'heights',
  allowPointerLock: true,
  enabled: true,
  description: 'Cozy midnight hiker.',
  name: 'Melody Heights',
  subjectStatus: 'Sedated',
  // Constants
  const: {},
  // Lifecycle
  load: function () {
    engine.seed.set(Math.random())
    engine.position.setEuler({yaw: engine.const.tau * 7/16})

    this.buzz.load()
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
    engine.position.setVector({})
    engine.position.setEuler({})

    this.audio.unload()
    this.buzz.unload()
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
    this.buzz.update()
    this.video.update()
  },
  // Methods
  moonVector: () => engine.tool.vector3d.unitX().inverse().rotateEuler({pitch: -engine.const.tau / 24}),
})
