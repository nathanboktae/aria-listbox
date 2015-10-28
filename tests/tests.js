describe('aria-listbox', function() {
  var testEl, testSetup = function() {
  },
  click = function(el) {
    var evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    el.dispatchEvent(evt)
  },
  textNodesFor = function(selector) {
    return Array.prototype.map.call(testEl.querySelectorAll(selector), function(el) {
      return el.textContent.trim()
    })
  },
  attributesFor = function(selector, attr) {
    return Array.prototype.map.call(testEl.querySelectorAll(selector), function(el) {
      return el.getAttribute(attr)
    })
  }

  afterEach(function() {
    testEl && testEl.parentElement.removeChild(testEl)
    testEl = null
  })

  it('should add the aria-listbox on the element')
  it('should add aria-option elements to direct li descendants if the element is ol or ul')
  it('should throw if there are no aria-option descendants on a non-list element')
  it('should make the element tabbable')
  it('should set aria-select on an option when it is clicked')
})