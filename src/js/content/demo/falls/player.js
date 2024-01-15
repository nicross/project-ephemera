content.demo.falls.player = (() => {
  const pubsub = engine.tool.pubsub.create()

  let isDead = false,
    isDeadAccelerated = 0,
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
    isDeadAccelerated: () => isDeadAccelerated,
    load: function () {
      return this
    },
    toRelativeX: (value) => {
      const size = content.demo.falls.const.stageSize,
        size2 = size / 2

      const distance = value - x

      return Math.abs(distance) < size2
        ? distance
        : -(size - Math.abs(distance)) * Math.sign(distance)
    },
    unload: function () {
      isDead = false
      isDeadAccelerated = 0
      x = 0

      return this
    },
    update: function () {
      if (!isDead) {
        checkDeath()
        handleInput()
      }

      if (isDead && isDeadAccelerated < 1) {
        isDeadAccelerated = engine.fn.accelerateValue(isDeadAccelerated, 1, 2)
      }

      return this
    },
    x: () => x,
  })
})()
