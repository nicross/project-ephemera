// Too lazy to refactor app.grain, so expose its touch() method here for demos
content.grain = (() => {
  let adapter

  return {
    getAdapter: () => adapter,
    setAdapter: function (value) {
      if (value && value.touch) {
        adapter = value
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
