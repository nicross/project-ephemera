content.demo.bread.input.keyboard = (() => {
  const touches = new Map()

  const mappings = {
    Digit1: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: 0.666},
    Digit2: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: 0.666},
    Digit3: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: 0.666},
    Digit4: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: 0.666},
    Digit5: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: 0.666},
    Digit6: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: 0.666},
    Digit7: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: 0.666},
    Digit8: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: 0.666},
    Digit9: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: 0.666},
    Digit0: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: 0.666},
    // Tropic
    KeyQ: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: 0.333},
    KeyW: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: 0.333},
    KeyE: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: 0.333},
    KeyR: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: 0.333},
    KeyT: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: 0.333},
    KeyY: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: 0.333},
    KeyU: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: 0.333},
    KeyI: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: 0.333},
    KeyO: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: 0.333},
    KeyP: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: 0.333},
    // Equator
    KeyA: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: -0.333},
    KeyS: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: -0.333},
    KeyD: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: -0.333},
    KeyF: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: -0.333},
    KeyG: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: -0.333},
    KeyH: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: -0.333},
    KeyJ: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: -0.333},
    KeyK: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: -0.333},
    KeyL: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: -0.333},
    Semicolon: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: -0.333},
    // Tropic
    KeyZ: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: -0.666},
    KeyX: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: -0.666},
    KeyC: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: -0.666},
    KeyV: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: -0.666},
    KeyB: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: -0.666},
    KeyN: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: -0.666},
    KeyM: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: -0.666},
    Comma: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: -0.666},
    Period: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: -0.666},
    Slash: {...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: -0.666},
  }

  const modeMappings = {
    0: 'ArrowUp',
    1: 'ArrowRight',
    2: 'ArrowDown',
    3: 'ArrowLeft',
  }

  function getDepth() {
    const left = engine.input.keyboard.is('ShiftLeft'),
      right = engine.input.keyboard.is('ShiftRight')

    if (left && right) {
      return 1
    }

    return left || right
      ? 0.5
      : 0
  }

  return {
    load: function () {
      return this
    },
    mode: () => {
      for (const [mode, key] of Object.entries(modeMappings)) {
        if (engine.input.keyboard.is(key)) {
          return mode
        }
      }
    },
    touches: () => touches.values(),
    unload: function () {
      touches.clear()

      return this
    },
    update: function () {
      const depth = getDepth()

      for (const [key, vector] of Object.entries(mappings)) {
        if (engine.input.keyboard.is(key)) {
          if (!touches.has(key)) {
            touches.set(key, {
              ...vector,
              depth,
            })
          }
        } else {
          touches.delete(key)
        }
      }

      return this
    },
  }
})()
