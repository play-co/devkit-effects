import animate;

var PI = Math.PI;
var TAU = 2 * PI;
var min = Math.min;
var max = Math.max;
var sin = Math.sin;
var cos = Math.cos;
var floor = Math.floor;
var random = Math.random;
var choose = function (a) { return a[floor(random() * a.length)]; };
var rollFloat = function (n, x) { return n + random() * (x - n); };
var rollInt = function (n, x) { return floor(n + random() * (1 + x - n)); };

exports = {

/* ~ ~ Animation Effects ~ ~ */

  animationEffects: {
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
      var vs = view.style;
      var ttl = opts.duration;
      var count = max(2, 20 * ~~(ttl / 1000));
      var data = engine.obtainParticleArray(count);
      var darker = data[count - 1];
      darker.width = vs.width;
      darker.height = vs.height;
      darker.compositeOperation = "source-over";
      darker.opacity = 0.75;
      darker.ttl = ttl;
      darker.image = opts.images[0];
      for (var i = count - 2; i >= 0; i--) {
        var light = data[0];
        light.width = vs.width / 10;
        light.height = light.width;
        light.compositeOperation = "lighter";
        light.ttl = ttl;
        light.image = choose(opts.images);
      }
      engine.emitParticles(data);
    }
  }
};
