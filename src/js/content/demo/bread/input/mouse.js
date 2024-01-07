content.demo.bread.input.mouse = (() => {
  let touch

  return {
    load: function () {
      return this
    },
    touches: () => touch ? [touch] : [],
    unload: function () {
      return this
    },
    update: function () {
      if (engine.input.mouse.isButton(0)) {
        let {x, y} = content.cursor.get()
        const magnitude = engine.fn.distance({x, y})

        if (magnitude > 1) {
          x /= magnitude
          y /= magnitude
        }

        if (!touch) {
          touch = {}
        }

        // Project cursor onto surface of sphere in screen space
        touch.depth = 0
        touch.x = 1 - Math.min(magnitude, 1)
        touch.y = -x
        touch.z = y
      } else {
        touch = undefined
      }

      return this
    },
  }
})()
