import animate;
import ui.ViewPool as ViewPool;
import ui.ParticleEngine as ParticleEngine;

import .defaultImages;

var PI = Math.PI;
var TAU = 2 * PI;
var sin = Math.sin;
var cos = Math.cos;
var floor = Math.floor;
var random = Math.random;
var choose = function (a) { return a[floor(random() * a.length)]; };
var rollFloat = function (n, x) { return n + random() * (x - n); };
var rollInt = function (n, x) { return floor(n + random() * (1 + x - n)); };

/*
    Effects Class
*/

var Effects = Class(function () {

/* ~ ~ Private API ~ ~ */

  this.init = function () {
    this._anims = [];
    this._engines = new ViewPool({ ctor: ParticleEngine });
    GC.app.engine.subscribe('Tick', bind(this, _tick));
  };

  var _tick = function (dt) {
    this._engines.forEachActiveView(function (engine) {
      if (engine._activeParticles.length) {
        !engine.paused && engine.runTick(dt);
      } else {
        this._engines.releaseView(engine);
      }
    }, this);
  };

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

  var _addAnimation = function (view, opts, fn) {
    opts = _applyDefaultOpts(opts);
    var anim = fn(view, opts);
    anim.stop = anim.clear;
    anim.then(bind(this, function () {
      this._anims.splice(this._anims.indexOf(anim), 1);
      if (opts.loop) {
        _addAnimation.call(this, view, opts, fn);
      }
    }));
    this._anims.push(anim);
    return anim;
  };

  var _addParticles = function (view, opts, fn) {
    opts = _applyDefaultOpts(opts);
    opts.images = opts.images || defaultImages.get(opts.group);
    var engine = this._engines.obtainView();
    var vs = view.style;
    var es = engine.style;
    es.x = vs.x || 0;
    es.y = vs.y || 0;
    es.width = vs.width || 1;
    es.height = vs.height || 1;
    es.anchorX = es.width / 2;
    es.anchorY = es.height / 2;
    es.zIndex = opts.behind ? vs.zIndex - 1 : vs.zIndex + 1;
    es.scale = opts.scale;
    engine.paused = false;
    engine.subject = view;
    engine._group = opts.group;
    fn(view, opts, engine);
    return engine;
  };

  var _applyState = function (view, group, state) {
    if (!view) {
      // apply state to all effects animations globally
      this._anims.forEach(function (anim) {
        anim[state]();
      }, this);
      // apply state to all effects particles globally
      this._engines.forEachActiveView(function (engine) {
        engine[state]();
      }, this);
    } else if (!group) {
      // apply state to all animations for a specific view
      this._anims.forEach(function (anim) {
        if (anim.subject === view) {
          anim[state]();
        }
      }, this);
      // apply state to all particles for a specific view
      this._engines.forEachActiveView(function (engine) {
        if (engine.subject === view) {
          engine[state]();
        }
      }, this);
    } else {
      // apply state to all animations for a specific view and specific group
      this._anims.forEach(function (anim) {
        if (anim.subject === view && anim._group === group) {
          anim[state]();
        }
      }, this);
      // apply state to all particles for a specific view and specific group
      this._engines.forEachActiveView(function (engine) {
        if (engine.subject === view && engine._group === group) {
          engine[state]();
        }
      }, this);
    }
  };

/* ~ ~ Public API ~ ~ */

  this.pause = function (view, group) {
    _applyState.call(this, view, group, 'pause');
  };

  this.resume = function (view, group) {
    _applyState.call(this, view, group, 'resume');
  };

  this.stop = function (view, group) {
    _applyState.call(this, view, group, 'stop');
  };

  this.explode = function (view, opts) {
    opts.group = 'explode';
    return _addParticles.call(this, view, opts, function (view, opts, engine) {
      var count = 16;
      var data = engine.obtainParticleArray(count);
      var size = 50;
      var ttl = opts.duration;
      var stop = -1000 / ttl;
      var vs = view.style;
      var x = vs.x + (vs.width - size) / 2;
      var y = vs.y + (vs.height - size) / 2;
      for (var i = 0; i < count; i++) {
        var p = data[i];
        p.polar = true;
        p.ox = x + rollFloat(-5, 5);
        p.oy = y + rollFloat(-5, 5);
        p.radius = rollFloat(-5, 5);
        p.dradius = rollFloat(0, 400);
        p.ddradius = stop * p.dradius;
        p.theta = TAU * random();
        p.r = TAU * random();
        p.dr = rollFloat(-4, 4);
        p.ddr = stop * p.dr;
        p.anchorX = size / 2;
        p.anchorY = size / 2;
        p.width = size;
        p.height = size;
        p.scale = rollFloat(0.25, 2.5);
        p.dscale = stop * p.scale;
        p.ttl = ttl;
        p.image = choose(opts.images);
        p.compositeOperation = opts.blend ? "lighter" : "";
      }
      engine.emitParticles(data);
    });
  };

  this.shake = function (view, opts) {
    return _addAnimation.call(this, view, opts, function (view, opts) {
      var ttl = opts.duration;
      var dt = ttl / 16;
      var m = 1.75 * opts.scale;
      var x = view.style.x;
      var y = view.style.y;
      var s = view.style.scale;
      var r1 = TAU * random();
      var r2 = TAU * random();
      var r3 = TAU * random();
      var r4 = TAU * random();
      var r5 = TAU * random();
      var r6 = TAU * random();
      var r7 = TAU * random();
      var r8 = TAU * random();
      var r9 = TAU * random();
      var r10 = TAU * random();
      var r11 = TAU * random();
      var r12 = TAU * random();
      var r13 = TAU * random();
      var r14 = TAU * random();

      return animate(view, 'shake')
        .then({ scale: s * (1 + 0.05 * m) }, dt, animate.easeIn)
        .then({ x: x + 14 * m * cos(r1), y: y + 14 * m * sin(r1), scale: s * (1 + 0.046 * m) }, dt, animate.easeOut)
        .then({ x: x + 13 * m * cos(r2), y: y + 13 * m * sin(r2), scale: s * (1 + 0.042 * m) }, dt, animate.easeInOut)
        .then({ x: x + 12 * m * cos(r3), y: y + 12 * m * sin(r3), scale: s * (1 + 0.038 * m) }, dt, animate.easeInOut)
        .then({ x: x + 11 * m * cos(r4), y: y + 11 * m * sin(r4), scale: s * (1 + 0.034 * m) }, dt, animate.easeInOut)
        .then({ x: x + 10 * m * cos(r5), y: y + 10 * m * sin(r5), scale: s * (1 + 0.030 * m) }, dt, animate.easeInOut)
        .then({ x: x + 9 * m * cos(r6), y: y + 9 * m * sin(r6), scale: s * (1 + 0.026 * m) }, dt, animate.easeInOut)
        .then({ x: x + 8 * m * cos(r7), y: y + 8 * m * sin(r7), scale: s * (1 + 0.022 * m) }, dt, animate.easeInOut)
        .then({ x: x + 7 * m * cos(r8), y: y + 7 * m * sin(r8), scale: s * (1 + 0.018 * m) }, dt, animate.easeInOut)
        .then({ x: x + 6 * m * cos(r9), y: y + 6 * m * sin(r9), scale: s * (1 + 0.014 * m) }, dt, animate.easeInOut)
        .then({ x: x + 5 * m * cos(r10), y: y + 5 * m * sin(r10), scale: s * (1 + 0.010 * m) }, dt, animate.easeInOut)
        .then({ x: x + 4 * m * cos(r11), y: y + 4 * m * sin(r11), scale: s * (1 + 0.008 * m) }, dt, animate.easeInOut)
        .then({ x: x + 3 * m * cos(r12), y: y + 3 * m * sin(r12), scale: s * (1 + 0.006 * m) }, dt, animate.easeInOut)
        .then({ x: x + 2 * m * cos(r13), y: y + 2 * m * sin(r13), scale: s * (1 + 0.004 * m) }, dt, animate.easeInOut)
        .then({ x: x + 1 * m * cos(r14), y: y + 1 * m * sin(r14), scale: s * (1 + 0.002 * m) }, dt, animate.easeInOut)
        .then({ x: x, y: y, scale: s }, dt, animate.easeIn);
    });
  };

});

/*
    EffectsParticleEngine
    ~ wraps ParticleEngine to mimic animate's Animator API
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

exports = new Effects();
