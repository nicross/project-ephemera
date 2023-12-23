content.demo.falls.audio.projectileShoot = () => {
  console.log('pew')
}

content.demo.falls.projectiles.on('shoot', () => content.demo.falls.audio.projectileShoot())
