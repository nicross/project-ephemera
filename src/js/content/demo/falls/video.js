content.demo.falls.video = (() => {
  let context

  return {
    context: () => context,
    load: function () {
      if (content.video.isActive()) {
        context = content.video.canvas()?.getContext('2d')
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

      // TODO: Draw

      return this
    },
  }
})()
