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
    touch: function (value) {
      
    },
    update: function (value) {
      updateSynth(value)

      return this
    },
  }
})()
