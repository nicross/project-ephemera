content.demo.heights.footsteps = (() => {
  const pubsub = engine.tool.pubsub.create(),
    strideLength = 1,
    tree = engine.tool.octree.create()

  let lastStep = engine.tool.vector3d.create()

  return pubsub.decorate({
    load: function () {
      return this
    },
    nearby: function (radius = 0) {
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
    unload: function () {
      lastStep = engine.tool.vector3d.create()
      tree.clear()

      return this
    },
    update: function () {
      const position = engine.position.getVector()

      if (lastStep.distance(position) >= strideLength) {
        lastStep = position

        if (!tree.find(position, strideLength) && (position.x || position.y)) {
          tree.insert({
            audio: 0,
            x: position.x,
            y: position.y,
            z: position.z,
          })
        }

        pubsub.emit('step', {
          strength: content.demo.heights.movement.velocityRatio(),
        })
      }

      return this
    },
  })
})()
