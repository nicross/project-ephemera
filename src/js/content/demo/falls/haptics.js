engine.ready(() => {

  // Enemy hit
  content.demo.falls.enemies.on('hit', () => {
    content.haptics.enqueue({
      duration: engine.fn.randomFloat(50, 100),
      strongMagnitude: engine.fn.randomFloat(1/8, 1/4),
      weakMagnitude: 0,
    })
  })

  // Enemy kill
  content.demo.falls.enemies.on('kill', () => {
    content.haptics.enqueue({
      duration: 125,
      strongMagnitude: 0.5,
      weakMagnitude: 0.5,
    })
  })

  // Player kill
  content.demo.falls.player.on('kill', () => {
    content.haptics.enqueue({
      duration: 250,
      strongMagnitude: 1,
      weakMagnitude: 1,
    })
  })

  // Player shoot
  content.demo.falls.projectiles.on('shoot', () => {
    content.haptics.enqueue({
      duration: engine.fn.randomFloat(50, 100),
      strongMagnitude: 0,
      weakMagnitude: engine.fn.randomFloat(1/8, 1/4),
    })
  })

})
