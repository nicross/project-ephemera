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
    const size = content.demo.falls.const.stageSize

    const noise = engine.fn.createNoise({
      octaves: size / 8,
      seed: ['falls', 'enemies', 'initialize'],
      type: '1d',
    })

    for (let x = 0; x < size; x += 1) {
      const value = engine.fn.lerp(
        noise.value(x / size * 2),
        noise.value((x - size) / size * 2),
        x / content.demo.falls.const.stageSize
      )

      if (value < 0.5) {
        continue
      }

      enemies.set(x, {
        damage: 0,
        height: value - 0.5,
        y: 1,
        x,
      })
    }
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
