content.demo.falls.enemies = (() => {
  const pubsub = engine.tool.pubsub.create()
  const enemies = new Map()

  function hit(projetile) {
    const enemy = enemies.get(projetile.x)

    if (!enemy) {
      return this
    }

    // Apply damage
    enemy.damage += 1/8

    // Handle kills
    if (enemy.damage + enemy.y > 1) {
      pubsub.emit('kill', {enemy})
      return enemies.delete(enemy.x)
    }

    // Otherwise announce hit
    pubsub.emit('hit', {enemy})
  }

  function initialize() {
    // TODO
  }

  function spawn() {
    // TODO
  }

  function update() {
    const delta = engine.loop.delta()

    const damageRate = 1 * delta,
      moveRate = 1/30 * delta

    for (const [x, enemy] of enemies) {
      // Apply damage toward top of screen
      enemy.y += enemy.damage ? Math.min(enemy.damage, damageRate) : 0
      enemy.damage = Math.max(0, enemy.damage - damageRate)

      // Move toward bottom of screen
      enemy.y -= moveRate

      // Despawn past bottom of screen
      if (enemy.y < -enemy.height) {
        enemies.delete(x)
      }
    }
  }

  return pubsub.decorate({
    all: () => Array.from(enemies.values()),
    get: (x) => enemies.get(x),
    hit: function (projetile) {
      hit(projetile)

      return this
    },
    load: function () {
      initialize()

      return this
    },
    unload: function () {
      enemies.clear()

      return this
    },
    update: function () {
      spawn()
      update()

      return this
    },
  })
})()
