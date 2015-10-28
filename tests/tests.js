describe('aria-listbox', function() {
  var testEl, listbox, testSetup = function(opts) {
    opts = opts || {}
    testEl = document.createElement(opts.tag || 'ul')
    if (opts.multiselect) {
      testEl.setAttribute('aria-multiselect', 'true')
    }
    testEl.innerHTML = opts.innerHTML ||
      ['cherry', 'orange', 'banana', 'watermelon', 'pineapple'].map(function(fruit) {
        return '<li role="option"><span>' + fruit + '<span></li>'
      })
    if (opts.selected) {
      testEl.children[opts.selected].setAttribute('aria-selected', 'true')
    }

    listbox = new AriaListbox(testEl)
  },
  click = function(el) {
    var evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    if (typeof el === 'string') {
      el = testEl.querySelector(el)
    }
    el.dispatchEvent(evt)
  },
  textNodesFor = function(selector) {
    return Array.prototype.map.call(testEl.querySelectorAll(selector), function(el) {
      return el.textContent.trim()
    })
  },
  selectedNodes = textNodesFor.bind(null, '[aria-selected="true"]')
  attributesFor = function(selector, attr) {
    return Array.prototype.map.call(testEl.querySelectorAll(selector), function(el) {
      return el.getAttribute(attr)
    })
  }

  it('should throw if not provided a container element', function() {
    (function() {
      new AriaListbox()
    }).should.throw('The listbox container element must be the first parameter to AriaListbox')
  })

  it('should add [role="aria-listbox"] on the element', function() {
    testSetup()
    testEl.should.have.attribute('role', 'aria-listbox')
  })

  it('should make the first aria-selected option tabbable if available, else the first role="option"', function() {
    testSetup()
    attributesFor('li', 'tabindex').should.deep.equal(['0', null, null, null, null])

    testSetup({ selected: 2 })
    attributesFor('li', 'tabindex').should.deep.equal([null, null, '0', null, null])
  })

  it('should set focus and tabindex=0 on the next role="option" element on arrow down, if it exists')
  it('should set focus and tabindex=0 on the previous role="option" element on arrow up, if it exists')
  it('should allow next and previous keys to be configured, allowing multiple mappings')

  it('should set aria-selected on an option when it is clicked, clearing previous selections for single select', function() {
    testSetup()
    click('li:nth-child(2)')
    selectedNodes().should.deep.equal(['orange'])
    click('li:nth-child(5)')
    selectedNodes().should.deep.equal(['pineapple'])
  })

  it('should set aria-selected on an option when a child element of it is clicked', function() {
    testSetup()
    click('li:nth-child(2) span')
    selectedNodes().should.deep.equal(['orange'])
  })

  it('should not prevent the default for clicks and keydown events to allow other code to handle them to')

  it('should set aria-selected on the focused option when space or enter is pressed')
  it('should allow the select keys to be configured')
  it('should fire an event when the selection changes')

  describe('multiselect', function() {
    it('should set aria-selected on an option when it is clicked, leaving other selections', function() {
      testSetup({ multiselect: true })
      click('li:first-child')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(4)')
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
    })

    it('should toggle a selection when clicked again', function() {
      testSetup({ multiselect: true })
      click('li:first-child')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(4)')
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
      click('li:first-child')
      selectedNodes().should.deep.equal(['watermelon'])
    })

    it('should allow multiple items to be selected by keyboard')
    it('should toggle a selected item when selected by keyboard')
  })
})