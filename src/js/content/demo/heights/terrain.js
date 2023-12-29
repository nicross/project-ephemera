content.demo.heights.terrain = (() => {
  return {
    load: function () {
      return this
    },
    value: function ({x, y} = engine.position.getVector()) {
      // TODO: Generate stuff
      return x / 4
    },
    unload: function () {
      return this
    },
  }
})()
