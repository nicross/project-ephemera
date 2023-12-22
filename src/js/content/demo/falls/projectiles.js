content.demo.falls.projectiles = (() => {
  const baseRate = 1 / 4,
    projectiles = new Set()

  function spawn() {
    // TODO
  }

  function update() {
    const rate = engine.loop.delta() * baseRate

    for (const projectile of projectiles) {
      // TODO
    }
  }

  return {
    all: () => [...projectiles],
    load: function () {
      return this
    },
    unload: function () {
      projectiles.clear()

      return this
    },
    update: function () {
      spawn()
      update()

      return this
    },
  }
})()
