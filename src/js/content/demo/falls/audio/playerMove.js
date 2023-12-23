content.demo.falls.audio.playerMove = () => {
  console.log('woosh')
}

content.demo.falls.player.on('move', () => content.demo.falls.audio.playerMove())
