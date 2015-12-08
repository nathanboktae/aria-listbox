describe('aria-listbox', function() {
  var testEl, testSetup = function(opts) {
    opts = opts || {}
    testEl = document.createElement(opts.tag || 'ul')
    if (opts.multiselect) {
      testEl.setAttribute('aria-multiselect', 'true')
    }
    testEl.innerHTML = opts.innerHTML ||
      ['cherry', 'orange', 'banana', 'watermelon', 'pineapple'].map(function(fruit, idx) {
        return idx === 1 || idx === 2 ?
          '<li role="option" aria-disabled="true"><span>' + fruit + '<span></li>' : 
          '<li role="option"><span>' + fruit + '<span></li>'
      }).join('')
    if (opts.selected) {
      testEl.children[opts.selected].setAttribute('aria-selected', 'true')
    }

    document.body.appendChild(testEl)
    ariaListbox(testEl, Object.keys(opts).length && opts)
  },
  click = function(el) {
    var evt = document.createEvent('MouseEvents')
    evt.initEvent('click', true, true)
    if (typeof el === 'string') {
      el = testEl.querySelector(el)
    }
    el.dispatchEvent(evt)
    return evt
  },
  keydown = function(el, key) {
    // Trying to "properly" create a KeyboardEvent is a huge bag of hurt
    var evt = document.createEvent('UIEvent')

    evt.initEvent('keydown', true, true)
    evt.keyCode = evt.code = typeof key === 'string' ? key.charCodeAt(0) : key
    if (typeof el === 'string') {
      el = testEl.querySelector(el)
    }
    el.dispatchEvent(evt)
    return evt
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

  afterEach(function() {
    testEl && testEl.parentElement && testEl.parentElement.removeChild(testEl)
    testEl = null
  })

  it('should throw if not provided a container element', function() {
    (function() {
      ariaListbox()
    }).should.throw('The listbox container element must be the first parameter to AriaListbox')
  })

  it('should add [role="listbox"] on the element', function() {
    testSetup()
    testEl.should.have.attribute('role', 'listbox')
  })

  it('should make the first aria-selected option tabbable if available, else the first role="option"', function() {
    testSetup()
    attributesFor('li', 'tabindex').should.deep.equal(['0', null, null, null, null])

    testSetup({ selected: 2 })
    attributesFor('li', 'tabindex').should.deep.equal([null, null, '0', null, null])
  })

  it('should set focus and tabindex=0 on the next role="option":not([aria-disabled="true"]) element on arrow down, if it exists', function() {
    testSetup()
    keydown('li:first-child', 40)
    textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
    document.activeElement.textContent.should.equal('watermelon')
    keydown(document.activeElement, 40)
    textNodesFor('[tabindex="0"]').should.deep.equal(['pineapple'])
    keydown(document.activeElement, 40)
    textNodesFor('[tabindex="0"]').should.deep.equal(['pineapple'])
    document.activeElement.textContent.should.equal('pineapple')
  })

  it('should set focus and tabindex=0 on the previous role="option":not([aria-disabled="true"]) element on arrow up, if it exists', function() {
    testSetup()
    keydown('li:nth-child(5)', 38)
    textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
    document.activeElement.textContent.should.equal('watermelon')
    keydown(document.activeElement, 38)
    textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])
    keydown(document.activeElement, 38)
    textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])
    document.activeElement.textContent.should.equal('cherry')
  })

  it('should allow next and previous keys to be configured, allowing multiple mappings', function() {
    testSetup({ prevKeys: [38, 'w'], nextKeys: 's' })
    keydown('li:nth-child(4)', 's')
    textNodesFor('[tabindex="0"]').should.deep.equal(['pineapple'])
    document.activeElement.textContent.should.equal('pineapple')
    keydown(document.activeElement, 's')
    textNodesFor('[tabindex="0"]').should.deep.equal(['pineapple'])
    document.activeElement.textContent.should.equal('pineapple')
    keydown(document.activeElement, 'w')
    textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
    document.activeElement.textContent.should.equal('watermelon')
    keydown(document.activeElement, 38)
    textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])
    document.activeElement.textContent.should.equal('cherry')
  })

  it('should not prevent the default for clicks and keydown events to allow other code to handle them to', function() {
    testSetup()
    keydown('li:nth-child(4)', 38).defaultPrevented.should.be.false
    click('li:nth-child(2) span').defaultPrevented.should.be.false
  })

  it('should allow the select keys to be configured', function() {
    testSetup({ selectKeys: ['|', 'v'] })
    keydown('li:nth-child(4)', '|')
    selectedNodes().should.deep.equal(['watermelon'])
    keydown('li:first-child span', 'v')
    selectedNodes().should.deep.equal(['cherry'])
  })

  describe('single select', function() {
    it('should set aria-selected on an option when a child element of it is clicked, if that item is not disabled', function() {
      testSetup()
      click('li:first-child span')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(2) span')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(4) span')
      selectedNodes().should.deep.equal(['watermelon'])
    })

    it('should set aria-selected on an option when it is clicked, clearing previous selections for single select', function() {
      testSetup()
      click('li:first-child')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(2)')
      selectedNodes().should.deep.equal(['cherry'])
      click('li:nth-child(4)')
      selectedNodes().should.deep.equal(['watermelon'])
    })

    it('should set aria-selected on the focused option when space or enter is pressed', function() {
      testSetup()
      keydown('li:nth-child(4)', 13)
      selectedNodes().should.deep.equal(['watermelon'])
      keydown('li:first-child span', 32)
      selectedNodes().should.deep.equal(['cherry'])
    })

    it('should fire an event when the selection changes with the HTMLElement selected', function() {
      var listener = sinon.spy()
      testSetup()
      testEl.addEventListener('selection-changed', listener)

      click('li:first-child span')
      listener.should.have.been.calledOnce
      var event = listener.lastCall.args[0]
      event.selection.should.be.instanceOf(HTMLElement)
      event.selection.textContent.should.equal('cherry')
      event.selection.tagName.should.equal('LI')

      click('li:nth-child(5)')
      listener.should.have.been.calledTwice
      listener.lastCall.args[0].selection.textContent.should.equal('pineapple')
    })
  })

  describe('multiselect', function() {
    it('should set aria-selected on an option when it is clicked, leaving other selections and ignoring disabled elements', function() {
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
      textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])

      click('li:nth-child(4)')
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])

      click('li:nth-child(2)')
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])

      click('li:first-child')
      selectedNodes().should.deep.equal(['watermelon'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])

      click('li:nth-child(4)')
      selectedNodes().should.be.empty
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
    })

    it('should allow multiple items to be selected by keyboard, ignoring disabled items', function() {
      testSetup({ multiselect: true })

      keydown('li:nth-child(4)', 13)
      selectedNodes().should.deep.equal(['watermelon'])

      keydown('li:nth-child(2)', 13)
      selectedNodes().should.deep.equal(['watermelon'])

      keydown('li:first-child span', 32)
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
    })

    it('should toggle a selected item when selected by keyboard', function() {
      testSetup({ multiselect: true })

      keydown('li:first-child', 32)
      selectedNodes().should.deep.equal(['cherry'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])

      keydown('li:nth-child(4)', 13)
      selectedNodes().should.deep.equal(['cherry', 'watermelon'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
      document.activeElement.textContent.should.equal('watermelon')

      keydown('li:nth-child(4)', 38)
      keydown('li:first-child span', 13)
      selectedNodes().should.deep.equal(['watermelon'])
      textNodesFor('[tabindex="0"]').should.deep.equal(['cherry'])
      document.activeElement.textContent.should.equal('cherry')

      keydown('li:first-child', 40)
      keydown('li:nth-child(4)', 13)
      selectedNodes().should.be.empty
      textNodesFor('[tabindex="0"]').should.deep.equal(['watermelon'])
    })

    it('should fire an event when the selection changes with the NodeList of selections, and which element was added or removed', function() {
      var listener = sinon.spy()
      testSetup({ multiselect: true })
      testEl.addEventListener('selection-changed', listener)

      click('li:first-child span')
      listener.should.have.been.calledOnce
      var event = listener.lastCall.args[0]
      event.selection.should.be.instanceOf(NodeList)
      event.selection.should.have.length(1)
      event.selection[0].textContent.should.equal('cherry')
      event.selection[0].tagName.should.equal('LI')
      event.added.textContent.should.equal('cherry')

      click('li:nth-child(5)')
      listener.should.have.been.calledTwice
      Array.prototype.map.call(listener.lastCall.args[0].selection, function(n) { return n.textContent })
        .should.deep.equal(['cherry', 'pineapple'])
      listener.lastCall.args[0].added.textContent.should.equal('pineapple')

      click('li:first-child')
      Array.prototype.map.call(listener.lastCall.args[0].selection, function(n) { return n.textContent })
        .should.deep.equal(['pineapple'])
      listener.lastCall.args[0].removed.textContent.should.equal('cherry')

      click('li:nth-child(5)')
      listener.lastCall.args[0].selection.should.be.empty
      listener.lastCall.args[0].removed.textContent.should.equal('pineapple')
    })
  })

  it('can switch between single select and multiselect mode')
})