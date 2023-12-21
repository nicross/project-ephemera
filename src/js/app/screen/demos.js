app.screen.demos = app.screenManager.invent({
  // Attributes
  id: 'demos',
  parentSelector: '.a-app--demos',
  rootSelector: '.a-demos',
  transitions: {
    back: function () {
      this.change('mainMenu')
    },
    play: function (demo) {
      this.change('game', demo)
    },
  },
  // State
  state: {},
  // Hooks
  onReady: function () {
    const root = this.rootElement

    // Demos
    const demoList = root.querySelector('.a-demos--demos')

    for (const demo of Object.values(content.demo.all())) {
      const item = document.createElement('li')
      item.classList.add('a-demos--demo')

      const button = document.createElement('button')
      button.classList.add('c-menuButton', 'c-menuButton-demo')
      button.innerHTML = `<h2>${demo.name}</h2><p>${demo.description}</p>`
      button.setAttribute('aria-description', demo.description)
      button.setAttribute('aria-label', demo.name)
      button.type = 'button'

      button.addEventListener('click', () => {
        app.screenManager.dispatch('play', {demo})
      })

      item.appendChild(button)
      demoList.appendChild(item)
    }

    // Actions
    Object.entries({
      back: root.querySelector('.a-demos--back'),
    }).forEach(([event, element]) => {
      element.addEventListener('click', () => app.screenManager.dispatch(event))
    })
  },
  onFrame: function () {
    const root = this.rootElement,
      ui = app.controls.ui()

    if (ui.back) {
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
})
