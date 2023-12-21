# GDD
## Harmony Falls
An arcade shooter against endlessly falling notes.

## Controls
**Move left and right:** A, D, arrow keys, numpad 4 5, gamepad any stick
**Shoot:** W, up arrow, numpad up, space, gamepad triggers, gamepad face buttons
**Exit:** escape, backspace, start, select

## Mechanics
- World wraps like a cylinder
- 64 vertical progress bars along x-axis
- Game starts with random falls
- Falls spawn randomly at the top, weighted near existing ones
- Falls advance continuously toward bottom at a rate which accelerates over time
- Falls are random heights between 1-3 (screen heights) before they fall under the screen and can spawn again
- Player can move discretely on x-axis as fast as they can press, or half-speed by holding button
- Player can shoot at a rate as fast as they can press, or half-speed by holding button
- Projectiles move continuously upward until they hit a fall or top of screen
- Falls struck by projectiles are pushed back to the top
- Falls pushed beyond top are destroyed
- Colliding with falls ends the game
- Score accumulates per second, successful shots, and when destroying falls

## Graphics
- Canvas API, simple colorful rectangles
- 16 falls visible at once (90-degree FOV)
- Background and foreground color generators
  - 1D noise controls the background brightness / foreground saturation (pastels on slate, rainbows on black)
  - Background is a neutral slate to black
  - Foreground (bar colors) hue is controlled by 2D noise (x, time) along x-axis
  - Falls flash briefly when hit by projectiles
- Projectiles
- Particle effects when projectiles hit falls or player dies
- Player sprite, zooms when player spawns, jiggles when player moves, shrinks when player dies

## Sound design
- Falls
  - Tone for every fall visible on the screen, panned and attenuated
  - Tone selection is from a pentatonic scale spread over many octaves, from highest to lowest
  - Fall tone synths retrigger when player moves or when changing frequency
  - Buzz when impassable and will cause death, modulation controlled by height of fall remaining
- Shoot
- Projectile hit
- Fall destroy
- Player destroy
