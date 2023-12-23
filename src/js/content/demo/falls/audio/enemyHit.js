content.demo.falls.audio.enemyHit = (enemy) => {
  console.log('stab', enemy)
}

content.demo.falls.enemies.on('hit', ({enemy}) => content.demo.falls.audio.enemyHit(enemy))
