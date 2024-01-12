content.demo.base = {
  // Information
  id: undefined,
  allowHum: false,
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
