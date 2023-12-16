app.screen.boot = app.screenManager.invent({
  // Attributes
  id: 'boot',
  parentSelector: '.a-app--boot',
  rootSelector: '.a-boot',
  transitions: {
    done: function () {
      this.change('mainMenu')
    },
  },
  // Hooks
  onEnter: async function () {
    this.statusElement = this.rootElement.querySelector('.a-boot--status')

    await this.doDisclaimer()
    await this.doLogo()

    app.screenManager.dispatch('done')
  },
  // Methods
  doDisclaimer: async function () {
    await engine.fn.promise(1 * 1000)

    const text = 'For demonstration purposes only.'

    const disclaimer = document.createElement('div')
    disclaimer.classList.add('a-boot--disclaimer')
    disclaimer.innerHTML = text

    this.rootElement.appendChild(disclaimer)
    this.statusElement.innerHTML = text
  },
  doLogo: async function () {
    await engine.fn.promise(1 * 1000)

    const text = 'Ephemera'

    const logo = document.createElement('div')
    logo.classList.add('a-boot--logo')
    logo.setAttribute('aria-label', text)

    logo.innerHTML = text.split('').map(
      (letter) => `<span class="a-boot--logoLetter"><span class="a-boot--logoLetterInner">${letter}</span></span>`
    ).join('')

    this.rootElement.appendChild(logo)

    await engine.fn.promise(1 * 1000)
    this.statusElement.innerHTML = text

    await engine.fn.promise(3 * 1000)
  },
})
