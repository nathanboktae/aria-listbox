(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory)
  } else if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory
  } else {
    window.AriaListbox = factory()
  }
})(function() {

  return function AriaListbox(el, opts) {
    if (!(el instanceof HTMLElement)) {
      throw new Error('The listbox container element must be the first parameter to AriaListbox')
    }

    function normalizeKeyOptions(keys, defaults) {
      if (!Array.isArray(keys)) {
        keys = keys ? [keys] : defaults
      }
      return keys.map(function(k) {
        return typeof k === 'string' && !Number(k) ? k.charCodeAt(0) : Number(k)
      })
    }

    el.setAttribute('role', 'aria-listbox')
    opts = opts || {}
    opts.prevKeys = normalizeKeyOptions(opts.prevKeys, [38])
    opts.nextKeys = normalizeKeyOptions(opts.nextKeys, [40])
    opts.selectKeys = normalizeKeyOptions(opts.selectKeys, [13, 32])

    var firstSelected = el.querySelector('[aria-selected="true"]')
    if (firstSelected) {
      firstSelected.setAttribute('tabindex', '0')
    } else {
      var options = el.querySelectorAll('[role="option"]')
      if (options.length) {
        options[0].setAttribute('tabindex', '0')
      }
    }

    function clearTabIndexes() {
      Array.prototype.forEach.call(el.querySelectorAll('[tabindex]'), function(n) {
        n.removeAttribute('tabindex')
      })
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
      clearTabIndexes()
      child.setAttribute('aria-selected', 'true')
      child.setAttribute('tabindex', '0')
    }

    function optionNode(e) {
      var optionEl = e.target
      while (optionEl && optionEl.getAttribute('role') !== 'option') {
        optionEl = optionEl.parentElement
      }
      return optionEl
    }

    el.addEventListener('click', function(e) {
      var optionEl = optionNode(e)
      if (optionEl) {
        select(optionEl)
      }
    })

    function handleKey(optionEl, code, keys, delta) {
      if (keys.indexOf(code) !== -1) {
        var optionEls = el.querySelectorAll('[role="option"]'),
            idx = Array.prototype.indexOf.call(optionEls, optionEl)

        var next = optionEls[idx + delta]
        if (next) {
          clearTabIndexes()
          next.setAttribute('tabindex', 0)
          next.focus()
        }
      }
    }

    el.addEventListener('keydown', function(e) {
      var optionEl = optionNode(e),
          code = e.keyCode || e.code
      if (opts.selectKeys.indexOf(code) !== -1) {
        select(optionEl)
      } else if (e.target && e.target.getAttribute('role') === 'option') {
        handleKey(optionEl, code, opts.nextKeys, 1)
        handleKey(optionEl, code, opts.prevKeys, -1)
      }
    })
  }

})