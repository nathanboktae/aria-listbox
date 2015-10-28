(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory
  } else {
    window.AriaListbox = factory()
  }
})(function() {

  return function AriaListbox(el) {
    if (!(el instanceof HTMLElement)) {
      throw new Error('The listbox container element must be the first parameter to AriaListbox')
    }

    el.setAttribute('role', 'aria-listbox')

    var firstSelected = el.querySelector('[aria-selected="true"]')
    if (firstSelected) {
      firstSelected.setAttribute('tabindex', '0')
    } else {
      var options = el.querySelectorAll('[role="option"]')
      if (options.length) {
        options[0].setAttribute('tabindex', '0')
      }
    }
  }

})