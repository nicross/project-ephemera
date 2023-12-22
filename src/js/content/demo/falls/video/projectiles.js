content.demo.falls.video.projectiles = (() => {
  function drawProjectile(projectile) {
    const context = content.demo.falls.video.context(),
      radius = 2 * (context.canvas.height / 600)

    const index = engine.fn.scale(
      content.demo.falls.player.toRelativeX(projectile.x),
      -8, 8,
      0, 16
    )

    context.fillStyle = '#FFFFFF'

    context.fillRect(
      Math.floor(context.canvas.width / 17 * (index + 0.5)) - radius,
      (context.canvas.height * (engine.fn.scale(projectile.y, 1, 0, 0, 1))) - radius,
      radius * 2,
      radius * 2
    )
  }

  return {
    draw: function () {
      const projectiles = content.demo.falls.projectiles.all()

      for (const projectile of projectiles) {
        drawProjectile(projectile)
      }

      return this
    },
  }
})()
