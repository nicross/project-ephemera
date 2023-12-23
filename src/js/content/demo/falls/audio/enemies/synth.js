content.demo.falls.audio.enemies.synth = {}

content.demo.falls.audio.enemies.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.demo.falls.audio.enemies.synth.prototype = {
  construct: function ({
    enemy,
  } = {}) {
    this.enemy = enemy

    return this
  },
  destroy: function () {
    delete this.enemy

    return this
  },
  update: function () {
    return this
  },
}
