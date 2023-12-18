content.audio.buffer.whiteNoise = content.audio.buffer.base.extend({
  buffers: [
    engine.buffer.whiteNoise({
      channels: 1,
      duration: 10,
    }),
  ],
})
