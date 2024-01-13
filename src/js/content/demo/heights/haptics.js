engine.ready(() => {

  // Catches
  content.demo.heights.fairies.on('catch', () => {
    content.haptics.enqueue({
      duration: engine.fn.randomFloat(75, 150),
      strongMagnitude: engine.fn.randomFloat(1/16, 1/8),
      weakMagnitude: engine.fn.randomFloat(1/16, 1/8),
    })

    content.haptics.enqueue({
      duration: engine.fn.randomFloat(200, 250),
      startDelay: engine.fn.randomFloat(150, 250),
      strongMagnitude: engine.fn.randomFloat(1/4, 1/2),
      weakMagnitude: engine.fn.randomFloat(1/4, 1/2),
    })
  })

  // Footsteps
  content.demo.heights.footsteps.on('step', ({strength}) => {
    if (content.demo.heights.movement.isJump()) {
      return
    }

    content.haptics.enqueue({
      duration: engine.fn.lerp(15, 25, strength),
      strongMagnitude: engine.fn.lerp(1/96, 1/64, strength) * Math.random(),
      weakMagnitude: engine.fn.lerp(1/96, 1/64, strength) * Math.random(),
    })
  })

  // Jump end
  content.demo.heights.movement.on('jump-end', ({strength}) => {
    content.haptics.enqueue({
      duration: engine.fn.lerp(125, 250, strength),
      strongMagnitude: engine.fn.lerp(1/4, 1, strength),
      weakMagnitude: engine.fn.lerp(1/4, 1, strength),
    })
  })

  // Jump start
  content.demo.heights.movement.on('jump-start', () => {
    content.haptics.enqueue({
      duration: engine.fn.randomFloat(75, 125),
      strongMagnitude: engine.fn.randomFloat(1/8, 1/4),
      weakMagnitude: engine.fn.randomFloat(1/8, 1/4),
    })

    content.haptics.enqueue({
      duration: engine.fn.randomFloat(75, 125),
      startDelay: engine.fn.randomFloat(100, 150),
      strongMagnitude: engine.fn.randomFloat(1/8, 1/4),
      weakMagnitude: engine.fn.randomFloat(1/8, 1/4),
    })
  })

})
