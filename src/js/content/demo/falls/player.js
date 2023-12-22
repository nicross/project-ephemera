content.demo.falls.player = (() => {
  const pubsub = engine.tool.pubsub.create()

  let isDead = false,
    x = 0

  function checkDeath() {
    const enemy = content.demo.falls.enemies.get(x)

    if (enemy && enemy.y <= 0) {
      isDead = true
      pubsub.emit('kill')
    }
  }

  function handleInput() {
    const movement = content.demo.falls.input.moveDirection()

    if (!movement) {
      return
    }

    x = engine.fn.wrap(x + movement, 0, content.demo.falls.const.stageSize)

    pubsub.emit('move')
  }

  return pubsub.decorate({
    isDead: () => isDead,
    load: function () {
      return this
    },
    unload: function () {
      isDead = false
      x = 0

      return this
    },
    update: function () {
      checkDeath()
      handleInput()

      return this
    },
    x: () => x,
  })
})()
