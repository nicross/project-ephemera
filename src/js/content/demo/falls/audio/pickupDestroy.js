content.demo.falls.audio.pickupDestroy = (pickup) => {
  console.log('destroy', pickup)
}

content.demo.falls.pickups.on('destroy', ({pickup}) => content.demo.falls.audio.pickupDestroy(pickup))
