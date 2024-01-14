content.demo.falls.video.player = (() => {
  function center() {
    const context = content.demo.falls.video.context()

    context.fillStyle = `rgba(255, 255, 255, ${1/32})`

    context.fillRect(
      Math.floor(context.canvas.width / 17 * 8),
      0,
      Math.ceil(context.canvas.width / 17),
      context.canvas.height
    )
  }

  function pawn() {
    const context = content.demo.falls.video.context()

    context.fillStyle = '#FFFFFF'

    context.fillRect(
      Math.floor(context.canvas.width / 17 * 8),
      context.canvas.height - Math.floor(context.canvas.width / 17 / 2),
      Math.ceil(context.canvas.width / 17),
      Math.floor(context.canvas.width / 17 / 2)
    )
  }

  return {
    draw: function () {
      if (content.demo.falls.player.isDead()) {
        return this
      }
      
      pawn()
      center()

      return this
    },
  }
})()
