content.demo.falls.player = (() => {
  const pubsub = engine.tool.pubsub.create()

  let isDead = false,
    position = 0

  function checkDeath() {
    const enemy = content.demo.falls.enemies.get(position)

    if (false) {
      isDead = true
      pubsub.emit('kill')
    }
  }

  function handleInput() {
    // TODO
  }

  return pubsub.decorate({
    isDead: () => isDead,
    load: function () {
      return this
    },
    unload: function () {
      isDead = false
      position = 0

      return this
    },
    position: () => position,
    update: function () {
      checkDeath()
      handleInput()

      return this
    },
  })
})()
