(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory
  } else {
    window.AriaListbox = factory()
  }
})(function() {

  return function AriaListbox() {}

})