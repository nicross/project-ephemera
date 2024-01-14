content.demo.falls.video.background = (() => {
  return {
    draw: function () {
      const context = content.demo.falls.video.context(),
        saturation = content.demo.falls.video.color.saturation()

      context.fillStyle = `hsl(0deg, 0%, ${engine.fn.scale(saturation, 0.25, 1, 0.1, 0) * 100}%)`
      context.fillRect(0, 0, context.canvas.width, context.canvas.height)

      return this
    },
  }
})()
