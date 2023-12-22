content.demo.falls.video = (() => {
  let context

  return {
    context: () => context,
    load: function () {
      if (content.video.isActive()) {
        context = content.video.canvas()?.getContext('2d')
      }

      this.color.load()

      return this
    },
    unload: function () {
      context = undefined

      this.color.unload()

      return this
    },
    update: function () {
      if (!context) {
        return this
      }

      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      this.player.draw()
      this.enemies.draw()
      this.projectiles.draw()
      // TODO: particles

      return this
    },
  }
})()
