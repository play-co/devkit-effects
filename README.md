DevKit Effects Module
======================

## Installation and Imports

Run this command to install devkit-effects as a dependency in your project:
```
  devkit install https://github.com/gameclosure/devkit-effects.git
```

Once installed, you can import effects like this:
```
  import effects;
```

## Using Effects

### Adding Effects to a Game

All effects take two parameters: a view and an optional opts object. Effects also looks for a view property so you can pass in something like an `Entity`.

Call effects like this:
```
  effects.explode(view);
```
or:
```
  effects.disco(player, { duration: 4000 });
```

### Managing Effects

The following functions can be called on effects to help manage active effects:

 * `effects.pause()` - optional parameters `view` and effect `name` - pauses all effects globally, all effects on a given view, or a specific effect on a specific view
 * `effects.resume()` - optional parameters `view` and effect `name` - resumes all effects globally, all effects on a given view, or a specific effect on a specific view
 * `effects.stop()` - optional parameters `view` and effect `name` - clears all effects globally, all effects on a given view, or a specific effect on a specific view
 * `effects.commit()` - optional parameters `view` and effect `name` - instantly and safely finishes all effects globally, all effects on a given view, or a specific effect on a specific view

For example, pause all effects, but resume only one of them:
```
effects.pause();
effects.resume(player, 'disco');
```

### Optional Opts Properties

These properties can be passed in to modify effects:

 * `duration` - number in milliseconds - change the time an effect takes to complete, defaults to 1000 for most effects (1 second)
 * `scale` - number - change the general scale or magnitude of an effect, defaults to 1 for most effects
 * `loop` - boolean - whether or not to continually repeat an effect, defaults to false for most effects
 * `blend` - boolean - whether or not to blend an effect using composite operations, defaults to false for most effects, only affects particles
 * `follow` - boolean - whether particles should follow a view as it moves, defaults to false for most effects, only affects particles, `follow: false` can create particle trails, try it with the `confetti` effect!
 * `behind` - boolean - whether particles should be in front or behind the view, defaults to false for most effects, only affects particles

### Master Effects List

#### Animation Effects
 * `hover` - hover a view up and down
 * `shake` - shake a view rapidly, great for screen shaking like earthquakes
 * `spin` - rotate a view
 * `squish` - make a view squish like jelly
 * `sway` - sway a view back and forth

#### Particle Effects
 * `confetti` - basic confetti effect, default images
 * `explode` - basic fiery explosion, default images
 * `sparkle` - basic sparkly effect, default images

#### Composite Effects
 * `disco` - disco-mode, default images
 * `radial` - awe-inspiring radials, default images

### Registering Custom Effects

Although this is possible using exposed API's, it's recommended to avoid until better tested and documented! Read the code in `effects.js` if you're super curious!

 * `registerAnimationEffect` - uses timestep's `animate` to create animation effects, like bounces or shakes
 * `registerParticleEffect` - uses timestep's `ParticleEngine` to create particle effects, like sparkles or explosions
 * `registerCompositeEffect` - uses timestep's `BlendEngine` to create composited particle effects, like disco-mode
