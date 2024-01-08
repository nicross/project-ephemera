content.demo.bread.audio.fx = (() => {
  const delayFeedbackField = engine.fn.createNoise({
    octaves: 8,
    seed: ['bread', 'fx', 'delayFeedback'],
    type: '1d',
  })

  const delayTimeField = engine.fn.createNoise({
    octaves: 8,
    seed: ['bread', 'fx', 'delayTime'],
    type: '1d',
  })

  const delayWetField = engine.fn.createNoise({
    octaves: 8,
    seed: ['bread', 'fx', 'delayWet'],
    type: '1d',
  })

  let delay,
    input

  function calculateParameters() {
    const time = content.demo.bread.time.get()

    return {
      delayFeedback: engine.fn.fromDb(engine.fn.lerp(-9, -3, delayFeedbackField.value(time / 17))),
      delayTime: engine.fn.lerpExp(1/16, 1, delayTimeField.value(time / 20), 2),
      delayWet: engine.fn.fromDb(engine.fn.lerp(-18, -6, delayWetField.value(time / 19))),
    }
  }

  return {
    input: () => input,
    load: function () {
      const context = engine.context()

      const {
        delayFeedback,
        delayTime,
        delayWet,
      } = calculateParameters()

      input = context.createGain()

      delay = engine.effect.pingPongDelay({
        delayTime,
        dry: 0,
        delayFeedback,
        delayWet,
      })

      input.connect(delay.input)

      delay.output.connect(
        content.demo.bread.audio.bus()
      )

      engine.ephemera
        .add(delayFeedbackField)
        .add(delayTimeField)
        .add(delayWetField)

      return this
    },
    unload: function () {
      delay.output.disconnect()
      delay = undefined

      engine.ephemera
        .remove(delayFeedbackField)
        .remove(delayTimeField)
        .remove(delayWetField)

      delayFeedbackField.reset()
      delayTimeField.reset()
      delayWetField.reset()

      return this
    },
    update: function () {
      const {
        delayFeedback,
        delayTime,
        delayWet,
      } = calculateParameters()

      engine.fn.setParam(delay.param.feedback, delayFeedback)
      engine.fn.setParam(delay.param.delay, delayTime)
      engine.fn.setParam(delay.param.wet, delayWet)

      return this
    },
  }
})()
