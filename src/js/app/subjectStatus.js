app.subjectStatus = engine.tool.fsm.create({
  state: 'Nominal',
  transition: {
    Nominal: {
      enterGame: function ({demo}) {
        if (demo.subjectStatus) {
          this.change(demo.subjectStatus)
        }
      },
      pushMindControl: function () {
        this.change('Suspicious')
      },
      viewStatus: function () {
        this.change('Aware')
      },
    },
    Aware: {
      enterGame: function ({demo}) {
        if (demo.subjectStatus) {
          this.change(demo.subjectStatus)
        }
      },
      pushMindControl: function () {
        this.change('Suspicious')
      },
    },
    Suspicious: {
      enterGame: function ({demo}) {
        if (demo.subjectStatus) {
          this.change(demo.subjectStatus)
        }
      },
    },
  },
})

app.ready(() => {
  document.querySelector('.a-information--row-subjectStatus').addEventListener('blur', () => app.subjectStatus.dispatch('viewStatus'))
  document.querySelector('.a-settings--mindControlButton').addEventListener('click', () => app.subjectStatus.dispatch('pushMindControl'))

  // Demo statuses
  app.screenManager.on('enter-game', (e) => app.subjectStatus.dispatch('enterGame', e))

  for (const [id, demo] of Object.entries(content.demo.all())) {
    if (demo.subjectStatus) {
      app.subjectStatus.transition[demo.subjectStatus] = {...app.subjectStatus.transition.Nominal}
    }
  }
})
