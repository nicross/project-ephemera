content.demo.bread.audio.touches.synth = {}

content.demo.bread.audio.touches.synth.create = function (...args) {
  return Object.create(this.prototype).construct(...args)
}

content.demo.bread.audio.touches.synth.prototype = {
  construct: function ({
    touch,
  }) {
    this.touch = touch

    return this
  },
  destroy: function () {
    return this
  },
  update: function () {
    return this
  },
}
