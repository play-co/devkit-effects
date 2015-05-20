import animate;
import ui.ViewPool as ViewPool;
import ui.ParticleEngine as ParticleEngine;
import ui.BlendEngine as BlendEngine;

import .defaultImages;
import .effectsLibrary;

import .EffectsParticleEngine;
import .EffectsBlendEngine;

var Effects = Class(function () {

/////////////////////////
// ~ ~ Private API ~ ~ //
/////////////////////////

  /**
    * <p>Effects Manager Class
    * ~ individual effects are added automatically from {@link effectsLibrary}
    * ~ effects can also be added manually via register functions</p>
    * <p>Although this is possible to register custom effects, particles, etc., it's recommended to avoid until better tested and documented! Read the code in if you're super curious!</p>
    * @class Effects
    */
  this.init = function () {
    this._animations = [];
    this._particleEngines = new ViewPool({ ctor: EffectsParticleEngine });
    this._blendEngines = new ViewPool({ ctor: EffectsBlendEngine });

    // register the default animation effects
    var anims = effectsLibrary.animationEffects;
    for (var name in anims) {
      this.registerAnimationEffect(name, anims[name]);
    }

    // register the default particle effects
    var particles = effectsLibrary.particleEffects;
    for (var name in particles) {
      this.registerParticleEffect(name, particles[name]);
    }

    // register the default composite effects
    var composites = effectsLibrary.compositeEffects;
    for (var name in composites) {
      this.registerCompositeEffect(name, composites[name]);
    }

    // subscribe to the devkit's tick once it's finished initializing
    setTimeout(bind(this, function() {
      GC.app.engine.subscribe('Tick', bind(this, _tick));
    }), 0);
  };

  var durationDefaults = effectsLibrary.getDefaults('duration');
  var loopDefaults = effectsLibrary.getDefaults('loop');
  var blendDefaults = effectsLibrary.getDefaults('blend');
  var followDefaults = effectsLibrary.getDefaults('follow');
  var behindDefaults = effectsLibrary.getDefaults('behind');

  /**
    * updates particle and blend engines and removes finished engines
    * @func Effects#_tick
    * @arg {number} dt
    */
  var _tick = function (dt) {
    // update particle engines
    this._particleEngines.forEachActiveView(function (engine) {
      if (engine._activeParticles.length) {
        engine.update(dt);
      } else {
        engine.stop(true);
        this._particleEngines.releaseView(engine);
      }
    }, this);

    // update blend engines
    this._blendEngines.forEachActiveView(function (engine) {
      if (engine._activeParticleObjects.length) {
        engine.update(dt);
      } else {
        engine.stop(true);
        this._blendEngines.releaseView(engine);
      }
    }, this);
  };

  /**
   * @typedef {Object} EffectsOpts
   * @property {number} delay - in milliseconds
   * @property {number} duration - in milliseconds, change the time an effect takes to complete, defaults to 1000 for most effects
   * @property {number} scale - change the general scale or magnitude of an effect, defaults to 1 for most effects
   * @property {boolean} loop - whether or not to continually repeat an effect, defaults to false for most effects
   * @property {boolean} blend - whether or not to blend an effect using composite operations, defaults to false for most effects, only affects particles
   * @property {boolean} follow - whether particles should follow a view as it moves, defaults to false for most effects, only affects particles
   * @property {boolean} behind - whether particles should be in front or behind the view, defaults to false for most effects, only affects particles
   */
  /**
   * normalizes opts passed in to effects with reasonable defaults. For a description of the defualt opts see {@link EffectsOpts}
   * @func Effects#_applyDefaultOpts
   * @param  name
   * @param  {Object} opts
   * @return {EffectsOpts} opts
   */
  var _applyDefaultOpts = function (name, opts) {
    opts = opts || {};
    opts.delay = opts.delay || 0;
    opts.duration = opts.duration !== void 0 ? opts.duration : durationDefaults[name] || 1000;
    opts.scale = opts.scale || 1;
    opts.loop = opts.loop !== void 0 ? opts.loop : loopDefaults[name];
    opts.blend = opts.blend !== void 0 ? opts.blend : blendDefaults[name];
    opts.follow = opts.follow !== void 0 ? opts.follow : followDefaults[name];
    opts.behind = opts.behind !== void 0 ? opts.behind : behindDefaults[name];
    return opts;
  };

  /**
   * wrapper for handling pause, resume, stop API
   * @func Effects#_applyState
   * @param  {View|Object} view - If an object is given, object.view will be used.
   * @param  {String} name
   * @param  {String} state
   */
  var _applyState = function (view, name, state) {
    view = (view && view.view) || view;

    if (!view) {
      // apply state to all animation effects globally
      this._animations.forEach(function (anim) {
        anim.interrupting = true;
        anim[state]();
        anim.interrupting = false;
      }, this);
      // apply state to all particle effects globally
      this._particleEngines.forEachActiveView(function (engine) {
        engine[state](true);
      }, this);
      // apply state to all composite effects globally
      this._blendEngines.forEachActiveView(function (engine) {
        engine[state](true);
      }, this);
    } else if (!name) {
      // apply state to all animation effects for a specific view
      this._animations.forEach(function (anim) {
        if (anim.subject === view) {
          anim.interrupting = true;
          anim[state]();
          anim.interrupting = false;
        }
      }, this);
      // apply state to all particle effects for a specific view
      this._particleEngines.forEachActiveView(function (engine) {
        if (engine.subject === view) {
          engine[state](false);
        }
      }, this);
      // apply state to all composite effects for a specific view
      this._blendEngines.forEachActiveView(function (engine) {
        if (engine.subject === view) {
          engine[state](false);
        }
      }, this);
    } else {
      // apply state to all animation effects for a specific view and specific effect name
      this._animations.forEach(function (anim) {
        if (anim.subject === view && anim._group === name) {
          anim.interrupting = true;
          anim[state]();
          anim.interrupting = false;
        }
      }, this);
      // apply state to all particle effects for a specific view and specific effect name
      this._particleEngines.forEachActiveView(function (engine) {
        if (engine.subject === view && engine._group === name) {
          engine[state](false);
        }
      }, this);
      // apply state to all composite effects for a specific view and specific effect name
      this._blendEngines.forEachActiveView(function (engine) {
        if (engine.subject === view && engine._group === name) {
          engine[state](false);
        }
      }, this);
    }
  };

////////////////////////
// ~ ~ Public API ~ ~ //
////////////////////////

  /**
   * pauses all effects globally, all effects on a given view, or a specific effect on a specific view
   * @function Effects#pause
   * @param  {View}   [view]
   * @param  {String} [name]
   */
  this.pause = function (view, name) {
    _applyState.call(this, view, name, 'pause');
  };

  /**
   * resumes all effects globally, all effects on a given view, or a specific effect on a specific view
   * @method Effects#resume
   * @param  {View}   [view]
   * @param  {String} [name]
   */
  this.resume = function (view, name) {
    _applyState.call(this, view, name, 'resume');
  };

  /**
   * clears all effects globally, all effects on a given view, or a specific effect on a specific view
   * @method Effects#clear
   * @param  {View}   [view]
   * @param  {String} [name]
   */
  /**
   * @method Effects#stop
   * @alias Effects#clear
   */
  this.clear = this.stop = function (view, name) {
    _applyState.call(this, view, name, 'stop');
  };

  /**
   * instantly and safely finishes all effects globally, all effects on a given view, or a specific effect on a specific view
   * @method Effects#commit
   * @param  {View}   [view]
   * @param  {String} [name]
   */
  this.commit = function (view, name) {
    _applyState.call(this, view, name, 'commit');
  };

  /**
   * @callback AnimationEffectCallback
   * @param {View}   view
   * @param {EffectsOpts} opts
   * @param {animation}   anim
   */
  /**
   * uses timestep's {@link animate} to create animation effects, like bounces or shakes
   * @method Effects#registerAnimationEffect
   * @param  {String} name
   * @param  {AnimationEffectCallback} fn
   * @return {animate}
   */
  this.registerAnimationEffect = function (name, fn) {
    this[name] = bind(this, function (view, opts) {
      // allow entities and other objects that have views
      view = view.view || view;

      // prep animations and ensure safe completion if already active
      var anim = animate(view, name);
      anim.stop = anim.clear;
      anim.interrupting = true;
      anim.commit();
      anim.interrupting = false;
      this._animations.push(anim);

      // call the animation function with normalized opts
      opts = _applyDefaultOpts(name, opts);
      fn.call(this, view, opts, anim);

      // remove the anim ref and loop the animation if specified
      anim.then(bind(this, function () {
        this._animations.splice(this._animations.indexOf(anim), 1);
        if (opts.loop && !anim.interrupting) {
          anim.clear();
          this[name](view, opts);
        }
      }));

      return anim;
    });
  };

  /**
   * @callback ParticleEffectCallback
   * @param {View}   view
   * @param {EffectsOpts} opts
   * @param {EffectsParticleEngine} engine
   */
  /**
   * uses timestep's {@link ParticleEngine} to create particle effects, like sparkles or explosions
   * @method Effects#registerParticleEffect
   * @param  {String} name
   * @param  {ParticleEffectCallback} fn
   * @return {ParticleEngine|null}
   */
  this.registerParticleEffect = function (name, fn) {
    this[name] = bind(this, function (view, opts) {
      // allow entities and other objects that have views
      view = view.view || view;

      // prep engine and add as a sibling view to the subject view
      opts = _applyDefaultOpts(name, opts);
      var engine = this._particleEngines.obtainView({});
      var parent = view.getSuperview() || GC.app;
      var vs = view.style;
      var es = engine.style;
      engine._group = name;
      engine.subject = view;
      engine.paused = false;
      engine.follow = opts.follow;
      parent.addSubview(engine);

      // the engine should be positioned and sized to match the subject view
      opts.images = opts.images || defaultImages.get(name);
      es.x = vs.x || 0;
      es.y = vs.y || 0;
      es.offsetX = vs.offsetX || 0;
      es.offsetY = vs.offsetY || 0;
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = vs.anchorX;
      es.anchorY = vs.anchorY;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale * vs.scale;
      es.flipX = vs.flipX;
      es.flipY = vs.flipY;

      // call the particle function with normalized opts
      fn.call(this, view, opts, engine);
      if (engine._activeParticles.length) {
        view[name + 'Engine'] = engine;
        // particle engine loop, repeats the effect
        if (opts.loop) {
          engine.animLoop.wait(opts.duration)
            .then(bind(this, function () {
              if (view[name + 'Engine'] === engine) {
                engine.stop(true);
                this._particleEngines.releaseView(engine);
                this[name](view, opts);
              }
            }));
        }
        return engine;
      } else {
        this._particleEngines.releaseView(engine);
        return null;
      }
    });
  };

  /**
   * @callback CompositeEffectCallback
   * @param {View}   view
   * @param {EffectsOpts} opts
   * @param {EffectsBlendEngine} engine
   */
  /**
   * uses timestep's {@link BlendEngine} to create composited particle effects, like disco-mode
   * @method Effects#registerCompositeEffect
   * @param  {String}   name
   * @param  {CompositeEffectCallback} fn
   * @return {BlendEngine|null}
   */
  this.registerCompositeEffect = function (name, fn) {
    this[name] = bind(this, function (view, opts) {
      // allow entities and other objects that have views
      view = view.view || view;

      // prep blend engine and add as a sibling view to the subject view
      opts = _applyDefaultOpts(name, opts);
      var engine = this._blendEngines.obtainView({});
      var parent = view.getSuperview() || GC.app;
      var vs = view.style;
      var es = engine.style;
      engine._group = name;
      engine.subject = view;
      engine.paused = false;
      engine.follow = opts.follow;
      engine._forceCenterX = vs.width / 2 || 0.5;
      engine._forceCenterY = vs.height / 2 || 0.5;
      parent.addSubview(engine);

      // the engine should be positioned and sized to match the subject view
      opts.images = opts.images || defaultImages.get(name);
      es.x = vs.x || 0;
      es.y = vs.y || 0;
      es.offsetX = vs.offsetX || 0;
      es.offsetY = vs.offsetY || 0;
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = vs.anchorX;
      es.anchorY = vs.anchorY;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale * vs.scale;
      es.flipX = vs.flipX;
      es.flipY = vs.flipY;

      // call the particle function with normalized opts
      fn.call(this, view, opts, engine);
      if (engine._activeParticleObjects.length) {
        view[name + 'Engine'] = engine;
        // blend engine loop, repeats the effect
        if (opts.loop) {
          engine.animLoop.wait(opts.duration)
            .then(bind(this, function () {
              if (view[name + 'Engine'] === engine) {
                engine.stop(true);
                this._blendEngines.releaseView(engine);
                this[name](view, opts);
              }
            }));
        }
        return engine;
      } else {
        this._blendEngines.releaseView(engine);
        return null;
      }
    });
  };

});

// this class is a singleton instantiated on import
exports = new Effects();
