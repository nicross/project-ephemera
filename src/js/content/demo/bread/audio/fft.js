content.demo.bread.audio.fft = (() => {
  const fftSize = 512

  let analyser,
    data = new Float32Array(fftSize / 2)

  return {
    data: () => data,
    load: function () {
      const bus = content.demo.bread.audio.bus(),
        context = engine.context()

      analyser = new AnalyserNode(context, {
        fftSize,
      })

      bus.connect(analyser)

      return this
    },
    unload: function () {
      analyser.disconnect()
      analyser = undefined

      data = new Float32Array(fftSize / 2)

      return this
    },
    update: function () {
      const temp = new Uint8Array(fftSize / 2)
      analyser.getByteFrequencyData(temp)

      for (const i in temp) {
        data[i] = engine.fn.clamp(temp[i] / 255)
      }

      return this
    },
  }
})()
