content.demo.falls = content.demo.register({
  id: 'falls',
  enabled: true,
  description: 'Under construction.',
  name: 'Harmony Falls',
  // Constants
  const: {
    stageSize: 64,
  },
  // Lifecycle
  load: function () {
    engine.seed.set(Math.random())

    this.time.load()

    this.enemies.load()
    this.input.load()
    this.player.load()
    this.projectiles.load()

    this.audio.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.enemies.unload()
    this.input.unload()
    this.player.unload()
    this.projectiles.unload()
    this.time.unload()
    this.video.unload()
  },
  update: function () {
    // TODO: Stop updating on death

    this.time.update()
    this.input.update()

    this.enemies.update()
    this.player.update()
    this.projectiles.update()

    this.audio.update()
    this.video.update()
  },
})
