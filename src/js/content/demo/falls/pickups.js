content.demo.falls.pickups = (() => {
  const pubsub = engine.tool.pubsub.create(),
    threshold = 600/800/17/2

  let cooldown = 0,
    pickup

  function spawn() {
    if (pickup) {
      return
    }

    const playerX = content.demo.falls.player.x()

    const enemies = content.demo.falls.enemies.all()
      .filter((enemy) => enemy.y + enemy.height < (1 - (threshold * 2)) && enemy.x != playerX)

    if (!enemies.length) {
      return
    }

    const enemy = engine.fn.choose(enemies, Math.random())

    pickup = {x: enemy.x, y: 1}
    pubsub.emit('spawn', pickup)
  }

  function update() {
    const playerX = content.demo.falls.player.x()

    pickup.y -= content.demo.falls.velocity.get() * engine.loop.delta()

    // Pickup by player
    if (pickup.x == playerX && pickup.y <= threshold) {
      pubsub.emit('pickup', pickup)

      cooldown = 30
      pickup = undefined

      return
    }

    // Despawn at bottom
    if (pickup.y <= -threshold) {
      cooldown = 1
      pickup = undefined

      return
    }

    // Check enemy collision
    const enemy = content.demo.falls.enemies.get(pickup.x)

    if (enemy && pickup.y >= enemy.y && enemy.y + enemy.height >= pickup.y) {
      pubsub.emit('destroy', pickup)

      cooldown = 5
      pickup = undefined

      return
    }

    // Check projectile collision
    const projectiles = content.demo.falls.projectiles.all()

    for (const projectile of projectiles) {
      if (projectile.x == pickup.x && projectile.y >= pickup.y) {
        pubsub.emit('pickup', pickup)

        cooldown = 30
        pickup = undefined

        return
      }
    }
  }

  return pubsub.decorate({
    at: (x) => pickup && pickup.x == x,
    get: () => pickup,
    load: function () {
      cooldown = 10

      return this
    },
    nearby: (radius = 0) => {
      if (!pickup) {
        return
      }

      const playerX = content.demo.falls.player.x(),
        size = content.demo.falls.const.stageSize

      for (let i = -radius; i <= radius; i += 1) {
        const x = engine.fn.wrap(playerX + i, 0, size)

        if (pickup.x == x) {
          return pickup
        }
      }
    },
    unload: function () {
      cooldown = 0
      pickup = undefined

      return this
    },
    update: function () {
      cooldown = engine.fn.accelerateValue(cooldown, 0, 1)

      if (pickup) {
        update()
      } else if (cooldown == 0 && !content.demo.falls.player.isDead()) {
        spawn()
      }

      return this
    },
  })
})()
