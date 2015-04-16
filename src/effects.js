import animate;
import ui.ViewPool as ViewPool;
import ui.ParticleEngine as ParticleEngine;
import ui.BlendEngine as BlendEngine;

import .defaultImages;
import .effectsLibrary;



/**
  *  Effects Manager Class
  *  ~ individual effects are added automatically from effectsLibrary
  *  ~ effects can also be added manually via register functions
  */

var Effects = Class(function () {

/* ~ ~ Private API ~ ~ */

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

  // updates particle and blend engines and removes finished engines
  var _tick = function (dt) {
    // update particle engines
    this._particleEngines.forEachActiveView(function (engine) {
      if (engine._activeParticles.length) {
        engine.update(dt);
      } else {
        engine.stop();
        this._particleEngines.releaseView(engine);
      }
    }, this);

    // update blend engines
    this._blendEngines.forEachActiveView(function (engine) {
      if (engine._activeParticleObjects.length) {
        engine.update(dt);
      } else {
        engine.stop();
        this._blendEngines.releaseView(engine);
      }
    }, this);
  };

  // normalizes opts passed in to effects with reasonable defaults
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

  // wrapper for handling pause, resume, stop API
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
        engine[state]();
      }, this);
      // apply state to all composite effects globally
      this._blendEngines.forEachActiveView(function (engine) {
        engine[state]();
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
          engine[state]();
        }
      }, this);
      // apply state to all composite effects for a specific view
      this._blendEngines.forEachActiveView(function (engine) {
        if (engine.subject === view) {
          engine[state]();
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
          engine[state]();
        }
      }, this);
      // apply state to all composite effects for a specific view and specific effect name
      this._blendEngines.forEachActiveView(function (engine) {
        if (engine.subject === view && engine._group === name) {
          engine[state]();
        }
      }, this);
    }
  };

/* ~ ~ Public API ~ ~ */

  // pause all, a group, or a single effect
  this.pause = function (view, name) {
    _applyState.call(this, view, name, 'pause');
  };

  // resume all, a group, or a single effect
  this.resume = function (view, name) {
    _applyState.call(this, view, name, 'resume');
  };

  // stop all, a group, or a single effect
  this.stop = function (view, name) {
    _applyState.call(this, view, name, 'stop');
  };

  // commit all, a group, or a single effect
  this.commit = function (view, name) {
    _applyState.call(this, view, name, 'commit');
  };

  // register a new animation effect
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

  // register a new particle effect
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
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = vs.anchorX;
      es.anchorY = vs.anchorY;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale * vs.scale;

      // call the particle function with normalized opts
      fn.call(this, view, opts, engine);
      if (engine._activeParticles.length) {
        view[name + 'Engine'] = engine;
        // particle engine loop, repeats the effect
        if (opts.loop) {
          engine.animLoop.wait(opts.duration)
            .then(bind(this, function () {
              if (view[name + 'Engine'] === engine) {
                engine.stop();
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

  // register a new composite (blending) effect
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
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = vs.anchorX;
      es.anchorY = vs.anchorY;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale * vs.scale;

      // call the particle function with normalized opts
      fn.call(this, view, opts, engine);
      if (engine._activeParticleObjects.length) {
        view[name + 'Engine'] = engine;
        // blend engine loop, repeats the effect
        if (opts.loop) {
          engine.animLoop.wait(opts.duration)
            .then(bind(this, function () {
              if (view[name + 'Engine'] === engine) {
                engine.stop();
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



/**
  *  EffectsParticleEngine
  *  ~ wraps ParticleEngine to mimic animate's Animator API
  */

var EffectsParticleEngine = Class(ParticleEngine, function() {
  var supr = ParticleEngine.prototype;

  this.init = function (opts) {
    supr.init.call(this, opts);
    this.anim = animate(this);
    this.animLoop = animate(this, 'loop');
    this.paused = false;
    this.follow = false;
    this.subject = null;
    this._group = "";
  };

  this.pause = function () {
    this.anim.pause();
    this.animLoop.pause();
    this.paused = true;
  };

  this.resume = function () {
    this.anim.resume();
    this.animLoop.resume();
    this.paused = false;
  };

  this.stop = this.clear = function () {
    if (this.subject) {
      this.anim.clear();
      this.animLoop.clear();
      this.killAllParticles();
      this.paused = false;
      this.follow = false;
      this.removeFromSuperview();
      this.subject[this._group + 'Engine'] = null;
      this.subject = null;
      this._group = "";
    }
  };

  this.commit = function () {
    this.anim.commit();
    this.animLoop.clear();
    this.stop();
  };

  this.update = function (dt) {
    !this.paused && this.runTick(dt);

    if (this.follow) {
      this.style.x = this.subject.style.x;
      this.style.y = this.subject.style.y;
      this.style.visible = this.subject.style.visible;

      var parent = this.subject.getSuperview();
      if (this.getSuperview() !== parent) {
        parent.addSubview(this);
      }
    }
  };

});



/**
  *  EffectsBlendEngine
  *  ~ wraps BlendEngine to mimic animate's Animator API
  */

var EffectsBlendEngine = Class(BlendEngine, function() {
  var supr = BlendEngine.prototype;

  this.init = function (opts) {
    supr.init.call(this, opts);
    this.anim = animate(this);
    this.animLoop = animate(this, 'loop');
    this.paused = false;
    this.follow = false;
    this.subject = null;
    this._group = "";
  };

  this.pause = function () {
    this.anim.pause();
    this.animLoop.pause();
    this.paused = true;
  };

  this.resume = function () {
    this.anim.resume();
    this.animLoop.resume();
    this.paused = false;
  };

  this.stop = this.clear = function () {
    if (this.subject) {
      this.anim.clear();
      this.animLoop.clear();
      this.killAllParticles();
      this.paused = false;
      this.follow = false;
      this.style.opacity = 1;
      this.style.compositeOperation = "";
      this.removeFromSuperview();
      this.subject[this._group + 'Engine'] = null;
      this.subject = null;
      this._group = "";
    }
  };

  this.commit = function () {
    this.anim.commit();
    this.animLoop.clear();
    this.stop();
  };

  this.update = function (dt) {
    !this.paused && this.runTick(dt);

    if (this.follow) {
      this.style.x = this.subject.style.x;
      this.style.y = this.subject.style.y;
      this.style.visible = this.subject.style.visible;

      var parent = this.subject.getSuperview();
      if (this.getSuperview() !== parent) {
        parent.addSubview(this);
      }
    }
  };

});



// this class is a singleton instantiated on import
exports = new Effects();
