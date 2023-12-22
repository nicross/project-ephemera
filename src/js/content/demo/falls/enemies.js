content.demo.falls.enemies = (() => {
  const pubsub = engine.tool.pubsub.create()
  const enemies = new Map()

  const defaults = {
    damage: 0,
    damageAccelerated: 0,
  }

  function hit(projetile) {
    const enemy = enemies.get(projetile.x)

    if (!enemy) {
      return this
    }

    // Apply damage
    enemy.damage += 1/8

    // Emit event
    const type = enemy.damage + enemy.y > 1
      ? 'kill'
      : 'hit'

    pubsub.emit(type, {enemy})
  }

  function initialize() {
    const size = content.demo.falls.const.stageSize

    const noise = engine.fn.createNoise({
      octaves: 4,
      seed: ['falls', 'enemies', 'initialize'],
      type: '1d',
    })

    for (let x = 0; x < size; x += 1) {
      const value = engine.fn.lerp(
        noise.value(x / size * 16),
        noise.value((x - size) / size * 16),
        x / size
      )

      if (value < 0.5) {
        continue
      }

      enemies.set(x, {
        ...defaults,
        height: engine.fn.randomFloat(1, 2),
        x,
        y: 1 - (((value - 0.5) * 2) * 0.75),
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
      enemy.damageAccelerated = engine.fn.accelerateValue(enemy.damageAccelerated, enemy.damage, 16)

      // Move toward bottom of screen
      enemy.y -= moveRate

      // Despawn past bottom of screen
      if (enemy.y < -enemy.height || enemy.y >= 1) {
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
    nearby: (radius = 0) => {
      const playerX = content.demo.falls.player.x(),
        results = [],
        size = content.demo.falls.const.stageSize

      for (let i = -radius; i <= radius; i += 1) {
        const x = engine.fn.wrap(playerX + i, 0, size)

        if (enemies.has(x)) {
          results.push(enemies.get(x))
        }
      }

      return results
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
