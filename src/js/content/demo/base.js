content.demo.base = {
  // Information
  id: undefined,
  allowPointerLock: false,
  enabled: false,
  name: '',
  description: '',
  // Methods
  extend: function (definition) {
    return engine.fn.extend(this, definition)
  },
  // Constants
  const: {},
  // Lifecycle
  load: () => {},
  unload: () => {},
  update: () => {},
}
