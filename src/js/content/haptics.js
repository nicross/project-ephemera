content.haptics = (() => {
  let adapter

  return {
    getAdapter: () => adapter,
    enqueue: function (...args) {
      if (adapter) {
        adapter.enqueue(...args)
      }

      return this
    },
    setAdapter: function (value) {
      if (value && value.enqueue) {
        adapter = value
      }

      return this
    },
  }
})()
