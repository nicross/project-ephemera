content.demo.falls.video.particles = (() => {
  const particles = new Set()

  function drawParticle(particle) {
    const context = content.demo.falls.video.context(),
      radius = particle.radius * (context.canvas.height / 600)

    const index = engine.fn.scale(
      content.demo.falls.player.toRelativeX(particle.x),
      -8, 8,
      0, 16
    )

    context.fillStyle = `rgba(255, 255, 255, ${particle.life})`

    context.fillRect(
      Math.floor(context.canvas.width / 17 * (index + 0.5)) - particle.radius + particle.offset.x,
      (context.canvas.height * (engine.fn.scale(particle.y, 1, 0, 0, 1))) - particle.radius + particle.offset.y,
      particle.radius * 2,
      particle.radius * 2
    )
  }

  return {
    draw: function () {
      const delta = engine.loop.delta()

      for (const particle of particles) {
        particle.life = engine.fn.accelerateValue(particle.life, 0, particle.rate)

        if (particle.life <= 0) {
          particles.delete(particle)
          continue
        }

        particle.offset.x += particle.velocity.x * delta
        particle.offset.y += particle.velocity.y * delta

        drawParticle(particle)
      }

      return this
    },
    load: function () {
      return this
    },
    spawn: function (particle) {
      particles.add(particle)

      return this
    },
    unload: function () {
      particles.clear()

      return this
    },
  }
})()

// Enemy hits
content.demo.falls.enemies.on('hit', ({
  enemy,
}) => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(20, 30)
  const velocity = context.canvas.height * 100/600

  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-2 * context.canvas.height/600, 2 * context.canvas.height/600), y: 0},
      radius: engine.fn.randomFloat(0, 1) ** 2,
      rate: engine.fn.randomFloat(2, 4),
      velocity: {x: velocity * engine.fn.randomFloat(-1, 1), y: velocity * engine.fn.randomFloat(0, 1)},
      x: enemy.x,
      y: enemy.y,
    })
  }
})

// Enemy kills
content.demo.falls.enemies.on('kill', ({
  enemy,
}) => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(50, 100)
  const velocity = context.canvas.height * 100/600

  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-context.canvas.height/17/2, context.canvas.height/17/2), y: 0},
      radius: engine.fn.randomFloat(0, 2),
      rate: engine.fn.randomFloat(1, 2),
      velocity: {x: velocity * engine.fn.randomFloat(-1, 1), y: velocity * engine.fn.randomFloat(0, 1)},
      x: enemy.x,
      y: 1,
    })
  }
})

// Pickups destroy
content.demo.falls.pickups.on('destroy', (pickup) => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(33, 66),
    radius = context.canvas.height/600*4,
    velocity = context.canvas.height * 100/600

  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-radius, radius), y: 0},
      radius: engine.fn.randomFloat(0, 1.5) ** 2,
      rate: engine.fn.randomFloat(1, 2),
      velocity: {x: velocity * engine.fn.randomFloat(-1, 1), y: velocity * engine.fn.randomFloat(-1, 0)},
      x: pickup.x,
      y: pickup.y,
    })
  }
})

// Pickups pickup
content.demo.falls.pickups.on('pickup', (pickup) => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(33, 66),
    playerX = content.demo.falls.player.x(),
    radius = context.canvas.height/600*4,
    velocity = context.canvas.height * 100/600

  // Projectile explode
  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-radius, radius), y: engine.fn.randomFloat(-radius, radius)},
      radius: engine.fn.randomFloat(0, 1.5) ** 2,
      rate: engine.fn.randomFloat(1, 2),
      velocity: {x: velocity * engine.fn.randomFloat(-1, 1), y: velocity * engine.fn.randomFloat(-1, 1)},
      x: pickup.x,
      y: pickup.y,
    })
  }
})

// Player kills
content.demo.falls.player.on('kill', () => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(50, 100),
    x = content.demo.falls.player.x()

  const velocity = context.canvas.height * 100/600

  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-context.canvas.height/17/2, context.canvas.height/17/2), y: 0},
      radius: engine.fn.randomFloat(0, 2),
      rate: engine.fn.randomFloat(1, 2),
      velocity: {x: velocity * engine.fn.randomFloat(-1, 1), y: velocity * engine.fn.randomFloat(-1, 0)},
      x,
      y: 0,
    })
  }
})

// Player moves
content.demo.falls.player.on('move', () => {
  const context = content.demo.falls.video.context()

  if (!context) {
    return
  }

  const count = engine.fn.randomFloat(20, 30),
    moveDirection = content.demo.falls.input.moveDirection(),
    x = content.demo.falls.player.x()

  const velocity = context.canvas.height * 100/600

  for (let i = 0; i <= count; i += 1) {
    content.demo.falls.video.particles.spawn({
      life: 1,
      offset: {x: engine.fn.randomFloat(-context.canvas.height/17/2, context.canvas.height/17/2), y: engine.fn.randomFloat(-context.canvas.height/17/2, 0)},
      radius: engine.fn.randomFloat(0, 1),
      rate: engine.fn.randomFloat(4, 8),
      velocity: {x: velocity * engine.fn.randomFloat(0.5, 1) * -moveDirection, y: velocity * engine.fn.randomFloat(-0.5, 0)},
      x: x - (moveDirection * 1),
      y: 0,
    })
  }
})
