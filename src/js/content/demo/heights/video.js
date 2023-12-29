content.demo.heights.video = (() => {
  let context

  return {
    context: () => context,
    load: function () {
      if (content.video.isActive()) {
        context = content.video.canvas()?.getContext('webgl2')

        context.depthFunc(context.LEQUAL)
        context.enable(context.DEPTH_TEST)

        context.enable(context.BLEND)
        context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA)
      }

      return this
    },
    unload: function () {
      context = undefined

      return this
    },
    update: function () {
      if (!context) {
        return this
      }

      const canvas = content.video.canvas()
      context.viewport(0, 0, canvas.width, canvas.height)

      return this
    },
  }
})()
