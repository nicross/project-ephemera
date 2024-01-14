content.demo.falls.enemies = (() => {
  const cooldowns = new Map(),
    enemies = new Map(),
    pubsub = engine.tool.pubsub.create()

  const defaults = {
    damage: 0,
    damageAccelerated: 0,
    x: 0,
    y: 1,
  }

  function calculateCooldownTime() {
    return engine.fn.lerpExp(
      16,
      0,
      content.demo.falls.velocity.value(),
      0.5
    )
  }

  function hit(projetile) {
    const enemy = enemies.get(projetile.x)

    if (!enemy) {
      return this
    }

    // Apply damage
    enemy.damage += 1/4

    // Emit event
    pubsub.emit('hit', {enemy})
  }

  function initialize() {
    const cooldownTime = calculateCooldownTime(),
      size = content.demo.falls.const.stageSize

    for (let x = 0; x < size; x += 1) {
      cooldowns.set(x, Math.random() * cooldownTime)
    }
  }

  function spawn() {
    const available = [],
      size = content.demo.falls.const.stageSize

    for (let x = 0; x < size; x += 1) {
      if (cooldowns.has(x) || enemies.has(x)) {
        continue
      }

      available.push(x)
    }

    if (!available.length) {
      return
    }

    const x = engine.fn.choose(available, Math.random())

    enemies.set(x, {
      ...defaults,
      height: engine.fn.randomFloat(1, 24) / 12,
      x,
    })
  }

  function update() {
    const delta = engine.loop.delta()

    // Cooldowns
    for (const [x, cooldown] of cooldowns) {
      if (cooldown > delta) {
        cooldowns.set(x, cooldown - delta)
      } else {
        cooldowns.delete(x)
      }
    }

    // Enemies
    const cooldownTime = calculateCooldownTime(),
      damageRate = 1 * delta,
      moveRate = content.demo.falls.velocity.get() * delta

    for (const [x, enemy] of enemies) {
      // Apply damage toward top of screen
      enemy.y += enemy.damage ? Math.min(enemy.damage, damageRate) : 0
      enemy.damage = Math.max(0, enemy.damage - damageRate)
      enemy.damageAccelerated = engine.fn.accelerateValue(enemy.damageAccelerated, enemy.damage, 16)

      // Move toward bottom of screen
      enemy.y -= moveRate

      // Despawn past bottom of screen
      if (enemy.y < -enemy.height) {
        cooldowns.set(x, engine.fn.randomFloat(0.5, 1.5) * cooldownTime)
        enemies.delete(x)
      }

      // Kills
      if (enemy.y > 1) {
        cooldowns.set(x, engine.fn.randomFloat(0.5, 1.5) * cooldownTime)
        pubsub.emit('kill', {enemy})
        enemies.delete(x)
      }
    }
  }

  return pubsub.decorate({
    all: () => Array.from(enemies.values()),
    get: (x) => enemies.get(x),
    has: (x) => enemies.has(x),
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
