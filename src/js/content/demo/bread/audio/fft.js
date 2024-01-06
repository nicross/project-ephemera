content.demo.bread.audio.fft = (() => {
  let analyser,
    data = new Float32Array()

  return {
    data: () => data,
    load: function () {
      const bus = content.demo.bread.audio.bus(),
        context = engine.context()

      analyser = new AnalyserNode(context, {
        fftSize: 2048,
      })

      bus.connect(analyser)

      return this
    },
    unload: function () {
      analyser.disconnect()
      analyser = undefined

      return this
    },
    update: function () {
      data = analyser.getFloatTimeDomainData(
        new Float32Array(analyser.fftSize)
      )

      return this
    },
  }
})()
