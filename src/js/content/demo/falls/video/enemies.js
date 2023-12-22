content.demo.falls.video.enemies = (() => {
  function drawEnemy(enemy) {
    const context = content.demo.falls.video.context()

    const index = engine.fn.scale(
      content.demo.falls.player.toRelativeX(enemy.x),
      -8, 8,
      0, 16
    )

    const hue = content.demo.falls.video.color.hue(enemy.x),
      lightness = engine.fn.clamp(0.5 + (enemy.damageAccelerated * 2)),
      saturation = content.demo.falls.video.color.saturation()

    context.fillStyle = `hsl(${hue}deg, ${saturation * 100}%, ${lightness * 100}%)`

    context.fillRect(
      Math.floor(context.canvas.width / 17 * index),
      context.canvas.height * (engine.fn.scale(enemy.y, 1, 0, 0, 1) - enemy.height),
      Math.ceil(context.canvas.width / 17),
      context.canvas.height * enemy.height
    )
  }

  return {
    draw: function () {
      const enemies = content.demo.falls.enemies.nearby(8)

      for (const enemy of enemies) {
        drawEnemy(enemy)
      }

      return this
    },
  }
})()
