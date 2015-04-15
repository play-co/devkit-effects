import ui.resource.loader as loader;
var _imageMap = loader.getMap();

var DEFAULT_PATH = "addons/devkit-effects/images/";
var PROJECT_PATH = "resources/images/";

var DefaultImages = Class(function () {

  this.init = function () {
    this._effectsImages = [];
    this._projectImages = [];

    for (var url in _imageMap) {
      if (url.indexOf(DEFAULT_PATH) >= 0) {
        this._effectsImages.push(url);
      } else if (url.indexOf(PROJECT_PATH) >= 0) {
        this._projectImages.push(url);
      }
    }
  };

  this.get = function (group) {
    var available = [];
    var testURL = '/' + group;

    for (var i = 0; i < this._projectImages.length; i++) {
      var url = this._projectImages[i];
      if (url.indexOf(testURL) >= 0) {
        available.push(url);
      }
    }

    if (!available.length) {
      for (var i = 0; i < this._effectsImages.length; i++) {
        var url = this._effectsImages[i];
        if (url.indexOf(testURL) >= 0) {
          available.push(url);
        }
      }
    }

    return available;
  };

  this.getImage = function (testURL) {
    var img = "";

    for (var i = 0; i < this._projectImages.length; i++) {
      var url = this._projectImages[i];
      if (url.indexOf(testURL) >= 0) {
        img = url;
      }
    }

    if (!img) {
      for (var i = 0; i < this._effectsImages.length; i++) {
        var url = this._effectsImages[i];
        if (url.indexOf(testURL) >= 0) {
          img = url;
        }
      }
    }

    return img;
  };

});

exports = new DefaultImages();
