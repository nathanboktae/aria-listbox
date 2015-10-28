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

    function select(child) {
      if (el.getAttribute('aria-multiselect') !== 'true') {
        Array.prototype.forEach.call(el.querySelectorAll('[aria-selected="true"]'), function(n) {
          n.removeAttribute('aria-selected')
        })
      } else if (child.getAttribute('aria-selected') === 'true') {
        child.removeAttribute('tabindex')
        child.removeAttribute('aria-selected')
        return
      }
      Array.prototype.forEach.call(el.querySelectorAll('[tabindex]'), function(n) {
        n.removeAttribute('tabindex')
      })
      child.setAttribute('aria-selected', 'true')
      child.setAttribute('tabindex', '0')
    }

    el.addEventListener('click', function(e) {
      var optionEl = e.target
      while (optionEl && optionEl.getAttribute('role') !== 'option') {
        optionEl = optionEl.parentElement
      }

      if (optionEl) {
        select(optionEl)
      }
    })
  }

})