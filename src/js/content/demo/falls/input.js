content.demo.falls.input = (() => {
  const mappings = {
    left: {
      gamepadDigital: [
        14, // D-pad left
      ],
      keyboard: [
        'ArrowLeft',
        'KeyA',
        'Numpad4',
      ],
      mouse: [],
    },
    right: {
      gamepadDigital: [
        15, // D-pad right
      ],
      keyboard: [
        'ArrowRight',
        'KeyD',
        'Numpad6',
      ],
      mouse: [],
    },
    shoot: {
      gamepadDigital: [
        0, // A
        6, // Left trigger
        7, // Right trigger
        12, // D-pad up
      ],
      keyboard: [
        'ArrowUp',
        'Enter',
        'KeyW',
        'Space',
        'Numpad8',
      ],
      mouse: [
        0, // Primary click
        2, // Secondary click
      ],
    },
  }

  const moveInterval = 1/4,
    shootInterval = 1/4

  let isShoot = false,
    moveCooldown = 0,
    moveDirection = 0,
    movePrevious = 0,
    shootCooldown = 0,
    shootPrevious = false

  function checkAnalogControls(isPositive) {
    return [0, 2].reduce((value, axis) => value || (isPositive ? 1 : -1) * engine.input.gamepad.getAxis(axis) > 0.5, false)
      || false
  }

  function checkDigitalControls(mappings) {
    return mappings.keyboard.reduce((value, key) => value || engine.input.keyboard.is(key) > 0, false)
      || mappings.gamepadDigital.reduce((value, key) => value || engine.input.gamepad.isDigital(key), false)
      || mappings.mouse.reduce((value, key) => value || engine.input.mouse.isButton(key), false)
      || false
  }

  function move() {
    const delta = engine.loop.delta()

    const isLeft = checkDigitalControls(mappings.left) || checkAnalogControls(false),
      isRight = checkDigitalControls(mappings.right) || checkAnalogControls(true)

    const moveIntent = isLeft && !isRight
      ? -1
      : (isRight && !isLeft ? 1 : 0)

    moveCooldown = moveIntent != movePrevious
      ? 0
      : Math.max(0, moveCooldown - delta)

    moveDirection = moveCooldown > 0 ? 0 : moveIntent
    movePrevious = moveCooldown > 0 ? movePrevious : moveDirection
    moveCooldown = Math.max(moveCooldown, moveDirection ? moveInterval : 0)
  }

  function shoot() {
    const delta = engine.loop.delta()
    const shootIntent = checkDigitalControls(mappings.shoot)

    shootCooldown = shootIntent != shootPrevious
      ? 0
      : Math.max(0, shootCooldown - delta)

    isShoot = shootCooldown > 0 ? false : shootIntent
    shootPrevious = shootCooldown > 0 ? shootPrevious : isShoot
    shootCooldown = Math.max(shootCooldown, isShoot ? shootInterval : 0)
  }

  return {
    isMove: () => moveDirection != 0,
    isShoot: () => isShoot,
    load: function () {
      return this
    },
    moveDirection: () => moveDirection,
    unload: function () {
      isShoot = false
      moveCooldown = 0
      moveDirection = 0
      movePrevious = false
      shootCooldown = 0
      shootPrevious = false

      return this
    },
    update: function () {
      if (content.demo.falls.time.get() < 1/4) {
        return this
      }

      move()
      shoot()

      return this
    },
  }
})()
