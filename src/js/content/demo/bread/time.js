content.demo.bread.time = (() => {
  let time = 0

  return {
    get: () => time,
    load: function () {
      time = engine.fn.randomFloat(-3600, 3600)

      return this
    },
    set: function (value) {
      time = value
      return this
    },
    unload: function () {
      time = 0

      return this
    },
    update: function () {
      time += engine.loop.delta()

      return this
    },
  }
})()
