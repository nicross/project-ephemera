content.demo.falls.video = (() => {
  let context

  return {
    context: () => context,
    load: function () {
      if (!content.video.isActive()) {
        return this
      }

      context = content.video.canvas().getContext('2d')

      this.color.load()
      this.particles.load()

      return this
    },
    unload: function () {
      context = undefined

      this.color.unload()
      this.particles.unload()

      return this
    },
    update: function () {
      if (!context) {
        return this
      }

      context.clearRect(0, 0, context.canvas.width, context.canvas.height)

      this.background.draw()
      this.player.draw()
      this.enemies.draw()
      this.pickups.draw()
      this.projectiles.draw()
      this.particles.draw()

      return this
    },
  }
})()
