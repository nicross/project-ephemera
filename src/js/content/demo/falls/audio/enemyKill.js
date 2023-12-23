content.demo.falls.audio.enemyKill = (enemy) => {
  console.log('boom', enemy)
}

content.demo.falls.enemies.on('kill', ({enemy}) => content.demo.falls.audio.enemyKill(enemy))
