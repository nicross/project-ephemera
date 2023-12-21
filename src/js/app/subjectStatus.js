app.subjectStatus = engine.tool.fsm.create({
  state: 'Nominal',
  transition: {
    Nominal: {
      viewStatus: function () {
        this.change('Aware')
      },
      pushMindControl: function () {
        this.change('Suspicious')
      },
    },
    Aware: {
      exitGame: function () {
        this.change('Nominal')
      },
      pushMindControl: function () {
        this.change('Suspicious')
      },
    },
    Suspicious: {
      exitGame: function () {
        this.change('Aware')
      },
    },
  },
})

app.ready(() => {
  document.querySelector('.a-information--row-subjectStatus').addEventListener('blur', () => app.subjectStatus.dispatch('viewStatus'))
  document.querySelector('.a-settings--mindControlButton').addEventListener('click', () => app.subjectStatus.dispatch('pushMindControl'))
  app.screenManager.on('exit-game', () => app.subjectStatus.dispatch('exitGame'))
})
