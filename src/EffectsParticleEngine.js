import animate;
import ui.ParticleEngine as ParticleEngine;

exports = Class(ParticleEngine, function() {
  var supr = ParticleEngine.prototype;

  /**
    * wraps ParticleEngine to mimic animate's Animator API
    * @class  EffectsParticleEngine
    * @extends {ParticleEngine}
    * @arg {Object} [opts]
    */
  this.init = function (opts) {
    supr.init.call(this, opts);
    this.anim = animate(this);
    this.animLoop = animate(this, 'loop');

    /** @var {boolean} EffectsParticleEngine#paused */
    this.paused = false;
    /** @var {boolean} EffectsParticleEngine#follow */
    this.follow = false;
    /** @var {View} EffectsParticleEngine#subject */
    this.subject = null;
    this._group = "";
  };

  /**
   * pause all animations and  animation loops
   * @method EffectsParticleEngine#pause
   */
  this.pause = function () {
    this.anim.pause();
    this.animLoop.pause();
    this.paused = true;
  };

  /**
   * resume all animations and animation loops
   * @method EffectsParticleEngine#resume
   */
  this.resume = function () {
    this.anim.resume();
    this.animLoop.resume();
    this.paused = false;
  };

  /**
   * clear all animations, loops, remove all things from screen.
   * @method EffectsParticleEngine#clear
   */
  /**
   * @method EffectsParticleEngine#stop
   * @alias EffectsParticleEngine#clear
   */
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

  /**
   * commit animation and animation loop, then execute {@link EffectsParticleEngine#stop}
   * @method EffectsParticleEngine#commit
   */
  this.commit = function () {
    // only commit effects that follow their subject, since explosions linger
    if (this.follow) {
      this.anim.commit();
      this.animLoop.clear();
      this.stop();
    }
  };

  /**
   * @method EffectsParticleEngine#update
   * @param  {number} dt
   */
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