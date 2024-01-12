content.demo.bread.input.keyboard = (() => {
  const touches = new Map()

  const mappings = {
    Digit1: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/12))), z: 0.666}).normalize(),
    Digit2: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/12))), z: 0.666}).normalize(),
    Digit3: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/12))), z: 0.666}).normalize(),
    Digit4: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/12))), z: 0.666}).normalize(),
    Digit5: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/12))), z: 0.666}).normalize(),
    Digit6: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/12))), z: 0.666}).normalize(),
    Digit7: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/12))), z: 0.666}).normalize(),
    Digit8: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/12))), z: 0.666}).normalize(),
    Digit9: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/12))), z: 0.666}).normalize(),
    Digit0: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/12))), z: 0.666}).normalize(),
    Minus: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/12))), z: 0.666}).normalize(),
    Equal: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(11/12))), z: 0.666}).normalize(),
    // Tropic
    KeyQ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/12))), z: 0.333}).normalize(),
    KeyW: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/12))), z: 0.333}).normalize(),
    KeyE: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/12))), z: 0.333}).normalize(),
    KeyR: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/12))), z: 0.333}).normalize(),
    KeyT: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/12))), z: 0.333}).normalize(),
    KeyY: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/12))), z: 0.333}).normalize(),
    KeyU: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/12))), z: 0.333}).normalize(),
    KeyI: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/12))), z: 0.333}).normalize(),
    KeyO: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/12))), z: 0.333}).normalize(),
    KeyP: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/12))), z: 0.333}).normalize(),
    BracketLeft: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/12))), z: 0.333}).normalize(),
    BracketRight: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(11/12))), z: 0.333}).normalize(),
    // Equator
    KeyA: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/11))), z: -0.333}).normalize(),
    KeyS: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/11))), z: -0.333}).normalize(),
    KeyD: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/11))), z: -0.333}).normalize(),
    KeyF: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/11))), z: -0.333}).normalize(),
    KeyG: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/11))), z: -0.333}).normalize(),
    KeyH: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/11))), z: -0.333}).normalize(),
    KeyJ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/11))), z: -0.333}).normalize(),
    KeyK: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/11))), z: -0.333}).normalize(),
    KeyL: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/11))), z: -0.333}).normalize(),
    Semicolon: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/11))), z: -0.333}).normalize(),
    Quote: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(10/11))), z: -0.333}).normalize(),
    // Tropic
    KeyZ: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(0/10))), z: -0.666}).normalize(),
    KeyX: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(1/10))), z: -0.666}).normalize(),
    KeyC: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(2/10))), z: -0.666}).normalize(),
    KeyV: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(3/10))), z: -0.666}).normalize(),
    KeyB: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(4/10))), z: -0.666}).normalize(),
    KeyN: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(5/10))), z: -0.666}).normalize(),
    KeyM: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(6/10))), z: -0.666}).normalize(),
    Comma: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(7/10))), z: -0.666}).normalize(),
    Period: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(8/10))), z: -0.666}).normalize(),
    Slash: engine.tool.vector3d.create({...engine.tool.vector2d.unitX().rotate(engine.const.tau * (0.5 + -(9/10))), z: -0.666}).normalize(),
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

    return left || right
      ? 1
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
          if (touches.has(key)) {
            const touch = touches.get(key)
            touch.depth = depth
          } else {
            touches.set(key, {
              ...vector,
              depth,
              modifier: 0,
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
