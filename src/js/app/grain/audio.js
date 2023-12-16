app.grain.audio = (() => {
  function createSynth() {

  }

  function updateSynth(value) {

  }

  return {
    activate: function () {
      createSynth()

      return this
    },
    update: function (value) {
      updateSynth(value)

      return this
    },
  }
})()
