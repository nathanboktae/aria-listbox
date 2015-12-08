## aria-listbox

#### Make your listbox compliant with aria-listbox with keyboard and mouse support.

[![Build Status](https://secure.travis-ci.org/nathanboktae/aria-listbox.png)](http://travis-ci.org/nathanboktae/aria-listbox)

[![SauceLabs Test Status](https://saucelabs.com/browser-matrix/aria-listbox.svg)](https://saucelabs.com/u/aria-listbox)

`aria-listbox` is a small library for turning any list of options into an ARIA compliant listbox with keyboard (tab and selection change) and mouse (and thus touch) support.

It has no dependencies and keeps no state, so it works easily with your favorite framework or library for building your app.

### Examples

See [live interactive examples here](http://nathanboktae.github.io/aria-listbox/).

### Usage

See [the tests](https://github.com/nathanboktae/aria-listbox/blob/master/tests/tests.js) for any clarifications and specifics.

#### ariaListbox(element /* HTMLElement */, opts)

- `element`: Required DOM element to initialize the container. It must contain children with `[role="option"]` to use as options in the listbox. You do not need to add `role="listbox"` to the container - `aria-selected` will set that for you.

- `opts`: Optional options for key bindings, which are arrays of numbers (keyCode) or strings (key value)

  - `nextKeys`: Key(s) for focusing the next element (in DOM tree). Default is `[38]` (down arrow)
  - `prevKeys`: Key(s) for focusing the previous element (in DOM tree). Default is `[40]` (up arrow)
  - `selectKeys`: Key(s) for selecting the focused element. Default is `[13, 32]` (space and enter)

```html
<ul>
  <li role="option">Choice 1</li>
  <li role="option">Choice 2</li>
  <li role="option" aria-disabled="true">Disabled Choice 3</li>
  <li>Not a choice</li>
</ul>

<section id="menu" aria-multiselect="true">
  <a href="" role="option">Vegetarian (Tofu)</a>
  <div>
    <h3>Poultry</h3>
    <ol><li role="option">Turkey</li><li role="option">Chicken</li></ol>
  </div>
<section>
```

```
// Single select with default keys
ariaSelect(document.querySelector('ul'))

// Multiselect select with default keys
ariaSelect(document.getElementById('menu'))

// Single select with WASD or arrow keys
ariaSelect(document.querySelector('ul'), { nextKeys: ['s', 'd', 37, 38], prevKeys: ['a', 'w', 39, 40] })

// Multiple select with horizontal keys
ariaSelect(document.querySelector('[aria-multiselect="true"]'), { nextKeys: 37, prevKeys: 39 })
```

Since `aria-selected` does not keep state, you can change the options, what is selected, what is disabled, and even the multiselect mode at any time!

#### `selection-changed` Event

`aria-selected` will fire a `selection-changed` event whenever the selection changes. The `selection` property will contain the new selection. For multiselect, this is a `NodeList`, and additionally `removed` or `added` will be set to the `HTMLElement` that was added or removed from the selection.

### Installation

via bower

```
bower install aria-listbox
```

or via npm

```
npm install aria-listbox
```