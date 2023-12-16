app.screen.mainMenu = app.screenManager.invent({
  // Attributes
  id: 'mainMenu',
  parentSelector: '.a-app--mainMenu',
  rootSelector: '.a-mainMenu',
  transitions: {
    demos: function () {
      this.change('demos')
    },
    information: function () {
      this.change('information')
    },
    quit: function () {
      app.quit()
    },
  },
  // State
  state: {},
  // Hooks
  onReady: function () {
    const root = this.rootElement

    Object.entries({
      demos: root.querySelector('.a-mainMenu--demos'),
      information: root.querySelector('.a-mainMenu--information'),
      quit: root.querySelector('.a-mainMenu--quit'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })

    root.querySelector('.a-mainMenu--action-quit').hidden = !app.isElectron()
  },
  onFrame: function () {
    const root = this.rootElement,
      ui = app.controls.ui()

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
  // Custom methods
  focusWithin: function () {
    app.utility.focus.set(
      this.rootElement.querySelector('.a-mainMenu--demos')
    )

    return this
  },
})
