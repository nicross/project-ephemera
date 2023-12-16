app.audio.ui = {}

app.audio.ui.click = ({
  enabled,
}) => {
  const bus = app.audio.bus()

  // TODO: synth
}

app.audio.ui.focus = ({
  enabled,
}) => {
  const bus = app.audio.bus()

  // TODO: synth
}

document.addEventListener('click', (e) => {
  if (e.target.tabIndex == '-1') {
    return
  }

  if (!e.target.matches('.a-app--screen-os .c-menuButton')) {
    return
  }

  app.audio.ui.click({
    enabled: !e.target.hasAttribute('aria-disabled'),
  })
})

document.addEventListener('focusin', (e) => {
  if (e.target.tabIndex == '-1') {
    return
  }

  if (!e.target.closest('.a-app--screen-os')) {
    return
  }

  app.audio.ui.focus({
    enabled: !e.target.hasAttribute('aria-disabled'),
  })
})
