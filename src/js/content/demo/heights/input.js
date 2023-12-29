content.demo.heights.input = (() => {
  const mappings = {
    lookDown: {
      gamepadAxis: [
        [3, 1],
      ],
      gamepadDigital: [],
      keyboard: [
        'PageDown',
      ],
      mouseAxis: [
        ['y', 1]
      ],
      mouseButton: [],
    },
    lookUp: {
      gamepadAxis: [
        [3, -1],
      ],
      gamepadDigital: [],
      keyboard: [
        'PageUp',
      ],
      mouseAxis: [
        ['y', -1]
      ],
      mouseButton: [],
    },
    moveBackward: {
      gamepadAxis: [
        [1, 1],
      ],
      gamepadDigital: [
        13, // D-pad up
      ],
      keyboard: [
        'ArrowDown',
        'KeyS',
        'Numpad5',
      ],
      mouseAxis: [],
      mouseButton: [],
    },
    moveForward: {
      gamepadAxis: [
        [1, -1],
      ],
      gamepadDigital: [
        12, // D-pad up
      ],
      keyboard: [
        'ArrowUp',
        'KeyW',
        'Numpad8',
      ],
      mouseAxis: [],
      mouseButton: [
        0, // Primary click
      ],
    },
    strafeLeft: {
      gamepadAxis: [
        [0, -1],
      ],
      gamepadDigital: [
        14, // D-pad left
      ],
      keyboard: [
        'KeyA',
        'Numpad4',
      ],
      mouseAxis: [],
      mouseButton: [],
    },
    strafeRight: {
      gamepadAxis: [
        [0, 1],
      ],
      gamepadDigital: [
        15, // D-pad right
      ],
      keyboard: [
        'KeyD',
        'Numpad6',
      ],
      mouseAxis: [],
      mouseButton: [],
    },
    turnLeft: {
      gamepadAxis: [
        [2, -1],
      ],
      gamepadDigital: [],
      keyboard: [
        'ArrowLeft',
        'KeyQ',
        'Numpad7',
      ],
      mouseAxis: [
        ['x', -1],
      ],
      mouseButton: [],
    },
    turnRight: {
      gamepadAxis: [
        [2, 1],
      ],
      gamepadDigital: [],
      keyboard: [
        'ArrowRight',
        'KeyE',
        'Numpad9',
      ],
      mouseAxis: [
        ['x', 1],
      ],
      mouseButton: [],
    },
  }

  let look = 0,
    turn = 0,
    x = 0,
    y = 0

  function check(mappings) {
    return Math.max(
      // Keyboard buttons
      mappings.keyboard.reduce((value, key) => value || engine.input.keyboard.is(key) > 0 ? 1 : 0, 0),
      // Gamepad axes
      mappings.gamepadAxis.reduce((value, mapping) => {
        const reading = engine.input.gamepad.getAxis(mapping[0])

        return Math.max(
          value,
          mapping[1] * reading > 0 ? Math.abs(reading) : 0,
        )
      }, 0),
      // Gamepad buttons
      mappings.gamepadDigital.reduce((value, key) => value || engine.input.gamepad.isDigital(key) ? 1 : 0, 0),
      // Mouse axes
      document.pointerLockElement
        ? mappings.mouseAxis.reduce((value, mapping) => {
            const reading = Math.sign(
              mapping[0] == 'x'
                ? engine.input.mouse.getMoveX()
                : engine.input.mouse.getMoveY()
            )

            return Math.max(
              value,
              mapping[1] * reading > 0 ? reading : 0,
            )
          }, 0)
        : 0,
      // Mouse buttons
      document.pointerLockElement
        ? mappings.mouseButton.reduce((value, key) => value || engine.input.mouse.isButton(key) ? 1 : 0, 0)
        : 0,
      0
    )
  }

  return {
    load: function () {
      return this
    },
    look: () => look,
    turn: () => turn,
    unload: function () {
      look = 0
      turn = 0
      x = 0
      y = 0

      return this
    },
    update: function () {
      look = check(mappings.lookUp) - check(mappings.lookDown)
      turn = check(mappings.turnLeft) - check(mappings.turnRight)
      x = check(mappings.moveForward) - check(mappings.moveBackward)
      y = check(mappings.strafeLeft) - check(mappings.strafeRight)

      // TODO: Mouse controls not working as expected
      //console.log({x, y, turn, look})
      //console.log(engine.input.mouse.getMoveX(), engine.input.mouse.getMoveY())

      return this
    },
    x: () => x,
    y: () => y,
  }
})()
