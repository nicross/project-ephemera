content.demo.base = {
  // Information
  id: undefined,
  name: '',
  description: '',
  // Methods
  extend: function (definition) {
    return engine.fn.extend(this, definition)
  },
  // Lifecycle
  load: () => {},
  unload: () => {},
  update: () => {},
}
