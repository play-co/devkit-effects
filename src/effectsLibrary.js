import animate;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.ViewPool as ViewPool;

import .defaultImages;

// math helper constants and functions
var PI = Math.PI;
var TAU = 2 * PI;
var abs = Math.abs;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var pow = Math.pow;
var floor = Math.floor;
var random = Math.random;
var choose = function (a) { return a[floor(random() * a.length)]; };
var rollFloat = function (n, x) { return n + random() * (x - n); };
var rollInt = function (n, x) { return floor(n + random() * (1 + x - n)); };

// custom defaults per effect if different from primary effect defaults
var DEFAULT_OPTS = {
  duration: {
    'disco': 2500,
    'sparkle': 2000,
    'confetti': 2500,
    'firework': 750
  },
  loop: {
    'hover': true,
    'spin': true,
    'squish': true,
    'sway': true,
    'disco': true,
    'sparkle': true,
    'confetti': true
  },
  blend: {
    'explode': true,
    'sparkle': true
  },
  follow: {
    'radial': true,
    'sparkle': true,
    'disco': true
  },
  behind: {
    'radial': true
  }
};

// some effects need views for complex animations
var _viewPool = new ViewPool({ ctor: View });
var _imageViewPool = new ViewPool({ ctor: ImageView });

/**
 * Some classy default effects to jazz up your game
 * @namespace effectsLibrary
 */
exports = {

///////////////////////////////
// ~ ~ Animation Effects ~ ~ //
///////////////////////////////

  /** @var {Object} effectsLibrary.animationEffects */
  animationEffects: {
    /**
     * hover a view up and down
     * @memberof effectsLibrary
     * @method animationEffects.hover
     * @type {AnimationEffectCallback}
     */
    hover: function (view, opts, anim) {
      var ttl = opts.duration;
      var dt = ttl / 4;
      var dy = 6 * opts.scale;
      var vs = view.style;

      anim.then({ y: vs.y - dy }, dt, animate.easeOut)
        .then({ y: vs.y }, dt, animate.easeIn)
        .then({ y: vs.y + dy }, dt, animate.easeOut)
        .then({ y: vs.y }, dt, animate.easeIn);
    },
    /**
     * shake a view rapidly, great for screen shaking like earthquakes
     * @memberof effectsLibrary
     * @method animationEffects.shake
     * @type {AnimationEffectCallback}
     */
    shake: function (view, opts, anim) {
      var ttl = opts.duration;
      var dt = ttl / 16;
      var m = 1.75 * opts.scale;
      var vs = view.style;
      var x = vs.x;
      var y = vs.y;
      var s = vs.scale;
      var ax = vs.anchorX;
      var ay = vs.anchorY;
      vs.anchorX = vs.width / 2;
      vs.anchorY = vs.height / 2;
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

      anim.then({ scale: s * (1 + 0.05 * m) }, dt, animate.easeIn)
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
        .then({ x: x, y: y, anchorX: ax, anchorY: ay, scale: s }, dt, animate.easeIn);
    },
    /**
     * rotate a view
     * @memberof effectsLibrary
     * @method animationEffects.spin
     * @type {AnimationEffectCallback}
     */
    spin: function (view, opts, anim) {
      var ttl = opts.duration;
      var vs = view.style;
      var dr = TAU * opts.scale;

      anim.then({ r: vs.r + dr }, ttl, animate.linear);
    },
    /**
     * make a view squish like jelly
     * @memberof effectsLibrary
     * @method animationEffects.squish
     * @type {AnimationEffectCallback}
     */
    squish: function (view, opts, anim) {
      var ttl = opts.duration;
      var dt = ttl / 4;
      var vs = view.style;
      var dsx = vs.scaleX * ((1 + 0.1 * opts.scale) - 1);
      var dsy = vs.scaleY * ((1 + 0.1 * opts.scale) - 1);

      anim.then({ scaleX: vs.scaleX - dsx, scaleY: vs.scaleY + dsy }, dt, animate.easeOut)
        .then({ scaleX: vs.scaleX, scaleY: vs.scaleY }, dt, animate.easeIn)
        .then({ scaleX: vs.scaleX + dsx, scaleY: vs.scaleY - dsy }, dt, animate.easeOut)
        .then({ scaleX: vs.scaleX, scaleY: vs.scaleY }, dt, animate.easeIn);
    },
    /**
     * sway a view back and forth
     * @memberof effectsLibrary
     * @method animationEffects.sway
     * @type {AnimationEffectCallback}
     */
    sway: function (view, opts, anim) {
      var ttl = opts.duration;
      var dt = ttl / 4;
      var dx = 6 * opts.scale;
      var vs = view.style;

      anim.then({ x: vs.x - dx }, dt, animate.easeOut)
        .then({ x: vs.x }, dt, animate.easeIn)
        .then({ x: vs.x + dx }, dt, animate.easeOut)
        .then({ x: vs.x }, dt, animate.easeIn);
    }
  },

//////////////////////////////
// ~ ~ Particle Effects ~ ~ //
//////////////////////////////

  /** @var {Object} effectsLibrary.particleEffects */
  particleEffects: {
    /**
     * basic fiery explosion, default images
     * @memberof effectsLibrary
     * @method particleEffects.explode
     * @type {ParticleEffectCallback}
     */
    explode: function (view, opts, engine) {
      var count = 16;
      var data = engine.obtainParticleArray(count);
      var size = 50 * opts.scale;
      var ttl = opts.duration;
      var stop = -1000 / ttl;
      var vs = view.style;
      var x = (vs.width - size) / 2;
      var y = (vs.height - size) / 2;
      var speed = opts.speed || 1;
      for (var i = 0; i < count; i++) {
        var p = data[i];
        p.polar = true;
        p.x = p.ox = x + rollFloat(-5, 5);
        p.y = p.oy = y + rollFloat(-5, 5);
        p.radius = rollFloat(-5, 5);
        p.dradius = rollFloat(0, 400) * speed;
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
    },
    /**
     * basic sparkly effect, default images
     * @memberof effectsLibrary
     * @method particleEffects.sparkle
     * @type {ParticleEffectCallback}
     */
    sparkle: function (view, opts, engine) {
      // unique effect per view
      // TODO: move to opts.unique, and handle stop(true) call automatically
      if (view.sparkleEngine) {
        view.sparkleEngine.stop(true);
      }

      var vs = view.style;
      var count = rollInt(1, 2);
      var data = engine.obtainParticleArray(count);
      for (var i = 0; i < count; i++) {
        var p = data[i];
        var x = vs.width * rollFloat(0.25, 0.75);
        var y = vs.height * rollFloat(0.25, 0.75);
        var width = rollInt(25, 100);
        var height = width;
        var ttl = opts.duration;
        var stop = -1000 / ttl;
        p.image = choose(opts.images);
        p.x = x - width / 2;
        p.y = y - height / 2;
        p.r = rollFloat(0, TAU);
        p.dr = rollFloat(-16, 16);
        p.ddr = stop * p.dr;
        p.anchorX = width / 2;
        p.anchorY = height / 2;
        p.width = width;
        p.height = height;
        p.scale = 0;
        p.dscale = 4 * -stop;
        p.ddscale = 3 * stop * p.dscale;
        p.delay = i * 0.25 * ttl;
        p.ttl = ttl - p.delay;
        p.opacity = opts.blend ? 0.85 : 1;
        p.compositeOperation = opts.blend ? "lighter" : "";
      }
      engine.emitParticles(data);
    },
    /**
     * confetti rain, default images
     * @memberof effectsLibrary
     * @method particleEffects.confetti
     * @type {ParticleEffectCallback}
     */
    confetti: function (view, opts, engine) {
      // unique effect per view
      if (view.confettiEngine) {
        view.confettiEngine.stop(true);
      }

      // this is a self-looping effect, and must be stopped manually or by duration
      opts.loop = false;

      var vs = view.style;
      var ttl = opts.duration / 2;
      var last = Date.now();
      var elapsed = 0;
      var onTick = function () {
        var now = Date.now();
        var dt = min(now - last, 100);
        elapsed += dt;
        last = now;

        // chance to add new confetti particle
        if ((!dt || random() < 0.25) && elapsed <= ttl) {
          var views = [];
          var data = engine.obtainParticleArray(1);
          var p = data[0];
          var width = rollFloat(8, 20);
          var height = rollFloat(8, 20);
          var cView = _viewPool.obtainView({
            superview: engine,
            x: 0,
            y: 0,
            anchorX: width / 2,
            anchorY: height / 2,
            width: width,
            height: height,
            opacity: 1,
            scale: 1,
            scaleX: 1,
            scaleY: 1
          });
          cView._spin = rollFloat(0, TAU);
          cView._spinMod = rollFloat(250, 750) * (random() < 0.5 ? 1 : -1);
          cView._rotMod = rollFloat(250, 750) * (random() < 0.5 ? 1 : -1);
          cView._imgView = _imageViewPool.obtainView({
            superview: cView,
            x: 0,
            y: 0,
            r: rollFloat(0, TAU),
            anchorX: width / 2,
            anchorY: height / 2,
            width: width,
            height: height,
            opacity: 1,
            scale: 1,
            scaleX: 1,
            scaleY: 1
          });
          cView._imgView.setImage(choose(opts.images));

          // particle props
          cView.style.x = p.x = (opts.follow ? 0 : vs.x - engine.style.x) + rollFloat(0, vs.width) - width / 2;
          cView.style.y = p.y = (opts.follow ? 0 : vs.y - engine.style.y) + rollFloat(0, vs.height) - height / 2;
          p.dy = 100;
          p.ttl = ttl;
          p.onDeath = function () {
            cView._imgView.removeFromSuperview();
            _imageViewPool.releaseView(cView._imgView)
            delete cView._imgView;
            cView.removeFromSuperview();
            _viewPool.releaseView(cView);
          };

          engine.addExternalParticles([cView], data);
        }

        // update confettis each tick
        engine.forEachActiveParticle(function (particle) {
          var pData = particle.pData;
          if (pData.elapsed >= 0.75 * ttl) {
            particle.style.opacity = (ttl - pData.elapsed) / (0.25 * ttl);
          }
          particle._spin += dt / particle._spinMod;
          particle.style.scaleY = abs(cos(particle._spin));
          if (random() < 0.5) {
            particle.style.r += dt / particle._rotMod;
          } else {
            particle._imgView.style.r += dt / particle._rotMod;
          }
        }, this);

        // set up next tick
        engine.animLoop.wait(16).then(onTick);
      };

      // start the loop
      onTick();
    },
    /**
     * a single firework explosion, default images
     * @memberof effectsLibrary
     * @method particleEffects.firework
     * @type {ParticleEffectCallback}
     */
    firework: function (view, opts, engine) {
      var vs = view.style;
      var count = 32;
      var ring = 14;
      var data = engine.obtainParticleArray(count);
      var ttl = opts.duration;
      var stop = -1000 / ttl;
      var size = 40 * opts.scale;
      var growth = 350 * opts.scale;
      var fall = rollFloat(150, 300);
      var img = choose(opts.images);
      for (var i = 0; i < count; i++) {
        var p = data[i];
        if (i < count - 1) {
          p.image = img;
          p.polar = true;
          p.x = p.ox = (vs.width - size) / 2;
          p.y = p.oy = (vs.height - size) / 2 - 10;
          p.dr = rollFloat(-30, 30);
          p.ddy = fall;
          p.theta = i < ring ? TAU * (i + 1) / ring : rollFloat(0, TAU);
          p.radius = 0;
          p.dradius = i < ring ? growth : rollFloat(0.1, 1) * growth;
          p.ddradius = stop * p.dradius;
          p.anchorX = size / 2;
          p.anchorY = size / 2;
          p.width = size;
          p.height = size;
          p.scale = 0.75;
          p.dscale = 1 - p.dradius / growth;
          p.ddscale = 2.5 * stop;
          p.ttl = ttl;
          p.compositeOperation = opts.blend ? "lighter" : "";
        } else {
          p.image = img;
          p.polar = true;
          p.x = p.ox = (vs.width - size) / 2;
          p.y = p.oy = (vs.height - size) / 2 - 10;
          p.r = rollFloat(0, TAU);
          p.ddy = fall;
          p.theta = 0;
          p.radius = 0;
          p.anchorX = size / 2;
          p.anchorY = size / 2;
          p.width = size;
          p.height = size;
          p.dscale = 25;
          p.ddscale = 2.3 * stop * p.dscale;
          p.opacity = 0.75;
          p.dopacity = 1.25 * stop;
          p.ttl = ttl / 2;
          p.compositeOperation = "lighter";
        }
      }
      engine.emitParticles(data);
    }
  },

///////////////////////////////
// ~ ~ Composite Effects ~ ~ //
///////////////////////////////

  /** @var {Object} effectsLibrary.compositeEffects */
  compositeEffects: {
    /**
     * disco-mode, default images
     * @memberof effectsLibrary
     * @method compositeEffects.disco
     * @type {CompositeEffectCallback}
     */
    disco: function (view, opts, engine) {
      // unique effect per view
      if (view.discoEngine) {
        view.discoEngine.stop(true);
      }

      var vs = view.style;
      var ttl = opts.duration;
      var stop = -1000 / ttl;
      var hasImage = !!view.getImage;

      // light count and organization
      var rows = 7;
      var cols = rows;
      var minPerRow = 6;
      var growthPerRow = 2;
      var count = 3;
      for (var r = 0; r < rows; r++) {
        if (r < rows / 2) {
          count += minPerRow + r * growthPerRow;
        } else {
          count += minPerRow + (rows - 1 - r) * growthPerRow;
        }
      }

      var data = engine.obtainParticleArray(count);

      // fade the engine in and out
      engine.style.compositeOperation = hasImage ? "" : "lighter";
      engine.style.opacity = 0;
      engine.anim.now({ opacity: 1 }, ttl / 4, animate.easeOut)
        .wait(ttl / 2)
        .then({ opacity: 0 }, ttl / 4, animate.easeIn);

      // render the base image to canvas
      if (hasImage) {
        var base = data[count - 1];
        base.x = 0;
        base.y = 0;
        base.width = vs.width;
        base.height = vs.height;
        base.compositeOperation = "source-over";
        base.ttl = ttl;
        base.image = view.getImage()._originalURL;
      }

      // darken the base image, disco in the dark
      var darker = data[count - 2];
      darker.x = 0;
      darker.y = 0;
      darker.width = vs.width;
      darker.height = vs.height;
      darker.compositeOperation = "source-over";
      darker.opacity = 0.5;
      darker.ttl = ttl;
      darker.image = defaultImages.getImage("disco/darker");

      // shine the lights!
      var row = 0;
      var col = 0;
      var lightsPerRow = minPerRow;
      var lights = defaultImages.get("disco/light");
      var size = vs.width / 10;
      for (var i = count - 3; i > 0; i--) {
        if (col >= lightsPerRow) {
          col = 0;
          row++;
          if (row < rows / 2) {
            lightsPerRow += growthPerRow;
          } else {
            lightsPerRow -= growthPerRow;
          }
        }

        var light = data[i];
        if (row < rows / 2) {
          light.x = col * (vs.width / cols) - size / 2;
          light.y = 2 * row * (vs.height / rows) - col * (vs.height / cols) - size / 2;
        } else {
          var newRow = row - floor(rows / 2);
          light.x = (2 * newRow - 1) * (vs.width / rows) + col * (vs.width / cols) - size / 2;
          light.y = vs.height - col * (vs.height / cols) - size / 2;
        }

        light.x += vs.width / 4;
        light.y -= vs.height / 4;
        light.dx = -vs.width * -stop;
        light.dy = vs.height * -stop;
        light.anchorX = size / 2;
        light.anchorY = size / 2;
        light.width = size;
        light.height = size;
        light.scale = 0;
        light.dscale = -3 * stop;
        light.ddscale = 2 * stop * light.dscale;
        light.opacity = 0.5;
        light.compositeOperation = "lighter";
        light.delay = ttl * (row / rows) * (col / cols);
        light.ttl = ttl - light.delay;
        light.image = choose(lights);

        col++;
      }

      // clip the disco effect to match the shape
      if (hasImage) {
        var clip = data[0];
        clip.x = 0;
        clip.y = 0;
        clip.width = vs.width;
        clip.height = vs.height;
        clip.compositeOperation = "destination-atop";
        clip.ttl = ttl;
        clip.image = view.getImage()._originalURL;
      }

      engine.emitParticles(data);
    },
    /**
     * awe-inspiring radials, default images
     * @memberof effectsLibrary
     * @method compositeEffects.radial
     * @type {CompositeEffectCallback}
     */
    radial: function (view, opts, engine) {
      // unique effect per view
      if (view.radialEngine) {
        view.radialEngine.stop(true);
      }

      var vs = view.style;
      var count = opts.images.length;
      var width = vs.width;
      var height = width;
      var data = engine.obtainParticleArray(count);
      for (var i = 0; i < count; i++) {
        var p = data[i];
        p.image = opts.images[i];
        p.x = (vs.width - width) / 2;
        p.y = (vs.height - height) / 2;
        p.r = TAU * random();
        p.dr = 0.32 * pow(0.67, i);
        p.anchorX = width / 2;
        p.anchorY = height / 2;
        p.width = width;
        p.height = height;
        p.scale = 4 * opts.scale;
        p.ttl = Infinity;
        p.compositeOperation = 'lighter';
      }
      engine.emitParticles(data);
    }
  },

//////////////////////////////
/* ~ ~ Helper Functions ~ ~ */
//////////////////////////////

  getDefaults: function (optName) {
    return DEFAULT_OPTS[optName];
  }
};
