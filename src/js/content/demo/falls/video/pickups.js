content.demo.falls.video.pickups = (() => {
  function drawPickup(pickup) {
    const context = content.demo.falls.video.context(),
      time = content.demo.falls.time.get()

    const radius = (5 + Math.sin(time * engine.const.tau)) * (context.canvas.height / 600)

    const index = engine.fn.scale(
      content.demo.falls.player.toRelativeX(pickup.x),
      -8, 8,
      0, 16
    )

    context.fillStyle = '#FFFFFF'

    context.fillRect(
      Math.floor(context.canvas.width / 17 * (index + 0.5)) - radius,
      (context.canvas.height * (engine.fn.scale(pickup.y, 1, 0, 0, 1))) - radius,
      radius * 2,
      radius * 2
    )
  }

  return {
    draw: function () {
      const pickup = content.demo.falls.pickups.get()

      if (pickup) {
        drawPickup(pickup)
      }

      return this
    },
  }
})()
