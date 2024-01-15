content.demo.falls.audio.pickupCollect = (pickup) => {
  console.log('collect', pickup)
}

content.demo.falls.pickups.on('collect', ({pickup}) => content.demo.falls.audio.pickupCollect(pickup))
