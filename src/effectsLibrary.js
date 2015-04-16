import animate;

import .defaultImages;

var PI = Math.PI;
var TAU = 2 * PI;
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

var DEFAULT_OPTS = {
  duration: {
    'disco': 2500
  },
  loop: {
    'hover': true,
    'spin': true,
    'squish': true,
    'sway': true,
    'disco': true,
    'sparkle': true
  },
  blend: {
    'explode': true
  },
  follow: {
    'radial': true,
    'sparkle': true
  },
  behind: {
    'radial': true
  }
};

exports = {

/* ~ ~ Animation Effects ~ ~ */

  animationEffects: {
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
    spin: function (view, opts, anim) {
      var ttl = opts.duration;
      var vs = view.style;
      var dr = TAU * opts.scale;

      anim.then({ r: vs.r + dr }, ttl, animate.linear);
    },
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

/* ~ ~ Particle Effects ~ ~ */

  particleEffects: {
    explode: function (view, opts, engine) {
      var count = 16;
      var data = engine.obtainParticleArray(count);
      var size = 50;
      var ttl = opts.duration;
      var stop = -1000 / ttl;
      var vs = view.style;
      var x = (vs.width - size) / 2;
      var y = (vs.height - size) / 2;
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
    }
  },

/* ~ ~ Composite Effects ~ ~ */

  compositeEffects: {
    disco: function (view, opts, engine) {
      // unique effect per view
      if (view.discoEngine) { return; }

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
          var newRow = row - ~~(rows / 2);
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
    radial: function (view, opts, engine) {
      // unique effect per view
      if (view.radialEngine) { return; }

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

/* ~ ~ Helper Functions ~ ~ */

  getDefaults: function (optName) {
    return DEFAULT_OPTS[optName];
  }
};
