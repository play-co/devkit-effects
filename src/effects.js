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

  // updates particle and blend engines and removes finished engines
  var _tick = function (dt) {
    this._particleEngines.forEachActiveView(function (engine) {
      if (engine._activeParticles.length) {
        !engine.paused && engine.runTick(dt);
      } else {
        engine.removeFromSuperview();
        this._particleEngines.releaseView(engine);
      }
    }, this);
  };

  // normalizes opts passed in to effects with reasonable defaults
  var _applyDefaultOpts = function (opts) {
    opts = opts || {};
    opts.delay = opts.delay || 0;
    opts.duration = opts.duration || 1000;
    opts.scale = opts.scale || 1;
    opts.loop = opts.loop || false;
    opts.blend = opts.blend || false;
    opts.follow = opts.follow || false;
    opts.behind = opts.behind || false;
    return opts;
  };

  // wrapper for handling pause, resume, stop API
  var _applyState = function (view, name, state) {
    if (!view) {
      // apply state to all animation effects globally
      this._animations.forEach(function (anim) {
        anim[state]();
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
          anim[state]();
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
          anim[state]();
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

  // register a new animation effect
  this.registerAnimationEffect = function (name, fn) {
    this[name] = bind(this, function (view, opts) {
      // prep animations and ensure safe completion if already active
      var anim = animate(view, name);
      anim.stop = anim.clear;
      anim.interrupting = true;
      anim.commit();
      anim.interrupting = false;
      this._animations.push(anim);

      // call the animation function with normalized opts
      opts = _applyDefaultOpts(opts);
      fn(view, opts, anim);

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
      // prep engine and add as a sibling view to the subject view
      var engine = this._particleEngines.obtainView({});
      var parent = view.getSuperview() || GC.app;
      var vs = view.style;
      var es = engine.style;
      engine.paused = false;
      engine.subject = view;
      engine._group = name;
      parent.addSubview(engine);

      // the engine should be positioned and sized to match the subject view
      opts = _applyDefaultOpts(opts);
      opts.images = opts.images || defaultImages.get(name);
      es.x = vs.x || 0;
      es.y = vs.y || 0;
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = es.width / 2;
      es.anchorY = es.height / 2;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale;

      // call the particle function with normalized opts
      fn(view, opts, engine);

      return engine;
    });
  };

  // register a new composite (blending) effect
  this.registerCompositeEffect = function (name, fn) {
    this[name] = bind(this, function (view, opts) {
      // prep blend engine and add as a sibling view to the subject view
      var engine = this._blendEngines.obtainView({});
      var parent = view.getSuperview() || GC.app;
      var vs = view.style;
      var es = engine.style;
      engine.paused = false;
      engine.subject = view;
      engine._group = name;
      parent.addSubview(engine);

      // the engine should be positioned and sized to match the subject view
      opts = _applyDefaultOpts(opts);
      opts.images = opts.images || defaultImages.get(name);
      es.x = vs.x || 0;
      es.y = vs.y || 0;
      es.width = vs.width || 1;
      es.height = vs.height || 1;
      es.anchorX = es.width / 2;
      es.anchorY = es.height / 2;
      es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
      es.scale = opts.scale;

      // call the particle function with normalized opts
      fn(view, opts, engine);

      return engine;
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
    this.paused = false;
    this.subject = null;
    this._group = "";
  };

  this.pause = function () {
    this.paused = true;
  };

  this.resume = function () {
    this.paused = false;
  };

  this.stop = this.clear = function () {
    this.killAllParticles();
    this.subject = null;
    this._group = "";
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
    this.paused = false;
    this.subject = null;
    this._group = "";
  };

  this.pause = function () {
    this.paused = true;
  };

  this.resume = function () {
    this.paused = false;
  };

  this.stop = this.clear = function () {
    this.killAllParticles();
    this.subject = null;
    this._group = "";
  };

});



// this class is a singleton instantiated on import
exports = new Effects();
