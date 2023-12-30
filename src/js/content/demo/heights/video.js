content.demo.heights.video = (() => {
  let context

  return {
    context: () => context,
    load: function () {
      if (!content.video.isActive()) {
        return this
      }

      context = content.video.canvas().getContext('webgl2')

      context.depthFunc(context.LEQUAL)
      context.enable(context.DEPTH_TEST)

      context.enable(context.BLEND)
      context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)

      this.fairies.load()
      this.footsteps.load()
      this.moon.load()
      this.sky.load()
      this.stars.load()
      this.terrain.load()

      return this
    },
    unload: function () {
      context = undefined

      this.fairies.unload()
      this.footsteps.unload()
      this.moon.unload()
      this.sky.unload()
      this.stars.unload()
      this.terrain.unload()

      return this
    },
    update: function () {
      if (!context) {
        return this
      }

      const canvas = content.video.canvas()
      context.viewport(0, 0, canvas.width, canvas.height)

      this.sky.draw()
      this.stars.draw()
      this.moon.draw()
      this.terrain.draw()
      this.footsteps.draw()
      this.fairies.draw()

      return this
    },
  }
})()
