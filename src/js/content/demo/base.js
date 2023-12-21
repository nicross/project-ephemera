content.demo.base = {
  // Information
  id: undefined,
  enabled: false,
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
