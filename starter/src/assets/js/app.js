/*
 * js-plugin-cli v1.0.0
 * (c) 2020 Feng L.H.
 * Released under the MIT License.
 */
;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Default = factory());
}(this, function () { 'use strict';
  var Default = {};

  Default.version = '0.1.0';

  var Settings = {
    num: 5,
  };

  // Configure
  Default.configure = function (options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)){
        Settings[key] = value;
      }
    }
    return this;
  };

  // Example
  Default.example = function () {
    console.log('You have ' + Settings.num + ' examples');
  };


  // Global query selector
  // var $ = function (selector) {
  //   return document.querySelector(selector);
  // };

  if (typeof window !== 'undefined') {
    window.Default = Default;
  }

  return Default;
}));
