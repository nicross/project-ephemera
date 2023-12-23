content.demo.falls.audio.playerKill = () => {
  console.log('boom')
}

content.demo.falls.player.on('kill', () => content.demo.falls.audio.playerKill())
