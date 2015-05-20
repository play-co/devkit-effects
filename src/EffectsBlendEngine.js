import animate;
import ui.BlendEngine as BlendEngine;

exports = Class(BlendEngine, function() {
  var supr = BlendEngine.prototype;

  /**
    * wraps BlendEngine to mimic animate's Animator API
    * @class EffectsBlendEngine
    * @extends {BlendEngine}
    * @arg {Object} [opts]
    */
  this.init = function (opts) {
    supr.init.call(this, opts);
    this.anim = animate(this);
    this.animLoop = animate(this, 'loop');

    /** @var {boolean} EffectsBlendEngine#paused */
    this.paused = false;
    /** @var {boolean} EffectsBlendEngine#follow */
    this.follow = false;
    /** @var {View} EffectsBlendEngine#subject */
    this.subject = null;
    this._group = "";
  };

  /**
   * pause all animations and  animation loops
   * @method EffectsBlendEngine#pause
   */
  this.pause = function () {
    this.anim.pause();
    this.animLoop.pause();
    this.paused = true;
  };

  /**
   * resume all animations and animation loops
   * @method EffectsBlendEngine#resume
   */
  this.resume = function () {
    this.anim.resume();
    this.animLoop.resume();
    this.paused = false;
  };

  /**
   * clear all animations, loops, remove all things from screen.
   * @method EffectsBlendEngine#clear
   */
  /**
   * @method EffectsBlendEngine#stop
   * @alias EffectsBlendEngine#clear
   */
  this.stop = this.clear = function (force) {
    // always stop loops
    this.animLoop.clear();

    if (this.subject && (this.follow || force)) {
      this.anim.clear();
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

  /**
   * commit animation and animation loop, then execute {@link EffectsBlendEngine#stop}
   * @method EffectsBlendEngine#commit
   */
  this.commit = function (force) {
    // always stop loops
    this.animLoop.clear();

    // only commit effects that follow their subject, since explosions linger
    if (this.follow || force) {
      this.anim.commit();
      this.stop(force);
    }
  };

  /**
   * @method EffectsBlendEngine#update
   * @param  {number} dt
   */
  this.update = function (dt) {
    !this.paused && this.runTick(dt);

    if (this.follow) {
      var es = this.style;
      var ss = this.subject.style;

      es.x = ss.x;
      es.y = ss.y;
      es.offsetX = ss.offsetX;
      es.offsetY = ss.offsetY;
      es.visible = ss.visible;

      var parent = this.subject.getSuperview();
      if (this.getSuperview() !== parent) {
        parent.addSubview(this);
      }
    }
  };

});