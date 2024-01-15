content.demo.falls.grain = (() => {
  return {
    update: function () {
      if (content.demo.falls.player.isDead()) {
        content.grain.touch(1)
      }

      return this
    },
  }
})()

engine.ready(() => {
  content.demo.falls.enemies.on('kill', () => content.grain.touch(
    engine.fn.randomFloat(0.333, 0.666)
  ))

  content.demo.falls.pickups.on('collect', () => content.grain.touch(
    engine.fn.randomFloat(0.333, 0.666)
  ))

  content.demo.falls.pickups.on('destroy', () => content.grain.touch(
    engine.fn.randomFloat(0.333, 0.666)
  ))
})
