content.demo.falls = content.demo.register({
  id: 'falls',
  enabled: true,
  description: 'Endless runner shooter.',
  name: 'Harmony Falls',
  subjectStatus: 'Stimulated',
  // Constants
  const: {
    stageSize: 36,
  },
  // Lifecycle
  load: function () {
    engine.seed.set(Math.random())

    this.time.load()
    this.velocity.load()

    this.enemies.load()
    this.input.load()
    this.pickups.load()
    this.player.load()
    this.projectiles.load()

    this.audio.load()
    this.video.load()
  },
  unload: function () {
    this.audio.unload()
    this.enemies.unload()
    this.input.unload()
    this.pickups.unload()
    this.player.unload()
    this.projectiles.unload()
    this.time.unload()
    this.velocity.unload()
    this.video.unload()
  },
  update: function () {
    this.time.update()
    this.velocity.update()

    this.input.update()
    this.player.update()
    this.pickups.update()
    this.enemies.update()
    this.projectiles.update()

    this.audio.update()
    this.grain.update()
    this.video.update()
  },
})
