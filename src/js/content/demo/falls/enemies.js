content.demo.falls.enemies = (() => {
  const baseRate = 1 / 30,
    enemies = new Map()

  function initialize() {
    // TODO
  }

  function spawn() {
    // TODO
  }

  function update() {
    const rate = engine.loop.delta() * baseRate

    for (const [x, enemy] of enemies) {
      // TODO
    }
  }

  return {
    all: () => Array.from(enemies.values()),
    get: (x) => enemies.get(x),
    load: function () {
      initialize()

      return this
    },
    unload: function () {
      slots.clear()

      return this
    },
    update: function () {
      spawn()
      update()

      return this
    },
  }
})()
