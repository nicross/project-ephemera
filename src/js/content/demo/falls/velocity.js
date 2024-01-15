content.demo.falls.velocity = (() => {
  let target = 0,
    value = 0,
    velocity = 0

  return {
    get: () => velocity,
    load: function () {
      return this
    },
    multiply: function (amount = 0) {
      target *= amount

      return this
    },
    unload: function () {
      target = 0
      value = 0
      velocity = 0

      return this
    },
    update: function () {
      const delta = engine.loop.delta()

      target = engine.fn.accelerateValue(target, 1, 1/300)
      value = engine.fn.accelerateValue(value, target, 2)

      velocity = engine.fn.lerpExp(
        1/60,
        1,
        value,
        2
      )

      return this
    },
    value: () => value,
  }
})()

engine.ready(() => {
  content.demo.falls.player.on('kill', () => content.demo.falls.velocity.multiply(0))
  content.demo.falls.pickups.on('collect', () => content.demo.falls.velocity.multiply(4/5))
  content.demo.falls.pickups.on('destroy', () => content.demo.falls.velocity.multiply(6/5))
})
