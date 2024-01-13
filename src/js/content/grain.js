// Too lazy to refactor app.grain, so expose its touch() method here for demos
content.grain = (() => {
  let adapter

  return {
    get: function (...args) {
      return adapter ? adapter.get() : 0
    },
    getAdapter: () => adapter,
    setAdapter: function (value) {
      if (value && value.touch) {
        adapter = value
      }

      return this
    },
    set: function (...args) {
      if (adapter) {
        adapter.set(...args)
      }

      return this
    },
    touch: function (...args) {
      if (adapter) {
        adapter.touch(...args)
      }

      return this
    },
  }
})()
