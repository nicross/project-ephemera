app.screen.information = app.screenManager.invent({
  // Attributes
  id: 'information',
  parentSelector: '.a-app--information',
  rootSelector: '.a-information',
  transitions: {
    back: function () {
      this.change('mainMenu')
    },
  },
  // State
  state: {},
  // Hooks
  onReady: function () {
    const root = this.rootElement

    root.querySelector('.a-information--back').addEventListener('click', () => {
      app.screenManager.dispatch('back')
    })
  },
  onEnter: function () {
    const position = engine.position.getVector(),
      root = this.rootElement

    for (const [selector, value] of [
      [
        '.a-information--metric-date',
        this.getSystemDate(),
      ],
      [
        '.a-information--metric-colorDepth',
        window.screen.colorDepth,
      ],
      [
        '.a-information--metric-resolution',
        `${app.width()}x${app.height()}`,
      ],
      [
        '.a-information--metric-sampleRate',
        engine.fn.round(engine.context().sampleRate / 1000, 2),
      ],
      [
        '.a-information--metric-subjectStatus',
        app.subjectStatus.state,
      ],
      [
        '.a-information--metric-time',
        this.getSystemTime(),
      ],
      [
        '.a-information--metric-version',
        `v${app.version()}`,
      ],
    ]) {
      root.querySelector(selector).innerHTML = value
    }
  },
  onFrame: function () {
    const root = this.rootElement

    for (const [selector, value] of [
      [
        '.a-information--metric-date',
        this.getSystemDate(),
      ],
      [
        '.a-information--metric-resolution',
        `${app.width()}x${app.height()}`,
      ],
      [
        '.a-information--metric-subjectStatus',
        app.subjectStatus.state,
      ],
      [
        '.a-information--metric-time',
        this.getSystemTime(),
      ],
    ]) {
      root.querySelector(selector).innerHTML = value
    }

    const ui = app.controls.ui()

    if (ui.back || ui.pause) {
      return app.screenManager.dispatch('back')
    }

    if (ui.confirm) {
      const focused = app.utility.focus.get(root)

      if (focused) {
        return focused.click()
      }
    }

    if ('focus' in ui) {
      const toFocus = app.utility.focus.selectFocusable(root)[ui.focus]

      if (toFocus) {
        if (app.utility.focus.is(toFocus)) {
          return toFocus.click()
        }

        return app.utility.focus.set(toFocus)
      }
    }

    if (ui.up) {
      return app.utility.focus.setPreviousFocusable(root)
    }

    if (ui.down) {
      return app.utility.focus.setNextFocusable(root)
    }
  },
  // Methods
  getCurrentDate: function () {
    return new Date(1994, 0, 1, 0, 0, Math.floor(engine.time()))
  },
  getSystemDate: function () {
    const now = this.getCurrentDate()

    return [
      (now.getMonth() + 1).toString().padStart(2, '0'),
      now.getDate().toString().padStart(2, '0'),
      now.getFullYear().toString(),
    ].join('/')
  },
  getSystemTime: function () {
    const now = this.getCurrentDate()

    return [
      now.getHours().toString().padStart(2, '0'),
      now.getMinutes().toString().padStart(2, '0'),
      now.getSeconds().toString().padStart(2, '0'),
    ].join(':')
  },
})
