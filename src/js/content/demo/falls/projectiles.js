content.demo.falls.projectiles = (() => {
  const pubsub = engine.tool.pubsub.create()

  const baseRate = 2,
    projectiles = new Set()

  function shoot() {
    if (content.demo.falls.player.isDead()) {
      return
    }

    if (!content.demo.falls.input.isShoot()) {
      return
    }

    projectiles.add({
      x: content.demo.falls.player.x(),
      y: 0,
    })

    pubsub.emit('shoot')
  }

  function update() {
    const rate = engine.loop.delta() * baseRate

    for (const projectile of projectiles) {
      projectile.y += rate

      const enemy = content.demo.falls.enemies.get(projectile.x),
        isDespawn = projectile.y > 1,
        isHit = enemy && projectile.y >= enemy.y

      if (isDespawn || isHit) {
        projectiles.delete(projectile)
      }

      if (isHit && !content.demo.falls.player.isDead()) {
        content.demo.falls.enemies.hit(projectile)
      }
    }
  }

  return pubsub.decorate({
    all: () => [...projectiles],
    load: function () {
      return this
    },
    unload: function () {
      projectiles.clear()

      return this
    },
    update: function () {
      shoot()
      update()

      return this
    },
  })
})()
