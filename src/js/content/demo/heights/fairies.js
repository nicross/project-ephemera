content.demo.heights.fairies = (() => {
  const chunkSize = 50,
    fairies = new Set(),
    pubsub = engine.tool.pubsub.create()

  const generator = engine.tool.generator2d.create({
    generator: function (x, y) {
      const srand = engine.fn.srand('heights', 'fairies', x, y)

      if (srand() > 3/4 || (x == 0 && y == 0)) {
        return
      }

      const vector = engine.tool.vector2d.unitX()
        .scale(srand() * chunkSize / 2)
        .rotate(srand() * engine.const.tau)
        .add({
          x: x * chunkSize,
          y: y * chunkSize,
        })

      const fairy = {
        alertness: 0,
        amodDepth: srand(),
        amodFrequency: srand(),
        angle: srand(-engine.const.tau, engine.const.tau),
        note: srand(),
        timidity: srand(),
        tolerance: srand(8, 16),
        velocity: engine.tool.vector2d.create(),
        x: vector.x,
        y: vector.y,
        z: content.demo.heights.terrain.value(vector),
      }

      fairies.add(fairy)
      tree.insert(fairy)

      pubsub.emit('spawn', fairy)
    },
    scale: chunkSize,
    radius: 20,
  })

  let tree = engine.tool.quadtree.create()

  function behavior(fairy) {
    const delta = engine.loop.delta(),
      time = content.demo.heights.time.get()

    // Positional fuzziness
    fairy.x += Math.cos(fairy.angle * time / 4) * delta
    fairy.y += Math.sin(fairy.angle * time / 4) * delta

    // Handle running away
    if (!fairy.velocity.isZero()) {
      fairy.x += fairy.velocity.x * delta
      fairy.y += fairy.velocity.y * delta
      fairy.velocity = engine.fn.accelerateVector(fairy.velocity, {}, 1)
    }

    // Float above terrain at a height proportionate to alertness
    const bob = 0.25 + (Math.sin(time / 4) * 0.25)
    fairy.z = content.demo.heights.terrain.value(fairy) + bob + fairy.alertness

    // Handle catching
    const position = engine.position.getVector()
    const distance = engine.fn.distance(position, fairy)

    if (distance < 2) {
      if (fairy.sound) {
        fairy.sound.fadeOutDuration = 1/16
      }

      fairies.delete(fairy)
      tree.remove(fairy)

      return pubsub.emit('catch', fairy)
    }

    // Accelerate alertness based on distance versus tolerance/timidity
    if (!fairy.velocity.isZero()) {
      return
    }

    const isNear = distance < fairy.tolerance

    fairy.alertness = Math.max(
      engine.fn.accelerateValue(
        fairy.alertness,
        isNear ? 1 : 0,
        2 * (isNear ? fairy.timidity : 1 - fairy.timidity) * (0.5 + engine.fn.clamp(Math.sin(fairy.alertness * Math.PI)) * 0.5)
      ),
      engine.fn.clamp(engine.fn.scale(distance, 10, 1, 0, 1))
    )

    // Run away when alerted
    if (fairy.alertness >= 1) {
      pubsub.emit('alert', fairy)

      fairy.velocity = engine.tool.vector2d.create(position)
        .subtract(fairy)
        .inverse()
        .normalize()
        .rotate(engine.fn.randomFloat(-1/8, 1/8) * engine.const.tau)
        .scale(engine.fn.randomFloat(15, 20))
    }
  }

  return pubsub.decorate({
    all: () => fairies,
    closest: function (radius = 0, count = 0) {
      const all = this.nearby(radius)

      if (all.length <= count) {
        return all
      }

      const distances = new Map(),
        position = engine.position.getVector()

      for (const fairy of all) {
        distances.set(fairy, position.distance(fairy))
      }

      all.sort((a, b) => distances.get(a) - distances.get(b))

      return all.slice(0, count)
    },
    load: function () {
      generator.update()

      return this
    },
    nearby: (radius = 0) => {
      const position = engine.position.getVector()

      return tree.retrieve({
        depth: radius * 2,
        height: radius * 2,
        width: radius * 2,
        x: position.x - radius,
        y: position.y - radius,
        z: position.z - radius,
      })
    },
    tree: () => tree,
    unload: function () {
      fairies.clear()
      generator.reset()

      return this
    },
    update: function () {
      generator.update()

      for (const fairy of this.nearby(500)) {
        behavior(fairy)
      }

      tree = engine.tool.quadtree.from(fairies)

      return this
    },
  })
})()
