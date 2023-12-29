content.demo.heights.time = (() => {
  let time = 0

  return {
    get: () => time,
    load: function () {
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
