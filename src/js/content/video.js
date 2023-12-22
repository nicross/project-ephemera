content.video = (() => {
  let canvas,
    isActive = false

  return {
    canvas: () => canvas,
    isActive: () => isActive,
    setActive: function (value) {
      isActive = Boolean(value)
      return this
    },
    setCanvas: function (value) {
      canvas = value
      return this
    },
  }
})()
