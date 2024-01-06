content.cursor = (() => {
  let cursor = engine.tool.vector2d.create()

  return {
    get: () => cursor.clone(),
    set: function ({x, y}) {
      cursor.x = x
      cursor.y = y

      return this
    },
  }
})()
